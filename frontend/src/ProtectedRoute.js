import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo) {
    // If user is not logged in, redirect to /signin
    return <Navigate to="/signin" />;
  }

  // If user is logged in, render the children components
  return children;
};

export default ProtectedRoute;
