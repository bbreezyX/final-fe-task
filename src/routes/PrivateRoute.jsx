import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../pages/Navbar.jsx';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default PrivateRoute;
