import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from '../pages/HomePage'; 
// import NotFoundPage from '../pages/NotFoundPage'; 
import LoginPage from '../features/auth/pages/LoginPage';

// Admin Pages
import DashboardPage from '../features/admin/pages/DashboardPage';
import { AdminLayout } from '../components/Layouts/AdminLayout';
import CreatePostPage from '../features/admin/pages/CreatePostPage';
import ManagePostsPage from '../features/admin/pages/ManagePostsPage';
import EditPostPage from '../features/admin/pages/EditPostPage';
import ManageServicesPage from '../features/admin/pages/ManageServicesPage';
import CreateServicePage from '../features/admin/pages/CreateServicePage';
import EditServicePage from '../features/admin/pages/EditServicePage';
import PublicPostsPage from '../features/posts/pages/publicPostsPage';
import PublicPostDetailPage from '../features/posts/pages/PostDetailPage';
import PublicServicesPage from '../features/services/pages/ServicesPage';

// Layouts
import ProtectedRoute from '../components/Layouts/ProtectedRoute';
import {PublicLayout}  from '../components/Layouts/PublicLayout';

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

          {/* Post Routes */}
          <Route path="/admin/posts/create" element={<CreatePostPage />} />
          <Route path="/admin/posts" element={<ManagePostsPage />} />
          <Route path="/admin/posts/edit/:postId" element={<EditPostPage />} />

          {/* Services Routes */}
          <Route path="/admin/services/create" element={<CreateServicePage />} />
          <Route path="/admin/services" element={<ManageServicesPage />} />
          <Route path="/admin/services/edit/:serviceId" element={<EditServicePage/>} />
        </Route>
      </Route>

      {/* --- Public Routes --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PublicPostsPage />} />
        <Route path="/posts/:postId" element={<PublicPostDetailPage />} />
        <Route path="/services" element={<PublicServicesPage />} />
      </Route>

      {/* --- Catch All --- */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default AppRouter;