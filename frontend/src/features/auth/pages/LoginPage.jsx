import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminLogin } from '../api/authApi';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);
    setLoading(true);

    try {
      // Call the API function from authApi.js
      const { data } = await adminLogin({ username, password });
      
      // On success, update global auth state
      login(data.loggedInUser, data.accessToken);

      // Navigate to the admin dashboard
      navigate('/admin/dashboard', { replace: true });

    } catch (err) { 
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // We wrap this in a full-screen div to center the login card
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex flex-col gap-6 w-full max-w-5xl">
        
        
        <div className="overflow-hidden shadow-lg rounded-lg bg-white dark:bg-gray-800">
          <div className="grid p-0 md:grid-cols-2">
            
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold dark:text-white">Welcome Back, Admin</h1>
                  <p className="text-balance text-gray-500 dark:text-gray-400">Login to your Priyal Net Cafe portal</p>
                </div>
                
                {/* This is our <Label> and <Input> replacement */}
                <div className="grid gap-2">
                  <label 
                    htmlFor="username" 
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <input 
                    id="username" 
                    type="text" 
                    placeholder="admin" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                {/* This is our second <Label> and <Input> replacement */}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <label 
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                  </div>
                  <input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Error message display */}
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-500 text-center">
                    {error}
                  </p>
                )}
                
                {/* This is our <Button> replacement */}
                <button 
                  type="submit" 
                  className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            
            <div className="relative hidden bg-gray-100 dark:bg-gray-700 md:block">
              <img
                src="logo.png"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src="https://placehold.co/800x1000/334155/e2e8f0?text=Priyal+Net+Cafe";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export as default so AppRouter can find it
export default LoginPage;