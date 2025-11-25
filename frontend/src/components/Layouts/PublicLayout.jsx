import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                {/* You can use your logo image here */}
                <img src="/logo.png" alt="Logo" className="h-10 w-auto mr-2 rounded-full" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  प्रियल नेट कॅफे
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                होम 
              </Link>
              <Link to="/posts" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                नोकरी अपडेट्स
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                ईतर सेवा
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                संपर्क 
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                Home
              </Link>
              <Link to="/posts" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                Updates / Jobs
              </Link>
              <Link to="/services" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                Services
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Priyal Net Cafe. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Near ST Stand, Islampur. Mo. 7709577531
              </p>
            </div>
            <div className="flex space-x-6">
               {/* Social Links could go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};