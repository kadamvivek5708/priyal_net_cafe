import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Fix import path using alias
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

  // Initial State
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
    others: '', // New field for additional info
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

    // Basic validation
    if (formData.ageLimit.length === 0) {
        setError("कृपया किमान एक वयोमर्यादा टॅग जोडा.");
        setLoading(false);
        return;
    }
    if (formData.qualifications.length === 0) {
        setError("कृपया किमान एक पात्रता टॅग जोडा. ");
        setLoading(false);
        return;
    }
    if (formData.fees.length === 0) {
        setError("कृपया किमान एक फी टॅग जोडा. ");
        setLoading(false);
        return;
    }

    try {
      await createPost(formData);
      navigate('/admin/posts'); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'पोस्ट तयार करण्यात अयशस्वी ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        नवीन पोस्ट तयार करा.
      </h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              पोस्टचे  तपशील 
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
                    label="शीर्षक  *"
                    placeholder="उदा. SSC CGL 2025 Notification"
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
                      <option value="भरती">भरती </option>
                      <option value="ऑनलाईन अर्ज">ऑनलाईन अर्ज </option>
                      <option value="स्पर्धा परीक्षा">स्पर्धा परीक्षा </option>
                      <option value="निकाल">निकाल </option>
                      <option value="इतर">इतर </option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Post Name */}
                <Input
                  id="postName"
                  label="पदाचे नाव  *"
                  placeholder="उदा. पोलीस कॉन्स्टेबल / तलाठी"
                  value={formData.postName}
                  onChange={handleChange}
                  required
                />

                {/* Row 3: Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="startDate"
                    label="सुरुवात तारीख "
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                  <Input
                    id="lastDate"
                    label="अंतिम तारीख  *"
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
                    placeholder="उदा. Open: ₹500"
                    value={formData.fees}
                    onChange={(tags) => handleTagsChange('fees', tags)}
                  />
                  
                  <TagsInput
                    id="ageLimit"
                    label="वयोमर्यादा *"
                    placeholder="उदा. 18-38 वर्षे"
                    value={formData.ageLimit}
                    onChange={(tags) => handleTagsChange('ageLimit', tags)}
                  />
                </div>

                <TagsInput
                    id="qualifications"
                    label="पात्रता  *"
                    placeholder="उदा. 10वी पास"
                    value={formData.qualifications}
                    onChange={(tags) => handleTagsChange('qualifications', tags)}
                />

                {/* Seat Details (Required by your schema default/logic) */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <SeatDetailsEditor 
                      value={formData.seatDetails}
                      onChange={handleSeatDetailsChange}
                    />
                </div>
              </div>
            </div>

            {/* Section 2: Other / Optional Information */}
            <div>
              <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400 mb-4 border-b pb-2 border-blue-100 dark:border-blue-900">
                2. इतर माहिती 
              </h4>

              <div className="space-y-6">
                <Input
                    id="totalSeats"
                    label="एकूण जागा "
                    placeholder="उदा. 1000+"
                    type="number"
                    value={formData.totalSeats}
                    onChange={handleChange}
                />

                <TagsInput
                    id="documentsRequired"
                    label="आवश्यक कागदपत्रे "
                    placeholder="टाइप करा आणि Enter दाबा (उदा. आधार कार्ड)"
                    value={formData.documentsRequired}
                    onChange={(tags) => handleTagsChange('documentsRequired', tags)}
                />

                <Input
                    id="source"
                    label="अधिकृत लिंक (Source Link)"
                    placeholder="https://..."
                    value={formData.source}
                    onChange={handleChange}
                />

                {/* New Field: Others */}
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
                        Active - Visible to public
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