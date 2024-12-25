import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Typography, Stack } from '@mui/joy';
import axios from 'axios';  // Axios for API requests

const ClientFormModal = ({ 
  isOpen, 
  clientNumber, 
  onClose, 
  onSubmit, 
  setClientNumber 
}) => {`  `
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [clientData, setClientData] = useState(null);  // Store client data from backend
  const [loading, setLoading] = useState(false);       // Loading state for API call
  const [error, setError] = useState(null);            // Error state
  const [clientSubmitted, setClientSubmitted] = useState(false);  // Tracks if client number was submitted

  // Function to handle client number submission and check the backend
  const onNumberSubmit = async () => {
    setLoading(true);  // Show loading state
    setError(null);    // Clear any previous errors
    setClientSubmitted(false);  // Reset form visibility until API returns

    try {
      // Make a GET request to check if the client exists
      const response = await axios.get(`/api/clients/${clientNumber}`);

      if (response.data) {
        // If client data is found, populate the form with the existing data
        const { name, company } = response.data;
        setClientData(response.data);
        setName(name);
        setCompany(company);
      } else {
        // If no client data is found, clear the form for a new entry
        setClientData(null);
        setName('');
        setCompany('');
      }
      
      setClientSubmitted(true);  // Show the form after submitting client number
    } catch (err) {
      setError('Client not found or server error.');
      setClientData(null);  // Clear client data on error
      setName('');
      setCompany('');
      setClientSubmitted(true);  // Show form even if client is not found (for new entry)
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  // Handle form submission (either update or add visit)
  const handleSubmit = () => {
    if (!name || !company) {
      alert('Please fill in all required fields'); // Basic validation
      return;
    }

    // Call the parent onSubmit function, passing form data
    onSubmit({ name, company });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div 
        className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Heading with Underline */}
        <Typography 
          level="h5" 
          className="mb-4 font-bold" 
          style={{ marginBottom: '20px', textAlign: 'center', borderBottom: '1px solid #eee', width: '100%' }}
        >
          Enter Client Number
        </Typography>

        {/* Client Number Input */}
        <Input
          placeholder="Enter client number"
          value={clientNumber}
          onChange={(e) => setClientNumber(e.target.value)}
          className="mb-4"
          style={{ marginBottom: '20px', width: '100%' }}
          disabled={loading}  // Disable input while loading
        />

        {/* Submit Client Number Button */}
        <Button 
          variant="solid" 
          onClick={onNumberSubmit} 
          className="mb-4"
          style={{ backgroundColor: '#007bff', color: '#fff', width: '100%', marginBottom: '20px' }}
          disabled={loading}  // Disable button while loading
        >
          {loading ? 'Checking...' : 'Submit'}
        </Button>

        {/* Display error if exists */}
        {error && (
          <Typography level="body2" color="danger" style={{ marginBottom: '20px' }}>
            {error}
          </Typography>
        )}

        {/* Conditionally render the form only after client number is submitted */}
        {clientSubmitted && (
          <div className="mt-6" style={{ width: '100%' }}>
            <Typography 
              level="h6" 
              className="mb-4" 
              style={{ textAlign: 'center', marginBottom: '10px' }}
            >
              {clientData ? 'Edit Client Details' : 'New Client Visit'}
            </Typography>

            {/* Client Name */}
            <Input
              placeholder="Client Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
              disabled={!!clientData && !!clientData.name}
              style={{ marginBottom: '10px', width: '100%' }}
            />

            {/* Company Name */}
            <Input
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mb-4"
              style={{ marginBottom: '10px', width: '100%' }}
            />

            {/* Submit and Cancel Buttons */}
            <Stack direction="row" spacing={2} justifyContent="space-between" style={{ marginTop: '20px' }}>
              <Button 
                variant="soft" 
                onClick={handleSubmit}
                style={{ backgroundColor: '#28a745', color: '#fff', width: '48%' }}
              >
                {clientData ? 'Update Visit' : 'Add Visit'}
              </Button>

              {/* Cancel Button */}
              <Button 
                variant="outlined" 
                onClick={onClose}
                style={{ width: '48%' }}
              >
                Cancel
              </Button>
            </Stack>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ClientFormModal;
