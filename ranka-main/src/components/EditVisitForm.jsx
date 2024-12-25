import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/joy';

const EditVisitForm = ({ client, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(client);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/visitors/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        onSubmit(updatedClient); // Notify parent of the updated client
      } else {
        console.error('Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography level="h5" mb={2}>Edit Client Details</Typography>

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Company Name"
        name="company_name"
        value={formData.company_name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Phone Number"
        name="primary_mobile_no"
        value={formData.primary_mobile_no}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Address"
        name="address_line1"
        value={formData.address_line1}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" color="primary" fullWidth>
        Save Changes
      </Button>
      <Button onClick={onClose} color="neutral" fullWidth>
        Cancel
      </Button>
    </form>
  );
};

export default EditVisitForm;
