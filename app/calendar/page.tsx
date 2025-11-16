'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import CalendarView from '@/components/CalendarView';
import UpcomingSessions from '@/components/UpcomingSessions';
import { StudyJam } from '@/types';

export default function CalendarPage() {
  const [studyJams, setStudyJams] = useState<StudyJam[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchStudyJams();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudyJams = async () => {
    try {
      const response = await fetch('/api/study-jams');
      if (response.ok) {
        const data = await response.json();
        setStudyJams(data);
      }
    } catch (error) {
      console.error('Failed to fetch study jams:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-2 sm:mb-4"
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Calendar & Upcoming Sessions
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <CalendarView studyJams={studyJams} userId={user.id} />
          </div>

          {/* Upcoming Sessions Sidebar */}
          <div className="lg:col-span-1">
            <UpcomingSessions studyJams={studyJams} userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

