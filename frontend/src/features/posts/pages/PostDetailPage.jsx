import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicPostById } from '../api/postsApi';
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody } from '../../../components/ui/Card';
import { Calendar, ArrowLeft, AlertCircle, CheckCircle, FileText, ExternalLink, Users } from 'lucide-react';

const PublicPostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
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
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The post you are looking for might have been removed or is no longer active.
          </p>
          <Link to="/posts">
            <Button>Back to All Posts</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Determine if the last date is near (e.g., within 3 days)
  const isLastDateNear = () => {
    if (!post.lastDate) return false;
    const today = new Date();
    const lastDate = new Date(post.lastDate);
    const diffTime = Math.abs(lastDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 3 && lastDate >= today;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb / Back Button */}
        <div className="mb-6">
          <Link to="/posts" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Updates
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* Header Section */}
          <div className="bg-blue-600 dark:bg-blue-900 p-6 md:p-10 text-white relative overflow-hidden">
            {/* Decorative Circle */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white mb-4 border border-white/30">
                {post.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-blue-100 text-sm md:text-base">
                 <div className="flex items-center bg-blue-700/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                   <Calendar size={18} className="mr-2" />
                   <span>Posted: {formatDate(post.createdAt)}</span>
                 </div>
                 {post.postName && (
                   <div className="flex items-center bg-blue-700/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                     <FileText size={18} className="mr-2" />
                     <span>{post.postName}</span>
                   </div>
                 )}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Key Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Important Dates Box - Highlighted */}
              <div className={`p-6 rounded-xl border ${isLastDateNear() ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center ${isLastDateNear() ? 'text-red-700 dark:text-red-400' : 'text-blue-800 dark:text-blue-300'}`}>
                  <Calendar className="mr-2" size={20} /> Important Dates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Application Starts</p>
                     <p className="font-semibold text-gray-900 dark:text-white">
                       {post.startDate ? formatDate(post.startDate) : 'Already Started'}
                     </p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Date to Apply</p>
                     <p className={`font-bold text-lg ${isLastDateNear() ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`}>
                       {formatDate(post.lastDate)}
                     </p>
                     {isLastDateNear() && (
                       <span className="text-xs text-red-600 font-medium block mt-1">Hurry! Closing soon.</span>
                     )}
                   </div>
                </div>
              </div>

              {/* Seat Details Table (MOVED UP) */}
              {post.seatDetails && post.seatDetails.length > 0 && (
                 <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                       <Users className="mr-2 text-purple-500" size={22} /> Vacancy Details
                       {post.totalSeats && <span className="ml-auto text-sm font-normal bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Total: {post.totalSeats}</span>}
                    </h3>
                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                             <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Seats</th>
                             </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                             {post.seatDetails.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                   <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.post}</td>
                                   <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{row.seats}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}

              {/* Qualifications */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} /> Eligibility & Qualifications
                </h3>
                <ul className="space-y-2">
                  {post.qualifications && post.qualifications.length > 0 ? (
                    post.qualifications.map((qual, index) => (
                      <li key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <span className="h-2 w-2 mt-2 rounded-full bg-green-500 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{qual}</span>
                      </li>
                    ))
                  ) : (
                     <p className="text-gray-500">See notification for details.</p>
                  )}
                </ul>
                
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg inline-block w-full">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Age Limit:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                     {post.ageLimit && post.ageLimit.length > 0 ? (
                        post.ageLimit.map((age, i) => (
                            <span key={i} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-sm font-medium">
                                {age}
                            </span>
                        ))
                     ) : <span>As per rules</span>}
                  </div>
                </div>
              </div>

              {/* Application Fees */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Application Fees</h3>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                   <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {post.fees && post.fees.length > 0 ? (
                            post.fees.map((fee, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                      {fee}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td className="px-6 py-4">Check official notification</td></tr>
                        )}
                     </tbody>
                   </table>
                </div>
              </div>
              
              {/* Documents Required */}
              {post.documentsRequired && post.documentsRequired.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Required Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {post.documentsRequired.map((doc, index) => (
                      <div key={index} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 transition-colors">
                        <FileText size={18} className="text-blue-500 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
               {post.others && (
                  <div className="bg-gray-50 dark:bg-gray-700/20 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Additional Information</h4>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{post.others}</p>
                  </div>
               )}

            </div>

            {/* Right Column: CTA Sidebar */}
            <div className="lg:col-span-1">
               <div className="sticky top-24 space-y-6">
                  
                  {/* Apply Now Card */}
                  <Card className="border-t-4 border-t-blue-600 shadow-lg">
                     <CardBody className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Interested?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                           Visit our center to apply for this form safely and correctly.
                        </p>
                        
                        <div className="space-y-3">
                           <a href="tel:+917709577531" className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
                              Call Now
                           </a>
                           <a 
                             href={`https://wa.me/917709577531?text=Hi, I want to inquire about ${post.title}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="block w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white text-center rounded-lg font-semibold transition-colors"
                           >
                              WhatsApp Inquiry
                           </a>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                           <p className="text-xs text-gray-400 mb-2">Visit Us At:</p>
                           <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                             Near ST Stand, Islampur
                           </p>
                        </div>
                     </CardBody>
                  </Card>

                  {/* Official Source Link */}
                  {post.source && (
                    <a 
                      href={post.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                    >
                       <ExternalLink size={18} className="mr-2" />
                       <span>View Official Notification</span>
                    </a>
                  )}

               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPostDetailPage;