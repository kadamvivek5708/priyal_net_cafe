import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
// import HomePage from '../pages/HomePage'; 
// import NotFoundPage from '../pages/NotFoundPage'; 
import LoginPage from '../features/auth/pages/LoginPage';

// Admin Pages
import DashboardPage from '../features/admin/pages/DashboardPage';
import { AdminLayout } from '../components/Layouts/AdminLayout';
import CreatePostPage from '../features/admin/pages/CreatePostPage';
import ManagePostsPage from '../features/admin/pages/ManagePostsPage';

// Layouts
import ProtectedRoute from '../components/Layouts/ProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- Protected Admin Routes --- */}
      <Route element={<ProtectedRoute />}>
        {/* Apply AdminLayout to all routes inside */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/posts/create" element={<CreatePostPage />} />
          <Route path="/admin/posts" element={<ManagePostsPage />} />
          {/* <Route path="/admin/services" element={<ManageServicesPage />} /> */}
        </Route>
      </Route>

      {/* --- Catch All --- */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default AppRouter;