


import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';

// Lazy load components for better performance
const Login = lazy(() => import('./components/Homepage/Login.jsx'));
const StaffPanel = lazy(() => import('./pages/StaffPanel'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Layout = lazy(() => import('./components/Layout'));
const AgentCall = lazy(() => import('./components/Staff/Agent_call.jsx'));
const NotFound = lazy(() => import('./components/toold/NotFound.jsx')); // Create a 404 page

// Authentication Utilities
const authUtils = {
  isAuthenticated: () => !!localStorage.getItem('token'),
  getUserRole: () => JSON.parse(localStorage.getItem('roles') || '[]'),
  getUser: () => JSON.parse(localStorage.getItem('user') || '{}'),

  // Logout Utility
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Token expiration check
  isTokenExpired: () => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  },
};

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  const userRoles = authUtils.getUserRole();
  const tokenExpired = authUtils.isTokenExpired();

  console.log('Authenticated:', isAuthenticated);
  console.log('Token Expired:', tokenExpired);
  console.log('Allowed Roles:', allowedRoles);
  console.log('User Roles:', userRoles);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (tokenExpired) {
    authUtils.logout();
  }
  if (allowedRoles && !userRoles.some((role) => allowedRoles.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children || <Outlet />;
};

// Redirect Authenticated Users
const RedirectIfAuthenticated = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      const userRoles = authUtils.getUserRole();

      if (userRoles.includes('Admin')) {
        navigate('/admin', { replace: true });
      } else if (userRoles.includes('Staff')) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RedirectIfAuthenticated />}>
            <Route index element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              authUtils.isAuthenticated() ? <Layout /> : <Navigate to="/" replace />
            }
          >
            {/* Staff Dashboard */}
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
                  <StaffPanel />
                </ProtectedRoute>
              } 
            />

            {/* Agent Call */}
            <Route 
              path="dashboard/agentcall" 
              element={
                <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
                  <AgentCall />
                </ProtectedRoute>
              } 
            />

            {/* Admin Panel */}
            <Route 
              path="admin" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />

            {/* Default Redirect */}
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
