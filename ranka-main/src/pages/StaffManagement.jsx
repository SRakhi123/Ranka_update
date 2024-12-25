import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import StaffForm from './StaffForm'; // Create this form component
import StaffTable from './StaffTable'; // Create this table component

const StaffManagement = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/staff');
      setStaffData(response.data);
    } catch (error) {
      console.error("Error fetching staff data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-800">Staff Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          Add Staff
        </button>
      </div>

      {showForm && <StaffForm fetchStaffData={fetchStaffData} />}
      <StaffTable staffData={staffData} loading={loading} />
      <Toaster />
    </div>
  );
};

export default StaffManagement;