'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudyJamFormData } from '@/types';

export default function StudyJamForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StudyJamFormData>({
    title: '',
    description: '',
    subject: '',
    campus: '',
    location: '',
    date: '',
    time: '',
    maxParticipants: 4,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/study-jams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create study jam');
      }
    } catch (error) {
      console.error('Failed to create study jam:', error);
      alert('Failed to create study jam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Header Section */}
      <div className="mb-8 sm:mb-10 text-center">
        <div className="inline-block mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-indigo-500 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-r from-primary-500 to-indigo-600 text-white px-6 py-3 rounded-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Create a Hive
              </h1>
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl font-medium mt-4">
          Start a new study group and connect with students on your campus
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
          <span>Fill in the details below</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
        </div>
      </div>

      {/* Form Card with Glassmorphism */}
      <form onSubmit={handleSubmit} className="group relative">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 via-indigo-500 to-purple-500 dark:from-primary-600 dark:via-indigo-600 dark:to-purple-600 rounded-3xl blur opacity-20 dark:opacity-10 group-hover:opacity-30 dark:group-hover:opacity-20 transition duration-1000"></div>
        
        {/* Main form container */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 dark:border-gray-700/50">
          <div className="space-y-6 sm:space-y-8">
            {/* Title Field */}
            <div className="form-group">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></span>
                Title <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-300 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70"
                placeholder="e.g., Calculus II Study Session"
              />
            </div>

            {/* Description Field */}
            <div className="form-group">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></span>
                Description <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-300 resize-none text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70"
                placeholder="Describe what you'll be studying..."
              />
            </div>

            {/* Subject and Campus Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></span>
                  Subject <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-300 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70"
                  placeholder="e.g., Mathematics, Computer Science"
                />
              </div>

              <div className="form-group">
                <label htmlFor="campus" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></span>
                  Campus <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="campus"
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-300 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70"
                  placeholder="e.g., Main Campus, North Campus"
                />
              </div>
            </div>

            {/* Location Field */}
            <div className="form-group">
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></span>
                Location <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-300 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70"
                placeholder="e.g., Library Room 201, Coffee Shop"
              />
            </div>

            {/* Date and Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></span>
                  Date <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-300 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70"
                />
              </div>

              <div className="form-group">
                <label htmlFor="time" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></span>
                  Time <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-300 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70"
                />
              </div>
            </div>

            {/* Max Participants Field */}
            <div className="form-group">
              <label htmlFor="maxParticipants" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></span>
                Max Participants <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <select
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-300 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70 cursor-pointer"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num} people
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative px-8 py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:hover:scale-100 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Hive
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
