

// // // import React, { useState, useEffect, useCallback } from "react";
// // // import { FiPhone, FiSearch, FiRefreshCw, FiUser } from "react-icons/fi";
// // // import { MdCall, MdCallEnd } from "react-icons/md";
// // // import CallControllerModal from './CallControllerModal'

// // // const QueueDashboard = () => {
// // //   const [activeTab, setActiveTab] = useState("queue");
// // //   const [entriesCount, setEntriesCount] = useState(5);
// // //   const [showCallModal, setShowCallModal] = useState(false);
// // //   const [autoCallEnabled, setAutoCallEnabled] = useState(false);
// // //   const [countdown, setCountdown] = useState(5);
// // //   const [currentCall, setCurrentCall] = useState(null);
// // //   const [callData, setCallData] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [isCallControllerOpen, setIsCallControllerOpen] = useState(false);

// // //   useEffect(() => {
// // //     fetchCallData();
// // //   }, []);

// // //   useEffect(() => {
// // //     let interval;
// // //     if (autoCallEnabled && !showCallModal) {
// // //       if (countdown === 0) {
// // //         const nextCall = callData.find((call) => call.status === "Pending");
// // //         if (nextCall) handleCall(nextCall);
// // //         else setAutoCallEnabled(false); // Stop AutoCall if no more calls
// // //       } else {
// // //         interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
// // //       }
// // //     }
// // //     return () => clearInterval(interval);
// // //   }, [autoCallEnabled, countdown, callData, showCallModal]);

// // //   const fetchCallData = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const user = JSON.parse(localStorage.getItem("user"));
// // //       if (!user) {
// // //         console.error("No user found in localStorage");
// // //         return;
// // //       }
// // //       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/calls/read`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({
// // //           action: "read",
// // //           username: user.username,
// // //         }),
// // //       });

// // //       const result = await response.json();
// // //       console.log("Fetched call data:", result); // Add this log

// // //       if (result.status === "success") {
// // //         setCallData(result.data);
// // //       } else {
// // //         console.error("Failed to fetch call data:", result);
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching call data:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Modify handleCall to open CallControllerModal
// // //   const handleCall = (call) => {
// // //     setCurrentCall(call);
// // //     setIsCallControllerOpen(true);
// // //     setCountdown(5); // Reset countdown
// // //   };




// // //   const closeCallControllerModal = useCallback(() => {
// // //     setIsCallControllerOpen(false);
// // //     setCurrentCall(null);

// // //     // Use a timeout to ensure any backend updates are completed
// // //     setTimeout(() => {
// // //       fetchCallData(); // Re-fetch the call data
// // //     }, 500);

// // //     setCountdown(5); // Start next call countdown
// // //   }, []);

// // //   const queueData = callData.filter((item) => item.status === "Pending");
// // //   const calledData = callData.filter((item) => item.status !== "Pending");

// // //   const filteredData = (activeTab === "queue" ? queueData : calledData).filter((item) =>
// // //     Object.values(item)
// // //       .join(" ")
// // //       .toLowerCase()
// // //       .includes(searchTerm.toLowerCase())
// // //   );

// // //   const totalPages = Math.ceil(filteredData.length / entriesCount);
// // //   const paginatedData = filteredData.slice(
// // //     (currentPage - 1) * entriesCount,
// // //     currentPage * entriesCount
// // //   );

// // //   const CallModal = ({ show, onClose, callData }) => {
// // //     if (!show) return null;
// // //     return (
// // //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //         <div className="bg-white rounded-lg p-6 w-96">
// // //           <div className="flex justify-between items-center mb-4">
// // //             <h3 className="text-xl font-bold text-gray-800">Call Controller</h3>
// // //             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
// // //           </div>
// // //           <div className="space-y-4">
// // //             <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
// // //               <FiUser className="text-blue-500" />
// // //               <span className="text-gray-700">{callData?.customer_name || "Unknown Customer"}</span>
// // //             </div>
// // //             <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
// // //               <FiPhone className="text-blue-500" />
// // //               <span className="text-gray-700">{callData?.phone_number}</span>
// // //             </div>
// // //             <div className="flex justify-center space-x-6 mt-6">
// // //               <button className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600">
// // //                 <MdCall size={24} />
// // //               </button>
// // //               <button className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600">
// // //                 <MdCallEnd size={24} />
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-100">
// // //       <header className="bg-white shadow-lg">
// // //         <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center">
// // //           <h1 className="text-3xl font-bold text-gray-900 flex items-center">
// // //             <FiPhone className="mr-2 text-blue-500" /> Call Dashboard
// // //           </h1>
// // //         </div>
// // //       </header>


