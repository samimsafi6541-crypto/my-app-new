import { Link } from 'react-router';
import { Home } from 'lucide-react';

export function NotFoundScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-bold text-slate-900 dark:text-white mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
