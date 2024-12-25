import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'; // Make sure to install heroicons if you want to use these icons.

const StaffForm = ({ fetchStaffData }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.post('/api/staff', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Staff added successfully!");
      fetchStaffData();
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to add staff. Please try again.");
      console.error("Error creating staff:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <button type="button" onClick={togglePasswordVisibility} className="absolute right-2 top-2">
            {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute right-2 top-2">
            {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
      </div>
      <div className="md:col -span-2">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Staff
        </button>
      </div>
    </form>
  );
};

export default StaffForm;