import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
// import HomePage from '../pages/HomePage'; 
import LoginPage from '../features/auth/pages/LoginPage';
// import NotFoundPage from '../pages/NotFoundPage'; 

// Admin Pages
import DashboardPage from '../features/admin/pages/DashboardPage';

// Layouts
import ProtectedRoute from '../components/Layouts/ProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- Protected Admin Routes --- */}
      {/* Anything inside this Route element checks for the token first */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        {/* Future routes will go here: */}
        {/* <Route path="/admin/posts" element={<ManagePostsPage />} /> */}
        {/* <Route path="/admin/services" element={<ManageServicesPage />} /> */}
      </Route>

      {/* --- Catch All --- */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default AppRouter;