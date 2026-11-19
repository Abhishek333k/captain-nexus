import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ReportDiscrepancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCityName?: string;
  defaultCityId?: string;
}

export const ReportDiscrepancyModal: React.FC<ReportDiscrepancyModalProps> = ({
  isOpen,
  onClose,
  defaultCityName = '',
  defaultCityId = ''
}) => {
  const [cityName, setCityName] = useState(defaultCityName);
  const [reportType, setReportType] = useState<'moved_office' | 'new_office' | 'boundary_expansion' | 'incorrect_data'>('moved_office');
  const [proposedAddress, setProposedAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [submitterRole, setSubmitterRole] = useState<'captain' | 'commuter' | 'executive' | 'other'>('captain');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCityName(defaultCityName);
      setProposedAddress('');
      setPincode('');
      setLandmark('');
      setNotes('');
      setIsSubmitted(false);
      setErrorMessage('');
    }
  }, [isOpen, defaultCityName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) {
      setErrorMessage('Please specify the city or area name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'feedback_reports'), {
        cityName: cityName.trim(),
        cityId: defaultCityId || null,
        reportType,
        proposedAddress: proposedAddress.trim(),
        pincode: pincode.trim(),
        landmark: landmark.trim(),
        notes: notes.trim(),
        submitterRole,
        status: 'pending',
        createdAt: Date.now()
      });

      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting discrepancy report:', err);
      setErrorMessage(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center text-sm font-bold border border-amber-400/30">
              📍
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Suggest Correction or Update</h3>
              <p className="text-[11px] text-slate-400">Help keep transit office and boundary data verified</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl border border-emerald-500/30">
              ✓
            </div>
            <h4 className="text-base font-bold text-white">Report Submitted</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Thank you for contributing. Operations will verify the address and update the public directory.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                City / Location Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="e.g. Hyderabad, Tadepalli, Bangalore"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Type of Update
                </label>
                <select
                  value={reportType}
                  onChange={(e: any) => setReportType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="moved_office">Office Relocated / Address Changed</option>
                  <option value="new_office">New Support / Onboarding Center</option>
                  <option value="boundary_expansion">Service Boundary Expanded</option>
                  <option value="incorrect_data">Inaccurate Coordinates / Info</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Your Role
                </label>
                <select
                  value={submitterRole}
                  onChange={(e: any) => setSubmitterRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="captain">Captain (Driver Partner)</option>
                  <option value="executive">Onboarding / Field Agent</option>
                  <option value="commuter">Commuter / Passenger</option>
                  <option value="other">Community Member</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Updated Physical Office Address
              </label>
              <textarea
                rows={2}
                value={proposedAddress}
                onChange={(e) => setProposedAddress(e.target.value)}
                placeholder="Building name, street, road, area..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 500081"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Navigation Landmark
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Pillar 125"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Additional Notes / Reference
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any operating hours, phone numbers, or context..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

