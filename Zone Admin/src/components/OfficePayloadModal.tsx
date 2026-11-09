import React, { useState, useEffect } from 'react';

interface StoredPayloadItem {
  id: string;
  timestamp: string;
  title: string;
  type: 'clipboard_text' | 'file_upload';
  fileName?: string;
  fileSize?: string;
  content: string;
}

const STORAGE_KEY = 'silenvault_admin_dropbox_payloads';

interface OfficePayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (rawText: string) => void;
}

export const OfficePayloadModal: React.FC<OfficePayloadModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'history'>('paste');
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [storedPayloads, setStoredPayloads] = useState<StoredPayloadItem[]>([]);
  const [selectedPayload, setSelectedPayload] = useState<StoredPayloadItem | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load existing dropbox payload records
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setStoredPayloads(JSON.parse(data));
      }
    } catch {
      // Ignored
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const savePayloads = (newList: StoredPayloadItem[]) => {
    setStoredPayloads(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const handleSaveClipboard = () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!textContent.trim()) {
      setErrorMsg('Please paste your spreadsheet, table, or address data first.');
      return;
    }

    const item: StoredPayloadItem = {
      id: `payload_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      title: title.trim() || `Raw Sheet Ingestion (${new Date().toLocaleDateString()})`,
      type: 'clipboard_text',
      content: textContent
    };

    const updated = [item, ...storedPayloads];
    savePayloads(updated);
    setSuccessMsg('Successfully dropped payload into storage vault! Ready for review.');
    setTextContent('');
    setTitle('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setSuccessMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      const item: StoredPayloadItem = {
        id: `payload_${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        title: title.trim() || file.name,
        type: 'file_upload',
        fileName: file.name,
        fileSize: sizeStr,
        content
      };

      const updated = [item, ...storedPayloads];
      savePayloads(updated);
      setSuccessMsg(`File [${file.name}] successfully saved in the dropbox vault.`);
      setTitle('');
    };

    reader.readAsText(file);
  };

  const handleDelete = (id: string) => {
    const filtered = storedPayloads.filter((p) => p.id !== id);
    savePayloads(filtered);
    if (selectedPayload?.id === id) {
      setSelectedPayload(null);
    }
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Payload content copied to clipboard.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl border border-blue-500/30">
              📦
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-white tracking-wide">
                  OPERATIONS DROPBOX VAULT
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded">
                  Raw Staging
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Safe storage for full raw sheets, legal address records, and files without premature parsing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between my-4 shrink-0">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'paste'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              📋 Paste Sheet Data
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              📁 File Dropbox
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <span>🗄️ Staged Payloads</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {storedPayloads.length}
              </span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs shrink-0">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs shrink-0">
            {successMsg}
          </div>
        )}

        {/* Tab 1: Clipboard Sheet Paste */}
        {activeTab === 'paste' && (
          <div className="flex-1 overflow-y-auto space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payload Label / Description
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Roppen Transportation Statutory Offices - Bihar & UP Batch"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Raw Sheet Content (Ctrl+V directly from Excel or Google Sheets)
              </label>
              <textarea
                rows={10}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste whole copied columns or text here directly..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveClipboard}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/20"
            >
              📥 Save Raw Payload to Dropbox
            </button>
          </div>
        )}

        {/* Tab 2: File Upload */}
        {activeTab === 'upload' && (
          <div className="flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Optional Custom Note / Label
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. November statutory office addresses export"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-950 transition-colors">
              <span className="text-4xl mb-3">📁</span>
              <span className="text-sm font-bold text-white mb-1">
                Upload Raw File into Vault
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Accepts .csv, .tsv, .xlsx exports, .txt, .json
              </span>
              <input
                type="file"
                accept=".csv,.tsv,.txt,.json,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Tab 3: Staged Payloads List & Inspector */}
        {activeTab === 'history' && (
          <div className="flex-1 flex overflow-hidden border border-slate-800 rounded-xl">
            {/* List */}
            <div className="w-1/2 border-r border-slate-800 flex flex-col bg-slate-950">
              <div className="p-3 border-b border-slate-800 text-xs font-semibold text-slate-300 flex justify-between">
                <span>Stored Staged Records ({storedPayloads.length})</span>
                <span className="text-[10px] text-slate-500 font-mono">Persistent</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-1">
                {storedPayloads.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No payloads staged yet. Paste or upload data from the tabs above.
                  </div>
                ) : (
                  storedPayloads.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPayload(item)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedPayload?.id === item.id
                          ? 'bg-blue-600/20 border border-blue-500/40'
                          : 'hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs text-white truncate max-w-[200px]">
                          {item.title}
                        </span>
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                          {item.type === 'file_upload' ? 'File' : 'Text'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                        <span>{item.timestamp}</span>
                        {item.fileSize && <span>{item.fileSize}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Viewer */}
            <div className="w-1/2 p-4 flex flex-col justify-between bg-slate-900/40">
              {selectedPayload ? (
                <>
                  <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <div className="font-bold text-xs text-white">{selectedPayload.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {selectedPayload.timestamp} {selectedPayload.fileName ? `• ${selectedPayload.fileName}` : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(selectedPayload.id)}
                        className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        Delete
                      </button>
                    </div>

                    <textarea
                      readOnly
                      rows={14}
                      value={selectedPayload.content}
                      className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-cyan-300 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => handleCopyContent(selectedPayload.content)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Copy Raw
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  Select a payload to view or copy raw contents.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-800 shrink-0 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
