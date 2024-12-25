<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ClientSmsController extends Controller
{
    public function processPorts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rid' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 0, 'errors' => $validator->errors()], 422);
        }

        try {
            DB::connection('client_db')->beginTransaction(); // Start transaction

            // Clean mo_no column by removing spaces, carriage returns, and newlines for status PP1
            DB::connection('client_db')->statement("
                UPDATE mob_no_sms_gsm 
                SET mo_no = REPLACE(REPLACE(REPLACE(mo_no, ' ', ''), CHAR(13), ''), CHAR(10), '') 
                WHERE status = 'PP11'
            ");


            // Step 1: Fetch the next available port from the client database
            $port = DB::connection('client_db')->table('port_usage')
                ->where('messages_sent', '<', 90)
                ->orderBy('port', 'asc')
                ->first();

            if (!$port) {
                return response()->json(['error' => 'No available ports in the client database'], 400);
            }

            // Step 2: Fetch mo_no and msg from mob_no_sms_gsm from the client's database
            $messages = DB::connection('client_db')->table('mob_no_sms_gsm')
                ->where('status', 'PP11')
                ->where('rid', $request->rid)
                ->get();

            if ($messages->isEmpty()) {
                return response()->json(['error' => 'No data from this request_id'], 400);
            }

            $portsData = [];
            $currentPort = $port->port;

            foreach ($messages as $message) {
                // Process the message for the client database
                $portsData[] = $this->processMessage($message, $currentPort);

                // Update the status to 'submited' and save the port number
                $this->updateStatusAndSavePort($message->id, $currentPort);

                // If the port reached 90 messages, fetch a new port
                if ($this->hasPortReachedLimit($currentPort)) {
                    $port = DB::connection('client_db')->table('port_usage')
                        ->where('messages_sent', '<', 90)
                        ->orderBy('port', 'asc')
                        ->first();

                    if (!$port) {
                        Log::error('No available ports in the client database');
                        break;
                    }

                    $currentPort = $port->port;
                }
            }

            DB::connection('client_db')->commit(); // Commit transaction in client database

            // Step 5: Send CURL requests for each port's data
            if (!empty($portsData)) {
                foreach ($portsData as $portData) {
                    $this->sendCurlRequest($portData);
                }
            }

            return response()->json(['success' => 'Ports processed successfully', 'data' => $portsData], 90);
        } catch (\Exception $e) {
            DB::connection('client_db')->rollback(); // Rollback the client database transaction

            // Log the exception
            Log::error('Error processing ports in the client database: ' . $e->getMessage());

            return response()->json(['error' => 'Error processing ports. Please try again later.', 'description' => $e], 500);
        }
    }

    // Helper function to process each message in the client database
    private function processMessage($message, $currentPort)
    {
        $mo_no = $message->mo_no;
        $msg = $message->msg;

        // Check if the message is Unicode or not
        if ($message->unicode == "" || $message->unicode == 0 || $message->unicode == null) {  // Non-Unicode message
            $msgLength = mb_strlen($msg);
            if ($msgLength <= 160) {
                DB::connection('client_db')->table('port_usage')->where('port', $currentPort)->increment('messages_sent', 1);
            } elseif ($msgLength >= 161 && $msgLength <= 306) {
                DB::connection('client_db')->table('port_usage')->where('port', $currentPort)->increment('messages_sent', 2);
            } elseif ($msgLength >= 307 && $msgLength <= 459) {
                DB::connection('client_db')->table('port_usage')->where('port', $currentPort)->increment('messages_sent', 3);
            } elseif ($msgLength >= 460 && $msgLength <= 612) {
                DB::connection('client_db')->table('port_usage')->where('port', $currentPort)->increment('messages_sent', 4);
            } else {
                return ['error' => 'Message is too long'];
            }
        } else {  // Unicode message
            $msgLength = mb_strlen($msg);
            if ($msgLength <= 70) {
                DB::connection('client_db')->table('port_usage')->where('port', $currentPort)->increment('messages_sent', 1);
            } elseif ($msgLength >= 71 && $msgLength <= 133) {
                DB::connection('client_db')->table('port_usage')->where('port', $currentPort)->increment('messages_sent', 2);
            } elseif ($msgLength >= 134 && $msgLength <= 199) {
                DB::connection('client_db')->table('port_usage')->where('port', $currentPort)->increment('messages_sent', 3);
            } elseif ($msgLength >= 200 && $msgLength <= 265) {
                DB::connection('client_db')->table('port_usage')->where('port', $currentPort)->increment('messages_sent', 4);
            } else {
                return ['error' => 'Message is too long'];
            }
        }

        return [
            'port' => (string)$currentPort,
            'numbers' => explode(',', $mo_no),
            'msg' => $msg
        ];
    }

    // Function to check if the port has reached its limit
    private function hasPortReachedLimit($port)
    {
        $messagesSent = DB::connection('client_db')->table('port_usage')->where('port', $port)->value('messages_sent');
        return $messagesSent >= 90;
    }

    // Function to update the status and save the port number
    private function updateStatusAndSavePort($id, $currentPort)
    {
        try {
            DB::connection('client_db')->table('mob_no_sms_gsm')
                ->where('id', $id)
                ->update([
                    'status' => 'delivered',  // Update the status to 'submited'
                    'port' => $currentPort    // Save the current port number
                ]);
        } catch (\Exception $e) {
            Log::error('Error updating status and port for ID: ' . $id . '. Error: ' . $e->getMessage());
        }
    }

    // Function to send CURL request (using Laravel Http client)
private function sendCurlRequest($data)
{
    $url = 'http://192.168.1.12/sms/sendsmsmultiports.php';
    $payload = ['ports' => [$data]];

    try {
        $response = Http::post($url, $payload);

        if ($response->failed()) {
            Log::error('CURL Error: ' . $response->body());
        } else {
            Log::info('CURL Response: ' . $response->body());
        }

        // Store the request data and response in the database
        DB::table('curl_requests2')->insert([
            'request_data' => json_encode($payload),
            'response' => $response->body(),
            'status' => $response->status(),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    } catch (\Exception $e) {
        Log::error('CURL Request failed: ' . $e->getMessage());
    }
}
}
