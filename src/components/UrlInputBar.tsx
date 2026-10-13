import React, { useState, useEffect } from 'react';
import { Search, Clipboard, X, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { deconstructUrl } from '../utils/heuristicScanner';

interface UrlInputBarProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export const UrlInputBar: React.FC<UrlInputBarProps> = ({
  url,
  setUrl,
  onAnalyze,
  loading,
}) => {
  const [liveHint, setLiveHint] = useState<{ text: string; color: string } | null>(null);

  // Real-time quick syntactic heuristic hint as user types
  useEffect(() => {
    if (!url.trim()) {
      setLiveHint(null);
      return;
    }

    try {
      const deconstructed = deconstructUrl(url);
      if (deconstructed.isIpAddress) {
        setLiveHint({ text: 'Notice: Numeric IP address host detected', color: 'text-rose-400' });
      } else if (deconstructed.hasPunycode) {
        setLiveHint({ text: 'Warning: Punycode / Cyrillic characters present', color: 'text-rose-400' });
      } else if (['xyz', 'top', 'click', 'work', 'icu', 'tk'].includes(deconstructed.tld)) {
        setLiveHint({ text: `Alert: High-risk TLD (.${deconstructed.tld}) detected`, color: 'text-amber-400' });
      } else if (deconstructed.subdomain && deconstructed.subdomain.includes('-')) {
        setLiveHint({ text: 'Heuristic: Hyphenated subdomain structure', color: 'text-amber-400' });
      } else if (url.includes('@')) {
        setLiveHint({ text: 'Warning: Obfuscated "@" browser credential delimiter', color: 'text-rose-400' });
      } else {
        setLiveHint({ text: `Valid syntax: ${deconstructed.hostname || 'Ready to analyze'}`, color: 'text-slate-400' });
      }
    } catch {
      setLiveHint(null);
    }
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch {
      // Clipboard access might be blocked by browser permissions
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && url.trim()) {
      onAnalyze();
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-[#091124]/90 border border-cyan-500/25 rounded-2xl shadow-2xl shadow-cyan-950/30 focus-within:border-cyan-400 focus-within:shadow-[0_0_30px_-5px_rgba(6,182,212,0.25)] transition-all">
        {/* Input field */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3.5 text-cyan-400/80 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste suspect URL (e.g. https://paypa1-security-update.xyz/login)..."
            disabled={loading}
            className="w-full pl-11 pr-24 py-3 bg-transparent text-sm sm:text-base text-slate-100 placeholder:text-slate-500 font-mono-code focus:outline-none disabled:opacity-50"
          />

          {/* Quick Clear or Paste action buttons inside input */}
          <div className="absolute right-2.5 flex items-center gap-1.5">
            {url ? (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-cyan-300 hover:text-cyan-100 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-all cursor-pointer font-medium"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading || !url.trim()}
          className="flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:via-cyan-400 hover:to-teal-300 active:brightness-95 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/35 cursor-pointer shrink-0"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-slate-950" />
              <span>Analyze Link</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time typing heuristic indicator */}
      {liveHint && (
        <div className="flex items-center justify-between px-3 text-xs font-mono-code pt-0.5">
          <div className="flex items-center gap-2">
            <AlertCircle className={`w-3.5 h-3.5 ${liveHint.color}`} />
            <span className={liveHint.color}>{liveHint.text}</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">Press Enter to analyze</span>
        </div>
      )}
    </div>
  );
};
