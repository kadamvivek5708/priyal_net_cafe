import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExpiredPosts } from '../api/postsApi';
import { Search, Calendar, ArrowLeft } from 'lucide-react';
import { Spinner } from '../../../components/ui/Spinner';

const PastPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const results = posts.filter(post => 
      post.title.toLowerCase().includes(lowerTerm) ||
      post.postName.toLowerCase().includes(lowerTerm)
    );
    setFilteredPosts(results);
  }, [searchTerm, posts]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <Link to="/posts" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft size={20} className="mr-2" /> Back to Active Jobs
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-700 dark:text-gray-200 sm:text-4xl">
            Past Job Postings
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            These posts are expired and are for reference only.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-150 ease-in-out"
            placeholder="Search past jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75"> {/* Reduced opacity for "past" feel */}
            {filteredPosts.map((post) => (
              <div key={post._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-red-500 font-medium border border-red-200 px-2 py-0.5 rounded">
                      Expired
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="text-sm text-gray-500 flex items-center mt-4">
                    <Calendar size={14} className="mr-1" />
                    Ended on: {formatDate(post.lastDate)}
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                  <Link to={`/posts/${post._id}`} className="block text-center text-sm text-blue-600 hover:underline">
                    View Archived Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">No past posts found.</div>
        )}
      </div>
    </div>
  );
};

export default PastPostsPage;
