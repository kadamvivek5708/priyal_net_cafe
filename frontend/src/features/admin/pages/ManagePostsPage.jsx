import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllPosts, deletePost } from '../api/adminPostsApi';

// UI Components
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle, 
  XCircle,
  FileText,
  Eye
} from 'lucide-react';

const ManagePostsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getAllPosts();
      const data = response.data || []; 
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("ही पोस्ट तुम्हाला नक्की डिलीट करायची आहे का ?")) {
      try {
        await deletePost(id);
        setPosts(posts.filter(post => post._id !== id));
      } catch (error) {
        alert("पोस्ट डिलीट करण्यास अयशस्वी.");
      }
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/admin/posts/edit/${id}`);
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/posts/${id}`);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.postName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
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

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="mr-2 text-blue-600" />
              पोस्ट व्यवस्थापन 
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              तुमच्या सर्व जाहिराती आणि अपडेट्सची यादी.
            </p>
          </div>
          <Button onClick={() => navigate('/admin/posts/create')}>
            <Plus size={18} className="mr-2" />
            नवीन पोस्ट 
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text"
            placeholder="शीर्षक किंवा पोस्टच्या नावाने शोधा..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition duration-150 ease-in-out"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div 
                key={post._id} 
                onClick={() => handleViewDetails(post._id)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4 items-start md:items-center cursor-pointer group"
              >
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                      {post.category}
                    </span>
                    {post.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30">
                        <CheckCircle size={12} className="mr-1" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30">
                        <XCircle size={12} className="mr-1" /> Inactive
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-4 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
                    {post.postName}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      अंतिम तारीख : 
                      <span className="font-medium text-gray-900 dark:text-gray-200 ml-1">
                        {formatDate(post.lastDate)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                    onClick={(e) => handleEdit(e, post._id)}
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                    onClick={(e) => handleDelete(e, post._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                कोणतीही पोस्ट सापडली नाही
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                नवीन पोस्ट तयार करण्यासाठी वरील बटणावर क्लिक करा.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManagePostsPage;
