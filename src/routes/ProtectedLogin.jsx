import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedLogin = ({ children }) => {
  const token = localStorage.getItem('token'); // Cek apakah token tersedia

  console.log('Token found:', token);

  // Jika token ada, arahkan ke dashboard
  if (token) {
    console.log('Redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('Rendering login page');
  // Jika tidak ada token, tampilkan halaman login
  return children;
};

export default ProtectedLogin;
