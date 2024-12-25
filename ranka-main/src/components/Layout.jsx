import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Ensure Navbar is correctly imported

const Layout = () => {
  return (
    <div className="layout-container">
      {/* Navbar */}
      <Navbar />

      {/* Main content rendered below the navbar */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
