import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '../api/adminPostsApi';

// UI Components
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { TagsInput } from '../../../components/ui/TagsInput';
import { SeatDetailsEditor } from '../components/SeatDetailsEditor';

const EditPostPage = () => {
  const { postId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // State matches the Create Post structure with arrays
  const [formData, setFormData] = useState({
    title: '',
    postName: '',
    category: 'भरती', 
    seatDetails: [],
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

  // 1. Fetch existing data on load
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await getPostById(postId);
        if (response.success) {
            const data = response.data;
            
            setFormData({
                title: data.title || '',
                postName: data.postName || '',
                category: data.category || 'भरती',
                
                // Handle Seat Details (Ensure it's an array)
                seatDetails: Array.isArray(data.seatDetails) ? data.seatDetails : [],

                // Handle Tag Arrays (Ensure they are arrays)
                ageLimit: Array.isArray(data.ageLimit) ? data.ageLimit : [],
                qualifications: Array.isArray(data.qualifications) ? data.qualifications : [],
                fees: Array.isArray(data.fees) ? data.fees : [],
                documentsRequired: Array.isArray(data.documentsRequired) ? data.documentsRequired : [],
                
                // Format Dates for Input type="date" (YYYY-MM-DD)
                lastDate: data.lastDate ? new Date(data.lastDate).toISOString().split('T')[0] : '',
                startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
                
                source: data.source || '',
                totalSeats: data.totalSeats || '',
                isActive: data.isActive
            });
        }
      } catch (err) {
        console.error("Failed to load post", err);
        setError("Could not load post details.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
        fetchPostData();
    }
  }, [postId]);

  // Handle basic input changes
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
    setSubmitting(true);
    setError(null);

    // Basic validation before submitting
    if (formData.ageLimit.length === 0) {
        setError("Please ensure there is at least one Age Limit tag.");
        setSubmitting(false);
        return;
    }

    try {
      // 2. Send Update Request
      await updatePost(postId, formData);
      navigate('/admin/posts'); // Go back to list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
      return (
          <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Edit Post
      </h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Update Details</h3>
          </CardHeader>
          
          <CardBody className="space-y-6">
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="title"
                label="Display Title *"
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
                  <option value="भरती">भरती</option>
                  <option value="ऑनलाईन अर्ज">ऑनलाईन अर्ज</option>
                  <option value="स्पर्धा परीक्षा">स्पर्धा परीक्षा</option>
                  <option value="निकाल">निकाल</option>
                  <option value="इतर">इतर</option>
                </select>
              </div>
            </div>

            <Input
              id="postName"
              label="Post Name (Official) *"
              value={formData.postName}
              onChange={handleChange}
              required
            />

            {/* Seat Details Editor */}
            <SeatDetailsEditor 
              value={formData.seatDetails}
              onChange={handleSeatDetailsChange}
            />

            <Input
                id="totalSeats"
                label="Total Seats (Optional Summary)"
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
                placeholder="Type & Enter"
                value={formData.fees}
                onChange={(tags) => handleTagsChange('fees', tags)}
              />
               <TagsInput
                id="ageLimit"
                label="Age Limit *"
                placeholder="Type & Enter"
                value={formData.ageLimit}
                onChange={(tags) => handleTagsChange('ageLimit', tags)}
              />
            </div>

            <TagsInput
                id="qualifications"
                label="Qualifications *"
                placeholder="Type & Enter"
                value={formData.qualifications}
                onChange={(tags) => handleTagsChange('qualifications', tags)}
            />

            <TagsInput
                id="documentsRequired"
                label="Documents Required"
                placeholder="Type & Enter"
                value={formData.documentsRequired}
                onChange={(tags) => handleTagsChange('documentsRequired', tags)}
            />

            <Input
              id="source"
              label="Source / Official Link"
              value={formData.source}
              onChange={handleChange}
            />

            {/* Active Checkbox */}
            <div className="flex items-center">
                <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Active (Visible to public)
                </label>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-4 pt-4">
               <Button 
                 type="button" 
                 variant="outline" 
                 onClick={() => navigate('/admin/posts')}
               >
                 Cancel
               </Button>
               <Button type="submit" isLoading={submitting}>
                 Update Post
               </Button>
            </div>

          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default EditPostPage;