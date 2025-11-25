import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Fix import path for API
import { getAnalyticsSummary } from '../api/adminAnalyticsApi';
import { useAuth } from '../../auth/hooks/useAuth';

// Using UI Kit
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { 
  Users, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Eye,
  ArrowUpRight
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Keep logout available if needed
  
  // State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('views');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getAnalyticsSummary(sortBy);
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        setError("डॅशबोर्ड डेटा लोड करण्यात अयशस्वी.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [sortBy]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('mr-IN', {
      day: 'numeric', month: 'short'
    });
  };

  if (loading && !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Visits Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Views
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.totalVisits || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
              <Users size={24} />
            </div>
          </div>

          {/* Total Posts Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Posts
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats?.totalPosts || 0}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
              <FileText size={24} />
            </div>
          </div>

          {/* Active Services Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Active Services
              </p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats?.totalServices || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
              <Briefcase size={24} />
            </div>
          </div>
        </div>

        {/* Detailed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Posts List */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-gray-400" size={20} />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {sortBy === 'views' ? 'सर्वाधिक पाहिलेल्या जाहिराती' : 'नवीनतम जाहिराती'}
                  </h2>
                </div>
                
                {/* Sorting Dropdown */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-1.5 px-3 cursor-pointer outline-none"
                >
                  <option value="views">Sort By: Views</option>
                  <option value="date">Sort By: Date</option>
                </select>
              </CardHeader>
              
              <CardBody className="relative min-h-[300px] p-0">
                {loading && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center z-10 backdrop-blur-sm">
                    <Spinner size="md" />
                  </div>
                )}

                {stats?.topPosts && stats.topPosts.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {stats.topPosts.map((post, index) => (
                      <div key={post.postId} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between group">
                        <div className="flex items-start gap-4 overflow-hidden">
                          <span className="shrink-0 w-6 text-center text-gray-400 font-medium mt-1">#{index + 1}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Calendar size={12} className="mr-1" />
                                {formatDate(post.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          sortBy === 'views' 
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          <Eye size={14} className="mr-1.5" />
                          {post.views}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <FileText size={48} className="mb-2 opacity-20" />
                    <p>सध्या कोणतीही माहिती उपलब्ध नाही.</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions / Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
             {/* Create Post Card */}
             <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">नवीन पोस्ट तयार करा !!!</h3>
                <p className="text-blue-100 text-sm mb-4 opacity-90">
                  नवीन जाहिरात किंवा अपडेट प्रकाशित करण्यासाठी येथे क्लिक करा.
                </p>
                <button 
                  onClick={() => navigate('/admin/posts/create')}
                  className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  Create <ArrowUpRight size={18} className="ml-2" />
                </button>
             </div>

             {/* Create Service Card */}
             <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">नवीन सर्विस तयार करा !!!</h3>
                <p className="text-purple-100 text-sm mb-4 opacity-90">
                  नवीन डिजिटल सेवा जोडण्यासाठी येथे क्लिक करा.
                </p>
                <button 
                  onClick={() => navigate('/admin/services/create')}
                  className="w-full bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center"
                >
                  Create <ArrowUpRight size={18} className="ml-2" />
                </button>
             </div>

          </div>

        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-center">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;