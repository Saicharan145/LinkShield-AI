import React from 'react';
import { ShieldAlert, Layers, BookOpen, History, QrCode, Activity } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeTab: 'single' | 'batch' | 'quishing' | 'history' | 'guide';
  setActiveTab: (tab: 'single' | 'batch' | 'quishing' | 'history' | 'guide') => void;
  scanCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, scanCount }) => {
  return (
    <header className="border-b border-cyan-500/15 bg-[#060b17]/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <BrandLogo size="md" />

            {/* SaaS Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-[11px] font-mono-code text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
              <span>Threat Defense Active</span>
            </div>
          </div>

          {/* Navigation Tabs (Functional Segmented Buttons with Electric Blue & Cyan Accents) */}
          <nav className="flex items-center gap-1 p-1 bg-[#091124] border border-cyan-900/40 rounded-xl shadow-inner shadow-black/50 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'single'
                  ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>URL Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'batch'
                  ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Batch Scan</span>
            </button>

            <button
              onClick={() => setActiveTab('quishing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap hidden sm:flex ${
                activeTab === 'quishing'
                  ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              {scanCount > 0 && (
                <span className="text-[10px] font-mono-code bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.2 rounded-full">
                  {scanCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap hidden md:flex ${
                activeTab === 'guide'
                  ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Defense Guide</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
