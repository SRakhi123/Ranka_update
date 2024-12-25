// // import React, { useState, useEffect } from 'react';
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import Papa from 'papaparse';



// // const CreateCampaignModal = ({ onClose, fetchCampaigns }) => {
// //   const [campaignName, setCampaignName] = useState("");
// //   const [scheduledDate, setScheduledDate] = useState("");
// //   const [scheduledTime, setScheduledTime] = useState("");
// //   const [csvFile, setCsvFile] = useState(null);
// //   const [csvData, setCsvData] = useState([]);
// //   const [selectedRows, setSelectedRows] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   // Set current date and time on component mount
// //   useEffect(() => {
// //     const now = new Date();
// //     const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
// //     const formattedTime = now.toTimeString().split(" ")[0]; // HH:MM:SS
// //     setScheduledDate(formattedDate);
// //     setScheduledTime(formattedTime);
// //   }, []);

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setCsvFile(file);
// //       Papa.parse(file, {
// //         header: true,
// //         complete: (results) => {
// //           setCsvData(results.data);
// //           toast.success("CSV data loaded successfully!");
// //         },
// //         error: (error) => {
// //           toast.error("Failed to parse CSV file.");
// //           console.error("CSV parse error:", error);
// //         }
// //       });
// //     }
// //   };

// //   const handleRowSelect = (index) => {
// //     if (selectedRows.includes(index)) {
// //       setSelectedRows(selectedRows.filter(rowIndex => rowIndex !== index));
// //     } else {
// //       setSelectedRows([...selectedRows, index]);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
    
// //     const formData = new FormData();
// //     formData.append("file", csvFile);
// //     formData.append("scheduled_date", scheduledDate);
// //     formData.append("scheduled_time", scheduledTime);
// //     formData.append("campaign_name", campaignName);

// //     try {
// //       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload`, formData, {
// //         headers: {
// //           "Content-Type": "multipart/form-data",
// //         },
// //       });
// //       fetchCampaigns();
// //       onClose();
// //       toast.success("Campaign created successfully with CSV!");
// //     } catch (error) {
// //       toast.error("Failed to create campaign.");
// //       console.error("Create error:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDownloadSample = () => {
// //     const sampleData = "Number,Name\nshubham,1234567890\nRanka,0987654321";
// //     const blob = new Blob([sampleData], { type: "text/csv" });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = "sample.csv";
// //     document.body.appendChild(a);
// //     a.click();
// //     document.body.removeChild(a);
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
// //       <div className="bg-white p-8 rounded-lg w-full max-w-xl">
// //         <h2 className="text-2xl font-bold mb-6">Create Campaign</h2>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
// //             <input
// //               type="text"
// //               value={campaignName}
// //               onChange={(e) => setCampaignName(e.target.value)}
// //               className="w-full px-3 py-2 border rounded-md"
// //               required
// //             />
// //           </div>
// //           <div className="flex space-x-4">
// //             <div className="flex-1">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
// //               <input
// //                 type="date"
// //                 value={scheduledDate}
// //                 onChange={(e) => setScheduledDate(e.target.value)}
// //                 className="w-full px-3 py-2 border rounded-md"
// //                 required
// //               />
// //             </div>
// //             <div className="flex-1">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
// //               <input
// //                 type="time"
// //                 value={scheduledTime}
// //                 onChange={(e) => setScheduledTime(e.target.value)}
// //                 className="w-full px-3 py-2 border rounded-md"
// //                 required
// //               />
// //             </div>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
// //             <input
// //               type="file"
// //               accept=".csv"
// //               onChange={handleFileChange}
// //               className="w-full border rounded-md px-3 py-2"
// //               required
// //             />
// //           </div>
// //           <div className="mt-4">
// //         <button
// //           onClick={handleDownloadSample}
// //           className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 transition-colors"
// //         >
// //           Download Sample Sheet
// //         </button>
// //       </div>
          

