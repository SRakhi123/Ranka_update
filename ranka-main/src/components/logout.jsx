import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear JWT token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to the login page
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
      Logout
    </button>
  );
};

export default Logout;
