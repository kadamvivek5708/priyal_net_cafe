import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getPublicPostById } from "../api/postsApi";
import { Spinner } from "../../../components/ui/Spinner";
import { Button } from "../../../components/ui/Button";

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Users,
  IndianRupee,
  Info,
  Calendar,
  Share2,
  ExternalLink,
} from "lucide-react";

/* -------------------- SHIMMER -------------------- */
const Shimmer = () => (
  <div className="animate-pulse p-4 max-w-3xl mx-auto space-y-4">
    <div className="h-6 bg-gray-300 rounded"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    <div className="h-20 bg-gray-300 rounded"></div>
  </div>
);

const PublicPostDetailPage = () => {
  const { postId } = useParams();
  const location = useLocation();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const backPath = location.state?.from || "/posts";
  const backLabel = "मागे जा";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPublicPostById(postId);
        if (data.success) setPost(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("mr-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const isLastDateNear = () => {
    if (!post?.lastDate) return false;
    const diff = new Date(post.lastDate) - new Date();
    return diff <= 3 * 86400000 && diff >= 0;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.postName,
        url: window.location.href,
      });
    }
  };

  /* -------------------- LOADING -------------------- */
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Shimmer />
      </div>
    );

  if (!post) return null;

  const isPDF = post.source?.endsWith(".pdf");

  /* -------------------- MAIN -------------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back + Share */}
        <div className="flex justify-between items-center">
          <Link
            to={backPath}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400"
          >
            <ArrowLeft size={18} className="mr-1" /> {backLabel}
          </Link>

          <button
            onClick={handleShare}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* HEADER */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-5 shadow-sm">
          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {post.category}
          </span>

          <h1 className="text-xl font-bold mt-2 text-gray-900 dark:text-white">
            {post.title}
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {post.postName}
          </p>
        </div>

        {/* पदांचा तपशील */}
        {post.seatDetails?.length > 0 && (
          <section className="bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center text-purple-600 dark:text-purple-300">
              <Users className="mr-2" size={20} /> पदांचा तपशील
            </h3>

            <div className="space-y-2">
              {post.seatDetails.map((row, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-2 border rounded-md text-sm"
                >
                  <span className="text-gray-900 dark:text-white">{row.post}</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {row.seats} जागा
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* पात्रता */}
        <section className="bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold flex items-center text-green-600 dark:text-green-300 mb-3">
            <CheckCircle className="mr-2" size={20} /> पात्रता
          </h3>

          <ul className="space-y-2">
            {post.qualifications.map((q, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                • {q}
              </li>
            ))}
          </ul>
        </section>

        {/* वयोमर्यादा */}
        <section className="bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold flex items-center text-orange-500 dark:text-orange-300 mb-3">
            <Clock className="mr-2" size={20} /> वयोमर्यादा
          </h3>

          <ul className="space-y-2">
            {post.ageLimit.map((a, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                • {a}
              </li>
            ))}
          </ul>
        </section>

        {/* एकूण जागा */}
        <section className="bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold flex items-center text-purple-600 dark:text-purple-300 mb-2">
            <Users className="mr-2" size={20} /> एकूण जागा
          </h3>

          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {post.totalSeats || "N/A"}
          </p>
        </section>

        {/* फी */}
        <section className="bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold flex items-center text-green-600 dark:text-green-300 mb-2">
            <IndianRupee className="mr-2" size={20} /> फी
          </h3>

          <ul className="space-y-1 text-sm">
            {post.fees.map((f, i) => (
              <li key={i} className="text-gray-800 dark:text-gray-300">• {f}</li>
            ))}
          </ul>
        </section>

        {/* अंतिम तारीख */}
        <section
          className={`p-5 rounded-xl border shadow-sm text-center ${
            isLastDateNear()
              ? "bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30"
              : "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20"
          }`}
        >
          <h3 className="text-lg font-bold flex items-center justify-center mb-2">
            <Calendar size={20} className="mr-2" /> अंतिम तारीख
          </h3>

          <p className="text-xl font-bold">
            {post.lastDate ? formatDate(post.lastDate) : "N/A"}
          </p>
        </section>

        {/* PDF or Source Link */}
        {post.source && (
          <div className="text-center">
            <a
              href={post.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-300 font-medium underline"
            >
              {isPDF ? "PDF डाउनलोड करा" : "अधिकृत जाहिरात पहा"}
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 flex gap-3 shadow-xl">
        <a
          href={`https://wa.me/917709577531?text='${post.title}' विषयी माहिती हवी आहे.`}
          target="_blank"
          className="flex-1 bg-green-600 text-white py-3 rounded-lg text-center font-bold"
        >
          WhatsApp
        </a>

        <a
          href="tel:+917709577531"
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg text-center font-bold"
        >
          कॉल
        </a>
      </div>
    </div>
  );
};

export default PublicPostDetailPage;
