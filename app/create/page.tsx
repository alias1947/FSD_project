'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudyJamForm from '@/components/StudyJamForm';

export default function CreatePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        if (userData.profileComplete) {
          setUser(userData);
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="relative inline-block">
            {/* Honeycomb loading animation */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 animate-hexagon-rotate" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="currentColor" strokeWidth="4" className="text-yellow-400 dark:text-yellow-500" fill="none" opacity="0.3"/>
                <path d="M50 15 L82 32.5 L82 67.5 L50 85 L18 67.5 L18 32.5 Z" stroke="currentColor" strokeWidth="4" className="text-orange-500 dark:text-orange-400" fill="none" opacity="0.5"/>
                <path d="M50 25 L74 37.5 L74 62.5 L50 75 L26 62.5 L26 37.5 Z" stroke="currentColor" strokeWidth="4" className="text-primary-600 dark:text-primary-400" fill="none"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xl animate-bee-buzz">🐝</div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 dark:bg-primary-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16 max-w-5xl">
        <StudyJamForm />
      </div>
    </div>
  );
}
