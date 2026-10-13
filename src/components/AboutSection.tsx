import React from 'react';
import { Shield, Eye, Lock, Globe, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Column: Mission & Narrative */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono-code text-cyan-300">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>About LinkShield AI</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Defending Users Against Deceptive Web Links
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Phishing remains the single largest vector for credential theft, ransomware initiation, and business email compromise. Modern attackers no longer rely only on misspelled Nigerian prince emails; they weaponize homoglyphs, brand spoofing on cloud platforms, and lookalike domains that fool even seasoned tech users.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              LinkShield AI was engineered with a clear mandate: empower regular internet users, remote employees, and security teams with an instant, explainable link verification tool that demystifies cyber threats before anyone clicks.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#070e1e] border border-cyan-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Zero Execution Sandbox</strong>
                  <span className="text-slate-400">Links are evaluated without running malware on your device.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070e1e] border border-cyan-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Privacy Guaranteed</strong>
                  <span className="text-slate-400">No user tracking, advertising cookies, or browser telemetry.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Pillars Card */}
          <div className="p-7 sm:p-8 rounded-2xl glass-panel border border-cyan-500/20 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              <span>Our Core Security Pillars</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-cyan-300">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>1. Explainable Threat Intelligence</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  Cybersecurity should never be a black box. LinkShield translates every risk score into straightforward English explanations detailing the exact attack mechanism.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-blue-300">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>2. Multi-Vector Verification</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  By examining syntax, Shannon randomness, top-level domain abuse, and brand keyword masquerading simultaneously, false positives and false negatives are drastically minimized.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-emerald-300">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>3. Safe for Enterprise & Personal Use</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-6">
                  From everyday individuals checking SMS notifications to enterprise SOC analysts auditing incident tickets with exportable reports, LinkShield adapts seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
