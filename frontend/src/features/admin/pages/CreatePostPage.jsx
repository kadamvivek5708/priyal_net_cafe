import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API
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

  // Initial Form State
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
    others: '',
    isActive: true
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTagsChange = (field, tags) => {
    setFormData(prev => ({ ...prev, [field]: tags }));
  };

  const handleSeatDetailsChange = (newSeatDetails) => {
    setFormData(prev => ({ ...prev, seatDetails: newSeatDetails }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.fees.length) {
      setError("कृपया किमान एक फी टॅग जोडा.");
      setLoading(false);
      return;
    }
    if (!formData.ageLimit.length) {
      setError("कृपया किमान एक वयोमर्यादा टॅग जोडा.");
      setLoading(false);
      return;
    }
    if (!formData.qualifications.length) {
      setError("कृपया किमान एक पात्रता टॅग जोडा.");
      setLoading(false);
      return;
    }

    try {
      await createPost(formData);
      navigate('/admin/posts');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'पोस्ट तयार करण्यात अयशस्वी.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        नवीन पोस्ट तयार करा
      </h1>

      <form onSubmit={handleSubmit}>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              पोस्टचे तपशील
            </h3>
          </CardHeader>

          <CardBody className="space-y-10 p-4 sm:p-6">

            {/* SECTION 1 — आवश्यक माहिती */}
            <div>
              <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400 mb-4 border-b pb-2">
                1. आवश्यक माहिती
              </h4>

              <div className="space-y-6">

                {/* Title + Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="title"
                    label="शीर्षक *"
                    placeholder="उदा. SSC CGL 2025 Notification"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      वर्ग *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <option value="भरती">भरती</option>
                      <option value="ऑनलाईन अर्ज">ऑनलाईन अर्ज</option>
                      <option value="स्पर्धा परीक्षा">स्पर्धा परीक्षा</option>
                      <option value="निकाल">निकाल</option>
                      <option value="इतर">इतर</option>
                    </select>
                  </div>
                </div>

                {/* Post Name */}
                <Input
                  id="postName"
                  label="पदाचे नाव *"
                  placeholder="उदा. पोलीस कॉन्स्टेबल / तलाठी"
                  value={formData.postName}
                  onChange={handleChange}
                  required
                />

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* Fees + Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* Qualification */}
                <TagsInput
                  id="qualifications"
                  label="पात्रता *"
                  placeholder="उदा. 10वी पास"
                  value={formData.qualifications}
                  onChange={(tags) => handleTagsChange('qualifications', tags)}
                />

                {/* Seat Details */}
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border dark:border-gray-700 overflow-x-auto">
                  <SeatDetailsEditor
                    value={formData.seatDetails}
                    onChange={handleSeatDetailsChange}
                  />
                </div>

              </div>
            </div>

            {/* SECTION 2 — इतर माहिती */}
            <div>
              <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400 mb-4 border-b pb-2">
                2. इतर माहिती
              </h4>

              <div className="space-y-6">

                {/* Total Seats */}
                <Input
                  id="totalSeats"
                  label="एकूण जागा"
                  type="number"
                  placeholder="उदा. 1000+"
                  value={formData.totalSeats}
                  onChange={handleChange}
                />

                {/* Documents */}
                <TagsInput
                  id="documentsRequired"
                  label="आवश्यक कागदपत्रे"
                  placeholder="उदा. आधार कार्ड"
                  value={formData.documentsRequired}
                  onChange={(tags) => handleTagsChange('documentsRequired', tags)}
                />

                {/* Source */}
                <Input
                  id="source"
                  label="अधिकृत लिंक (Source)"
                  placeholder="https://..."
                  value={formData.source}
                  onChange={handleChange}
                />

                {/* Others */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    इतर माहिती
                  </label>
                  <textarea
                    id="others"
                    rows="4"
                    placeholder="काही अतिरिक्त सूचना किंवा माहिती..."
                    className="w-full px-3 py-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
                    value={formData.others}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/40 border rounded-lg dark:border-gray-700">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-900 dark:text-gray-200 cursor-pointer">
                    Active - Visible to Public
                  </label>
                </div>

              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
              <Button
                variant="outline"
                type="button"
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
