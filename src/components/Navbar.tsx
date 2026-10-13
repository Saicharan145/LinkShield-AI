import React, { useState } from 'react';
import { ShieldAlert, Layers, BookOpen, History, QrCode, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeTab: 'scanner' | 'batch' | 'quishing' | 'history' | 'guide';
  setActiveTab: (tab: 'scanner' | 'batch' | 'quishing' | 'history' | 'guide') => void;
  onCheckLinkClick: () => void;
  scanCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onCheckLinkClick,
  scanCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setActiveTab('scanner');
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b border-cyan-500/15 bg-[#060b17]/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveTab('scanner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left cursor-pointer"
            >
              <BrandLogo size="md" />
            </button>

            {/* Desktop Anchor Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <button
                onClick={() => scrollToSection('home')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                About
              </button>
            </nav>
          </div>

          {/* Right Navigation & Tools */}
          <div className="hidden md:flex items-center gap-3">
            {/* Functional Secondary Tools (Zero-Pill segmented) */}
            <div className="flex items-center gap-1 p-1 bg-[#091124] border border-cyan-900/40 rounded-xl">
              <button
                onClick={() => setActiveTab('batch')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'batch'
                    ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-sm border border-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Batch Scan</span>
              </button>

              <button
                onClick={() => setActiveTab('quishing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'quishing'
                    ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-sm border border-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Quishing</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-sm border border-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
                {scanCount > 0 && (
                  <span className="text-[10px] font-mono-code bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-1 py-0.2 rounded-full">
                    {scanCount}
                  </span>
                )}
              </button>
            </div>

            {/* Primary "Check a Link" Action Button */}
            <button
              onClick={onCheckLinkClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-cyan-500/25 hover:shadow-cyan-400/35 cursor-pointer shrink-0"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-slate-950" />
              <span>Check a Link</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onCheckLinkClick}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-extrabold text-xs cursor-pointer"
            >
              Check Link
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-cyan-900/40 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-cyan-950/80 space-y-3 animate-fadeIn">
            <div className="flex flex-col gap-2 text-sm font-medium text-slate-300 px-1">
              <button
                onClick={() => scrollToSection('home')}
                className="text-left py-1.5 px-3 rounded-lg hover:bg-slate-900 hover:text-cyan-400"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-left py-1.5 px-3 rounded-lg hover:bg-slate-900 hover:text-cyan-400"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left py-1.5 px-3 rounded-lg hover:bg-slate-900 hover:text-cyan-400"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left py-1.5 px-3 rounded-lg hover:bg-slate-900 hover:text-cyan-400"
              >
                About
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1 px-1">
              <button
                onClick={() => {
                  setActiveTab('batch');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 text-slate-300"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Batch Scan</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('quishing');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 text-slate-300"
              >
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>QR Quishing</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('history');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 text-slate-300"
              >
                <History className="w-3.5 h-3.5 text-cyan-400" />
                <span>History ({scanCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('guide');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 text-slate-300"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Defense Guide</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
