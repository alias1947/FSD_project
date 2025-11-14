'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiBook, FiLogOut, FiCalendar, FiMapPin, FiUsers, FiCheckCircle, FiXCircle, FiArrowLeft, FiEdit2, FiClock, FiTarget, FiStar, FiTrendingUp, FiAward } from 'react-icons/fi';
import { User, StudyJam, StudyGoal, Review } from '@/types';
import StudyJamCard from '@/components/StudyJamCard';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [studyJams, setStudyJams] = useState<StudyJam[]>([]);
  const [createdJams, setCreatedJams] = useState<StudyJam[]>([]);
  const [participatedJams, setParticipatedJams] = useState<StudyJam[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchStudyJams();
  }, []);

  useEffect(() => {
    if (user) {
      fetchReviews();
      fetchGoals();
      setBioText(user.bio || '');
    }
  }, [user]);

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

  useEffect(() => {
    if (user && studyJams.length > 0) {
      const created = studyJams.filter(jam => jam.createdBy === user.id);
      const participated = studyJams.filter(
        jam => jam.participants.includes(user.id) && jam.createdBy !== user.id
      );
      setCreatedJams(created);
      setParticipatedJams(participated);
    }
  }, [user, studyJams]);

  const fetchReviews = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/reviews?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  const handleSaveBio = async () => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: bioText }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditingBio(false);
      }
    } catch (error) {
      console.error('Failed to update bio:', error);
    }
  };

  const calculateStats = () => {
    const totalHives = createdJams.length + participatedJams.length;
    const completedHives = studyJams.filter(jam => jam.status === 'completed' && (jam.createdBy === user?.id || jam.participants.includes(user?.id || ''))).length;
    const totalHours = user?.totalStudyHours || 0;
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    return { totalHives, completedHives, totalHours, avgRating };
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to logout:', error);
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-2 sm:mb-4"
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="bg-primary-600 p-3 sm:p-4 rounded-xl">
                  <FiUser className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-all">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <FiLogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Bio Section */}
          <div className="mb-4 sm:mb-6">
            {editingBio ? (
              <div>
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleSaveBio}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setBioText(user.bio || '');
                      setEditingBio(false);
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <p className="text-gray-700 dark:text-gray-300">
                  {user.bio || 'No bio yet. Click edit to add one!'}
                </p>
                <button
                  onClick={() => setEditingBio(true)}
                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiEdit2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Study Statistics */}
          {(() => {
            const stats = calculateStats();
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 sm:mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 text-center">
                  <FiBook className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-300">{stats.totalHives}</div>
                  <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-400">Total Hives</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 text-center">
                  <FiCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-300">{stats.completedHives}</div>
                  <div className="text-xs sm:text-sm text-green-700 dark:text-green-400">Completed</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 sm:p-4 text-center">
                  <FiClock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-300">{stats.totalHours}</div>
                  <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-400">Study Hours</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4 text-center">
                  <FiStar className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-900 dark:text-yellow-300">
                    {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}
                  </div>
                  <div className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400">Avg Rating</div>
                </div>
              </div>
            );
          })()}

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiBook className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100">Academic Information</h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                <div><span className="font-medium">Batch Year:</span> {user.batchYear}</div>
                <div><span className="font-medium">Roll Number:</span> {user.rollNumber}</div>
                <div><span className="font-medium">Branch:</span> {user.branch}</div>
                <div><span className="font-medium">Campus:</span> {user.campus}</div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-sm sm:text-base font-semibold text-green-900 dark:text-green-100">Strong Subjects</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {user.strongSubjects && user.strongSubjects.length > 0 ? (
                  user.strongSubjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs sm:text-sm font-medium border border-green-200 dark:border-green-800"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-xs sm:text-sm text-green-700 dark:text-green-300">No subjects selected</span>
                )}
              </div>
            </div>
          </div>

          {/* Weak Subjects */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FiXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
              <h3 className="text-sm sm:text-base font-semibold text-red-900 dark:text-red-100">Subjects Needing Help</h3>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {user.weakSubjects && user.weakSubjects.length > 0 ? (
                user.weakSubjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full text-xs sm:text-sm font-medium border border-red-200 dark:border-red-800"
                  >
                    {subject}
                  </span>
                ))
              ) : (
                <span className="text-xs sm:text-sm text-red-700 dark:text-red-300">No subjects selected</span>
              )}
            </div>
          </div>
        </div>

        {/* Study Goals Section */}
        {goals.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiTarget className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary-600 dark:text-primary-400" />
              Study Goals
            </h2>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      goal.status === 'paused' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  {goal.targetHours && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{goal.currentHours} / {goal.targetHours} hours</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((goal.currentHours / goal.targetHours) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiStar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary-600 dark:text-primary-400" />
              Reviews ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Jams Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Created Study Jams */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <FiBook className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary-600" />
              <span className="break-words">Study Jams I Created ({createdJams.length})</span>
            </h2>
            {createdJams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {createdJams.map(jam => (
                  <StudyJamCard
                    key={jam.id}
                    jam={jam}
                    onJoin={() => fetchStudyJams()}
                    onLeave={() => fetchStudyJams()}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center border border-gray-100 dark:border-gray-700">
                <FiBook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't created any study jams yet.</p>
                <Link
                  href="/create"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <span>Create Your First Study Jam</span>
                </Link>
              </div>
            )}
          </div>

          {/* Participated Study Jams */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <FiUsers className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary-600" />
              <span className="break-words">Study Jams I'm Participating In ({participatedJams.length})</span>
            </h2>
            {participatedJams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {participatedJams.map(jam => (
                  <StudyJamCard
                    key={jam.id}
                    jam={jam}
                    onJoin={() => fetchStudyJams()}
                    onLeave={() => fetchStudyJams()}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center border border-gray-100 dark:border-gray-700">
                <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">You're not participating in any study jams yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

