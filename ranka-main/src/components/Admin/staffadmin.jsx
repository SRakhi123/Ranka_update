import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DateRangePicker from "../toold/DateRangePicker.jsx";
import SalesmanModal from "./SalesmanModal.jsx";
import { FiSearch, FiPlus } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

Modal.setAppElement("#root"); // To prevent screen reader issues with React Modal

const StaffPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCampaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");

  const fetchData = async () => {
    if (!startDate || !endDate) {
      console.log("Start date or end date is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://ranka.nuke.co.in/backend/api/visitors/by-date-range`,
        {
          params: {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        }
      );
      setData(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((row) => row.id));
    }
  };

  const filteredData = useMemo(() => {
    return currentItems.filter((item) => {
      return Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [currentItems, searchTerm]);

  const handleCreateCampaign = async () => {
    if (!campaignName || !scheduledDate) {
      toast.error("Please provide campaign name and schedule date.");
      return;
    }

    const selectedVisitors = data.filter((visitor) =>
      selectedRows.includes(visitor.id)
    );

    const payload = {
      campaignName,
      scheduledDate,
      selectedVisitors: selectedVisitors.map((visitor) => ({
        number: visitor.primary_mobile_no,
        name: visitor.name,
      })),
    };

    setCreatingCampaign(true);
    try {
      const response = await axios.post(
        "https://ranka.nuke.co.in/backend/api/campaignsvisitor",
        payload
      );
      toast.success(response.data.message || "Campaign created successfully.");
      setCampaignModalOpen(false);
      setCampaignName("");
      setSelectedRows([]);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign.");
    } finally {
      setCreatingCampaign(false);
    }
  };

  useEffect(() => {
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const formattedTime = now.toTimeString().split(" ")[0]; // HH:MM:SS
      setScheduledDate(formattedDate);
      setScheduledTime(formattedTime);
    }, []);
    

  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-6 bg-white rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 text-center flex-grow">Visitors</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center px-5 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
          >
            <FiPlus className="mr-2" /> Manage Salesmen
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6 bg-white rounded-lg shadow-lg mb-6">
        <DateRangePicker
          onApply={({ startDate, endDate }) => {
            setStartDate(startDate);
            setEndDate(endDate);
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6 bg-white rounded-lg shadow-lg mb-6">
        <SalesmanModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

        <div className="flex justify-between items-center mt-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
          <button
            disabled={selectedRows.length === 0}
            onClick={() => setCampaignModalOpen(true)}
            className={`ml-4 px-5 py-3 ${selectedRows.length > 0 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-700 cursor-not-allowed"} text-white rounded-md transition-colors shadow-md`}
          >
            Create Campaign
          </button>
        </div>

        {loading ? (
          <p className="text-blue-500 mt-4">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={selectedRows.length === filteredData.length}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Mobile No</th>
                  <th className="px-4 py-3 text-left">Salesman</th>
                  <th className="px-4 py-3 text-left">Company Name</th>
                  <th className="px-4 py-3 text-left">Scheduled Date</th>
                  <th className="px-4 py-3 text-left">District</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Visit Count</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        onChange={() => toggleRowSelection(item.id)}
                        checked={selectedRows.includes(item.id)}
                      />
                    </td>
                    <td className="px-3 py-2">{item.id}</td>
                    <td className="px-3 py-2">{item.name}</td>
                    <td className="px-3 py-2">{item.primary_mobile_no || "N/A"}</td>
                    <td className="px-3 py-2">{item.salesman || "N/A"}</td>
                    <td className="px-3 py-2">{item.company_name}</td>
                    <td className="px-3 py-2">{new Date(item.updated_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{item.dist}</td>
                    <td className="px-3 py-2">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{item.visit_count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center py-3 mt-6">
          <div className="text-sm text-gray-700">
            Showing{" "}
            {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} items
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(Math.ceil(filteredData.length / itemsPerPage), currentPage + 1)
                )
              }
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>

      {/* Modal for Campaign Creation */}
      <Modal
        isOpen={isCampaignModalOpen}
        onRequestClose={() => setCampaignModalOpen(false)}
        className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-12"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Create Campaign</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Campaign Name"
            className="w-full px-4 py-2 border rounded-lg"
          />
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
          <div className="space-y-2">
            <p className="font-semibold">Selected Visitors:</p>
            {selectedRows
              .slice(0, 5)
              .map((id) => data.find((visitor) => visitor.id === id))
              .map((visitor) => (
                <p key={visitor.id}>
                  {visitor.name} ({visitor.primary_mobile_no})
                </p>
              ))}
          </div>
          {selectedRows.length > 5 && (
            <p className="text-gray-500">+{selectedRows.length - 5} more...</p>
          )}
          <button
            onClick={handleCreateCampaign}
            disabled={creatingCampaign}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {creatingCampaign ? "Creating..." : "Submit"}
          </button>
        </div>
      </Modal>
    </>
  );
};


export default StaffPage;
