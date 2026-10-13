import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Shield, AlertTriangle, Lock, FileText, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onNavigateSection: (id: string) => void;
  onSelectTab: (tab: 'scanner' | 'batch' | 'quishing' | 'history' | 'guide') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onNavigateSection,
  onSelectTab,
}) => {
  return (
    <footer className="border-t border-cyan-500/15 bg-[#050914] text-slate-400 text-xs mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & About */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" showSubtitle={false} />
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              LinkShield AI is an intelligent cybersecurity application designed to deconstruct, inspect, and evaluate suspicious URLs before users open them.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono-code text-cyan-400/90">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Multi-vector heuristic & AI defense engine</span>
            </div>
          </div>

          {/* Col 2: Navigation & Sections */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono-code">
              Navigation
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button
                  onClick={() => onNavigateSection('home')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('features')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('how-it-works')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('about')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  About LinkShield
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('guide')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Defense Knowledge Base
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Security Tools & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono-code">
              Security & Legal
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button
                  onClick={() => onSelectTab('batch')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Batch URL Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('quishing')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  QR Code Quishing Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-cyan-400" />
                  <span>Terms of Use</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Disclaimer Box (Explicitly requested by user) */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#070e1e] border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Security & Threat Intelligence Disclaimer</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            LinkShield AI performs heuristic, structural, and artificial intelligence assessments on submitted URL strings. While our engine flags high-probability phishing patterns, typosquatting, and deceptive redirection, no security scanning tool guarantees 100% detection of all zero-day threats or compromised legitimate domains. Always verify authenticity directly with organizations and never disclose passwords, credentials, or two-factor authentication codes on unverified pages.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} LinkShield AI. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash & Server Heuristics</span>
            <span aria-hidden="true">·</span>
            <span>Zero Client Script Execution</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
