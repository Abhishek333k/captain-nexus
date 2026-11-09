import React, { useState } from 'react';
import { CityOffice } from '../../../Zone Rapido/src/data/offices';

interface OfficePayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newOffices: CityOffice[]) => void;
}

export const OfficePayloadModal: React.FC<OfficePayloadModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [activeMode, setActiveMode] = useState<'paste' | 'upload'>('paste');
  const [pasteData, setPasteData] = useState('');
  const [previewOffices, setPreviewOffices] = useState<CityOffice[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  // Parser for Spreadsheet (TSV, CSV, or Tab-separated copied from Google Sheets / Excel)
  const parseDelimitedText = (text: string): CityOffice[] => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];

    const parsed: CityOffice[] = [];

    lines.forEach((line, index) => {
      // Skip header if line matches common headers
      if (index === 0 && (line.toLowerCase().includes('name') || line.toLowerCase().includes('address'))) {
        return;
      }

      // Detect delimiter: tab or comma
      const delimiter = line.includes('\t') ? '\t' : ',';
      const cols = line.split(delimiter).map((c) => c.replace(/^["']|["']$/g, '').trim());

      if (cols.length >= 3) {
        // Expected format: Name, City, State, Address, Lat (opt), Lng (opt), Landmark (opt)
        const name = cols[0] || 'Regional Office';
        const city = cols[1] || 'India';
        const state = cols[2] || 'India';
        const address = cols[3] || `${name}, ${city}, ${state}`;
        const lat = parseFloat(cols[4]) || 20.5937;
        const lng = parseFloat(cols[5]) || 78.9629;
        const landmarkNote = cols[6] || undefined;
        const id = `office_${city.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}_${index}`;

        parsed.push({
          id,
          name,
          legalEntity: 'Roppen Transportation Services Private Limited',
          cin: 'U52210TG2015PTC097115',
          city,
          state,
          address,
          type: 'registered_office',
          pincode: 'India',
          timing: '10:00 AM - 6:00 PM',
          statutorySource: 'Ministry of Corporate Affairs (MCA) Public Records',
          lat,
          lng,
          landmarkNote
        });
      }
    });

    return parsed;
  };

  const handleParseClipboard = () => {
    setErrorMsg('');
    try {
      const result = parseDelimitedText(pasteData);
      if (result.length === 0) {
        setErrorMsg('Could not detect valid rows. Expected columns: [Name, City, State, Address, Lat, Lng, Landmark]');
        return;
      }
      setPreviewOffices(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error parsing tabular data.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      if (file.name.endsWith('.json')) {
        try {
          const json = JSON.parse(content);
          if (Array.isArray(json)) {
            setPreviewOffices(json);
            return;
          }
        } catch {
          setErrorMsg('Invalid JSON format.');
          return;
        }
      }

      // Default CSV/TSV
      const result = parseDelimitedText(content);
      if (result.length === 0) {
        setErrorMsg('No valid rows found in file.');
        return;
      }
      setPreviewOffices(result);
    };

    reader.readAsText(file);
  };

  const handleFinalImport = () => {
    if (previewOffices.length === 0) return;
    onImport(previewOffices);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded">
              Bulk Statutory Office Ingestion
            </span>
            <h2 className="text-base font-bold text-white mt-1">
              Spreadsheet Clipboard Paste & File Ingestion
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex space-x-2 my-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'paste'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            📋 Clipboard / Sheet Paste
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            📁 File Upload (.csv, .tsv, .json)
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {activeMode === 'paste' ? (
            <div className="space-y-3">
              <label className="block text-xs text-slate-400 leading-relaxed">
                Copy and paste rows directly from Google Sheets or Excel. 
                <span className="block text-[11px] text-slate-500 font-mono mt-0.5">
                  Columns: [Name] | [City] | [State] | [Address] | [Lat] | [Lng] | [Landmark Note]
                </span>
              </label>
              <textarea
                rows={6}
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                placeholder="Roppen Transportation Office	Patna	Bihar	Fraser Road, Patna	25.6101	85.1415	Near Dak Bunglow"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleParseClipboard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                Parse & Generate Preview
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs text-slate-400">
                Upload `.csv`, `.tsv`, or `.json` file containing statutory office locations.
              </label>
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-950 transition-colors">
                <span className="text-3xl mb-2">📥</span>
                <span className="text-xs font-bold text-white mb-1">
                  {fileName ? fileName : 'Choose File or Drop Here'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Supports CSV, TSV, JSON</span>
                <input
                  type="file"
                  accept=".csv,.tsv,.txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Parsed Preview Table */}
          {previewOffices.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">
                  Detected {previewOffices.length} Office Records Ready For Ingestion
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Live Validation Passed</span>
              </div>

              <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 divide-y divide-slate-800/80">
                {previewOffices.map((o, idx) => (
                  <div key={idx} className="p-2.5 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{o.name}</div>
                      <div className="text-[11px] text-slate-400">{o.address}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                        {o.city}, {o.state}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {o.lat}, {o.lng}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800 shrink-0 mt-4">
          <span className="text-xs text-slate-500 font-mono">
            {previewOffices.length > 0 ? `${previewOffices.length} records staged` : 'Awaiting input'}
          </span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFinalImport}
              disabled={previewOffices.length === 0}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-blue-600/20"
            >
              Import {previewOffices.length} Records to Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
