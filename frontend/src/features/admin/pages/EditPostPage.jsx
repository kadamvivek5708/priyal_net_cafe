import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPostById, updatePost } from "../api/adminPostsApi";

// UI Components
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Spinner } from "../../../components/ui/Spinner";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import { TagsInput } from "../../../components/ui/TagsInput";
import { SeatDetailsEditor } from "../../../features/admin/components/SeatDetailsEditor";

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    postName: "",
    category: "भरती",
    seatDetails: [],
    ageLimit: [],
    qualifications: [],
    fees: [],
    documentsRequired: [],
    lastDate: "",
    startDate: "",
    source: "",
    totalSeats: "",
    others: "",
    isActive: true,
  });

  // Load existing post
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getPostById(postId);

        if (response.success) {
          const data = response.data;

          setFormData({
            title: data.title || "",
            postName: data.postName || "",
            category: data.category || "भरती",
            seatDetails: Array.isArray(data.seatDetails) ? data.seatDetails : [],
            ageLimit: Array.isArray(data.ageLimit) ? data.ageLimit : [],
            qualifications: Array.isArray(data.qualifications)
              ? data.qualifications
              : [],
            fees: Array.isArray(data.fees) ? data.fees : [],
            documentsRequired: Array.isArray(data.documentsRequired)
              ? data.documentsRequired
              : [],
            lastDate: data.lastDate
              ? new Date(data.lastDate).toISOString().split("T")[0]
              : "",
            startDate: data.startDate
              ? new Date(data.startDate).toISOString().split("T")[0]
              : "",
            source: data.source || "",
            totalSeats: data.totalSeats || "",
            others: data.others || "",
            isActive: Boolean(data.isActive),
          });
        }
      } catch {
        setErrors({ general: "पोस्ट लोड करण्यात अयशस्वी." });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId]);

  // Handle input fields
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle tag inputs
  const handleTagsChange = (field, tags) => {
    setFormData((prev) => ({ ...prev, [field]: tags }));
  };

  // Handle seat detail changes
  const handleSeatDetailsChange = (rows) => {
    setFormData((prev) => ({ ...prev, seatDetails: rows }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "शीर्षक आवश्यक आहे.";
    if (!formData.postName.trim()) newErrors.postName = "पदाचे नाव आवश्यक आहे.";

    if (formData.fees.length === 0)
      newErrors.fees = "कृपया फी टाका.";
    if (formData.ageLimit.length === 0)
      newErrors.ageLimit = "कृपया वयोमर्यादा टाका.";
    if (formData.qualifications.length === 0)
      newErrors.qualifications = "कृपया पात्रता टाका.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      await updatePost(postId, formData);
      navigate("/admin/posts");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "पोस्ट अपडेट करण्यात अयशस्वी",
      });
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        पोस्ट संपादित करा
      </h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              अपडेट तपशील
            </h3>
          </CardHeader>

          <CardBody className="space-y-8 p-4 sm:p-6">

            {/* SECTION 1 */}
            <div>
              <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400 mb-4 border-b pb-2">
                1. आवश्यक तपशील
              </h4>

              <div className="space-y-6">
                {/* Title + Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    id="title"
                    label="शीर्षक *"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                  />

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      वर्ग *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:text-white dark:border-gray-700"
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
                  value={formData.postName}
                  onChange={handleChange}
                  error={errors.postName}
                />

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  />
                </div>

                {/* Tags (Fees, Age, Qualifications) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <TagsInput
                    id="fees"
                    label="फी *"
                    placeholder="उदा. Open: ₹500"
                    value={formData.fees}
                    onChange={(t) => handleTagsChange("fees", t)}
                    error={errors.fees}
                  />

                  <TagsInput
                    id="ageLimit"
                    label="वयोमर्यादा *"
                    placeholder="उदा. 18-38 वर्षे"
                    value={formData.ageLimit}
                    onChange={(t) => handleTagsChange("ageLimit", t)}
                    error={errors.ageLimit}
                  />
                </div>

                <TagsInput
                  id="qualifications"
                  label="पात्रता *"
                  placeholder="उदा. 10वी पास"
                  value={formData.qualifications}
                  onChange={(t) => handleTagsChange("qualifications", t)}
                  error={errors.qualifications}
                />

                {/* Seat Details */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                    जागांचा तपशील *
                  </h4>
                  <SeatDetailsEditor
                    value={formData.seatDetails}
                    onChange={handleSeatDetailsChange}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2 */}
            <div>
              <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-4 border-b pb-2">
                2. इतर तपशील
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
                  placeholder="उदा. आधार कार्ड"
                  value={formData.documentsRequired}
                  onChange={(t) =>
                    handleTagsChange("documentsRequired", t)
                  }
                />

                <Input
                  id="source"
                  label="अधिकृत लिंक"
                  value={formData.source}
                  onChange={handleChange}
                />

                {/* Others */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    इतर माहिती
                  </label>
                  <textarea
                    id="others"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 resize-none"
                    rows="4"
                    placeholder="अतिरिक्त तपशील..."
                    value={formData.others}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-700">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                  >
                    Active - सर्वांना दिसेल
                  </label>
                </div>
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/posts")}
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
