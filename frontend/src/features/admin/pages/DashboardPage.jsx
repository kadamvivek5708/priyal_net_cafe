import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API + Auth
import { getAnalyticsSummary } from '../api/adminAnalyticsApi';
import { useAuth } from '../../auth/hooks/useAuth';

// UI Kit
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';

// Icons
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
  const { logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("views");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getAnalyticsSummary(sortBy);

        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError('डॅशबोर्ड लोड करण्यात त्रुटी आली.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [sortBy]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("mr-IN", {
      day: "numeric",
      month: "short"
    });
  };

  // INITIAL FULL SCREEN LOADER
  if (loading && !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ---------------- Header ---------------- */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Analytics, trending posts & quick actions
          </p>
        </div>


        {/* ---------------- Stats Grid ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Total Visits */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center hover:shadow-lg transition">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                Total Views
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.totalVisits ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
              <Users size={24} />
            </div>
          </div>

          {/* Total Posts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center hover:shadow-lg transition">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                Total Posts
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats?.totalPosts ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300">
              <FileText size={24} />
            </div>
          </div>

          {/* Total Services */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center hover:shadow-lg transition">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                Active Services
              </p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats?.totalServices ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
              <Briefcase size={24} />
            </div>
          </div>

        </div>


        {/* ---------------- Main Content Grid ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ---------- Top Posts ---------- */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">

              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-gray-400" size={20} />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {sortBy === "views" ? "सर्वाधिक पाहिलेल्या जाहिराती" : "नवीनतम जाहिराती"}
                  </h2>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-gray-50 dark:text-amber-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:ring-blue-500"
                >
                  <option value="views">Sort By: Views</option>
                  <option value="date">Sort By: Date</option>
                </select>
              </CardHeader>

              <CardBody className="p-0 relative min-h-[300px]">

                {loading && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <Spinner size="md" />
                  </div>
                )}

                {stats?.topPosts?.length ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.topPosts.map((post, index) => (
                      <div
                        key={post.postId}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition flex justify-between items-center gap-3"
                      >
                
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <span className="w-6 text-gray-400 font-medium text-center mt-1 shrink-0">
                            #{index + 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white truncate hover:text-blue-600 transition">
                              {post.title}
                            </p>

                            <p className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Calendar size={12} className="mr-1" />
                              {formatDate(post.createdAt)}
                            </p>
                          </div>
                        </div>

                        
                        <div className="shrink-0 px-3 py-1 text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full flex items-center">
                          <Eye size={14} className="mr-1" /> {post.views}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 h-64">
                    <FileText size={50} className="opacity-40" />
                    <p className="mt-2">डेटा उपलब्ध नाही</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>


          {/* ---------- Quick Actions Cards ---------- */}
          <div className="space-y-6">

            {/* Create Post */}
            <div className="rounded-xl p-6 shadow-lg bg-linear-to-br from-blue-500 to-blue-600 text-white">
              <h3 className="font-bold text-lg">नवीन पोस्ट तयार करा</h3>
              <p className="text-blue-100 text-sm mt-1 mb-4">नवीन जाहिरात प्रकाशित करण्यासाठी क्लिक करा.</p>

              <button
                onClick={() => navigate("/admin/posts/create")}
                className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition flex items-center justify-center"
              >
                Create <ArrowUpRight size={18} className="ml-2" />
              </button>
            </div>

            {/* Create Service */}
            <div className="rounded-xl p-6 shadow-lg bg-linear-to-br from-purple-500 to-purple-600 text-white">
              <h3 className="font-bold text-lg">नवीन सेवा जोडा</h3>
              <p className="text-purple-100 text-sm mt-1 mb-4">नवीन ऑनलाइन सेवा जोडण्यासाठी क्लिक करा.</p>

              <button
                onClick={() => navigate("/admin/services/create")}
                className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition flex items-center justify-center"
              >
                Create <ArrowUpRight size={18} className="ml-2" />
              </button>
            </div>

          </div>

        </div>


        {/* ---------- Error Message ---------- */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
