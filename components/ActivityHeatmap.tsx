'use client';

import { StudyJam } from '@/types';
import { useState } from 'react';

interface ActivityHeatmapProps {
  studyJams: StudyJam[];
  userId: string;
}

export default function ActivityHeatmap({ studyJams, userId }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  // Get all dates where user participated in study jams
  const getActivityData = () => {
    const activityMap = new Map<string, number>();
    
    studyJams.forEach(jam => {
      if (jam.participants.includes(userId) || jam.createdBy === userId) {
        const jamDate = new Date(jam.date);
        const dateKey = jamDate.toISOString().split('T')[0];
        activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
      }
    });

    return activityMap;
  };

  // Generate last 365 days
  const generateDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    
    return days;
  };

  const activityMap = getActivityData();
  const days = generateDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get intensity level (0-4) based on activity count
  const getIntensity = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const count = activityMap.get(dateKey) || 0;
    
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count >= 3 && count < 5) return 3;
    return 4;
  };

  // Get color based on intensity
  const getColor = (intensity: number) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-700/30', // No activity
      'bg-green-200 dark:bg-green-900/60', // 1 activity
      'bg-green-400 dark:bg-green-700/80', // 2 activities
      'bg-green-600 dark:bg-green-500/90', // 3-4 activities
      'bg-green-800 dark:bg-green-400', // 5+ activities
    ];
    return colors[intensity];
  };

  // Group days by weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Get month labels
  const getMonthLabels = () => {
    const labels: { week: number; month: string }[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let lastMonth = -1;
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        labels.push({ week: weekIndex, month: months[month] });
        lastMonth = month;
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();
  const totalActivities = Array.from(activityMap.values()).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Study Activity
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {totalActivities} {totalActivities === 1 ? 'study session' : 'study sessions'} in the last year
        </p>
      </div>

      <div className="overflow-x-auto">
        {/* Month labels row - positioned above grid */}
        <div className="flex gap-1 mb-3 h-4">
          <div className="w-12 flex-shrink-0"></div>
          <div className="flex gap-1 relative">
            {monthLabels.map((label, idx) => {
              // Calculate position: week columns are vertical stacks, each cell is w-3 (12px)
              // There's gap-1 (4px) between week columns
              // Each week column width = cell width (12px)
              // Position = weekIndex * (cellWidth + gapSize)
              const cellWidth = 12; // w-3 = 12px (0.75rem)
              const gapSize = 4; // gap-1 = 4px (0.25rem)
              const weekColumnWidth = cellWidth + gapSize; // 16px per week column (including gap)
              const leftPosition = label.week * weekColumnWidth;
              
              return (
                <div
                  key={idx}
                  className="text-xs text-gray-600 dark:text-gray-400 absolute whitespace-nowrap pointer-events-none"
                  style={{ left: `${leftPosition}px` }}
                >
                  {label.month}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid row */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="w-12 flex-shrink-0 flex flex-col gap-1 pt-6">
            {['Mon', 'Wed', 'Fri'].map((day) => (
              <div key={day} className="text-xs text-gray-600 dark:text-gray-400 h-3">
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const intensity = getIntensity(day);
                  const dateKey = day.toISOString().split('T')[0];
                  const count = activityMap.get(dateKey) || 0;
                  const isToday = day.getTime() === today.getTime();
                  
                  const tooltipContent = `${count} ${count === 1 ? 'study session' : 'study sessions'} on ${day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                  
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      onMouseEnter={(e) => {
                        if (count > 0) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10,
                            content: tooltipContent,
                          });
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      className={`w-3 h-3 rounded-sm ${getColor(intensity)} border border-gray-200 dark:border-gray-600 ${
                        isToday ? 'ring-2 ring-primary-500 dark:ring-primary-400 ring-offset-1 dark:ring-offset-gray-800' : ''
                      } ${count > 0 ? 'cursor-pointer hover:opacity-80 hover:scale-110' : ''} transition-all`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600"></div>
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/60 border border-gray-200 dark:border-gray-600"></div>
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/80 border border-gray-200 dark:border-gray-600"></div>
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500/90 border border-gray-200 dark:border-gray-600"></div>
          <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-400 border border-gray-200 dark:border-gray-600"></div>
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

