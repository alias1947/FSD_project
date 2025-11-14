'use client';

import { useState, useEffect, useRef } from 'react';
import { FiX, FiArrowRight, FiArrowLeft, FiSearch, FiPlus, FiFilter, FiUsers } from 'react-icons/fi';

interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'search',
    target: '[data-tour="search"]',
    title: 'Search Hives',
    description: 'Use the search bar to find study groups by subject, campus, or keywords. Type what you\'re looking for and discover hives that match your interests!',
    position: 'bottom',
  },
  {
    id: 'filters',
    target: '[data-tour="filters"]',
    title: 'Filter & Explore',
    description: 'Click the Filters button to narrow down hives by campus, subject, or status. Find exactly what you need quickly and efficiently.',
    position: 'bottom',
  },
  {
    id: 'create',
    target: '[data-tour="create"]',
    title: 'Create Your Hive',
    description: 'Start your own study group! Click "Create Hive" to set up a new study session. Fill in the details and invite others to join your learning journey.',
    position: 'bottom',
  },
  {
    id: 'join',
    target: '[data-tour="join"]',
    title: 'Join a Hive',
    description: 'Found a hive that interests you? Click "Join Hive" to become part of the study group. Connect with fellow students and learn together!',
    position: 'top',
  },
];

export default function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user just logged in and should see the tour
    const shouldShowTour = sessionStorage.getItem('hivemind-show-tour');
    
    // Show tour after every login
    if (shouldShowTour === 'true') {
      // Wait a bit for page to load
      setTimeout(() => {
        setIsVisible(true);
        updateTooltipPosition();
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (isVisible && currentStep < tourSteps.length) {
      updateTooltipPosition();
      window.addEventListener('resize', updateTooltipPosition);
      window.addEventListener('scroll', updateTooltipPosition, true);
      return () => {
        window.removeEventListener('resize', updateTooltipPosition);
        window.removeEventListener('scroll', updateTooltipPosition, true);
      };
    }
  }, [currentStep, isVisible]);

  const updateTooltipPosition = () => {
    if (!tooltipRef.current || !overlayRef.current) return;

    const step = tourSteps[currentStep];
    const targetElement = document.querySelector(step.target);
    
    if (!targetElement) {
      // If target not found, skip to next step
      if (currentStep < tourSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        completeTour();
      }
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    const overlay = overlayRef.current;

    // Create highlight overlay
    overlay.style.clipPath = `polygon(
      0% 0%,
      0% 100%,
      ${rect.left}px 100%,
      ${rect.left}px ${rect.top}px,
      ${rect.right}px ${rect.top}px,
      ${rect.right}px ${rect.bottom}px,
      ${rect.left}px ${rect.bottom}px,
      ${rect.left}px 100%,
      100% 100%,
      100% 0%
    )`;

    // Position tooltip
    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + rect.width / 2;
        tooltip.style.transform = 'translateX(-50%)';
        break;
      case 'top':
        top = rect.top - 20;
        left = rect.left + rect.width / 2;
        tooltip.style.transform = 'translate(-50%, -100%)';
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 20;
        tooltip.style.transform = 'translate(-100%, -50%)';
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 20;
        tooltip.style.transform = 'translateY(-50%)';
        break;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    // Scroll into view if needed
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setIsVisible(false);
    // Clear the flag so tour doesn't show again until next login
    sessionStorage.removeItem('hivemind-show-tour');
  };

  const skipTour = () => {
    completeTour();
  };

  if (!isVisible || currentStep >= tourSteps.length) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <>
      {/* Dark overlay with cutout */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 z-[9998] transition-all duration-300"
        onClick={skipTour}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] w-80 sm:w-96 animate-fade-in-up"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-primary-500 p-6 relative">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-t-2xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={skipTour}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentStep + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {step.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <FiArrowLeft className="h-4 w-4" />
                Previous
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentStep + 1} of {tourSteps.length}
              </div>
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all font-medium shadow-lg"
              >
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Arrow pointing to target */}
          <div
            className={`absolute w-0 h-0 border-8 border-transparent ${
              step.position === 'bottom'
                ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-white dark:border-b-gray-800'
                : step.position === 'top'
                ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-white dark:border-t-gray-800'
                : step.position === 'left'
                ? 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-white dark:border-l-gray-800'
                : 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-white dark:border-r-gray-800'
            }`}
          />
        </div>
      </div>
    </>
  );
}