// // //       <main className="max-w-7xl mx-auto px-4 py-6">
// // //         {/* Tabs */}
// // //         <div className="mb-6">
// // //           <div className="flex border-b">
// // //             <button
// // //               onClick={() => setActiveTab("queue")}
// // //               className={`flex-1 py-3 text-center font-medium ${activeTab === "queue"
// // //                   ? "border-b-2 border-blue-500 text-blue-500"
// // //                   : "text-gray-600 hover:text-blue-500"
// // //                 }`}
// // //             >
// // //               Queue Dashboard
// // //             </button>
// // //             <button
// // //               onClick={() => setActiveTab("called")}
// // //               className={`flex-1 py-3 text-center font-medium ${activeTab === "called"
// // //                   ? "border-b-2 border-blue-500 text-blue-500"
// // //                   : "text-gray-600 hover:text-blue-500"
// // //                 }`}
// // //             >
// // //               Called Dashboard
// // //             </button>
// // //           </div>
// // //         </div>


// // //         {/* Search and pagination */}

// // //         <div className="mb-6 flex justify-between items-center">
// // //           <select
// // //             value={entriesCount}
// // //             onChange={(e) => setEntriesCount(Number(e.target.value))}
// // //             className="bg-white px-4 py-2 rounded-lg shadow-md"
// // //           >
// // //             {[5, 10, 15, 20].map((count) => (
// // //               <option key={count} value={count}>{count} entries</option>
// // //             ))}
// // //           </select>
// // //           <input
// // //             type="text"
// // //             placeholder="Search..."
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             className="pl-3 pr-4 py-2 rounded-lg shadow-md"
// // //           />
// // //           <button
// // //             onClick={() => setAutoCallEnabled(!autoCallEnabled)}
// // //             className={`px-6 py-2 rounded-lg ${autoCallEnabled ? "bg-green-600" : "bg-gray-600"} text-white`}
// // //           >
// // //             Auto Call {autoCallEnabled && `(${countdown}s)`}
// // //           </button>
// // //         </div>

// // //         <div className="bg-white rounded-lg shadow overflow-hidden">
// // //           {loading ? (
// // //             <div className="text-center py-8">Loading...</div>
// // //           ) : (
// // //             <table className="min-w-full divide-y divide-gray-200">
// // //               <thead className="bg-gray-50">
// // //                 <tr>
// // //                   {["ID", "Agent", "Phone", "Status", "Actions"].map((header) => (
// // //                     <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //                       {header}
// // //                     </th>
// // //                   ))}
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="bg-white divide-y divide-gray-200">
// // //                 {paginatedData.map((row) => (
// // //                   <tr key={row.id}>
// // //                     <td className="px-6 py-4">{row.id}</td>
// // //                     <td className="px-6 py-4">{row.agent_assigned || "Unassigned"}</td>
// // //                     <td className="px-6 py-4">{row.phone_number || "N/A"}</td>
// // //                     <td className="px-6 py-4">{row.status || "Unknown"}</td>
// // //                     <td className="px-6 py-4">
// // //                       {activeTab === "queue" && (
// // //                         <button
// // //                           onClick={() => handleCall(row)}
// // //                           className="text-blue-600 hover:text-blue-800"
// // //                         >
// // //                           <FiPhone className="w-5 h-5" />
// // //                         </button>
// // //                       )}
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           )}
// // //         </div>

// // //         {/* Pagination */}
// // //         <div className="mt-6 flex justify-between items-center">
// // //           <button
// // //             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
// // //             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
// // //           >
// // //             Previous
// // //           </button>
// // //           <span>
// // //             Page {currentPage} of {totalPages}
// // //           </span>
// // //           <button
// // //             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
// // //             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
// // //           >
// // //             Next
// // //           </button>
// // //         </div>
// // //       </main>

// // //       <CallControllerModal
// // //         isOpen={isCallControllerOpen}
// // //         onClose={closeCallControllerModal }
// // //         callData={currentCall}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default QueueDashboard;


// // import React, { useState, useEffect, useCallback } from "react";
// // import { FiPhone, FiSearch, FiRefreshCw, FiCheckCircle, FiTrash2 } from "react-icons/fi";
// // import { MdCall, MdCallEnd } from "react-icons/md";
// // import CallControllerModal from "./CallControllerModal";

// // const QueueDashboard = () => {
// //   const [activeTab, setActiveTab] = useState("queue");
// //   const [entriesCount, setEntriesCount] = useState(5);
// //   const [autoCallEnabled, setAutoCallEnabled] = useState(false);
// //   const [countdown, setCountdown] = useState(5);
// //   const [currentCall, setCurrentCall] = useState(null);
// //   const [callData, setCallData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isFetching, setIsFetching] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [isCallControllerOpen, setIsCallControllerOpen] = useState(false);
// //   const [selectedRows, setSelectedRows] = useState([]);

