


import React, { useState, useEffect, useMemo } from "react";
import { FiArrowLeft, FiSearch, FiRefreshCw } from "react-icons/fi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetailedTablePage = ({ campaign, onBack }) => {
  const [data, setData] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customRowsInput, setCustomRowsInput] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const { request_id } = campaign;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchCampaignDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/campaigns/details?request_id=${request_id}&action=read`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load campaign details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!request_id) return;
    fetchCampaignDetails();
  }, [request_id]);

  const fetchAgents = async () => {
    try {
      const response = await fetch(
        "https://ranka.nuke.co.in/backend/api/staff"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }
      const result = await response.json();
      setAgents(result);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to load agents");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleCustomRowsChange = (e) => {
    const value = e.target.value;
    setCustomRowsInput(value);

    const parsedValue = parseInt(value);
    setRowsPerPage(isNaN(parsedValue) || parsedValue <= 0 ? 5 : parsedValue);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((row) => row.id));
    }
  };

  const filteredData = useMemo(() => {
    return paginatedData.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [paginatedData, searchTerm]);

  const handleAssignAgent = async () => {
    if (selectedRows.length === 0) {
      toast.error('Please select at least one row');
      return;
    }

    if (!selectedAgent) {
      toast.error('Please select an agent');
      return;
    }

    setIsAssigning(true);

    try {
      const response = await fetch(
        'https://ranka.nuke.co.in/backend/api/campaigns/details/assign-agent/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            row_ids: selectedRows,
            agent_name: selectedAgent
          })
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(`Successfully assigned ${result.updatedRows} rows to ${selectedAgent}`);

        // Refresh data immediately after successful assignment
        await fetchCampaignDetails();

        // Reset selections
        setSelectedRows([]);
        setSelectedAgent("");
      } else {
        toast.error(result.message || 'Failed to assign agent');
      }
    } catch (err) {
      toast.error('Error assigning agent: ' + err.message);
      console.error('Assignment error:', err);
    } finally {
      setIsAssigning(false);
    }
  };

    // Calculate Overview Metrics
    const overviewMetrics = useMemo(() => {
      const total = data.length;
      const answered = data.filter(row => row.call_status === "Disconnected").length;
      const pending = data.filter(row => row.status === "Pending").length;
      const failed = data.filter(row => row.call_status === "Failed").length;
      const notAnswered = data.filter(row => row.call_status === "Not Answered").length;
      const completed = data.filter(row => row.status === "Complete").length;
  
      return { total, answered, pending, failed, notAnswered, completed };
    }, [data]);

  return (
    <>
            {/* Header with Refresh Button */}

            <div className="container mx-auto px-4 py-8 space-y-6 bg-white rounded-lg shadow-lg mb-6">
            <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="text-blue-600 flex items-center space-x-2 hover:underline"
            >
              <FiArrowLeft />
              <span>Back</span>
            </button>
              <h1 className="text-4xl font-bold text-gray-800 text-center flex-grow">Campaign Management</h1>
              <button
              onClick={fetchCampaignDetails}
              disabled={loading}
              className="text-green-600 flex items-center space-x-2 hover:underline disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              <span>Refresh Data</span>
            </button>
            </div>
          </div>

          {/* Overview Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
            <strong>Total Rows:</strong> {overviewMetrics.total}
          </div>
          <div className="p-4 bg-green-100 text-green-800 rounded-lg">
            <strong>Answered:</strong> {overviewMetrics.answered}
          </div>
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            <strong>Pending:</strong> {overviewMetrics.pending}
          </div>
          <div className="p-4 bg-red-100 text-red-800 rounded-lg">
            <strong>Failed:</strong> {overviewMetrics.failed}
          </div>
          <div className="p-4 bg-gray-100 text-gray-800 rounded-lg">
            <strong>Not Answered:</strong> {overviewMetrics.notAnswered}
          </div>
          <div className="p-4 bg-indigo-100 text-indigo-800 rounded-lg">
            <strong>Completed:</strong> {overviewMetrics.completed}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">


        {/* Search and Filters */}
        <div className="flex justify-between items-center space-x-6 mb-4">
          <div className="relative flex-grow min-w-[200px]">
            <input
              type="text"
              placeholder="     Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          >
            {[5, 10, 20, 50].map(num => (
              <option key={num} value={num}>{num} rows</option>
            ))}
          </select>
          

          <input
            type="number"
            placeholder="Custom rows"
            value={customRowsInput}
            onChange={handleCustomRowsChange}
            min="1"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 w-38"
          />

          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select Agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.username}>
                {agent.username}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignAgent}
            disabled={selectedRows.length === 0 || !selectedAgent || isAssigning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isAssigning ? (
              <>
                <FiRefreshCw className="mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Agent'
            )}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto border rounded-lg shadow">
          {loading ? (
            <div className="text-center p-4 flex justify-center items-center">
              <FiRefreshCw className="animate-spin mr-2" /> Loading...
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : filteredData.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              No data available.
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={selectedRows.length === filteredData.length}
                    />
                  </th>
                  <th className="p-4">ID</th>{" "}
                  <th className="p-4">Agent Assigned</th>{" "}
                  <th className="p-4">Phone Number</th>{" "}
                  <th className="p-4">Customer Name</th>{" "}
                  <th className="p-4">Notes</th>{" "}
                  <th className="p-4">Call Status</th>{" "}
                  <th className="p-4">Call Duration</th>{" "}
                  <th className="p-4">Status</th>{" "}
                  {/* Add more columns as needed */}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-100">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        onChange={() => toggleRowSelection(row.id)}
                        checked={selectedRows.includes(row.id)}
                      />
                    </td>
                    <td className="p-4">{row.id}</td>{" "}
                    <td className="p-4">{row.agent_assigned}</td>{" "}
                    <td className="p-4">{row.phone_number}</td>{" "}
                    <td className="p-4">{row.customer_name}</td>{" "}
                    <td className="p-4">{row.notes}</td>{" "}
                    <td className="p-4">{row.call_status}</td>{" "}
                    <td className="p-4">{row.call_duration}</td>{" "}
                    <td className="p-4">{row.status}</td>
                    {/* Add more data fields as needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} of {data.length} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default DetailedTablePage;
