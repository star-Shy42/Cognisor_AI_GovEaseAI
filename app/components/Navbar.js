'use client';

import Link from 'next/link';
import { useAuth } from '../providers.js';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            GovEase AI
          </Link>
          
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link href="/register" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                  Register
                </Link>
                <Link href="/login" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                  Dashboard
                </Link>
               
                {user.role === 'admin' && (
                  <Link href="/admin" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </>

            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

