'use client';

import { StudyJam } from '@/types';
import { FiUsers, FiMapPin, FiCalendar, FiClock, FiBookOpen } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StudyJamCardProps {
  jam: StudyJam;
  onJoin?: () => void;
  onLeave?: () => void;
}

export default function StudyJamCard({ jam, onJoin, onLeave }: StudyJamCardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/study-jams/${jam.id}/join`, {
        method: 'POST',
      });

      if (response.ok) {
        onJoin?.();
        router.refresh();
      } else {
        const error = await response.json();
        if (error.error === 'Study jam is full') {
          // Try to request instead
          handleRequest();
        } else {
          alert(error.error || 'Failed to join study jam');
        }
      }
    } catch (error) {
      console.error('Failed to join:', error);
      alert('Failed to join study jam');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/study-jams/${jam.id}/request`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Request sent! The creator will be notified.');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send request');
      }
    } catch (error) {
      console.error('Failed to send request:', error);
      alert('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/study-jams/${jam.id}/leave`, {
        method: 'POST',
      });

      if (response.ok) {
        onLeave?.();
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to leave study jam');
      }
    } catch (error) {
      console.error('Failed to leave:', error);
      alert('Failed to leave study jam');
    } finally {
      setLoading(false);
    }
  };

  const isParticipant = user && jam.participants.includes(user.id);
  const isCreator = user && jam.createdBy === user.id;
  const hasRequested = user && jam.requests && jam.requests.includes(user.id);

  const statusColors = {
    open: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    full: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    completed: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  };

  // Progress bar for participants
  const participantProgress = (jam.currentParticipants / jam.maxParticipants) * 100;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 sm:p-7 border border-gray-100 dark:border-gray-700 hover:border-primary-200/50 dark:hover:border-primary-700/50 overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-indigo-50/0 dark:from-primary-900/0 dark:to-indigo-900/0 group-hover:from-primary-50/30 group-hover:to-indigo-50/20 dark:group-hover:from-primary-900/20 dark:group-hover:to-indigo-900/10 transition-all duration-500 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header with status badge */}
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2 flex-1 mr-3 leading-tight">
            {jam.title}
          </h3>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${statusColors[jam.status]}`}>
            {jam.status.toUpperCase()}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed line-clamp-2">{jam.description}</p>

        {/* Subject Badge */}
        <div className="mb-5">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/30 dark:to-indigo-900/30 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800">
            <FiBookOpen className="h-4 w-4 mr-1.5" />
            {jam.subject}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3.5 mb-6">
          <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mr-3">
              <FiMapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="truncate font-medium">{jam.campus} • {jam.location}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mr-3">
              <FiCalendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="font-medium">{new Date(jam.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mr-3">
              <FiClock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="font-medium">{jam.time}</span>
          </div>
          
          {/* Participants with progress bar */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                  <FiUsers className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="font-semibold">{jam.currentParticipants} / {jam.maxParticipants}</span>
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2.5 py-1 rounded-lg">
                {Math.round(participantProgress)}% full
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  participantProgress === 100
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : participantProgress >= 75
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                style={{ width: `${participantProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-5 border-t border-gray-100 dark:border-gray-700">
          {isCreator ? (
            <div className="flex items-center justify-center text-sm text-primary-600 dark:text-primary-400 font-semibold">
              <span className="px-4 py-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl border border-primary-100 dark:border-primary-800">You created this</span>
            </div>
          ) : isParticipant ? (
            <button
              onClick={handleLeave}
              disabled={loading}
              className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-all duration-300 font-semibold text-sm border border-red-100 dark:border-red-800 hover:border-red-200 dark:hover:border-red-700 hover:shadow-md"
            >
              {loading ? 'Leaving...' : 'Leave Hive'}
            </button>
          ) : hasRequested ? (
            <button
              disabled
              className="w-full px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-xl disabled:opacity-50 transition-colors font-semibold text-sm border border-yellow-100 dark:border-yellow-800"
            >
              Request Pending
            </button>
          ) : jam.status === 'full' ? (
            <button
              onClick={handleRequest}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition-all duration-300 font-semibold text-sm shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40"
            >
              {loading ? 'Sending...' : 'Request to Join'}
            </button>
          ) : (
            <button
              data-tour="join"
              onClick={handleJoin}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl hover:from-primary-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300 font-semibold text-sm shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
            >
              {loading ? 'Joining...' : 'Join Hive'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

