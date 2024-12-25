import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Modal component for adding staff
const AddStaffModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isLoading
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Add Staff Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Staff'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal component for editing staff
const EditStaffModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isLoading
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    // Prepare data to send to API
    const dataToSend = {
      username,
      ...(email && email !== formData.email && { newEmail: email }), // Only send newEmail if changed
      ...(password && password !== '' && { newPassword: password }) // Only send newPassword if filled
    };

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    onSubmit(dataToSend);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Edit Staff Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Staff'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Dashboard Component
const StaffDashboard = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/staff`
      );
      // Sort staff data to show latest first
      const sortedData = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setStaffData(sortedData);
      setError(null);
    } catch (error) {
      setError('Failed to fetch staff data');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (staffInfo) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/staff`,
        staffInfo
      );
      toast.success('Staff added successfully!');
      fetchStaffData();
      setIsAddModalOpen(false);
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      console.error('Add staff error:', error);
      toast.error('Failed to add staff. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/delete-user`, {
        data: { username }
      });
      toast.success(response.data.message);
      fetchStaffData();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user. Please try again.');
    }
  };

  const handleEditStaff = async (userInfo) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/update-user-details`,
        userInfo
      );
      toast.success(response.data.message);
      fetchStaffData();
      setIsEditModalOpen(false);
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Failed to update user details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate pagination
  const indexOfLastStaff = currentPage * rowsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - rowsPerPage;
  const currentStaffData = staffData.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(staffData.length / rowsPerPage);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (

    <>
      {/* Header */}
      <div className="container mx-auto px-4 py-8 space-y-6 bg-white rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex-grow text-center">Staff Management</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FiPlus className="mr-2" /> Add Staff
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 space-y-6 bg-slate-50 rounded-lg shadow-lg mb-4">
        {/* Overview Section */}
        <div className="mb-6 ">
          {/* Section Header with shadow */}
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-shadow-md">
            Overview
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Staff */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Total Staff</h3>
              <p className="text-4xl font-bold text-gray-900">{staffData.length}</p>
            </div>

            {/* Active Staff */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Online Staff</h3>
              <p className="text-4xl font-bold text-green-600">
                {staffData.filter(staff => staff.status === 'online').length}
              </p>
            </div>

            {/* Active Staff */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Offline Staff</h3>
              <p className="text-4xl font-bold text-green-600">
                {staffData.filter(staff => staff.status === 'offline').length}
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8 space-y-6 bg-slate-50 rounded-lg shadow-lg">


        {/* Rows per page selection */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-4">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="mt-4 sm:mt-0 w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                setStaffData((prevData) => prevData.filter(staff =>
                  staff.username.toLowerCase().includes(searchTerm) ||
                  staff.email.toLowerCase().includes(searchTerm)
                ));
              }}
            />
          </div>
        </div>

        {/* Staff List Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-md text-indigo-800 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-md text-indigo-800 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-md text-indigo-800 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-md  text-indigo-800 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-left text-md  text-indigo-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-md  text-indigo-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStaffData.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{staff.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{staff.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(staff.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(staff.last_active).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {staff.status || 'inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                            onClick={() => {
                              setEditingUser(staff.username);
                              setFormData({ username: staff.username, email: staff.email, password: '' });
                              setIsEditModalOpen(true);
                            }}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                            onClick={() => handleDeleteUser(staff.username)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {staffData.length === 0 && (
                <div className="text-center py-4 text-gray-500">No staff members found</div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>

        {/* Modals */}
        <AddStaffModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddStaff}
          formData={formData}
          setFormData={setFormData}
          isLoading={isSubmitting}
        />

        <EditStaffModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditStaff}
          formData={formData}
          setFormData={setFormData}
          isLoading={isSubmitting}
        />

        <ToastContainer />
      </div>



    </>

  );
};

export default StaffDashboard;