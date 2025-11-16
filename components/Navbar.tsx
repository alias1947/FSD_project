'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiBook, FiUser, FiLogIn, FiPlus, FiMenu, FiX, FiSun, FiMoon, FiBell, FiMessageCircle, FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch('/api/notifications?count=true');
      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };


  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-2.5 hover:opacity-90 transition-opacity group">
              <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-primary-600 p-2 rounded-xl shadow-lg shadow-yellow-500/30 group-hover:shadow-xl group-hover:shadow-yellow-500/40 transition-all duration-300">
                <span className="text-lg sm:text-xl">🐝</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">HiveMind</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Browse
            </Link>
            <Link
              href="/calendar"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-1"
            >
              <FiCalendar className="h-4 w-4" />
              <span>Calendar</span>
            </Link>
            <Link
              data-tour="create"
              href="/create"
              className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-4 lg:px-5 py-2 rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 flex items-center space-x-2"
            >
              <FiPlus className="h-4 w-4" />
              <span className="hidden lg:inline">Create Hive</span>
              <span className="lg:hidden">Create</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>
            {user && (
              <Link
                href="/chats"
                className="relative p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                aria-label="Messages"
              >
                <FiMessageCircle className="h-5 w-5" />
              </Link>
            )}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) {
                      fetchNotificationCount();
                    }
                  }}
                  className="relative p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  aria-label="Notifications"
                >
                  <FiBell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <button
                        onClick={async () => {
                          await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAll: true }) });
                          fetchNotificationCount();
                        }}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <NotificationsList onClose={() => setShowNotifications(false)} />
                  </div>
                )}
              </div>
            )}
            {user ? (
              <Link
                href="/profile"
                className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
              >
                <FiUser className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium max-w-[100px] truncate">{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <FiLogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-4 space-y-2 animate-slide-down">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition-all duration-300"
            >
              Browse
            </Link>
            <Link
              href="/calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2"
            >
              <FiCalendar className="h-4 w-4" />
              <span>Calendar</span>
            </Link>
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-primary-500/30 flex items-center space-x-2"
            >
              <FiPlus className="h-4 w-4" />
              <span>Create Hive</span>
            </Link>
            {user ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex items-center space-x-2"
              >
                <FiUser className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <FiLogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NotificationsList({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.slice(0, 10)); // Show latest 10
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (notification.link) {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notification.id }),
      });
      router.push(notification.link);
      onClose();
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  if (notifications.length === 0) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>;
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => handleNotificationClick(notification)}
          className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
        >
          <p className="font-medium text-sm text-gray-900 dark:text-white">{notification.title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

