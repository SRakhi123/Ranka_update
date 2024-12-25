



import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FiEye, FiTrash2, FiPlus } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateCampaignModal from "./CreateCampaignModal";
import DetailedTablePage from "./DetailedTablePage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const DialerPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState([null, null]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/campaigns`);
      const sortedCampaigns = response.data.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );
      setCampaigns(sortedCampaigns);
      setFilteredCampaigns(sortedCampaigns); // Apply filtering logic here if needed
    } catch (error) {
      toast.error("Failed to fetch campaigns.");
    }
  };

  // Add a delete function to handle API request
  // Add a delete function to handle API request
  const handleDeleteCampaign = async (event, requestId) => {
    event.stopPropagation(); // Prevent click event from affecting other components (like select)

    try {
      const response = await axios.delete(`${API_BASE_URL}/campaigns`, {
        data: {
          Action: "delete",
          request_id: requestId,
        },
      });

      if (response.data.message === "Campaign and corresponding queue record deleted successfully") {
        // Refresh campaigns after deletion
        toast.success("Campaign deleted successfully.");
        fetchCampaigns(); // Re-fetch the campaigns to update the list
      } else {
        toast.error("Failed to delete campaign.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the campaign.");
    }
  };




  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleBackFromDetails = () => {
    setSelectedCampaign(null); // Clear selected campaign
    fetchCampaigns(); // Re-hit the API to refresh data
  };


  // Filter campaigns by search term and status
  // const filterCampaigns = (search, status) => {
  //   let filtered = campaigns;

  //   if (search) {
  //     filtered = filtered.filter((campaign) =>
  //       campaign.campaign_name.toLowerCase().includes(search.toLowerCase())
  //     );
  //   }

  //   if (status) {
  //     filtered = filtered.filter((campaign) => campaign.status === status);
  //   }

  //   setFilteredCampaigns(filtered);
  // };

  const filterCampaigns = (search, status, dateRange) => {
    let filtered = campaigns;

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);

      filtered = filtered.filter((campaign) => {
        const campaignDate = new Date(campaign.created_at);
        return campaignDate >= startDate && campaignDate <= endDate;
      });
    }

    // Filter by search term (case-insensitive)
    if (search) {
      filtered = filtered.filter((campaign) =>
        campaign.campaign_name && campaign.campaign_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter((campaign) => campaign.status === status);
    }

    setFilteredCampaigns(filtered);
  };




  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterCampaigns(value, statusFilter, dateRange);  // Pass all three filters to the function
  };

  const handleStatusFilter = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
    filterCampaigns(searchTerm, value, dateRange);  // Pass all three filters
  };

  const handleDateRangeChange = (update) => {
    setDateRange(update);
    filterCampaigns(searchTerm, statusFilter, update);  // Pass all three filters
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? filteredCampaigns.map((c) => c.id) : []);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-200 text-green-800';
      case 'Pending': return 'bg-yellow-200 text-yellow-800';
      case 'Completed': return 'bg-blue-200 text-blue-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  useEffect(() => {
    filterCampaigns(searchTerm, statusFilter);
  }, [campaigns, searchTerm, statusFilter]);

  const currentCampaignData = filteredCampaigns.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when rows per page changes
  }, [rowsPerPage]);

  // Calculate Overview Metrics
  const overviewMetrics = useMemo(() => {
    const total = campaigns.length;
    const answered = campaigns.filter(row => row.call_status === "Answered").length;
    const pending = campaigns.filter(row => row.status === "Pending").length;
    const inprogress = campaigns.filter(row => row.call_status === "inprogress").length;
    const notAnswered = campaigns.filter(row => row.call_status === "Not Answered").length;
    const completed = campaigns.filter(row => row.status === "Completed").length;

    return { total, answered, pending, inprogress, notAnswered, completed };
  }, [campaigns]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {selectedCampaign ? (
        <DetailedTablePage
          campaign={selectedCampaign}
          onBack={handleBackFromDetails} // Trigger refresh when returning
        />
      ) : (
        <>
          <div className="container mx-auto px-4 py-8 space-y-6 bg-white rounded-lg shadow-lg mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-gray-800 text-center flex-grow">Campaign Management</h1>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center px-5 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
              >
                <FiPlus className="mr-2" /> Create Campaign
              </button>
            </div>
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
            <strong>Total Rows:</strong> {overviewMetrics.total}
          </div> */}
              {/* <div className="p-4 bg-green-100 text-green-800 rounded-lg">
            <strong>Answered:</strong> {overviewMetrics.answered}
          </div> */}
              <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                <strong>Pending:</strong> {overviewMetrics.pending}
              </div>
              <div className="p-4 bg-red-100 text-red-800 rounded-lg">
                <strong>In-progress:</strong> {overviewMetrics.inprogress}
              </div>
              {/* <div className="p-4 bg-gray-100 text-gray-800 rounded-lg">
            <strong>Not Answered:</strong> {overviewMetrics.notAnswered}
          </div> */}
              <div className="p-4 bg-indigo-100 text-indigo-800 rounded-lg">
                <strong>Completed:</strong> {overviewMetrics.completed}
              </div>
            </div>
          </div>

          <div className="container mx-auto mb-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center space-x-6 mb-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-3 w-full md:w-1/3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Search Campaign"
                  />
                  <div className="flex space-x-4 items-center">
                    <label className="block text-sm text-gray-700">Date Range:</label>
                    <div>

                      <DatePicker
                        selectsRange
                        startDate={dateRange[0]}
                        endDate={dateRange[1]}
                        onChange={(update) => setDateRange(update)}  // Should correctly update the date range state
                        isClearable
                        customInput={
                          <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Select date range"
                          />
                        }
                        placeholderText="Select date range"
                      />



                    </div>
                    <select
                      value={statusFilter}
                      onChange={handleStatusFilter}
                      className="p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Status</option>
                      <option value="Completed">Completed</option>
                      <option value="In-progress">In-progress</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <label className="block text-sm text-gray-700">Rows per page:</label>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(Number(e.target.value))}
                      className="p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-100 text-indigo-800">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedRows.length === filteredCampaigns.length}
                          />
                        </th>
                        <th className="px-4 py-3 text-left">Campaign Name</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Numbers</th>
                        <th className="px-4 py-3 text-left">Scheduled Date</th>
                        <th className="px-4 py-3 text-left">Agent Assigned</th>
                        <th className="px-4 py-3 text-left">Created</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {currentCampaignData.map((campaign) => (
                        <tr
                          key={campaign.id}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedCampaign(campaign)}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(campaign.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleRowSelect(campaign.id);
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">{campaign.campaign_name}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}
                            >
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{campaign.numbers}</td>
                          <td className="px-4 py-3">
                            {new Date(campaign.scheduled_date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {(() => {
                              if (!campaign.agent_assign) return 'No agents assigned'; // Handle null or undefined
                              const agents = campaign.agent_assign.split(', ');
                              return agents.length > 3
                                ? `${agents.slice(0, 3).join(', ')}...`
                                : campaign.agent_assign;
                            })()}
                          </td>

                          <td className="px-4 py-3">{new Date(campaign.created_at).toLocaleDateString()}</td>

                          <td className="px-4 py-3 flex space-x-2">
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={(e) => handleDeleteCampaign(e, campaign.request_id)} // Pass the event and request_id
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center py-3 mt-6">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    {Math.min((currentPage - 1) * rowsPerPage + 1, filteredCampaigns.length)} to{" "}
                    {Math.min(currentPage * rowsPerPage, filteredCampaigns.length)} of{" "}
                    {filteredCampaigns.length} campaigns
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(Math.ceil(filteredCampaigns.length / rowsPerPage), currentPage + 1))}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ToastContainer />
        </>
      )}

      {/* Create Campaign Modal */}
      {/* {showModal && <CreateCampaignModal onClose={() => setShowModal(false)} />}
      // In DialerPage Component */}
      {showModal && (
        <CreateCampaignModal onClose={() => {
          setShowModal(false);
          fetchCampaigns(); // Re-fetch campaigns when modal is closed
        }} />
      )}

    </div>
  );
};

export default DialerPage;
