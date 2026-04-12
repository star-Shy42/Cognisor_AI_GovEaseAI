 'use client';

import { useAuth } from './providers.js';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            GovEase AI
          </h1>
          <div className="flex gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 font-semibold">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-semibold">
                  Login
                </Link>
                <Link href="/register" className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 font-semibold">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Access Government Services Easily
          </h1>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            Ask in natural language, speak in Bangla, auto-fill forms, find nearest offices. AI-powered for all Bangladeshi gov services.
          </p>
          {user ? (
            <Link href="/dashboard" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-3xl text-2xl font-bold hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-3xl transition-all">
              Go to Dashboard →
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-12 py-6 rounded-3xl text-xl font-bold hover:from-blue-600 hover:to-indigo-700 shadow-2xl hover:shadow-3xl transition-all">
                Get Started
              </Link>
              <Link href="/register" className="border-2 border-purple-500 text-purple-600 px-12 py-6 rounded-3xl text-xl font-bold hover:bg-purple-50 transition-all">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


