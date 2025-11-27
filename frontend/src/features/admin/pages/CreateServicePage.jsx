import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createService } from "../api/adminServicesApi";

// UI Components
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import { TagsInput } from "../../../components/ui/TagsInput";

const CreateServicePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    fees: "",
    processingTime: "",
    documentsRequired: [],
    isActive: true
  });

  const [errors, setErrors] = useState({});

  // Generic input change handler
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Tag handler
  const handleTagsChange = (tags) => {
    setFormData((prev) => ({ ...prev, documentsRequired: tags }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "सेवेचे नाव आवश्यक आहे.";
    if (!formData.fees.trim()) newErrors.fees = "फी आवश्यक आहे.";
    if (formData.documentsRequired.length === 0)
      newErrors.documentsRequired = "किमान एक कागदपत्र आवश्यक आहे.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await createService(formData);
      navigate("/admin/services");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Service तयार करण्यात अयशस्वी.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        नवीन सेवा जोडा
      </h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              सेवेची माहिती
            </h3>
          </CardHeader>

          <CardBody className="space-y-8 p-4 sm:p-6">
            {/* Service Name */}
            <Input
              id="name"
              label="सेवेचे नाव *"
              placeholder="उदा. Shop Act License"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            {/* Fees & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                id="fees"
                label="फी *"
                placeholder="उदा. ₹500"
                value={formData.fees}
                onChange={handleChange}
                error={errors.fees}
                required
              />

              <Input
                id="processingTime"
                label="कालावधी"
                placeholder="उदा. 2-3 दिवस"
                value={formData.processingTime}
                onChange={handleChange}
              />
            </div>

            {/* Tags for Documents */}
            <TagsInput
              id="documentsRequired"
              label="आवश्यक कागदपत्रे *"
              placeholder="उदा. Aadhar Card"
              value={formData.documentsRequired}
              onChange={handleTagsChange}
              error={errors.documentsRequired}
            />

            {/* Active Toggle */}
            <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Active - Visible to users
              </label>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/services")}
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