// //           {/* Table View for CSV Data, showing only the first 5 rows */}
// //           {csvData.length > 0 && (
// //   <div className="mt-4 overflow-x-auto border rounded-lg">
// //     <div className="text-sm text-gray-600 p-2">CSV Preview (first 5 rows)</div>
// //     <table className="w-full border-collapse">
// //       <thead>
// //         <tr>
// //           {csvData[0] && Object.keys(csvData[0]).map((header, idx) => (
// //             <th 
// //               key={idx} 
// //               className="border px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-700 uppercase"
// //             >
// //               {header}
// //             </th>
// //           ))}
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {csvData.slice(0, 5).map((row, index) => (
// //           <tr 
// //             key={index} 
// //             className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
// //           >
// //             {Object.values(row).map((value, colIndex) => (
// //               <td 
// //                 key={colIndex} 
// //                 className="border px-4 py-2 text-sm text-gray-900"
// //               >
// //                 {value || ''}
// //               </td>
// //             ))}
// //           </tr>
// //         ))}
// //       </tbody>
// //     </table>
// //     {csvData.length > 5 && (
// //       <div className="text-sm text-gray-500 p-2">
// //         ... and {csvData.length - 5} more rows
// //       </div>
// //     )}
// //   </div>
// // )}

// //           <div className="flex space-x-4">
// //             <button
// //               type="submit"
// //               className={`w-full ${loading ? "bg-gray-400" : "bg-blue-500"} text-white py-2 rounded-md hover:bg-blue-600 transition-colors`}
// //               disabled={loading}
// //             >
// //               {loading ? "Loading..." : "Create Campaign"}
// //             </button>
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateCampaignModal;

// import React, { useState, useEffect } from 'react';
// import axios from "axios";
// import { toast } from "react-toastify";
// import Papa from 'papaparse';

// const CreateCampaignModal = ({ onClose, fetchCampaigns }) => {
//   const [campaignName, setCampaignName] = useState("");
//   const [scheduledDate, setScheduledDate] = useState("");
//   const [scheduledTime, setScheduledTime] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   const [csvData, setCsvData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Set current date and time on component mount
//   useEffect(() => {
//     const now = new Date();
//     const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
//     const formattedTime = now.toTimeString().split(" ")[0]; // HH:MM:SS
//     setScheduledDate(formattedDate);
//     setScheduledTime(formattedTime);
//   }, []);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setCsvFile(file);
//       Papa.parse(file, {
//         header: true,
//         complete: (results) => {
//           setCsvData(results.data);
//           toast.success("CSV data loaded successfully!");
//         },
//         error: (error) => {
//           toast.error("Failed to parse CSV file.");
//           console.error("CSV parse error:", error);
//         }
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     const formData = new FormData();
//     formData.append("file", csvFile);
//     formData.append("scheduled_date", scheduledDate);
//     formData.append("scheduled_time", scheduledTime);
//     formData.append("campaign_name", campaignName);

//     try {
//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       fetchCampaigns();
//       onClose();
//       toast.success("Campaign created successfully with CSV!");
//     } catch (error) {
//       toast.error("Failed to create campaign.");
//       console.error("Create error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadSample = () => {
//     const sampleData = "Number,Name\nshubham,1234567890\nRanka,0987654321";
//     const blob = new Blob([sampleData], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "sample.csv";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg w-[600px] h-[800px] flex flex-col overflow-hidden shadow-xl">
//         {/* Modal Header */}
//         <div className="p-6 border-b">
//           <h2 className="text-2xl font-bold">Create Campaign</h2>
//         </div>

//         {/* Scrollable Content Area */}
//         <form 
//           onSubmit={handleSubmit} 
//           className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
//         >
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
//             <input
//               type="text"
//               value={campaignName}
//               onChange={(e) => setCampaignName(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             />
//           </div>

//           <div className="flex space-x-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
//               <input
//                 type="date"
//                 value={scheduledDate}
//                 onChange={(e) => setScheduledDate(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md"
//                 required
//               />
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
//               <input
//                 type="time"
//                 value={scheduledTime}
//                 onChange={(e) => setScheduledTime(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={handleFileChange}
//               className="w-full border rounded-md px-3 py-2"
//               required
//             />
//           </div>

//           <div className="mt-4">
//             <button
//               type="button"
//               onClick={handleDownloadSample}
//               className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 transition-colors"
//             >
//               Download Sample Sheet
//             </button>
//           </div>

//           {/* CSV Preview Section */}
//           {csvData.length > 0 && (
//             <div className="mt-4 overflow-x-auto border rounded-lg">
//               <div className="text-sm text-gray-600 p-2">CSV Preview (first 5 rows)</div>
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr>
//                     {csvData[0] && Object.keys(csvData[0]).map((header, idx) => (
//                       <th 
//                         key={idx} 
//                         className="border px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-700 uppercase"
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {csvData.slice(0, 5).map((row, index) => (
//                     <tr 
//                       key={index} 
//                       className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
//                     >
//                       {Object.values(row).map((value, colIndex) => (
//                         <td 
//                           key={colIndex} 
//                           className="border px-4 py-2 text-sm text-gray-900"
//                         >
//                           {value || ''}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {csvData.length > 5 && (
//                 <div className="text-sm text-gray-500 p-2">
//                   ... and {csvData.length - 5} more rows
//                 </div>
//               )}
//             </div>
//           )}
//         </form>

//         {/* Fixed Footer with Action Buttons */}
//         <div className="p-6 border-t flex space-x-4 bg-white">
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`w-full ${loading ? "bg-gray-400" : "bg-blue-500"} text-white py-2 rounded-md hover:bg-blue-600 transition-colors`}
//             disabled={loading}
//           >
//             {loading ? "Loading..." : "Create Campaign"}
//           </button>
//           <button
//             type="button"
//             onClick={onClose}
//             className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateCampaignModal;

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import Papa from 'papaparse';

const CreateCampaignModal = ({ onClose, fetchCampaigns }) => {
  const [campaignName, setCampaignName] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set current date and time on component mount
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = now.toTimeString().split(" ")[0]; // HH:MM:SS
    setScheduledDate(formattedDate);
    setScheduledTime(formattedTime);
  }, []);
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
          toast.success("CSV data loaded successfully!");
        },
        error: (error) => {
          toast.error("Failed to parse CSV file.");
          console.error("CSV parse error:", error);
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("scheduled_date", scheduledDate);
    formData.append("scheduled_time", scheduledTime);
    formData.append("campaign_name", campaignName);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if fetchCampaigns is a function before calling it
      if (typeof fetchCampaigns === 'function') {
        fetchCampaigns();
      } else {
        console.error('fetchCampaigns is not a function');
      }

      onClose();
      toast.success("Campaign created successfully with CSV!");
    } catch (error) {
      toast.error("Failed to create campaign.");
      console.error("Create error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const sampleData = "Number,Name\nshubham,1234567890\nRanka,0987654321";
    const blob = new Blob([sampleData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-[600px] flex flex-col overflow-hidden shadow-xl">
        {/* Modal Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Create Campaign</h2>
        </div>

        {/* Scrollable Content Area */}
        <form 
          onSubmit={handleSubmit} 
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleDownloadSample}
              className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Download Sample Sheet
            </button>
          </div>

          {/* CSV Preview Section */}
          {csvData.length > 0 && (
            <div className="mt-4 overflow-x-auto border rounded-lg max-h-64">
              <div className="text-sm text-gray-600 p-2">CSV Preview (first 5 rows)</div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {csvData[0] && Object.keys(csvData[0]).map((header, idx) => (
                      <th 
                        key={idx} 
                        className="border px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-700 uppercase"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 5).map((row, index) => (
                    <tr 
                      key={index} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                    >
                      {Object.values(row).map((value, colIndex) => (
                        <td 
                          key={colIndex} 
                          className="border px-4 py-2 text-sm text-gray-900"
                        >
                          {value || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvData.length > 5 && (
                <div className="text-sm text-gray-500 p-2">
                  ... and {csvData.length - 5} more rows
                </div>
              )}
            </div>
          )}
        </form>

        {/* Fixed Footer with Action Buttons */}
        <div className="p-6 border-t flex space-x-4 bg-white">
          <button
            type="submit"
            onClick={handleSubmit}
            className={`w-full ${loading ? "bg-gray-400" : "bg-blue-500"} text-white py-2 rounded-md`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Campaign"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-300 text-black py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
