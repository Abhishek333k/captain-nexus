import React, { useState, useEffect, useRef } from 'react';

export interface TourStep {
  id: string;
  targetId: string; // DOM element ID to focus and spotlight
  title: string;
  stepNumber: number;
  totalSteps: number;
  description: string;
  tip: string;
  icon: string;
  placement: 'bottom' | 'top' | 'right' | 'left' | 'center';
  actionHint?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-search',
    targetId: 'tour-search-container',
    title: 'Search Your Location',
    stepNumber: 1,
    totalSteps: 5,
    description: 'Type any town, landmark, or pincode here to see nearby Rapido cities and calculate your actual driving distance.',
    tip: 'Shortcut: Press Ctrl + F (or Cmd + F) anytime to quickly focus this search bar.',
    icon: '🔍',
    placement: 'bottom',
    actionHint: 'Try typing a city or pincode'
  },
  {
    id: 'step-service',
    targetId: 'tour-service-filters',
    title: 'Filter by Ride Type',
    stepNumber: 2,
    totalSteps: 5,
    description: 'Filter cities by available vehicles: Bike Taxi, Auto, Cab, E-Rickshaw, Tuk-Tuk, or Delivery.',
    tip: 'Click any ride icon to show only cities offering that service.',
    icon: '🛵',
    placement: 'bottom'
  },
  {
    id: 'step-cities',
    targetId: 'tour-city-list',
    title: 'Operating Cities & Distance',
    stepNumber: 3,
    totalSteps: 5,
    description: 'Browse active operating cities sorted by road driving distance. Tap any city to see its service boundary on the map.',
    tip: 'Clicking any city card centers the map directly on that city.',
    icon: '🗺️',
    placement: 'right'
  },
  {
    id: 'step-offices',
    targetId: 'tour-offices-tab',
    title: 'City Offices & Local Hubs',
    stepNumber: 4,
    totalSteps: 5,
    description: 'Switch between cities and local city offices to find physical street addresses, landmarks, and operational hours.',
    tip: 'Use this to find where to visit for local captain onboarding or customer assistance.',
    icon: '🏢',
    placement: 'bottom'
  },
  {
    id: 'step-controls',
    targetId: 'tour-map-controls',
    title: 'Map Controls & Shortcuts',
    stepNumber: 5,
    totalSteps: 5,
    description: 'Toggle city pins, office locations, or coverage areas on the map. Press Esc anytime to reset your view.',
    tip: 'Tap the (?) icon anytime to open this guide again.',
    icon: '⚡',
    placement: 'bottom'
  }
];

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: 'cities' | 'offices') => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Calculate target element bounding rectangle whenever step changes
  useEffect(() => {
    if (!isOpen) return;

    if (step.id === 'step-offices' && onSelectTab) {
      // Auto-preview tabs if needed
    }

    const updatePosition = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, currentStepIndex, step.targetId, step.id, onSelectTab]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
      setCurrentStepIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Compute tooltip popover coordinates anchored to target element
  const getPopoverStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed'
      };
    }

    const pad = 12;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const popoverWidth = 380;
    const popoverHeight = 260;

    let top = 0;
    let left = 0;

    if (step.placement === 'bottom') {
      top = targetRect.bottom + pad;
      left = targetRect.left + targetRect.width / 2 - popoverWidth / 2;
    } else if (step.placement === 'top') {
      top = targetRect.top - popoverHeight - pad;
      left = targetRect.left + targetRect.width / 2 - popoverWidth / 2;
    } else if (step.placement === 'right') {
      top = targetRect.top + 20;
      left = targetRect.right + pad;
    } else if (step.placement === 'left') {
      top = targetRect.top + 20;
      left = targetRect.left - popoverWidth - pad;
    }

    // Viewport bounds constraint
    if (left + popoverWidth > windowWidth - 16) {
      left = windowWidth - popoverWidth - 16;
    }
    if (left < 16) {
      left = 16;
    }
    if (top + popoverHeight > windowHeight - 16) {
      top = windowHeight - popoverHeight - 16;
    }
    if (top < 16) {
      top = 16;
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      position: 'fixed'
    };
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none pointer-events-auto">
      {/* 1. Backdrop with Dark Overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 transition-opacity duration-300"
      />

      {/* 2. Spotlight Cutout / Glow Ring around Target Element */}
      {targetRect && (
        <div
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12
          }}
          className="fixed rounded-2xl border-2 border-amber-400 bg-amber-400/10 pointer-events-none transition-all duration-300 shadow-[0_0_35px_rgba(251,191,36,0.45)] ring-4 ring-amber-400/20 animate-pulse"
        />
      )}

      {/* 3. Gaming-Style Focused Tooltip Popover */}
      <div
        ref={popoverRef}
        style={getPopoverStyle()}
        className="z-10 w-[380px] max-w-[92vw] bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-5 text-slate-100 transition-all duration-300 backdrop-blur-md"
      >
        {/* Step Badge & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{step.icon}</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded font-mono">
                Step {step.stepNumber} of {step.totalSteps}
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">{step.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Description & Tip */}
        <div className="py-3 space-y-2.5">
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {step.description}
          </p>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-2">
            <span className="text-amber-400 text-xs">💡</span>
            <p className="text-[11px] text-slate-400 leading-normal font-mono">
              {step.tip}
            </p>
          </div>
        </div>

        {/* Stepper Dots & Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex space-x-1">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentStepIndex === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-3.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-400/20"
            >
              {currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
