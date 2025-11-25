import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Using the admin API we already have
import { getPostById } from '../../admin/api/adminPostsApi'; 

// UI Components
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Clock, 
  IndianRupee, 
  FileText, 
  Users,
  Edit
} from 'lucide-react';

const AdminPostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await getPostById(postId);
        // Assuming response structure matches standard ApiResponse
        if (response.success) {
            setPost(response.data);
        } else {
            setError("Post data not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post details.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
        fetchPostData();
    }
  }, [postId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('mr-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error || "Post not found"}</p>
        <Button onClick={() => navigate('/admin/posts')}>Back to List</Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Header / Nav */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin/posts')} className="pl-0 hover:bg-transparent">
             <ArrowLeft size={20} className="mr-2" /> मागे जा 
          </Button>
          
          <Button onClick={() => navigate(`/admin/posts/edit/${postId}`)}>
            <Edit size={18} className="mr-2" /> Edit
          </Button>
        </div>

        {/* Main Detail Card */}
        <Card className="overflow-hidden">
           
           {/* Card Header with Status */}
           <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                 <div>
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                      {post.category}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {post.title}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {post.postName}
                    </p>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-sm font-bold ${post.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {post.isActive ? 'Active' : 'Inactive'}
                 </div>
              </div>
           </div>

           <CardBody className="space-y-8">
              
              {/* 1. Dates & Fees Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
                        <Calendar size={16} className="mr-2" /> महत्त्वाच्या तारखा 
                    </h3>
                    <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">सुरुवात तारीख : </span>
                          <span className="font-medium">{formatDate(post.startDate)}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">अंतिम तारीख : </span>
                          <span className="font-bold text-red-600">{formatDate(post.lastDate)}</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
                        <IndianRupee size={16} className="mr-2" /> फी 
                    </h3>
                    <ul className="space-y-1">
                       {post.fees && post.fees.map((fee, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">{fee}</li>
                       ))}
                    </ul>
                 </div>
              </div>

              {/* 2. Vacancy Table */}
              {post.seatDetails && post.seatDetails.length > 0 && (
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Users size={20} className="mr-2 text-purple-600" /> जागांचा तपशील 
                        {post.totalSeats && <span className="ml-2 text-sm font-normal text-gray-500">Total: {post.totalSeats}</span>}
                    </h3>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                             <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Post Name</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Seats</th>
                             </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                             {post.seatDetails.map((row, idx) => (
                                <tr key={idx}>
                                   <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{row.post}</td>
                                   <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-right">{row.seats}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}

              {/* 3. Criteria (Age & Qualification) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                       <CheckCircle size={20} className="mr-2 text-green-600" /> पात्रता 
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                       {post.qualifications?.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                       <Clock size={20} className="mr-2 text-orange-600" /> वयोमर्यादा 
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                       {post.ageLimit?.map((age, i) => <li key={i}>{age}</li>)}
                    </ul>
                 </div>
              </div>

              {/* 4. Documents & Source */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <FileText size={16} className="mr-2" /> आवश्यक कागदपत्रे 
                 </h3>
                 <div className="flex flex-wrap gap-2 mb-6">
                    {post.documentsRequired?.map((doc, i) => (
                       <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-200 dark:border-gray-700">
                          {doc}
                       </span>
                    ))}
                 </div>

                 {post.source && (
                    <div className="text-sm">
                       <span className="font-semibold text-gray-700 dark:text-gray-300">Source Link: </span>
                       <a href={post.source} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block">
                          {post.source}
                       </a>
                    </div>
                 )}
              </div>

           </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default AdminPostDetailPage;