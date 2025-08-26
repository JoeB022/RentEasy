import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldX className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-8">
          You do not have permission to view this page.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#003B4C] text-white px-6 py-3 rounded-md hover:bg-[#005A6E] transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
