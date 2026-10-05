import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home } from 'lucide-react';
import { Button } from '../components/common/UI';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="p-4 bg-emerald-100 text-emerald-800 rounded-3xl mb-2">
        <Sprout className="h-12 w-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md">
        The field or agricultural report you are trying to cultivate does not exist or has been relocated.
      </p>
      <Link to="/dashboard">
        <Button size="md">
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
