import React, { useState, useEffect } from "react";
import ListView from "../components/ListView";
import CardView from "../components/CardView";
import Pagination from "../components/Pagination";
import AddVisitForm from "../components/AddVisitForm";
import VisitorDetailsModal from "../components/VisitorDetailsModal";
import Modal from "../components/toold/Modal";
import { Button, Typography } from "@mui/joy";
import { ViewList, ViewModule } from "@mui/icons-material";

const StaffPanel = () => {
  const [viewMode, setViewMode] = useState("card");
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const clientsPerPage = 6;
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    fetchTodayVisits();
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayVisits = async () => {
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const endDate = new Date(today.setDate(today.getDate() + 1))
      .toISOString()
      .split("T")[0];

    setLoading(true);
    setError(null);

    try {
      const [visitorsRes, recordRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/visitors/by-date-range?startDate=${startDate}&endDate=${endDate}`
        ),
        fetch(
          `https://ranka.nuke.co.in/backend/api/visitors/record/by-date-range?startDate=${startDate}&endDate=${endDate}`
        ),
      ]);

      const visitorsData = await visitorsRes.json();
      const recordData = await recordRes.json();

      if (Array.isArray(visitorsData) && Array.isArray(recordData)) {
        const updatedClients = visitorsData.map((visitor) => {
          const matchingRecords = recordData.filter(
            (rec) => rec.primary_mobile_no === visitor.primary_mobile_no
          );

          if (matchingRecords.length > 0) {
            matchingRecords.sort(
              (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
            );
            visitor.purchase = matchingRecords[0].purchase;
          } else {
            visitor.purchase = "0"; // Default to "0" if no record is found
          }

          return visitor;
        });

        setClients(updatedClients);
      } else {
        setClients([]);
        console.warn("Invalid data format received from APIs.");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Unable to fetch visitors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVisit = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    window.location.reload(); // Refresh the page after closing the modal
  };

  const handleNewVisit = (newVisit) => {
    setClients((prevClients) => [...prevClients, newVisit]);
    closeModal(); // Close the modal after updating the list and refresh the page
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedClient(null);
    window.location.reload(); // Refresh the page after closing the details modal
  };

  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleUpdateVisit = (updatedClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const onEndVisit = async (clientId) => {
    try {
      const client = clients.find((c) => c.id === clientId);
      const response = await fetch('https://ranka.nuke.co.in/backend/api/visitors/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primary_mobile_no: client.primary_mobile_no,
          status: 'PP1',
        }),
      });
  
      if (response.ok) {
        alert('Visit ended successfully');
        // Refresh the page
        window.location.reload();
      } else {
        alert('Failed to end visit');
        console.error('Error ending visit:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  return (
    <div className="staff-panel mx-auto p-6 sm:p-8 max-w-7xl bg-white rounded-lg shadow-lg">
      {/* Hero Section */}
      <div className="hero flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-6 sm:mb-0">
          <img
            src="/Ranka.png"
            alt="Company Logo"
            className="h-20 w-20 mr-4 sm:mr-6 rounded-full shadow-md"
          />
          <Typography
            level="h3"
            className="font-bold text-gray-800 text-center sm:text-left"
          >
            Welcome, Receptionist
          </Typography>
        </div>

        {/* Date & Time */}
        <div className="text-gray-600 flex items-center justify-end w-full sm:w-auto mt-4 sm:mt-0">
          <Typography level="body2" className="text-right text-lg">
            {formatDateTime(currentDateTime)}
          </Typography>
        </div>

        {/* View and Add Visit */}
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant={viewMode === "list" ? "solid" : "plain"}
            onClick={() => setViewMode("list")}
            size="sm"
            startDecorator={<ViewList />}
            className="hover:bg-gray-100"
          >
            List View
          </Button>
          <Button
            variant={viewMode === "card" ? "solid" : "plain"}
            onClick={() => setViewMode("card")}
            size="sm"
            startDecorator={<ViewModule />}
            className="hover:bg-gray-100"
          >
            Card View
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleAddVisit}
            className="ml-4"
            startDecorator={<ViewModule />}
          >
            Add Visit →
          </Button>
        </div>
      </div>

      {/* Conditionally Render Views */}
      {loading ? (
        <Typography>Loading visitors...</Typography>
      ) : error ? (
        <Typography color="danger">{error}</Typography>
      ) : clients.length === 0 ? (
        <Typography>No visitors found for today.</Typography>
      ) : (
        <>
          {viewMode === "list" ? (
            <ListView
              clients={currentClients}
              onViewDetails={handleViewDetails}
              onEndVisit={onEndVisit} // Ensure onEndVisit is passed to ListView if needed
            />
          ) : (
            <CardView
              clients={currentClients}
              onViewDetails={handleViewDetails}
              onEndVisit={onEndVisit} // Pass onEndVisit here
            />
          )}

          {/* Pagination Component */}
          <Pagination
            totalClients={clients.length}
            clientsPerPage={clientsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {/* Add Visit Modal */}
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
          <AddVisitForm closeModal={closeModal} onVisitAdded={handleNewVisit} />
        </Modal>
      )}

      {/* Visitor Details Modal */}
      {detailsModalOpen && (
        <VisitorDetailsModal
          isModalOpen={detailsModalOpen}
          closeModal={closeDetailsModal}
          visitor={selectedClient}
          onUpdate={handleUpdateVisit} // Pass this function to handle updates
        />
      )}
    </div>
  );
};

export default StaffPanel;
