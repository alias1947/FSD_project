'use client';

import { useState, useEffect } from 'react';
import StudyJamCard from '@/components/StudyJamCard';
import { StudyJam } from '@/types';
import { FiSearch, FiFilter, FiPlus, FiBookOpen, FiUsers, FiMapPin } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OnboardingTour from '@/components/OnboardingTour';

export default function Home() {
  const [studyJams, setStudyJams] = useState<StudyJam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    campus: '',
    subject: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchStudyJams();
  }, []);

  useEffect(() => {
    fetchStudyJams();
  }, [filters]);

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

  const fetchStudyJams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.campus) params.append('campus', filters.campus);
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`/api/study-jams?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setStudyJams(data);
      } else {
        console.error('Failed to fetch study jams');
      }
    } catch (error) {
      console.error('Failed to fetch study jams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      campus: '',
      subject: '',
      status: '',
    });
    setSearchQuery('');
  };

  // Filter study jams by search query
  const filteredJams = studyJams.filter(jam => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      jam.title.toLowerCase().includes(query) ||
      jam.description.toLowerCase().includes(query) ||
      jam.subject.toLowerCase().includes(query) ||
      jam.campus.toLowerCase().includes(query) ||
      jam.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <OnboardingTour />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-700 text-white py-12 sm:py-16 lg:py-20 mb-8 sm:mb-12 overflow-hidden">
        {/* Honeycomb background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 animate-fade-in tracking-tight">
              HiveMind
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-primary-50 mb-8 sm:mb-10 px-2 max-w-2xl mx-auto font-light">
              Connect with your study hive and boost your learning together
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
                <div className="relative">
                  <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <input
                    data-tour="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hives..."
                    className="w-full pl-14 pr-5 py-4 rounded-2xl text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-3xl mx-auto mt-10 sm:mt-12 px-2">
            <div className="group relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-lg group-hover:bg-white/20 transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <FiBookOpen className="h-7 w-7 sm:h-8 sm:w-8 mx-auto mb-3 text-white/90" />
                <div className="text-2xl sm:text-3xl font-bold mb-1">{studyJams.length}</div>
                <div className="text-xs sm:text-sm text-primary-100 font-medium">Hives</div>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-lg group-hover:bg-white/20 transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <FiUsers className="h-7 w-7 sm:h-8 sm:w-8 mx-auto mb-3 text-white/90" />
                <div className="text-2xl sm:text-3xl font-bold mb-1">
                  {studyJams.reduce((sum, jam) => sum + jam.currentParticipants, 0)}
                </div>
                <div className="text-xs sm:text-sm text-primary-100 font-medium">Students</div>
              </div>
            </div>
            <div className="group relative col-span-2 sm:col-span-1">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-lg group-hover:bg-white/20 transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <FiMapPin className="h-7 w-7 sm:h-8 sm:w-8 mx-auto mb-3 text-white/90" />
                <div className="text-2xl sm:text-3xl font-bold mb-1">
                  {new Set(studyJams.map(jam => jam.campus)).size || 1}
                </div>
                <div className="text-xs sm:text-sm text-primary-100 font-medium">Campuses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 max-w-7xl pb-12 sm:pb-16">
        {/* Filters Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-4">
            <button
              data-tour="filters"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                showFilters || Object.values(filters).some(v => v)
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md'
              }`}
            >
              <FiFilter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            {(Object.values(filters).some(v => v) || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 sm:p-7 mb-6 animate-slide-down">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                <div>
                  <label htmlFor="campus" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Campus
                  </label>
                  <input
                    type="text"
                    id="campus"
                    value={filters.campus}
                    onChange={(e) => handleFilterChange('campus', e.target.value)}
                    placeholder="e.g., Main Campus"
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={filters.subject}
                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="sm:col-span-2 md:col-span-1">
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="full">Full</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-24">
            <div className="relative inline-block">
              {/* Honeycomb loading animation */}
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 animate-hexagon-rotate" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="currentColor" strokeWidth="4" className="text-yellow-400 dark:text-yellow-500" fill="none" opacity="0.3"/>
                  <path d="M50 15 L82 32.5 L82 67.5 L50 85 L18 67.5 L18 32.5 Z" stroke="currentColor" strokeWidth="4" className="text-orange-500 dark:text-orange-400" fill="none" opacity="0.5"/>
                  <path d="M50 25 L74 37.5 L74 62.5 L50 75 L26 62.5 L26 37.5 Z" stroke="currentColor" strokeWidth="4" className="text-primary-600 dark:text-primary-400" fill="none"/>
                </svg>
                {/* Bee icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl animate-bee-buzz">🐝</div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg font-medium">Loading hives...</p>
          </div>
        ) : filteredJams.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
              <FiBookOpen className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {studyJams.length === 0 ? 'No hives yet' : 'No hives found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-base">
              {studyJams.length === 0
                ? 'Be the first to create a hive and connect with other students on your campus!'
                : 'Try adjusting your search or filters to find more hives.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/create"
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 font-medium"
              >
                <FiPlus className="h-5 w-5" />
                <span>Create Your First Hive</span>
              </Link>
              {studyJams.length === 0 && (
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/study-jams/seed', { method: 'POST' });
                      if (response.ok) {
                        fetchStudyJams();
                        alert('Sample data loaded! Refresh the page to see it.');
                      } else {
                        alert('Sample data already exists or failed to load');
                      }
                    } catch (error) {
                      console.error('Failed to seed data:', error);
                    }
                  }}
                  className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                >
                  <span>Load Sample Data</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {filteredJams.length} Hive{filteredJams.length !== 1 ? 's' : ''} Found
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredJams.map((jam, index) => (
                <div key={jam.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <StudyJamCard 
                    jam={jam} 
                    onJoin={() => fetchStudyJams()} 
                    onLeave={() => fetchStudyJams()} 
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

