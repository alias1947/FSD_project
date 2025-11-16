'use client';

import { StudyJam } from '@/types';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiChevronRight, FiDownload } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

interface UpcomingSessionsProps {
  studyJams: StudyJam[];
  userId: string;
}

export default function UpcomingSessions({ studyJams, userId }: UpcomingSessionsProps) {
  const [showAll, setShowAll] = useState(false);

  // Get upcoming study jams
  const upcomingJams = studyJams
    .filter(jam => {
      const jamDate = new Date(jam.date + 'T' + jam.time);
      const now = new Date();
      return (
        jamDate >= now &&
        (jam.participants.includes(userId) || jam.createdBy === userId) &&
        jam.status !== 'completed'
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA.getTime() - dateB.getTime();
    });

  const displayedJams = showAll ? upcomingJams : upcomingJams.slice(0, 5);

  // Generate iCal file
  const exportToICal = () => {
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HiveMind//Study Jams//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    upcomingJams.forEach(jam => {
      const startDate = new Date(jam.date + 'T' + jam.time);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 2); // Default 2 hour duration

      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icalContent.push(
        'BEGIN:VEVENT',
        `UID:${jam.id}@hivemind`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:${jam.title}`,
        `DESCRIPTION:${jam.description}\\n\\nLocation: ${jam.location}\\nSubject: ${jam.subject}`,
        `LOCATION:${jam.location}, ${jam.campus}`,
        'END:VEVENT'
      );
    });

    icalContent.push('END:VCALENDAR');

    const blob = new Blob([icalContent.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hivemind-study-sessions.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return 'Today';
    }
  };

  if (upcomingJams.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="text-center py-8">
          <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Upcoming Sessions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Join or create a study jam to see it here
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
          >
            Browse Study Jams
            <FiChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Upcoming Sessions ({upcomingJams.length})
        </h3>
        <button
          onClick={exportToICal}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          title="Export to Calendar"
        >
          <FiDownload className="h-4 w-4" />
          <span className="hidden sm:inline">Export iCal</span>
        </button>
      </div>

      <div className="space-y-3">
        {displayedJams.map((jam) => {
          const jamDate = new Date(jam.date + 'T' + jam.time);
          const isToday = jamDate.toDateString() === new Date().toDateString();
          const isTomorrow = jamDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

          return (
            <div
              key={jam.id}
              className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600 cursor-pointer"
              onClick={() => window.location.href = `/?highlight=${jam.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {jam.title}
                    </h4>
                    {(isToday || isTomorrow) && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isToday
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {isToday ? 'Today' : 'Tomorrow'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {jam.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="h-4 w-4" />
                      {jamDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock className="h-4 w-4" />
                      {jam.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiMapPin className="h-4 w-4" />
                      {jam.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiUsers className="h-4 w-4" />
                      {jam.currentParticipants}/{jam.maxParticipants}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-primary-600 dark:text-primary-400">
                    {getTimeUntil(jamDate)} remaining
                  </div>
                </div>
                <FiChevronRight className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {upcomingJams.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        >
          {showAll ? 'Show Less' : `Show All (${upcomingJams.length - 5} more)`}
        </button>
      )}
    </div>
  );
}

