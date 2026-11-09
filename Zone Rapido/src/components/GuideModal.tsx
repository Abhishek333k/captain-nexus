import React, { useState } from 'react';

interface GuideStep {
  title: string;
  badge: string;
  description: string;
  tip: string;
  icon: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    title: 'Instant City & Commute Search',
    badge: 'Step 1 of 5',
    description: 'Press Ctrl + F (or tap the search bar) to look up any village, town, district, or pincode across India.',
    tip: 'Zero-latency distance ranking calculates road distance via OSRM immediately.',
    icon: '🔍'
  },
  {
    title: 'Service Fleet Filtering',
    badge: 'Step 2 of 5',
    description: 'Filter active cities by category: Bike Taxi, Auto, Cab, E-Rickshaw, Tuk-Tuk, or B2B Delivery.',
    tip: 'Click any chip in the filter bar to immediately isolate supported locations.',
    icon: '🛵'
  },
  {
    title: 'Interactive City Boundaries',
    badge: 'Step 3 of 5',
    description: 'Click on any city in the list or map. The system immediately zooms in and renders the official municipal boundary.',
    tip: 'The live badge will tell you if your searched location is strictly inside or outside.',
    icon: '🗺️'
  },
  {
    title: 'Registered Statutory Offices',
    badge: 'Step 4 of 5',
    description: 'Switch to the "Registered Offices" tab to view Roppen Transportation statutory corporate and regional offices.',
    tip: 'Check landmarks and direct legal address records across each state.',
    icon: '🏛️'
  },
  {
    title: 'Keyboard Shortcuts & Map Toggles',
    badge: 'Step 5 of 5',
    description: 'Use Ctrl + F to search, Esc to clear, and toggle Cities, Offices, or Hexagons directly from the top header.',
    tip: 'You can reopen this tutorial anytime by tapping the (?) help icon.',
    icon: '⚡'
  }
];

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = GUIDE_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{step.icon}</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                {step.badge}
              </span>
              <h2 className="text-base font-bold text-white mt-1">{step.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-2">
            <span className="text-amber-400 text-xs">💡</span>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">{step.tip}</p>
          </div>
        </div>

        {/* Stepper Dots & Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex space-x-1.5">
            {GUIDE_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-amber-400/20"
            >
              {currentStep === GUIDE_STEPS.length - 1 ? 'Get Started' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

