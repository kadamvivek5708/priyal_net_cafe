// src/components/Layout/AdminLayout.jsx
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  LogOut, 
  Menu,
  X,
  FilePlus2,
} from 'lucide-react';

export const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Helper to check if a link is active
  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    // { name: 'Add Post', path: '/admin/posts/create', icon: FilePlus2},
    { name: 'Manage Posts', path: '/admin/posts', icon: FileText },
    // { name: 'Add Service', path: '/admin/services/create', icon: FilePlus2},
    { name: 'Manage Services', path: '/admin/services', icon: Briefcase },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      
      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Priyal Net Cafe</span>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                ${isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon size={20} className="mr-3" />
              {item.name}
            </Link>
          ))}
          
          <button
            onClick={logout}
            className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 mt-auto"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center lg:hidden h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-semibold text-gray-800 dark:text-white">Admin Panel</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};