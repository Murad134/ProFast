// Forbidden.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="max-w-md text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-6">
                    Oops! You do not have permission to access this page.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                >
                    Go Back to Dashboard
                </Link>
            </div>
        </div>
    );
};
export default Forbidden;
