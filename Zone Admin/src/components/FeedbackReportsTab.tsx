import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { City } from '../../../Zone Rapido/src/data/cities';

export interface FeedbackReport {
  id: string;
  cityName: string;
  cityId?: string | null;
  reportType: 'moved_office' | 'new_office' | 'boundary_expansion' | 'incorrect_data';
  proposedAddress?: string;
  pincode?: string;
  landmark?: string;
  notes?: string;
  submitterRole: 'captain' | 'commuter' | 'executive' | 'other';
  status: 'pending' | 'approved' | 'dismissed';
  createdAt: number;
}

interface FeedbackReportsTabProps {
  cities: City[];
  onCityUpdated: (updatedCity: City) => void;
}

export const FeedbackReportsTab: React.FC<FeedbackReportsTabProps> = ({ cities, onCityUpdated }) => {
  const [reports, setReports] = useState<FeedbackReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'dismissed' | 'all'>('pending');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'feedback_reports'));
      const list: FeedbackReport[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as FeedbackReport);
      });
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setReports(list);
    } catch (err: any) {
      console.error('Failed to load feedback reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleApplyToCity = async (report: FeedbackReport) => {
    try {
      // Find matching city by cityId or clean name
      const targetCity =
        cities.find((c) => report.cityId && c.id === report.cityId) ||
        cities.find((c) => c.name.toLowerCase().includes(report.cityName.toLowerCase())) ||
        cities.find((c) => report.cityName.toLowerCase().includes(c.name.toLowerCase()));

      if (!targetCity) {
        showFeedback(`No existing city matched "${report.cityName}". Register city first.`, 'error');
        return;
      }

      const updatedCity: City = {
        ...targetCity,
        address: report.proposedAddress || targetCity.address,
        pincode: report.pincode || targetCity.pincode,
        landmarkNote: report.landmark || targetCity.landmarkNote,
        notes: report.notes ? `${targetCity.notes ? targetCity.notes + ' • ' : ''}${report.notes}` : targetCity.notes
      };

      // Persist to Firestore
      await setDoc(doc(db, 'cities', updatedCity.id), updatedCity, { merge: true });

      // Mark report approved
      await updateDoc(doc(db, 'feedback_reports', report.id), {
        status: 'approved',
        appliedAt: Date.now()
      });

      onCityUpdated(updatedCity);
      setReports((prev) =>
        prev.map((r) => (r.id === report.id ? { ...r, status: 'approved' } : r))
      );

      showFeedback(`Successfully updated ${updatedCity.name} office address from report.`, 'success');
    } catch (err: any) {
      console.error('Error applying report:', err);
      showFeedback(err.message || 'Failed to update city.', 'error');
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await updateDoc(doc(db, 'feedback_reports', reportId), {
        status: 'dismissed'
      });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
      );
      showFeedback('Report marked as dismissed.', 'success');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to dismiss report.', 'error');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm('Delete this report record permanently?')) return;
    try {
      await deleteDoc(doc(db, 'feedback_reports', reportId));
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      showFeedback('Report permanently deleted.', 'success');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to delete report.', 'error');
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const getRoleBadge = (role: FeedbackReport['submitterRole']) => {
    switch (role) {
      case 'captain':
        return 'bg-amber-400/20 text-amber-300 border-amber-400/30';
      case 'executive':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'commuter':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Community Discrepancy & Office Reports</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {reports.filter((r) => r.status === 'pending').length} Pending
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Crowdsourced submissions from captains, commuters, and field executives
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {(['pending', 'approved', 'dismissed', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded font-semibold capitalize transition-all ${
                  filter === tab
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={fetchReports}
            title="Refresh reports"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            ↻
          </button>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium ${
            actionMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          {actionMsg.text}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          Loading community reports...
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="py-16 text-center space-y-2 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
          <div className="text-2xl">📬</div>
          <h4 className="text-sm font-semibold text-slate-300">No {filter} reports</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When commuters or captains report an address update or boundary shift, it will appear here for 1-click verification.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-3 shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{report.cityName}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${getRoleBadge(
                        report.submitterRole
                      )}`}
                    >
                      {report.submitterRole}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      report.status === 'pending'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : report.status === 'approved'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <div className="text-[11px] text-amber-400/90 font-medium capitalize">
                  Type: {report.reportType.replace(/_/g, ' ')}
                </div>

                {report.proposedAddress && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div className="text-[10px] text-slate-500 font-mono mb-0.5">Reported Office Address:</div>
                    <div className="text-slate-200 select-text font-medium leading-relaxed">
                      {report.proposedAddress}
                    </div>
                    {report.pincode && (
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        PIN: {report.pincode}
                      </div>
                    )}
                    {report.landmark && (
                      <div className="text-[10px] text-cyan-400 italic mt-0.5">
                        📍 Landmark: {report.landmark}
                      </div>
                    )}
                  </div>
                )}

                {report.notes && (
                  <div className="text-xs text-slate-400 italic">
                    Note: "{report.notes}"
                  </div>
                )}

                <div className="text-[10px] text-slate-500 font-mono">
                  Submitted: {new Date(report.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApplyToCity(report)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
                      >
                        <span>✓</span>
                        <span>Apply to City</span>
                      </button>
                      <button
                        onClick={() => handleDismissReport(report.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  {report.status !== 'pending' && (
                    <span className="text-[11px] text-slate-500 italic">
                      Processed ({report.status})
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteReport(report.id)}
                  title="Delete report"
                  className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

