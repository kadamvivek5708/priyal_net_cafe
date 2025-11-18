// src/features/admin/pages/CreatePostPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/adminPostsApi';

// UI Components
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial State matches your Mongoose Post Schema
  const [formData, setFormData] = useState({
    title: '',
    postName: '',
    category: 'भरती', // Default enum value
    ageLimit: '',
    qualifications: '',
    fees: '',
    lastDate: '',
    startDate: '',
    documentsRequired: '',
    source: '',
    isActive: true
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createPost(formData);
      // Redirect to post list after success
      navigate('/admin/posts'); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Create New Post
      </h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Post Details</h3>
          </CardHeader>
          
          <CardBody className="space-y-6">
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="title"
                label="Display Title *"
                placeholder="e.g. SSC CGL 2025 Notification"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <div className="w-full">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="भरती">भरती (Recruitment)</option>
                  <option value="ऑनलाईन अर्ज">ऑनलाईन अर्ज (Online Form)</option>
                  <option value="स्पर्धा परीक्षा">स्पर्धा परीक्षा (Competitive Exam)</option>
                  <option value="निकाल">निकाल (Result)</option>
                  <option value="इतर">इतर (Other)</option>
                </select>
              </div>
            </div>

            <Input
              id="postName"
              label="Post Name (Official) *"
              placeholder="e.g. Inspector, Assistant Section Officer"
              value={formData.postName}
              onChange={handleChange}
              required
            />

            {/* Row 2: Dates & Fees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                id="startDate"
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
              <Input
                id="lastDate"
                label="Last Date *"
                type="text" // Text allows "31 Dec 2025" or specific formats
                placeholder="DD-MM-YYYY"
                value={formData.lastDate}
                onChange={handleChange}
                required
              />
              <Input
                id="fees"
                label="Fees *"
                placeholder="e.g. Open: ₹500, OBC: ₹300"
                value={formData.fees}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 3: Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input
                id="ageLimit"
                label="Age Limit *"
                placeholder="e.g. 18-27 Years"
                value={formData.ageLimit}
                onChange={handleChange}
                required
              />
              <Input
                id="qualifications"
                label="Qualifications *"
                placeholder="e.g. Any Graduate"
                value={formData.qualifications}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 4: Extra Info */}
            <div className="space-y-4">
               <Input
                id="documentsRequired"
                label="Documents Required"
                placeholder="e.g. Aadhar, Photo, Signature"
                value={formData.documentsRequired}
                onChange={handleChange}
              />
              <Input
                id="source"
                label="Source / Official Link"
                placeholder="https://..."
                value={formData.source}
                onChange={handleChange}
              />
            </div>

            {/* Error Display */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
               <Button 
                 type="button" 
                 variant="outline" 
                 onClick={() => navigate('/admin/dashboard')}
               >
                 Cancel
               </Button>
               <Button type="submit" isLoading={loading}>
                 Create Post
               </Button>
            </div>

          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default CreatePostPage;