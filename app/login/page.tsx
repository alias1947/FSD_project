'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiMail,
  FiBook,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiLogIn
} from 'react-icons/fi';

import { parseCollegeEmail } from '@/lib/emailParser';

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  /* ---------------------- HANDLERS ---------------------- */

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setErrMsg('');
    setPassword('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg('');

    const parsed = parseCollegeEmail(email);
    if (!parsed.isValid) {
      setErrMsg(
        'Invalid college email format. Expected: YYbranchROLL@domain (e.g., 23bcs057@iiitdwd.ac.in)'
      );
      setLoading(false);
      return;
    }

    // Redirect to setup page
    router.push(`/setup?email=${encodeURIComponent(email)}`);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        sessionStorage.setItem('hivemind-show-tour', 'true');
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setErrMsg(data.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setErrMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- UI ---------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-primary-600 p-2.5 sm:p-3 rounded-xl">
              <FiBook className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to HiveMind
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {mode === 'signin'
              ? 'Sign in to join study groups on your campus'
              : 'Create your HiveMind account to get started'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
          <button
            onClick={() => switchMode('signin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-all text-sm font-medium ${
              mode === 'signin'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FiLogIn className="h-4 w-4" />
            Sign In
          </button>

          <button
            onClick={() => switchMode('signup')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-all text-sm font-medium ${
              mode === 'signup'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FiUserPlus className="h-4 w-4" />
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}
          className="space-y-4 sm:space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Email Address
            </label>

            <div className="relative">
              <FiMail className="absolute left-3 inset-y-0 my-auto h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Password (Sign in only) */}
          {mode === 'signin' && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-3 inset-y-0 my-auto h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />

                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPwd ? (
                    <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errMsg && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm">
              {errMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg text-sm sm:text-base font-medium"
          >
            {loading
              ? mode === 'signin'
                ? 'Signing in...'
                : 'Processing...'
              : mode === 'signin'
              ? 'Sign In'
              : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
