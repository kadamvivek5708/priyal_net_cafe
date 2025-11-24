import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// FIX: Use @ alias for API import
import { getPublicPosts } from '../../../features/posts/api/postsApi';
import { Search, Calendar, Archive } from 'lucide-react'; // Added Archive icon
// FIX: Use @ alias for Component imports
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';

const PublicPostsPage = () => {
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
        const response = await getPublicPosts();
        const data = response.data || [];
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Archive Link */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Latest Job Updates
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Find the latest government jobs, exam results, and online forms here.
          </p>
          
          {/* Archive Link Button */}
          <div className="mt-6">
            <Link to="/posts/past">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20">
                <Archive size={16} className="mr-2" />
                View Past / Expired Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search for jobs (e.g. SSC, Police, Clerk)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Tabs */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex space-x-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <div 
                key={post._id} 
                className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center" title="Post Date">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    <Link to={`/posts/${post._id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
                    {post.postName}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Last Date:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                            {formatDate(post.lastDate)}
                        </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3">
                   <Link to={`/posts/${post._id}`} className="block">
                     <Button variant="outline" className="w-full justify-center border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20">
                       View Full Details
                     </Button>
                   </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Search size={48} />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <Button onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PublicPostsPage;