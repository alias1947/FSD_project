'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiBook, FiCheck, FiX, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const commonSubjects = [
  'Mathematics', 'Calculus', 'Linear Algebra', 'Discrete Mathematics',
  'Data Structures', 'Algorithms', 'Computer Networks', 'Database Systems',
  'Operating Systems', 'Software Engineering', 'Machine Learning', 'Artificial Intelligence',
  'Digital Electronics', 'Signals and Systems', 'Communication Systems',
  'Physics', 'Chemistry', 'English', 'Economics', 'Statistics'
];

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strongSubjects, setStrongSubjects] = useState<string[]>([]);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);

  useEffect(() => {
    const email = searchParams.get('email');
    if (!email) {
      router.push('/login');
      return;
    }

    // Fetch parsed user data
    fetch(`/api/auth/parse-email?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          router.push('/login');
        } else {
          setUserData(data);
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [searchParams, router]);

  const toggleSubject = (subject: string, type: 'strong' | 'weak') => {
    if (type === 'strong') {
      setStrongSubjects(prev => 
        prev.includes(subject) 
          ? prev.filter(s => s !== subject)
          : [...prev, subject]
      );
      // Remove from weak if it's there
      setWeakSubjects(prev => prev.filter(s => s !== subject));
    } else {
      setWeakSubjects(prev => 
        prev.includes(subject) 
          ? prev.filter(s => s !== subject)
          : [...prev, subject]
      );
      // Remove from strong if it's there
      setStrongSubjects(prev => prev.filter(s => s !== subject));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (!password || password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (strongSubjects.length === 0 || weakSubjects.length === 0) {
      alert('Please select at least one strong subject and one weak subject');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password,
          batchYear: userData.batchYear,
          rollNumber: userData.rollNumber,
          branch: userData.branch,
          branchAcronym: userData.branchAcronym,
          strongSubjects,
          weakSubjects,
        }),
      });

      if (response.ok) {
        // Mark user as new for onboarding tour
        sessionStorage.setItem('hivemind-show-tour', 'true');
        router.push('/');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      alert('Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-primary-600 p-2.5 sm:p-3 rounded-xl">
                <FiBook className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Profile</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Tell us about your academic interests</p>
          </div>

          {/* Display parsed info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-300 mb-2">Your Information</h3>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
              <div><span className="font-medium">Batch:</span> {userData.batchYear}</div>
              <div><span className="font-medium">Roll No:</span> {userData.rollNumber}</div>
              <div><span className="font-medium">Branch:</span> {userData.branch}</div>
              <div className="col-span-2 break-all"><span className="font-medium">Email:</span> {userData.email}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Password Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Create Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    placeholder="Enter password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Strong Subjects */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Subjects you're strong in (select all that apply) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2">
                {commonSubjects.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject, 'strong')}
                    className={`flex items-center justify-between px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border transition-all text-xs sm:text-sm ${
                      strongSubjects.includes(subject)
                        ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <span className="truncate">{subject}</span>
                    {strongSubjects.includes(subject) && (
                      <FiCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
              {strongSubjects.length > 0 && (
                <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                  Selected: {strongSubjects.join(', ')}
                </p>
              )}
            </div>

            {/* Weak Subjects */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Subjects you need help with (select all that apply) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2">
                {commonSubjects.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject, 'weak')}
                    className={`flex items-center justify-between px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border transition-all text-xs sm:text-sm ${
                      weakSubjects.includes(subject)
                        ? 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <span className="truncate">{subject}</span>
                    {weakSubjects.includes(subject) && (
                      <FiX className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
              {weakSubjects.length > 0 && (
                <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                  Selected: {weakSubjects.join(', ')}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading || strongSubjects.length === 0 || weakSubjects.length === 0}
                className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg text-sm sm:text-base font-medium"
              >
                {loading ? 'Creating Profile...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

