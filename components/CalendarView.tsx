'use client';

import { useState } from 'react';
import { StudyJam } from '@/types';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import Link from 'next/link';

interface CalendarViewProps {
  studyJams: StudyJam[];
  userId: string;
}

export default function CalendarView({ studyJams, userId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Get study jams for the current month
  const getJamsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return studyJams.filter(jam => {
      const jamDate = new Date(jam.date).toISOString().split('T')[0];
      return jamDate === dateStr && (jam.participants.includes(userId) || jam.createdBy === userId);
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push(date);
  }

  const today = new Date();
  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {monthNames[month]} {year}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square"></div>;
          }

          const jams = getJamsForDate(date);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={date.getTime()}
              className={`aspect-square border rounded-lg p-1 ${
                isCurrentDay
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              } transition-colors relative`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isCurrentDay
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {date.getDate()}
              </div>
              
              {jams.length > 0 && (
                <div className="space-y-0.5">
                  {jams.slice(0, 2).map((jam) => (
                    <div
                      key={jam.id}
                      className="text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded px-1 truncate"
                      title={jam.title}
                    >
                      {jam.title}
                    </div>
                  ))}
                  {jams.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{jams.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming sessions list */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming This Month
        </h3>
        <div className="space-y-3">
          {studyJams
            .filter(jam => {
              const jamDate = new Date(jam.date);
              return (
                jamDate >= new Date(year, month, 1) &&
                jamDate <= new Date(year, month + 1, 0) &&
                (jam.participants.includes(userId) || jam.createdBy === userId) &&
                jam.status !== 'completed'
              );
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map((jam) => {
              const jamDate = new Date(jam.date);
              return (
                <div
                  key={jam.id}
                  className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/?highlight=${jam.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {jam.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="h-3 w-3" />
                          {jamDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="h-3 w-3" />
                          {jam.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin className="h-3 w-3" />
                          {jam.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiUsers className="h-3 w-3" />
                          {jam.currentParticipants}/{jam.maxParticipants}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          {studyJams.filter(jam => {
            const jamDate = new Date(jam.date);
            return (
              jamDate >= new Date(year, month, 1) &&
              jamDate <= new Date(year, month + 1, 0) &&
              (jam.participants.includes(userId) || jam.createdBy === userId) &&
              jam.status !== 'completed'
            );
          }).length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No upcoming study sessions this month
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

