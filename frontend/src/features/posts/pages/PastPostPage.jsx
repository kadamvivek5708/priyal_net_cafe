import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// FIX: Use @ alias for API import
import { getExpiredPosts } from '../../posts/api/postsApi';
import { Search, Calendar, ArrowLeft } from 'lucide-react';
// FIX: Use @ alias for Component imports
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';

const PastPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'भरती', 'ऑनलाईन अर्ज', 'स्पर्धा परीक्षा', 'निकाल', 'इतर'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getExpiredPosts();
        const data = response.data || [];
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Failed to fetch past posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle Filtering
  useEffect(() => {
    let result = posts;

    if (selectedCategory !== 'All') {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(lowerTerm) || 
        post.postName.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredPosts(result);
  }, [searchTerm, selectedCategory, posts]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/posts" className="text-gray-500 hover:text-blue-600 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                जुन्या जाहिराती 
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1 ml-7">
              मुदत संपलेल्या सरकारी नोकऱ्या आणि जाहिरातींचे अर्काइव्ह
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8 sticky top-20 z-40 border border-gray-200 dark:border-gray-700 opacity-95">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="शोधा (उदा. तलाठी, पोलीस)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Tabs */}
            <div className="w-full md:w-2/3 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <div className="flex space-x-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 border ${
                      selectedCategory === cat
                        ? 'bg-gray-700 text-white border-gray-700 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat === 'All' ? 'सर्व' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid - Focused on Cards */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-85">
            {filteredPosts.map((post) => (
              <div 
                key={post._id} 
                className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full grayscale hover:grayscale-0 transition-all duration-300"
              >
                <div className="p-5 flex-1 flex flex-col relative">
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      {post.category}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-3">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                    <Link to={`/posts/${post._id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  {/* Post Name */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                    {post.postName}
                  </p>

                  {/* Expired Status */}
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Status:</span>
                        <span className="font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded text-xs">
                            Expired / संपले
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                       <span className="text-gray-400 text-xs">अंतिम तारीख: {formatDate(post.lastDate)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <Link to={`/posts/${post._id}`} className="block w-full">
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 text-center border-t border-gray-200 dark:border-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                     <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                       जुनी माहिती पहा &rarr;
                     </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Search size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">कोणतीही माहिती सापडली नाही</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              कृपया वेगळ्या शब्दांचा वापर करून शोधा.
            </p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}>
                फिल्टर काढा (Clear)
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PastPostsPage;