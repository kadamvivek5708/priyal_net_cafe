import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
      
      <div className="mb-8 text-yellow-500 dark:text-yellow-400">
        <AlertTriangle size={80} strokeWidth={1.5} />
      </div>

      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Page Not Found
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button size="lg">
            Go Home
          </Button>
        </Link>
        <Link to="/posts">
          <Button variant="outline" size="lg">
            View Latest Updates
          </Button>
        </Link>
      </div>

    </div>
  );
};

export default NotFoundPage;