import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicPosts } from '../../posts/api/postsApi';
import { Search, Calendar, Archive } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';

const PublicPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  const categories = ['All', 'भरती', 'स्पर्धा परीक्षा', 'निकाल'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPublicPosts();
        const data = response.data || [];
        setPosts(data);
        setFilteredPosts(data);
      } catch {
        console.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let result = [...posts];

    // CATEGORY FILTER
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // SEARCH FILTER
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(s) ||
          p.postName.toLowerCase().includes(s)
      );
    }

    // SORTING LOGIC
    if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === 'lastDate') {
      result.sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate));
    } else if (sortOption === 'titleAsc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'titleDesc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredPosts(result);
  }, [searchTerm, selectedCategory, sortOption, posts]);

  const formatDate = d =>
    !d
      ? ''
      : new Date(d).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              नोकरी अपडेट्स
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              सरकारी नोकऱ्या, परीक्षा निकाल आणि ऑनलाइन फॉर्मची माहिती
            </p>
          </div>

          <Link to="/posts/past">
            <Button variant="outline" className="
              text-blue-600 border-blue-200 hover:bg-blue-50 
              dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20
            ">
              <Archive size={16} className="mr-2" />
              जुन्या / संपलेल्या जाहिराती पहा
            </Button>
          </Link>
        </div>

        {/* FILTER BAR */}
        <div className="
          bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8 
          border border-gray-200 dark:border-gray-700 sticky top-20 z-40
        ">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">

            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="शोधा (उदा. तलाठी, पोलीस, लिपिक)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="
                  w-full pl-10 pr-3 py-2 text-sm rounded-md border
                  bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-white placeholder-gray-400
                  focus:ring-1 focus:ring-blue-500
                "
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-2/4 overflow-x-auto no-scrollbar pb-1">
              <div className="flex space-x-2 min-w-max">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap
                      ${selectedCategory === cat
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {cat === 'All' ? 'सर्व' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* SORTING DROPDOWN */}
            <div className="w-full md:w-1/4">
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="
                  w-full px-3 py-2 rounded-md border text-sm
                  bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500
                "
              >
                <option value="newest">नवीन जाहिराती प्रथम</option>
                <option value="oldest">जुन्या जाहिराती प्रथम</option>
                <option value="lastDate">लवकर संपणाऱ्या जाहिराती</option>
                <option value="titleAsc">A → Z (शीर्षक)</option>
                <option value="titleDesc">Z → A (शीर्षक)</option>
              </select>
            </div>

          </div>
        </div>

        {/* POSTS GRID */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
              <div
                key={post._id}
                className="
                  group flex flex-col bg-white dark:bg-gray-800 
                  rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
                  hover:shadow-md transition-all duration-300
                "
              >
                <div className="p-5 flex-1 flex flex-col relative">

                  {/* Category */}
                  <span className="
                    absolute top-4 right-4 px-2.5 py-0.5 text-xs font-medium rounded-full
                    bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                    border border-blue-100 dark:border-blue-800
                  ">
                    {post.category}
                  </span>

                  {/* Date */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-3">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(post.createdAt)}
                  </div>

                  {/* Title */}
                  <Link to={`/posts/${post._id}`}>
                    <h3 className="
                      text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2
                      group-hover:text-blue-600 dark:group-hover:text-blue-400
                    ">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 flex-1">
                    {post.postName}
                  </p>

                  {/* Last Date */}
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        अंतिम तारीख:
                      </span>

                      <span className="
                        font-semibold text-red-600 dark:text-red-400
                        bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded
                      ">
                        {formatDate(post.lastDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/posts/${post._id}`}>
                  <div className="
                    bg-gray-50 dark:bg-gray-700/40 px-5 py-3 text-center border-t 
                    border-gray-200 dark:border-gray-700 text-sm font-medium
                    group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20
                    group-hover:text-blue-700 dark:group-hover:text-blue-300
                  ">
                    सविस्तर माहिती पहा →
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* NO RESULTS */
          <div className="
            text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm
            border border-dashed border-gray-300 dark:border-gray-700
          ">
            <Search size={40} className="mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              कोणतीही माहिती सापडली नाही
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              कृपया वेगळ्या शब्दांनी शोधा किंवा फिल्टर बदला.
            </p>

            <div className="mt-5">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSortOption('newest');
                }}
              >
                फिल्टर काढा
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PublicPostsPage;
