import React, { useState } from 'react';
import { ThreatAnalysis, RiskLevel } from '../types/threat';
import { History, Download, Trash2, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface ScanHistoryProps {
  history: ThreatAnalysis[];
  onSelectScan: (scan: ThreatAnalysis) => void;
  onClearHistory: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onSelectScan,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<RiskLevel | 'all'>('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.riskLevel === filter;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `linkshield-history-${Date.now()}.json`);
    dlAnchor.click();
  };

  const handleExportCsv = () => {
    if (history.length === 0) return;
    const headers = ['Timestamp', 'URL', 'Score', 'Level', 'Verdict', 'Brand', 'AttackType'];
    const rows = history.map((h) => [
      `"${h.timestamp}"`,
      `"${h.url}"`,
      h.riskScore,
      h.riskLevel,
      `"${h.verdict}"`,
      `"${h.targetBrand || 'None'}"`,
      `"${h.attackType}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', encodeURI(csvContent));
    dlAnchor.setAttribute('download', `linkshield-history-${Date.now()}.csv`);
    dlAnchor.click();
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'dangerous':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />;
      case 'suspicious':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'low':
        return <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />;
      case 'safe':
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>Inspection Audit History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Locally stored audit logs of recent phishing detections and analyses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800/80 w-fit">
        {(['all', 'dangerous', 'suspicious', 'safe'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-3 py-1 text-xs font-mono-code rounded transition-all cursor-pointer ${
              filter === lvl
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lvl.toUpperCase()}
          </button>
        ))}
      </div>

      {filteredHistory.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          No audit entries found in history.
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase border ${
                      item.riskLevel === 'dangerous'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                        : item.riskLevel === 'suspicious'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                    }`}
                  >
                    {getRiskIcon(item.riskLevel)}
                    <span>{item.riskScore}/100</span>
                  </span>

                  {item.targetBrand && (
                    <span className="text-xs font-semibold text-rose-400">
                      Impersonating {item.targetBrand}
                    </span>
                  )}

                  <span className="text-[11px] text-slate-500 font-mono-code">
                    {new Date(item.timestamp).toLocaleTimeString()} · {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div className="font-mono-code text-xs text-slate-200 truncate">
                  {item.url}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {item.verdict} — {item.summary}
                </p>
              </div>

              <button
                onClick={() => onSelectScan(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-center"
              >
                <span>View Full Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
