// src/features/admin/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { getAnalyticsSummary } from '../api/adminAnalyticsApi';

// Using your new UI Kit
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // State for data and loading
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAnalyticsSummary();
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
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
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
            <p className="text-gray-500 dark:text-gray-400">Priyal Net Cafe Performance</p>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Visits Card */}
          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Site Visits</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.totalVisits || 0}
              </p>
            </CardBody>
          </Card>

          {/* Placeholders for future stats (e.g. Total Posts count) */}
          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Services</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">--</p>
              <span className="text-xs text-gray-400">(Coming soon)</span>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">--</p>
              <span className="text-xs text-gray-400">(Coming soon)</span>
            </CardBody>
          </Card>
        </div>

        {/* Top Posts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Top Viewed Posts</h2>
            </CardHeader>
            <CardBody>
              {stats?.topPosts && stats.topPosts.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.topPosts.map((post) => (
                    <li key={post.postId} className="py-3 flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 truncate pr-4">
                        {post.title}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {post.views} views
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No views recorded yet.</p>
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