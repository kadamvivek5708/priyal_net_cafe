import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getServiceById, updateService } from "../api/adminServicesApi";

// UI Components
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Spinner } from "../../../components/ui/Spinner";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import { TagsInput } from "../../../components/ui/TagsInput";

const EditServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    fees: "",
    processingTime: "",
    documentsRequired: [],
    isActive: true,
  });

  // Load service data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getServiceById(serviceId);

        if (response.success) {
          const data = response.data;

          setFormData({
            name: data.name || "",
            fees: data.fees || "",
            processingTime: data.processingTime || "",
            documentsRequired: Array.isArray(data.documentsRequired)
              ? data.documentsRequired
              : [],
            isActive: Boolean(data.isActive),
          });
        }
      } catch {
        setErrors({ general: "सेवा लोड करण्यात समस्या आली." });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceId]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      await updateService(serviceId, formData);
      navigate("/admin/services");
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message || "सेवा अपडेट करण्यात समस्या आली.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        सेवा संपादित करा
      </h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              अपडेट तपशील
            </h3>
          </CardHeader>

          <CardBody className="space-y-8 p-4 sm:p-6">

            {/* NAME */}
            <Input
              id="name"
              label="सेवेचे नाव *"
              placeholder="उदा. Shop Act License"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            {/* FEES & TIME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                id="fees"
                label="फी *"
                placeholder="उदा. ₹300"
                value={formData.fees}
                onChange={handleChange}
                error={errors.fees}
              />
              <Input
                id="processingTime"
                label="कालावधी"
                placeholder="उदा. 2–3 दिवस"
                value={formData.processingTime}
                onChange={handleChange}
              />
            </div>

            {/* DOCUMENTS REQUIRED */}
            <TagsInput
              id="documentsRequired"
              label="आवश्यक कागदपत्रे *"
              placeholder="कागदपत्र टाइप करा (उदा. आधार कार्ड) & Enter"
              value={formData.documentsRequired}
              onChange={handleTagsChange}
              error={errors.documentsRequired}
            />

            {/* ACTIVE */}
            <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-700">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Active — सर्वांना दिसेल
              </label>
            </div>

            {/* GENERAL ERROR */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/services")}
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
