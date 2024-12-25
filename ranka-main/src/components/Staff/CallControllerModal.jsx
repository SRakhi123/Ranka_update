


import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaPhoneAlt,
  FaPhoneSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPause,
  FaPlay,
  FaTimes,
  FaCommentDots
} from "react-icons/fa";
import { FiUser, FiPhone } from "react-icons/fi";

const CallControllerModal = ({ isOpen, onClose, callData }) => {
  const [callStatus, setCallStatus] = useState("idle"); // idle, ringing, active, hold
  const [isMuted, setIsMuted] = useState(false);
  const [callID, setCallID] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [callDuration, setCallDuration] = useState(0); // seconds
  const [remarks, setRemarks] = useState("");
  const phoneRef = useRef(null);

  // Reset Modal State
  const resetModalState = () => {
    setCallStatus("idle");
    setIsMuted(false);
    setCallID(null);
    setStartTime(null);
    setEndTime(null);
    setCallDuration(0);
    setRemarks("");
  };

  // Call Timer
  useEffect(() => {
    let timer = null;
    if (callStatus === "active" && startTime) {
      timer = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - new Date(startTime)) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus, startTime]);

  // Initialize Phone SDK
  useEffect(() => {
    const phone = new Jabarphone({
      sipUsername: "7001",
      sipPassword: "51ee29602746eea9f7d91faf5bcedcbc",
      sipServer: "voice2.nuke.co.in",
      wssServer: "wss://voice2.nuke.co.in:8089/ws",
      userAgentString: "WebRTC Agent",
      earlyMedia: true,
    });

    phone.on("call_status", (data) => {
      console.log("Call status event:", data);

      if (data.message === "INITIATED") {
        setCallStatus("ringing");
        setCallID(data.id);
      } else if (data.message === "ANSWERED") {
        setCallStatus("active");
        setStartTime(new Date());
      } else if (data.message === "ENDED") {
        setCallStatus("idle");
        setEndTime(new Date());
        setCallID(null);
      } else if (data.message === "HOLD") {
        setCallStatus("hold");
      }
    });

    phone.init();
    phoneRef.current = phone;
  }, []);

  // Auto-Call Trigger when Modal Opens
  useEffect(() => {
    if (isOpen) {
      // Trigger call after 2 seconds when modal opens
      const autoCallTimer = setTimeout(() => {
        handleMakeCall();
      }, 2000);
      return () => clearTimeout(autoCallTimer); // Cleanup on unmount or isOpen change
    } else {
      resetModalState();
    }
  }, [isOpen]);

  // Submit Call Details with Option to Close Modal
  const handleSubmit = async (shouldClose = false) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.username) {
        toast.error("User not logged in. Please log in again.");
        return false;
      }

      const payload = {
        action: "update",
        agent_assigned: user.username,
        phone_number: callData?.phone_number,
        call_status: callStatus === "active" ? "Connected" : "Disconnected",
        call_duration: callDuration,
        call_start_time: startTime ? new Date(startTime).toISOString() : null,
        call_end_time: endTime ? new Date(endTime).toISOString() : null,
        notes: remarks,
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/calls/update-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit call details.");
      }

      toast.success("Call details submitted successfully!");
      
      if (shouldClose) {
        // Disconnect call if active
        if (callID) {
          try {
            phoneRef.current.endCall(callID);
          } catch (disconnectErr) {
            console.error("Error disconnecting call:", disconnectErr);
          }
        }
        
        resetModalState();
        onClose();
      }

      return true;
    } catch (err) {
      toast.error("Failed to submit details: " + err.message);
      return false;
    }
  };

  // Handle Modal Close
  const handleModalClose = () => {
    // If call is active, submit details and close
       handleSubmit(true);
  };

  // Make Call
  const handleMakeCall = async () => {
    try {
      const uniqueCallID = phoneRef.current.getUniqueID();
      phoneRef.current.dial(callData?.phone_number, uniqueCallID);
      setCallStatus("ringing");
      setCallID(uniqueCallID);
      toast.info("Calling...");
    } catch (err) {
      toast.error("Call initiation failed: " + err.message);
    }
  };

  // Disconnect Call
  const handleDisconnect = async () => {
    try {
      if (callID) {
        phoneRef.current.endCall(callID);
      }
      
      // await handleSubmit(true);
      
      setCallStatus("idle");
      setIsMuted(false);
    } catch (err) {
      toast.error("Failed to disconnect call: " + err.message);
    }
  };

  // Toggle Mute
  const handleMute = async () => {
    try {
      const action = isMuted ? "unmute" : "mute";
      await phoneRef.current.toggleMute(callID, action);
      setIsMuted(!isMuted);
      toast.info(isMuted ? "Unmuted" : "Muted");
    } catch (err) {
      toast.error("Failed to toggle mute: " + err.message);
    }
  };

  // Toggle Hold
  const handleHold = async () => {
    try {
      const action = callStatus === "hold" ? "unhold" : "hold";
      await phoneRef.current.toggleHold(callID, action);
      setCallStatus(action === "hold" ? "hold" : "active");
      toast.info(action === "hold" ? "Call on Hold" : "Call Resumed");
    } catch (err) {
      toast.error("Failed to toggle hold: " + err.message);
    }
  };

  // Render Nothing if Modal is Closed
  if (!isOpen) return null;

  // Format Duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaCommentDots className="mr-3 text-blue-500" />
            Call Controller
          </h2>
          <button 
            onClick={handleModalClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Status and Timer */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="grid grid-cols-2 gap-2">
            <p className="text-sm text-gray-600">
              Status: 
              <span className="font-medium ml-2 
                text-blue-600
                capitalize">
                {callStatus}
              </span>
            </p>
            {startTime && (
              <p className="text-sm text-gray-600 text-right">
                Duration: 
                <span className="font-medium ml-2 text-blue-600">
                  {formatDuration(callDuration)}
                </span>
              </p>
            )}
          </div>
          {startTime && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <p className="text-sm text-gray-600">
                Start: 
                <span className="font-medium ml-2 text-blue-600">
                  {new Date(startTime).toLocaleTimeString()}
                </span>
              </p>
              {endTime && (
                <p className="text-sm text-gray-600 text-right">
                  End: 
                  <span className="font-medium ml-2 text-blue-600">
                    {new Date(endTime).toLocaleTimeString()}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center mb-2">
            <FiUser className="text-blue-500 mr-3 w-5 h-5" />
            <span className="font-medium text-gray-700">
              {callData?.customer_name || "Unknown Customer"}
            </span>
          </div>
          <div className="flex items-center">
            <FiPhone className="text-blue-500 mr-3 w-5 h-5" />
            <span className="font-medium text-gray-700">
              {callData?.phone_number || "N/A"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleMakeCall}
            disabled={callStatus !== "idle"}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-3 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <FaPhoneAlt />
            <span>Call</span>
          </button>
          <button
            onClick={handleDisconnect}
            disabled={callStatus === "idle"}
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-3 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <FaPhoneSlash />
            <span>Hang Up</span>
          </button>
          <button
            onClick={handleMute}
            disabled={callStatus !== "active"}
            className={`${
              isMuted ? "bg-yellow-500" : "bg-blue-500"
            } hover:opacity-90 text-white rounded-lg p-3 flex items-center justify-center space-x-2 disabled:opacity-50`}
          >
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </button>
          <button
            onClick={handleHold}
            disabled={callStatus === "idle"}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg p-3 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {callStatus === "hold" ? <FaPlay /> : <FaPause />}
            <span>{callStatus === "hold" ? "Resume" : "Hold"}</span>
          </button>
        </div>

        {/* Remarks */}
        <div className="mb-4">
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add call notes..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
            rows="3"
          />
          <button
            onClick={() => handleSubmit(true)}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg w-full transition-colors"
          >
            Submit Call Details
          </button>
        </div>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CallControllerModal;