import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
// Import your public pages
// import HomePage from '../pages/HomePage';
// import NotFoundPage from '../pages/NotFoundPage';

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      {/* <Route path="/" element={<HomePage />} /> */}
      
      {/* This is the route you'll test: */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes (We'll add these later) */}
      {/* <Route path="/admin/dashboard" element={...} /> */}

      {/* Catch-all Not Found Route */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default AppRouter;