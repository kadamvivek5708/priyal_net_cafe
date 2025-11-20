import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService } from '../api/adminServicesApi';

// UI Components
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { TagsInput } from '../../../components/ui/TagsInput';

const CreateServicePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    fees: '',
    processingTime: '',
    documentsRequired: [], // Array for TagsInput
    isActive: true
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handler specifically for the TagsInput component
  const handleTagsChange = (newTags) => {
    setFormData((prev) => ({ ...prev, documentsRequired: newTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.name.trim()) {
        setError("Service Name is required");
        setLoading(false);
        return;
    }
    if (formData.documentsRequired.length === 0) {
        setError("Please add at least one required document.");
        setLoading(false);
        return;
    }

    try {
      await createService(formData);
      navigate('/admin/services');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Add New Service
      </h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">Service Details</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            
            <Input 
              id="name" 
              label="Service Name *" 
              placeholder="e.g. Shop Act License"
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                id="fees" 
                label="Fees *" 
                placeholder="e.g. ₹500"
                value={formData.fees} 
                onChange={handleChange} 
                required 
              />
              <Input 
                id="processingTime" 
                label="Processing Time" 
                placeholder="e.g. 2-3 Days" 
                value={formData.processingTime} 
                onChange={handleChange} 
              />
            </div>

            {/* Using TagsInput for Documents */}
            <TagsInput
                id="documentsRequired"
                label="Documents Required *"
                placeholder="Type (e.g. Aadhar Card) & Enter"
                value={formData.documentsRequired}
                onChange={handleTagsChange}
                error={error && formData.documentsRequired.length === 0 ? "Required" : null}
            />

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
               <Button type="submit" isLoading={loading}>
                 Create Service
               </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default CreateServicePage;