// //   useEffect(() => {
// //     fetchCallData();
// //   }, []);

// //   useEffect(() => {
// //     let interval;
// //     if (autoCallEnabled && !isCallControllerOpen) {
// //       if (countdown === 0) {
// //         const nextCall = callData.find((call) => call.status === "Pending");
// //         if (nextCall) handleCall(nextCall);
// //         else setAutoCallEnabled(false); // Stop AutoCall if no more calls
// //       } else {
// //         interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
// //       }
// //     }
// //     return () => clearInterval(interval);
// //   }, [autoCallEnabled, countdown, callData, isCallControllerOpen]);

// //   const fetchCallData = async () => {
// //     try {
// //       setLoading(true);
// //       setIsFetching(true); // Indicate fetching status
// //       const user = JSON.parse(localStorage.getItem("user"));
// //       if (!user) {
// //         console.error("No user found in localStorage");
// //         return;
// //       }
// //       const response = await fetch(
// //         `${import.meta.env.VITE_API_BASE_URL}/calls/read`,
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({
// //             action: "read",
// //             username: user.username,
// //           }),
// //         }
// //       );

// //       const result = await response.json();

// //       if (result.status === "success") {
// //         setCallData(result.data);
// //       } else {
// //         console.error("Failed to fetch call data:", result);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching call data:", error);
// //     } finally {
// //       setLoading(false);
// //       setIsFetching(false);
// //     }
// //   };

// //   const handleCall = (call) => {
// //     setCurrentCall(call);
// //     setIsCallControllerOpen(true);
// //     setCountdown(5); // Reset countdown
// //   };

// //   const closeCallControllerModal = useCallback(() => {
// //     setIsCallControllerOpen(false);
// //     setCurrentCall(null);

// //     setTimeout(() => {
// //       fetchCallData(); // Refresh data after modal close
// //     }, 500);

// //     setCountdown(5);
// //   }, []);

// //   const queueData = callData.filter((item) => item.status === "Pending");
// //   const calledData = callData.filter((item) => item.status !== "Pending");

// //   const filteredData = (activeTab === "queue" ? queueData : calledData).filter(
// //     (item) =>
// //       Object.values(item)
// //         .join(" ")
// //         .toLowerCase()
// //         .includes(searchTerm.toLowerCase())
// //   );

// //   const totalPages = Math.ceil(filteredData.length / entriesCount);
// //   const paginatedData = filteredData.slice(
// //     (currentPage - 1) * entriesCount,
// //     currentPage * entriesCount
// //   );

// //   const toggleRowSelection = (id) => {
// //     setSelectedRows((prev) =>
// //       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
// //     );
// //   };

// //   const bulkComplete = () => {
// //     const updatedData = callData.map((call) =>
// //       selectedRows.includes(call.id) ? { ...call, status: "Completed" } : call
// //     );
// //     setCallData(updatedData);
// //     setSelectedRows([]);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-white shadow-lg">
// //         <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
// //           <h1 className="text-3xl font-bold text-gray-900">
// //             <FiPhone className="mr-2 text-blue-500" /> Call Dashboard
// //           </h1>
// //           <div className="flex items-center space-x-4">
// //             <span className="text-sm text-gray-600">
// //               Pending: <strong>{queueData.length}</strong>
// //             </span>
// //             <span className="text-sm text-gray-600">
// //               Completed: <strong>{calledData.length}</strong>
// //             </span>
// //             <button
// //               onClick={fetchCallData}
// //               disabled={isFetching}
// //               className={`px-4 py-2 rounded-lg text-white shadow-md ${
// //                 isFetching ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
// //               } hover:bg-blue-700`}
// //             >
// //               Refresh <FiRefreshCw className="inline-block ml-1" />
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main */}
// //       <main className="max-w-7xl mx-auto px-4 py-6">
// //         {/* Tabs */}
// //         <div className="mb-6">
// //           <div className="flex border-b">
// //             <button
// //               onClick={() => setActiveTab("queue")}
// //               className={`flex-1 py-3 text-center font-medium ${
// //                 activeTab === "queue"
// //                   ? "border-b-2 border-blue-500 text-blue-500"
// //                   : "text-gray-600 hover:text-blue-500"
// //               }`}
// //             >
// //               Queue Dashboard
// //             </button>
// //             <button
// //               onClick={() => setActiveTab("called")}
// //               className={`flex-1 py-3 text-center font-medium ${
// //                 activeTab === "called"
// //                   ? "border-b-2 border-blue-500 text-blue-500"
// //                   : "text-gray-600 hover:text-blue-500"
// //               }`}
// //             >
// //               Called Dashboard
// //             </button>
// //           </div>
// //         </div>

// //         {/* Search and Filters */}
// //         <div className="mb-6 flex justify-between items-center">
// //           <select
// //             value={entriesCount}
// //             onChange={(e) => setEntriesCount(Number(e.target.value))}
// //             className="bg-white px-4 py-2 rounded-lg shadow-md"
// //           >
// //             {[5, 10, 15, 20].map((count) => (
// //               <option key={count} value={count}>
// //                 {count} entries
// //               </option>
// //             ))}
// //           </select>
// //           <input
// //             type="text"
// //             placeholder="Search..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="pl-3 pr-4 py-2 rounded-lg shadow-md"
// //           />
// //           <button
// //             onClick={() => setAutoCallEnabled(!autoCallEnabled)}
// //             className={`px-6 py-2 rounded-lg ${
// //               autoCallEnabled ? "bg-green-600" : "bg-gray-600"
// //             } text-white`}
// //           >
// //             Auto Call {autoCallEnabled && `(${countdown}s)`}
// //           </button>
// //         </div>

// //         {/* Bulk Actions */}
// //         {selectedRows.length > 0 && (
// //           <div className="mb-4 flex space-x-4">
// //             <button
// //               onClick={bulkComplete}
// //               className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
// //             >
// //               Complete Selected <FiCheckCircle className="inline-block ml-1" />
// //             </button>
// //             <button
// //               onClick={() => setSelectedRows([])}
// //               className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
// //             >
// //               Clear Selection <FiTrash2 className="inline-block ml-1" />
// //             </button>
// //           </div>
// //         )}

// //         {/* Table */}
// //         <div className="bg-white rounded-lg shadow overflow-hidden">
// //           {loading ? (
// //             <div className="text-center py-8">Loading...</div>
// //           ) : (
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3">
// //                     <input
// //                       type="checkbox"
// //                       onChange={(e) =>
// //                         setSelectedRows(
// //                           e.target.checked ? paginatedData.map((row) => row.id) : []
// //                         )
// //                       }
// //                       checked={
// //                         paginatedData.every((row) => selectedRows.includes(row.id))
// //                       }
// //                     />
// //                   </th>
// //                   {["ID", "Agent", "Phone", "Status", "Actions"].map((header) => (
// //                     <th
// //                       key={header}
// //                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
// //                     >
// //                       {header}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {paginatedData.map((row) => (
// //                   <tr key={row.id} className="hover:bg-gray-50">
// //                     <td className="px-6 py-4">
// //                       <input
// //                         type="checkbox"
// //                         checked={selectedRows.includes(row.id)}
// //                         onChange={() => toggleRowSelection(row.id)}
// //                       />
// //                     </td>
// //                     <td className="px-6 py-4">{row.id}</td>
// //                     <td className="px-6 py-4">{row.agent_assigned || "Unassigned"}</td>
// //                     <td className="px-6 py-4">{row.phone_number || "N/A"}</td>
// //                     <td className="px-6 py-4">{row.status || "Unknown"}</td>
// //                     <td className="px-6 py-4">
// //                       {activeTab === "queue" && (
// //                         <button
// //                           onClick={() => handleCall(row)}
// //                           className="text-blue-600 hover:text-blue-800"
// //                         >
// //                           <MdCall className="w-5 h-5" />
// //                         </button>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>

// //         {/* Pagination */}
// //         <div className="mt-6 flex justify-between items-center">
// //           <button
// //             onClick={() => setCurrentPage(1)}
// //             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
// //           >
// //             First
// //           </button>
// //           <button
// //             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
// //             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
// //           >
// //             Previous
// //           </button>
// //           <span>
// //             Page {currentPage} of {totalPages}
// //           </span>
// //           <button
// //             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
// //             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
// //           >
// //             Next
// //           </button>
// //           <button
// //             onClick={() => setCurrentPage(totalPages)}
// //             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
// //           >
// //             Last
// //           </button>
// //         </div>
// //       </main>

// //       {/* Modal */}
// //       <CallControllerModal
// //         isOpen={isCallControllerOpen}
// //         onClose={closeCallControllerModal}
// //         callData={currentCall}
// //       />
// //     </div>
// //   );
// // };

// // export default QueueDashboard;

// import React, { useState, useEffect, useCallback } from "react";
// import { FiPhone, FiRefreshCw } from "react-icons/fi";

// const QueueDashboard = () => {
//   const [activeTab, setActiveTab] = useState("queue");
//   const [entriesCount, setEntriesCount] = useState(5);
//   const [callData, setCallData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchCallData();
//   }, []);

//   const fetchCallData = async () => {
//     try {
//       setLoading(true);
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user) {
//         console.error("No user found in localStorage");
//         return;
//       }
//       const response = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL}/calls/read`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             action: "read",
//             username: user.username,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (result.status === "success") {
//         setCallData(result.data);
//       } else {
//         console.error("Failed to fetch call data:", result);
//       }
//     } catch (error) {
//       console.error("Error fetching call data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const queueData = callData.filter((item) => item.status === "Pending");
//   const calledData = callData.filter((item) => item.status !== "Pending");

//   const filteredData = (activeTab === "queue" ? queueData : calledData).filter(
//     (item) =>
//       Object.values(item)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredData.length / entriesCount);
//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * entriesCount,
//     currentPage * entriesCount
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-lg py-6">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             <FiPhone className="inline text-blue-500 mr-2" />
//             Call Dashboard
//           </h1>
//           <div className="text-sm text-gray-600">
//             <span className="mr-4">
//               Pending Calls: <strong>{queueData.length}</strong>
//             </span>
//             <span>
//               Completed Calls: <strong>{calledData.length}</strong>
//             </span>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="max-w-7xl mx-auto px-4 py-6">
//         {/* Tabs */}
//         <div className="mb-6">
//           <div className="flex border-b">
//             <button
//               onClick={() => setActiveTab("queue")}
//               className={`flex-1 py-3 text-center font-medium ${
//                 activeTab === "queue"
//                   ? "border-b-2 border-blue-500 text-blue-500"
//                   : "text-gray-600 hover:text-blue-500"
//               }`}
//             >
//               Queue Dashboard
//             </button>
//             <button
//               onClick={() => setActiveTab("called")}
//               className={`flex-1 py-3 text-center font-medium ${
//                 activeTab === "called"
//                   ? "border-b-2 border-blue-500 text-blue-500"
//                   : "text-gray-600 hover:text-blue-500"
//               }`}
//             >
//               Called Dashboard
//             </button>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-6 flex justify-between items-center">
//           <select
//             value={entriesCount}
//             onChange={(e) => setEntriesCount(Number(e.target.value))}
//             className="bg-white px-4 py-2 rounded-lg shadow-md"
//           >
//             {[5, 10, 15, 20].map((count) => (
//               <option key={count} value={count}>
//                 {count} entries
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-3 pr-4 py-2 rounded-lg shadow-md"
//           />
//           <button
//             onClick={fetchCallData}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
//           >
//             Refresh <FiRefreshCw className="inline-block ml-1" />
//           </button>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {loading ? (
//             <div className="text-center py-8">Loading...</div>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {activeTab === "queue"
//                     ? ["ID", "Agent", "Phone", "Status"].map((header) => (
//                         <th
//                           key={header}
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
//                         >
//                           {header}
//                         </th>
//                       ))
//                     : [
//                         "ID",
//                         "Agent",
//                         "Phone",
//                         "Call Status",
//                         "Call Duration",
//                         "Start Time",
//                         "End Time",
//                         "Notes",
//                       ].map((header) => (
//                         <th
//                           key={header}
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
//                         >
//                           {header}
//                         </th>
//                       ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedData.map((row) => (
//                   <tr key={row.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">{row.id}</td>
//                     <td className="px-6 py-4">{row.agent_assigned || "Unassigned"}</td>
//                     <td className="px-6 py-4">{row.phone_number || "N/A"}</td>
//                     {activeTab === "queue" ? (
//                       <td className="px-6 py-4">{row.status || "Unknown"}</td>
//                     ) : (
//                       <>
//                         <td className="px-6 py-4">{row.call_status || "Unknown"}</td>
//                         <td className="px-6 py-4">{row.call_duration || 0} sec</td>
//                         <td className="px-6 py-4">
//                           {row.call_start_time || "N/A"}
//                         </td>
//                         <td className="px-6 py-4">{row.call_end_time || "N/A"}</td>
//                         <td className="px-6 py-4">{row.notes || "N/A"}</td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="mt-6 flex justify-between items-center">
//           <button
//             onClick={() => setCurrentPage(1)}
//             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
//           >
//             First
//           </button>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
//           >
//             Previous
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
//           >
//             Next
//           </button>
//           <button
//             onClick={() => setCurrentPage(totalPages)}
//             className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
//           >
//             Last
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default QueueDashboard;

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
