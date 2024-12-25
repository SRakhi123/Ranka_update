import React, { useState, useEffect, useCallback } from "react";
import { FiPhone, FiSearch, FiRefreshCw } from "react-icons/fi";
import { MdCall } from "react-icons/md";
import CallControllerModal from "./CallControllerModal";

const QueueDashboard = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [entriesCount, setEntriesCount] = useState(5);
  const [autoCallEnabled, setAutoCallEnabled] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [currentCall, setCurrentCall] = useState(null);
  const [callData, setCallData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCallControllerOpen, setIsCallControllerOpen] = useState(false);

  useEffect(() => {
    fetchCallData();
  }, []);

  useEffect(() => {
    let interval;
    if (autoCallEnabled && !isCallControllerOpen) {
      if (countdown === 0) {
        const nextCall = callData.find((call) => call.status === "Pending");
        if (nextCall) handleCall(nextCall);
        else setAutoCallEnabled(false); // Stop AutoCall if no more calls
      } else {
        interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      }
    }
    return () => clearInterval(interval);
  }, [autoCallEnabled, countdown, callData, isCallControllerOpen]);

  const fetchCallData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.error("No user found in localStorage");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/calls/read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "read",
            username: user.username,
          }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setCallData(result.data);
      } else {
        console.error("Failed to fetch call data:", result);
      }
    } catch (error) {
      console.error("Error fetching call data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (call) => {
    setCurrentCall(call);
    setIsCallControllerOpen(true);
    setCountdown(5); // Reset countdown
  };

  const closeCallControllerModal = useCallback(() => {
    setIsCallControllerOpen(false);
    setCurrentCall(null);

    setTimeout(() => {
      fetchCallData(); // Refresh data after modal close
    }, 500);

    setCountdown(5);
  }, []);

  const queueData = callData.filter((item) => item.status === "Pending");
  const calledData = callData.filter((item) => item.status !== "Pending");

  const filteredData = (activeTab === "queue" ? queueData : calledData).filter(
    (item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesCount);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesCount,
    currentPage * entriesCount
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <FiPhone className="inline text-blue-500 mr-2" />
            Call Dashboard
          </h1>
          <div className="text-sm text-gray-600">
            <span className="mr-4">
              Pending Calls: <strong>{queueData.length}</strong>
            </span>
            <span>
              Completed Calls: <strong>{calledData.length}</strong>
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("queue")}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "queue"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Queue Dashboard
            </button>
            <button
              onClick={() => setActiveTab("called")}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "called"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Called Dashboard
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex justify-between items-center">
          <select
            value={entriesCount}
            onChange={(e) => setEntriesCount(Number(e.target.value))}
            className="bg-white px-4 py-2 rounded-lg shadow-md"
          >
            {[5, 10, 15, 20].map((count) => (
              <option key={count} value={count}>
                {count} entries
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-4 py-2 rounded-lg shadow-md"
          />
          <button
            onClick={() => setAutoCallEnabled(!autoCallEnabled)}
            className={`px-6 py-2 rounded-lg ${
              autoCallEnabled ? "bg-green-600" : "bg-gray-600"
            } text-white`}
          >
            Auto Call {autoCallEnabled && `(${countdown}s)`}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === "queue"
                    ? ["ID", "Agent", "Phone", "Status", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {header}
                          </th>
                        )
                      )
                    : [
                        "ID",
                        "Agent",
                        "Phone",
                        "Call Status",
                        "Call Duration",
                        "Start Time",
                        "End Time",
                        "Notes",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {header}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{row.id}</td>
                    <td className="px-6 py-4">{row.agent_assigned || "Unassigned"}</td>
                    <td className="px-6 py-4">{row.phone_number || "N/A"}</td>
                    {activeTab === "queue" ? (
                      <>
                        <td className="px-6 py-4">{row.status || "Unknown"}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleCall(row)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <MdCall className="w-5 h-5" />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">{row.call_status || "Unknown"}</td>
                        <td className="px-6 py-4">{row.call_duration || 0} sec</td>
                        <td className="px-6 py-4">
                          {row.call_start_time || "N/A"}
                        </td>
                        <td className="px-6 py-4">{row.call_end_time || "N/A"}</td>
                        <td className="px-6 py-4">{row.notes || "N/A"}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
          >
            Last
          </button>
        </div>
      </main>

      {/* Modal */}
      <CallControllerModal
        isOpen={isCallControllerOpen}
        onClose={closeCallControllerModal}
        callData={currentCall}
      />
    </div>
  );
};

export default QueueDashboard;
