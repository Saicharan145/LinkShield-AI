import React, { useState } from 'react';
import { Layers, AlertOctagon, AlertTriangle, CheckCircle2, ArrowRight, Download, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { ThreatAnalysis } from '../types/threat';

interface BatchScannerProps {
  onInspectSingleUrl: (url: string) => void;
}

export const BatchScanner: React.FC<BatchScannerProps> = ({ onInspectSingleUrl }) => {
  const [inputUrls, setInputUrls] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePhishingBatch = [
    'https://paypa1-security-verification.xyz/login/verify',
    'https://login.microsoftonline.account-confirm.work/auth',
    'https://chase-banking-support-update.click/secure/verify-card',
    'http://185.193.66.42:8080/online-banking/signin',
    'https://bit.ly/appleid-account-suspended-urgent',
    'https://github.com/torvalds/linux',
    'https://en.wikipedia.org/wiki/Computer_security',
  ].join('\n');

  const handleRunBatch = async () => {
    const urls = inputUrls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      setError('Please enter at least one URL to scan.');
      return;
    }

    if (urls.length > 10) {
      setError('Batch limit is 10 URLs per scan.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/batch-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });

      if (!response.ok) {
        throw new Error('Batch analysis failed');
      }

      const data = await response.json();
      setResults(data.scans || []);
    } catch (err: any) {
      setError(err.message || 'Failed to execute batch scan.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!results || results.length === 0) return;
    const headers = ['URL', 'Score', 'Risk Level', 'Verdict', 'Target Brand', 'Attack Type', 'Indicators Count'];
    const rows = results.map((r) => [
      `"${r.url}"`,
      r.riskScore,
      r.riskLevel,
      `"${r.verdict}"`,
      `"${r.targetBrand || 'None'}"`,
      `"${r.attackType}"`,
      r.indicatorsCount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `linkshield-batch-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dangerousCount = results ? results.filter((r) => r.riskLevel === 'dangerous').length : 0;
  const suspiciousCount = results ? results.filter((r) => r.riskLevel === 'suspicious').length : 0;
  const safeCount = results ? results.filter((r) => r.riskLevel === 'safe' || r.riskLevel === 'low').length : 0;

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="p-6 sm:p-7 rounded-2xl glass-panel space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Multi-URL Batch Security Scanner</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Audit up to 10 URLs simultaneously (paste suspicious links from emails, SMS lures, or logs).
            </p>
          </div>

          <button
            onClick={() => setInputUrls(samplePhishingBatch)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 transition-all cursor-pointer self-start sm:self-auto hover:border-cyan-500"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample Threat Batch</span>
          </button>
        </div>

        {/* Textarea for URLs */}
        <div className="space-y-2">
          <textarea
            value={inputUrls}
            onChange={(e) => setInputUrls(e.target.value)}
            rows={5}
            placeholder="Paste URLs here, one per line (max 10 URLs)...&#10;https://example-phish-domain.xyz&#10;https://chase-login-fake.click"
            className="w-full p-3.5 bg-[#070e1e] border border-cyan-950/80 rounded-xl text-xs font-mono-code text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_-5px_rgba(6,182,212,0.2)]"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-400 font-mono-code">
              {inputUrls.split('\n').filter((u) => u.trim().length > 0).length} of 10 URLs entered
            </span>

            <div className="flex items-center gap-2">
              {inputUrls && (
                <button
                  onClick={() => setInputUrls('')}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}

              <button
                onClick={handleRunBatch}
                disabled={loading || !inputUrls.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:brightness-110 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Batch...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    <span>Execute Batch Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Aggregate Scorecards when results available */}
      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block mb-1">Total Analyzed</span>
              <span className="text-2xl font-bold font-mono-code text-slate-100">{results.length}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Multi-vector checks</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-900/50">
              <span className="text-rose-400 block mb-1 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Critical / Phishing</span>
              </span>
              <span className="text-2xl font-bold font-mono-code text-rose-400">{dangerousCount}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Immediate block advised</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/50">
              <span className="text-amber-400 block mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Suspicious / Elevated</span>
              </span>
              <span className="text-2xl font-bold font-mono-code text-amber-400">{suspiciousCount}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Further inspection needed</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/50">
              <span className="text-emerald-400 block mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Benign / Verified</span>
              </span>
              <span className="text-2xl font-bold font-mono-code text-emerald-400">{safeCount}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Standard web patterns</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Batch Inspection Summary</h3>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Report</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Score & Status</th>
                    <th className="py-2.5 px-3">Target URL</th>
                    <th className="py-2.5 px-3">Target Brand</th>
                    <th className="py-2.5 px-3">Attack Category</th>
                    <th className="py-2.5 px-3 text-right">Deep Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {results.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${
                            item.riskLevel === 'dangerous'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                              : item.riskLevel === 'suspicious'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                          }`}
                        >
                          {item.riskScore}/100 {item.riskLevel.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-3 max-w-xs truncate text-slate-300 font-mono-code">
                        {item.url}
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {item.targetBrand ? (
                          <span className="text-rose-400 font-semibold">{item.targetBrand}</span>
                        ) : (
                          <span className="text-slate-400">None detected</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-400 max-w-[180px] truncate">
                        {item.attackType}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onInspectSingleUrl(item.url)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-medium text-emerald-400 hover:text-emerald-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
