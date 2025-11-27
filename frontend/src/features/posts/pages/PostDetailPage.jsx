import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getPublicPostById } from '../api/postsApi';
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';

import {
  Calendar,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  FileText,
  ExternalLink,
  Users,
  Clock,
  IndianRupee,
  Share2,
  Info
} from 'lucide-react';

const PublicPostDetailPage = () => {
  const { postId } = useParams();
  const location = useLocation();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backPath = location.state?.from || "/posts";
  const isFromAdmin = location.state?.from?.includes("admin");
  const backLabel = isFromAdmin ? "व्यवस्थापनाकडे परत" : "मागे जा";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPublicPostById(postId);
        if (data.success) {
          setPost(data.data);
        } else {
          setError("Post not found.");
        }
      } catch {
        setError("Could not load post details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const formatDate = (d) =>
    !d
      ? "N/A"
      : new Date(d).toLocaleDateString("mr-IN", {
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
        text: `ही जाहिरात पहा: ${post?.title}`,
        url: window.location.href,
      });
    }
  };

  /* -------------------- LOADING -------------------- */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );

  /* -------------------- ERROR -------------------- */
  if (error || !post)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error}
        </h2>
        <Link to={backPath}>
          <Button variant="outline">{backLabel}</Button>
        </Link>
      </div>
    );

  /* -------------------- MAIN CONTENT -------------------- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">

      <div className="max-w-3xl mx-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to={backPath}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <ArrowLeft size={18} className="mr-1" /> {backLabel}
          </Link>

          <button
            onClick={handleShare}
            className="p-2 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* HEADER */}
          <div className="p-6 md:p-8 bg-blue-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-center">

            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-white border text-blue-600 text-xs font-bold shadow-sm">
              {post.category}
            </span>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
              {post.title}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
              {post.postName}
            </p>
          </div>

          {/* BODY */}
          <div className="p-6 md:p-8 space-y-10">

            {/* TOP GRID: LAST DATE / FEES / SEATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* LAST DATE */}
              <div
                className={`rounded-xl p-4 text-center border ${
                  isLastDateNear()
                    ? "bg-red-50 border-red-200 dark:bg-red-900/20"
                    : "bg-blue-50 border-blue-100 dark:bg-blue-900/20"
                }`}
              >
                <div className="p-2 rounded-full bg-white dark:bg-gray-800 mx-auto mb-2 text-blue-600">
                  <Calendar size={20} />
                </div>

                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  अंतिम तारीख
                </p>

                <p
                  className={`text-lg font-bold ${
                    isLastDateNear()
                      ? "text-red-600"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {formatDate(post.lastDate)}
                </p>
              </div>

              {/* FEES */}
              <div className="rounded-xl p-4 text-center bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700/40">
                <div className="p-2 rounded-full bg-white dark:bg-gray-800 mx-auto mb-2 text-green-600">
                  <IndianRupee size={20} />
                </div>

                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  फी
                </p>

                <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {post.fees?.length ? post.fees.slice(0, 3).map((fee, i) => (
                    <div key={i}>{fee}</div>
                  )) : "नोटीस पहा"}
                </div>
              </div>

              {/* SEATS */}
              <div className="rounded-xl p-4 text-center bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700/40">
                <div className="p-2 rounded-full bg-white dark:bg-gray-800 mx-auto mb-2 text-purple-600">
                  <Users size={20} />
                </div>

                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  एकूण जागा
                </p>

                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {post.totalSeats || "N/A"}
                </p>
              </div>
            </div>

            {/* VACANCY TABLE */}
            {post.seatDetails?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-3">
                  <Users size={20} className="mr-2 text-purple-500" /> पदांचा तपशील
                </h3>

                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                          पदाचे नाव
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-gray-400">
                          जागा
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {post.seatDetails.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-100 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-2 text-gray-900 dark:text-white">{row.post}</td>
                          <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                            {row.seats}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ELIGIBILITY + AGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Eligibility */}
              <div>
                <h3 className="text-lg font-bold flex items-center text-gray-900 dark:text-white mb-3">
                  <CheckCircle size={20} className="mr-2 text-green-500" /> पात्रता
                </h3>

                <ul className="space-y-2">
                  {post.qualifications?.map((q, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 dark:text-gray-300 flex"
                    >
                      • <span className="ml-2">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Age Limit */}
              <div>
                <h3 className="text-lg font-bold flex items-center text-gray-900 dark:text-white mb-3">
                  <Clock size={20} className="mr-2 text-orange-500" /> वयोमर्यादा
                </h3>

                <ul className="space-y-2">
                  {post.ageLimit?.map((age, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 dark:text-gray-300 flex"
                    >
                      • <span className="ml-2">{age}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DOCUMENTS REQUIRED */}
            {post.documentsRequired?.length > 0 && (
              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl">
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center mb-3">
                  <FileText size={20} className="mr-2" /> आवश्यक कागदपत्रे
                </h3>

                <div className="flex flex-wrap gap-2">
                  {post.documentsRequired.map((doc, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border text-gray-700 dark:text-gray-300 text-sm"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* OTHER INFO */}
            {post.others && (
              <div className="p-5 bg-gray-50 dark:bg-gray-800/40 border rounded-xl">
                <h3 className="text-lg font-bold flex items-center mb-3 text-gray-900 dark:text-white">
                  <Info size={20} className="mr-2" /> इतर माहिती
                </h3>

                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {post.others}
                </p>
              </div>
            )}

            {/* DESKTOP BUTTONS */}
            <div className="hidden sm:flex gap-4 pt-6border-t border-gray-200 dark:border-gray-700">
              
              <a
                href={`https://wa.me/917709577531?text=नमस्कार, मला '${post.title}' बद्दल माहिती हवी आहे .`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-center shadow"
              >
                WhatsApp वर अर्ज करा
              </a>

              <a
                href="tel:+917709577531"
                className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-3 rounded-lg text-gray-800 dark:text-white font-bold text-center hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                कॉल करा
              </a>
            </div>

            {/* SOURCE LINK */}
            {post.source && (
              <div className="text-center pt-4 pb-20 sm:pb-0">
                <a
                  href={post.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm inline-flex items-center"
                >
                  अधिकृत जाहिरात पहा <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/90 p-4 flex gap-3 backdrop-blur z-50 shadow-lg">

        <a
          href={`https://wa.me/917709577531?text=नमस्कार, मला '${post.title}' बद्दल माहिती हवी आहे .`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-center shadow"
        >
          WhatsApp वर अर्ज करा
        </a>

        <a
          href="tel:+917709577531"
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-lg font-bold text-center"
        >
          कॉल करा
        </a>
      </div>
    </div>
  );
};

export default PublicPostDetailPage;
