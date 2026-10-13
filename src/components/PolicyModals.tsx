import React from 'react';
import { X, Shield, Lock, FileText } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#091124] border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-950/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-cyan-950/80 bg-[#060b17]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {type === 'privacy' ? <Lock className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <h3 className="font-extrabold text-white text-base">
              {type === 'privacy' ? 'LinkShield AI — Privacy Policy' : 'LinkShield AI — Terms of Use'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {type === 'privacy' ? (
            <>
              <h4 className="font-bold text-white text-base">1. Zero-Execution & Data Minimization</h4>
              <p>
                LinkShield AI is architected with a privacy-by-design posture. We evaluate URL strings submitted for security threats without executing harmful client scripts, downloading file payloads, or storing personal browsing sessions.
              </p>

              <h4 className="font-bold text-white text-base">2. Submitted URL Handling</h4>
              <p>
                URLs submitted to the scanner are processed on secure servers to extract lexical components, domain entropy, and brand indicators. Scans are temporarily cached in your local browser storage for your personal audit history and are never sold to data brokers.
              </p>

              <h4 className="font-bold text-white text-base">3. No Tracking Cookies</h4>
              <p>
                We do not employ third-party behavioral tracking cookies, cross-site trackers, or commercial advertising pixels. Your search queries remain confidential.
              </p>

              <h4 className="font-bold text-white text-base">4. Data Deletion</h4>
              <p>
                You can permanently purge your locally cached scan logs at any time by clicking "Clear History" inside the Scan History dashboard.
              </p>
            </>
          ) : (
            <>
              <h4 className="font-bold text-white text-base">1. Service Scope & Educational Intent</h4>
              <p>
                LinkShield AI is provided as an informational cybersecurity threat detection tool designed to help users identify potentially hazardous, spoofed, or phishing URLs.
              </p>

              <h4 className="font-bold text-white text-base">2. Security Disclaimer & Limitation of Liability</h4>
              <p>
                While LinkShield AI uses heuristic and AI-assisted models to detect deceptive links, no automated detection system guarantees 100% identification of all malicious threats, compromised authentic websites, or emerging zero-day vulnerabilities.
              </p>
              <p>
                Users remain solely responsible for exercising prudent security vigilance before submitting sensitive personal, corporate, or financial data to any website.
              </p>

              <h4 className="font-bold text-white text-base">3. Prohibited Usage</h4>
              <p>
                You may not use LinkShield AI to test or optimize malicious phishing campaigns, reverse-engineer proprietary detection algorithms, or launch denial-of-service attempts against our infrastructure.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-cyan-950/80 bg-[#060b17]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
