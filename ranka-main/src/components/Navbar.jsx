// import React, { useState, useEffect } from "react";
// import { Home, Phone, ClipboardList, LogOut, Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeLink, setActiveLink] = useState("/home");

//   const isAuthenticated = !!localStorage.getItem("token");
//   const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
//   const isAdmin = userRoles.includes("Admin");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("roles");
//     localStorage.removeItem("user");

//     // Create and show toast message
//     const toast = document.createElement('div');
//     toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50';
//     toast.textContent = "You have successfully logged out!";
//     document.body.appendChild(toast);
    
//     // Remove toast after 3 seconds
//     setTimeout(() => {
//       toast.remove();
//       window.location.href = '/';
//     }, 1000);
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     // Set the active link based on the current path
//     const currentPath = window.location.pathname;
//     setActiveLink(currentPath);
//   }, []);

//   const handleNavigation = (path) => {
//     setActiveLink(path); // Update the active link state first

//     if (path === '/home') {
//       if (isAdmin) {
//         window.location.href = '/admin';
//       } else {
//         window.location.href = '/dashboard';
//       }
//     } else {
//       window.location.href = path;
//     }
//   };

//   const navigationItems = [
//     { title: "Home", path: "/home", icon: <Home size={20} /> },
//     { title: "Agent Call", path: "/dashboard/agentcall", icon: <Phone size={20} /> },
//     { title: "Message Logs", path: "/message-logs", icon: <ClipboardList size={20} /> }
//   ];

//   return (
//     <nav
//       className={`fixed w-full z-50 transition-all duration-300 ${
//         isScrolled
//           ? "bg-white shadow-lg"
//           : "bg-white bg-opacity-90 backdrop-blur-sm"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Left Section: Logo */}
//           <div className="flex-shrink-0">
//             <button 
//               onClick={() => handleNavigation('/home')}
//               className="flex items-center"
//             >
//               <span className="text-xl font-semibold text-gray-800">
//                 Ranka
//               </span>
//             </button>
//           </div>

//           {/* Center: Navigation */}
//           <div className="hidden md:flex space-x-6 items-center">
//             {navigationItems.map((item, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleNavigation(item.path)}
//  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//                   activeLink === item.path
//                     ? "text-blue-600 border-b-2 border-blue-500"
//                     : "text-gray-700 hover:text-blue-600"
//                 } transition-all duration-300`}
//               >
//                 {item.icon} <span className="ml-2">{item.title}</span>
//               </button>
//             ))}
//           </div>

//           {/* Right Section: Logout */}
//           <div className="hidden md:flex">
//             {isAuthenticated && (
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-gray-700 hover:text-red-500 transition-all duration-300"
//               >
//                 <LogOut size={20} className="mr-2" />
//                 Logout
//               </button>
//             )}
//           </div>

//           {/* Mobile Menu Toggle */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-700 hover:text-blue-600"
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white shadow-lg">
//           {navigationItems.map((item, index) => (
//             <button
//               key={index}
//               onClick={() => {
//                 handleNavigation(item.path);
//                 setIsMenuOpen(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
//             >
//               {item.icon} <span className="ml-2">{item.title}</span>
//             </button>
//           ))}
//           {isAuthenticated && (
//             <button
//               onClick={() => {
//                 handleLogout();
//                 setIsMenuOpen(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
//             >
//               <LogOut size={20} className="mr-2 inline" />
//               Logout
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from "react";
import { Home, Phone, ClipboardList, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/home");

  const isAuthenticated = !!localStorage.getItem("token");
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = userRoles.includes("Admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("user");

    // Create and show toast message
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50";
    toast.textContent = "You have successfully logged out!";
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.remove();
      window.location.href = "/";
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Set the active link based on the current path
    const currentPath = window.location.pathname;
    setActiveLink(currentPath);
  }, []);

  const handleNavigation = (path) => {
    setActiveLink(path); // Update the active link state first

    if (path === "/home") {
      if (isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      window.location.href = path;
    }
  };

  const navigationItems = [
    { title: "Home", path: "/home", icon: <Home size={20} /> },
    { title: "Agent Call", path: "/dashboard/agentcall", icon: <Phone size={20} /> },
    { title: "Message Logs", path: "/message-logs", icon: <ClipboardList size={20} /> },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white bg-opacity-90 backdrop-blur-sm"
      }`}
      style={{
        margin: 0,
        padding: 0,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavigation("/home")}
              className="flex items-center"
            >
              <span className="text-xl font-semibold text-gray-800">Ranka</span>
            </button>
          </div>

          {/* Center: Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  activeLink === item.path
                    ? "text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-700 hover:text-blue-600"
                } transition-all duration-300`}
              >
                {item.icon} <span className="ml-2">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Right Section: Logout */}
          <div className="hidden md:flex">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-500 transition-all duration-300"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                handleNavigation(item.path);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              {item.icon} <span className="ml-2">{item.title}</span>
            </button>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            >
              <LogOut size={20} className="mr-2 inline" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
