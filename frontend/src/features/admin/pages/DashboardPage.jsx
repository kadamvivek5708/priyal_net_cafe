import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsSummary } from '../api/adminAnalyticsApi';

// Using your new UI Kit
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // State for data and loading
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState('views');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true); // Show loading when switching sort
      try {
        // Pass the sortBy state to the API
        const response = await getAnalyticsSummary(sortBy);
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

  fetchStats();
  }, [sortBy]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short'
    });
  };

  if (loading && !stats) { // Only full page spinner on initial load
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Overview of your cafe's performance</p>
          </div>
          {/* Logout is in sidebar, but if you kept it here temporarily: */}
          {/* <Button variant="danger" onClick={handleLogout}>Logout</Button> */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Site Visits</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.totalVisits || 0}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Services</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats?.totalServices || 0}
              </p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats?.totalPosts || 0}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Top Posts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-full">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {sortBy === 'views' ? 'Top Viewed Posts' : 'Latest Active Posts'}
              </h2>
              
              {/* Sorting Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-1 px-2"
              >
                <option value="views">Sort by: Views</option>
                <option value="date">Sort by: Date</option>
              </select>
            </CardHeader>
            
            <CardBody className="relative min-h-[200px]">
              {/* Small overlay spinner for re-sorting */}
              {loading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
                  <Spinner size="md" />
                </div>
              )}

              {stats?.topPosts && stats.topPosts.length >= 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.topPosts.map((post) => (
                    <li key={post.postId} className="py-3 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-gray-700 dark:text-gray-300 truncate font-medium pr-4">
                          {post.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sortBy === 'views' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {post.views} views
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No active posts found.</p>
              )}
            </CardBody>
          </Card>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;