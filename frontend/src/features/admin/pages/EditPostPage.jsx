import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '../api/adminPostsApi';

// UI Components
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { TagsInput } from '../../../components/ui/TagsInput';
import { SeatDetailsEditor } from '../../../features/admin/components/SeatDetailsEditor';

const EditPostPage = () => {
  const { postId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // State matches the Create Post structure
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
    others: '',
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
                others: data.others || '',
                isActive: data.isActive
            });
        }
      } catch (err) {
        console.error("Failed to load post", err);
        setError("पोस्ट तपशील लोड करण्यात अयशस्वी.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
        fetchPostData();
    }
  }, [postId]);

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

    // Basic validation
    if (formData.ageLimit.length === 0) {
        setError("कृपया किमान एक वयोमर्यादा टॅग जोडा.");
        setSubmitting(false);
        return;
    }
    if (formData.qualifications.length === 0) {
        setError("कृपया किमान एक पात्रता टॅग जोडा.");
        setSubmitting(false);
        return;
    }
    if (formData.fees.length === 0) {
        setError("कृपया किमान एक फी टॅग जोडा.");
        setSubmitting(false);
        return;
    }

    try {
      // 2. Send Update Request
      await updatePost(postId, formData);
      navigate('/admin/posts'); // Go back to list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'पोस्ट अपडेट करण्यात अयशस्वी');
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        पोस्ट संपादित करा
      </h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              अपडेट तपशील
            </h3>
          </CardHeader>
          
          <CardBody className="space-y-8">
            
            {/* Section 1: Required Information */}
            <div>
              <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400 mb-4 border-b pb-2 border-blue-100 dark:border-blue-900">
                1. आवश्यक माहिती
              </h4>
              
              <div className="space-y-6">
                {/* Row 1: Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="title"
                    label="शीर्षक *"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  <div className="w-full">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      वर्ग *
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

                {/* Row 2: Post Name */}
                <Input
                  id="postName"
                  label="पदाचे नाव *"
                  value={formData.postName}
                  onChange={handleChange}
                  required
                />

                {/* Row 3: Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="startDate"
                    label="सुरुवात तारीख"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                  <Input
                    id="lastDate"
                    label="अंतिम तारीख *"
                    type="date"
                    value={formData.lastDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Row 4: Tags (Fees, Age, Qual) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <TagsInput
                    id="fees"
                    label="फी *"
                    placeholder="टाइप करा आणि Enter दाबा"
                    value={formData.fees}
                    onChange={(tags) => handleTagsChange('fees', tags)}
                  />
                  
                   <TagsInput
                    id="ageLimit"
                    label="वयोमर्यादा *"
                    placeholder="टाइप करा आणि Enter दाबा"
                    value={formData.ageLimit}
                    onChange={(tags) => handleTagsChange('ageLimit', tags)}
                  />
                </div>

                <TagsInput
                    id="qualifications"
                    label="पात्रता *"
                    placeholder="टाइप करा आणि Enter दाबा"
                    value={formData.qualifications}
                    onChange={(tags) => handleTagsChange('qualifications', tags)}
                />

                {/* Seat Details (Required by your schema default/logic) */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">जागांचा तपशील *</h4>
                    <SeatDetailsEditor 
                      value={formData.seatDetails}
                      onChange={handleSeatDetailsChange}
                    />
                </div>
              </div>
            </div>

            {/* Section 2: Other / Optional Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-600 dark:text-gray-400 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700 mt-6">
                2. इतर माहिती
              </h4>

              <div className="space-y-6">
                <Input
                    id="totalSeats"
                    label="एकूण जागा"
                    type="number"
                    value={formData.totalSeats}
                    onChange={handleChange}
                />

                <TagsInput
                    id="documentsRequired"
                    label="आवश्यक कागदपत्रे"
                    placeholder="टाइप करा आणि Enter दाबा"
                    value={formData.documentsRequired}
                    onChange={(tags) => handleTagsChange('documentsRequired', tags)}
                />

                <Input
                    id="source"
                    label="अधिकृत लिंक"
                    value={formData.source}
                    onChange={handleChange}
                />

                {/* Others Field */}
                <div className="w-full">
                  <label htmlFor="others" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    इतर माहिती
                  </label>
                  <textarea
                    id="others"
                    rows="4"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400"
                    placeholder="काही अतिरिक्त सूचना किंवा माहिती..."
                    value={formData.others}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <input
                        id="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-900 dark:text-gray-200 cursor-pointer">
                        Active - Visible to all
                    </label>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
               <Button 
                 type="button" 
                 variant="outline" 
                 onClick={() => navigate('/admin/posts')}
               >
                Cancel
               </Button>
               <Button type="submit" isLoading={submitting}>
                 Update
               </Button>
            </div>

          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default EditPostPage;