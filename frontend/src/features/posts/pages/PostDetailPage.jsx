import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
// FIX: Use @ alias for API import
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
  Info // Added Info icon for the new section
} from 'lucide-react';

const PublicPostDetailPage = () => {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine where to go back to
  const backPath = location.state?.from || '/posts';
  const isFromAdmin = location.state?.from?.includes('admin');
  const backLabel = isFromAdmin ? 'व्यवस्थापनाकडे परत (Back to Manage)' : 'मागे जा (Back)';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPublicPostById(postId);
        if (response.success) {
          setPost(response.data);
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        console.error("Failed to fetch post details", err);
        setError("Could not load post details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('mr-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Native Share Functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `ही जाहिरात पहा: ${post.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || "Post Not Found"}
          </h2>
          <Link to={backPath}>
            <Button variant="outline">{backLabel}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Helper to check if last date is near
  const isLastDateNear = () => {
    if (!post.lastDate) return false;
    const today = new Date();
    const lastDate = new Date(post.lastDate);
    const diffTime = lastDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Bar Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link to={backPath} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft size={18} className="mr-1" /> {backLabel}
          </Link>
          <button onClick={handleShare} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors" title="Share this post">
            <Share2 size={20} />
          </button>
        </div>

        {/* MAIN POST CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          
          {/* 1. HEADER SECTION - Simple Faint Background */}
          <div className="bg-blue-50 dark:bg-gray-900 p-6 md:p-8 text-center relative border-b border-blue-100 dark:border-gray-700">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white shadow-sm text-blue-600 mb-4 uppercase tracking-wide border border-blue-100">
              {post.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-snug text-gray-900 dark:text-white">
              {post.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">
              {post.postName}
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-8">

            {/* 2. KEY INFO GRID (Dates, Fees, Total Seats) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Important Dates */}
              <div className={`p-4 rounded-xl border text-center ${isLastDateNear() ? 'bg-red-50 border-red-200 dark:bg-red-900/20' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/10'}`}>
                <div className="inline-flex p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-2 text-blue-600">
                  <Calendar size={20} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">अंतिम तारीख </p>
                <p className={`text-lg font-bold ${isLastDateNear() ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                  {formatDate(post.lastDate)}
                </p>
              </div>

              {/* Fees */}
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600 text-center">
                <div className="inline-flex p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-2 text-green-600">
                  <IndianRupee size={20} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">फी </p>
                <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {post.fees && post.fees.length > 0 ? (
                    post.fees.slice(0, 2).map((fee, i) => (
                      <div key={i} className="truncate">{fee}</div>
                    ))
                  ) : <span>नोटीस पहा</span>}
                </div>
              </div>

              {/* Vacancy */}
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600 text-center">
                <div className="inline-flex p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-2 text-purple-600">
                  <Users size={20} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">एकूण जागा </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {post.totalSeats || "N/A"}
                </p>
              </div>
            </div>

            {/* 3. VACANCY TABLE (Clean Look) */}
            {post.seatDetails && post.seatDetails.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Users className="mr-2 text-purple-500" size={20} /> पदांचा तपशील 
                </h3>
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">पदाचे नाव </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">जागा </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {post.seatDetails.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white font-medium">{row.post}</td>
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-right">{row.seats}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. ELIGIBILITY & AGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <CheckCircle className="mr-2 text-green-500" size={20} /> पात्रता 
                </h3>
                <ul className="space-y-2">
                  {post.qualifications?.map((q, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                      <span className="h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-400 mr-2 shrink-0"></span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Clock className="mr-2 text-orange-500" size={20} /> वयोमर्यादा
                </h3>
                <ul className="space-y-2">
                  {post.ageLimit?.map((age, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                      <span className="h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-400 mr-2 shrink-0"></span>
                      {age}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. DOCUMENTS REQUIRED */}
            {post.documentsRequired && post.documentsRequired.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                  <FileText className="mr-2" size={20} /> आवश्यक कागदपत्रे 
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.documentsRequired.map((doc, index) => (
                    <span key={index} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 6. OTHER INFORMATION (Added New Section) */}
            {post.others && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Info className="mr-2 text-gray-500" size={20} /> इतर माहिती
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {post.others}
                </p>
              </div>
            )}

            {/* 7. ACTION BUTTONS (Sticky Bottom on Mobile) */}
            <div
              className="
                flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 dark:border-gray-700
                /* Sticky Bottom on Mobile */
                fixed bottom-0 left-0 right-0 z-50
                bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
                p-4 sm:static sm:bg-transparent sm:backdrop-blur-0 sm:p-0
              "
            >
              <a
                href={`https://wa.me/917709577531?text=नमस्कार, मला '${post.title}' बद्दल माहिती हवी आहे .`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex-1 bg-green-600 hover:bg-green-700 text-white text-center
                  py-3 rounded-lg font-bold shadow-md active:scale-95 flex items-center justify-center
                "
              >
                WhatsApp वर अर्ज करा
              </a>

              <a
                href="tel:+917709577531"
                className="
                  flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-white text-center py-3 rounded-lg font-bold
                  hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors
                "
              >
                कॉल करा
              </a>
            </div>

            {post.source && (
              <div className="text-center pb-20 sm:pb-0"> {/* Added padding for sticky bottom on mobile */}
                <a href={post.source} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline inline-flex items-center">
                  अधिकृत जाहिरात पहा <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPostDetailPage;