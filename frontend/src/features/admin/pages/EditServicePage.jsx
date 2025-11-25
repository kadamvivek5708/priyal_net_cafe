import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getServiceById, updateService } from '../api/adminServicesApi';

import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { TagsInput } from '../../../components/ui/TagsInput';

const EditServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    fees: '',
    processingTime: '',
    documentsRequired: [],
    isActive: true
  });

  // 1. Fetch Service Data
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await getServiceById(serviceId);
        if (response.success) {
            const data = response.data;
            setFormData({
                name: data.name || '',
                fees: data.fees || '',
                processingTime: data.processingTime || '',
                // Ensure array for TagsInput
                documentsRequired: Array.isArray(data.documentsRequired) ? data.documentsRequired : [],
                isActive: data.isActive
            });
        }
      } catch (err) {
        console.error("Failed to load service", err);
        setError("Could not load service details.");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
        fetchService();
    }
  }, [serviceId]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagsChange = (newTags) => {
    setFormData((prev) => ({ ...prev, documentsRequired: newTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (formData.documentsRequired.length === 0) {
        setError("Please add at least one required document.");
        setSubmitting(false);
        return;
    }

    try {
      await updateService(serviceId, formData);
      navigate('/admin/services');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update service');
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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Edit Service
      </h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">Update Details</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            
            <Input 
              id="name" 
              label="सेवेचे नाव *" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                id="fees" 
                label="फी *" 
                value={formData.fees} 
                onChange={handleChange} 
                required 
              />
              <Input 
                id="processingTime" 
                label="कालावधी *" 
                value={formData.processingTime} 
                onChange={handleChange} 
              />
            </div>

            {/* TagsInput for Documents */}
            <TagsInput
                id="documentsRequired"
                label="आवश्यक कागदपत्रे *"
                placeholder="Type & Enter"
                value={formData.documentsRequired}
                onChange={handleTagsChange}
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
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
               <Button 
                 type="button" 
                 variant="outline" 
                 onClick={() => navigate('/admin/services')}
               >
                 Cancel
               </Button>
               <Button type="submit" isLoading={submitting}>
                 Update Service
               </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default EditServicePage;