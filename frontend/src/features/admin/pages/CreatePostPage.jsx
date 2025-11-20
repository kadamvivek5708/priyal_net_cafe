import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/adminPostsApi';

// UI Components
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { TagsInput } from '../../../components/ui/TagsInput';
import { SeatDetailsEditor } from '../components/SeatDetailsEditor';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial State updated for arrays
  const [formData, setFormData] = useState({
    title: '',
    postName: '',
    category: 'भरती',
    seatDetails: [{ post: '', seats: '' }], 
    ageLimit: [], 
    qualifications: [], 
    fees: [], 
    documentsRequired: [], 
    lastDate: '',
    startDate: '',
    source: '',
    totalSeats: '', 
    isActive: true
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler for TagsInput
  const handleTagsChange = (field, newTags) => {
    setFormData(prev => ({ ...prev, [field]: newTags }));
  };

  // Handler for SeatDetails
  const handleSeatDetailsChange = (newSeatDetails) => {
    setFormData(prev => ({ ...prev, seatDetails: newSeatDetails }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation for arrays
    if (formData.ageLimit.length === 0) {
        setError("Please add at least one Age Limit tag.");
        setLoading(false);
        return;
    }
    if (formData.qualifications.length === 0) {
        setError("Please add at least one Qualification tag.");
        setLoading(false);
        return;
    }
    if (formData.fees.length === 0) {
        setError("Please add at least one Fee tag.");
        setLoading(false);
        return;
    }

    try {
      await createPost(formData);
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

            {/* Seat Details Table */}
            <SeatDetailsEditor 
              value={formData.seatDetails}
              onChange={handleSeatDetailsChange}
            />

            <Input
                id="totalSeats"
                label="Total Seats (Optional Summary)"
                placeholder="e.g. 1000+"
                type="number"
                value={formData.totalSeats}
                onChange={handleChange}
            />

            {/* Row 2: Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                type="date"
                value={formData.lastDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 3: Array Fields (Tags) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <TagsInput
                id="fees"
                label="Fees *"
                placeholder="Type (e.g. Open: ₹500) & Enter"
                value={formData.fees}
                onChange={(tags) => handleTagsChange('fees', tags)}
              />
              
               <TagsInput
                id="ageLimit"
                label="Age Limit *"
                placeholder="Type (e.g. 18-27 Years) & Enter"
                value={formData.ageLimit}
                onChange={(tags) => handleTagsChange('ageLimit', tags)}
              />
            </div>

            <TagsInput
                id="qualifications"
                label="Qualifications *"
                placeholder="Type (e.g. Any Graduate) & Enter"
                value={formData.qualifications}
                onChange={(tags) => handleTagsChange('qualifications', tags)}
            />

            <TagsInput
                id="documentsRequired"
                label="Documents Required"
                placeholder="Type (e.g. Aadhar Card) & Enter"
                value={formData.documentsRequired}
                onChange={(tags) => handleTagsChange('documentsRequired', tags)}
            />

            <Input
                id="source"
                label="Source / Official Link"
                placeholder="https://..."
                value={formData.source}
                onChange={handleChange}
            />

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
               <Button 
                 type="button" 
                 variant="outline" 
                 onClick={() => navigate('/admin/posts')}
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