import React, { useState } from "react";
import { 
  FiHome, 
  FiBarChart2, 
  FiPhone, 
  FiUsers 
} from "react-icons/fi";
import { Toaster } from 'react-hot-toast';

// Import sub-components
import Dialer  from "../components/Admin/dialer";
import Statistics from "../components/Admin/statistics";
import Dashboard from "../components/Admin/dashboard";
import Staff from "../components/Admin/staffadmin"; // Import the new Staff component

/**
 * AdminDashboard component
 * Provides a responsive sidebar-based navigation for admin functionality
 * Supports switching between Dashboard, Statistics, Dialer, and Staff sections
 */
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const navSections = [
    { 
      name: "dashboard", 
      icon: <FiHome />,
      component: Dashboard 
    },
    { 
      name: "statistics", 
      icon: <FiBarChart2 />,
      component: Statistics 
    },
    { 
      name: "dialer Campaign", 
      icon: <FiPhone />,
      component: Dialer 
    },
    { 
      name: "Visitors", 
      icon: <FiUsers />,
      component: Staff 
    }
  ];

  // Render Sidebar
  const renderSidebar = () => (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-10 transition-transform duration-300 ease-in-out mt-20 ${
        // For mobile, set width based on the icons only
        "w-auto sm:w-64" // w-auto for mobile, w-64 for larger screens
      }`}
    >
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navSections.map(({ name, icon }) => (
            <li key={name}>
              <button
                onClick={() => setActiveSection(name)}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md transition duration-150 ease-in-out ${
                  activeSection === name
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {icon}
                {/* Show text only on md screens and up */}
                <span className="text-lg hidden sm:block">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );

  // Render Active Section
  const renderActiveSection = () => {
    const ActiveComponent = navSections.find(
      section => section.name === activeSection
    )?.component;

    return ActiveComponent 
      ? <ActiveComponent activeSection={activeSection} /> 
      : null;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* Sidebar Navigation */}
          {renderSidebar()}

          {/* Main Content Area */}
          <main className="flex-1 p-8 sm:ml-60 ml-10">
            {renderActiveSection()}
          </main>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </>
  );
};

export default AdminDashboard;
