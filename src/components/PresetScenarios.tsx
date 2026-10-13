import React from 'react';
import { PresetScenario } from '../types/threat';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PresetScenariosProps {
  onSelectScenario: (url: string) => void;
  disabled?: boolean;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'sc-paypal',
    title: 'PayPal Typosquat & Credential Trap',
    category: 'phishing',
    targetBrand: 'PayPal',
    url: 'https://paypa1-security-verification.xyz/login/auth.php?token=938472',
    scenarioDescription: 'Replaces lowercase "l" with digit "1", uses disposable .xyz TLD, and chains urgent security keywords.',
    technique: 'Typosquatting + Credential Harvesting',
  },
  {
    id: 'sc-msft',
    title: 'Microsoft 365 Account Suspension Scam',
    category: 'phishing',
    targetBrand: 'Microsoft',
    url: 'https://login.microsoftonline.account-confirm.work/auth/office365',
    scenarioDescription: 'Pretends to be Microsoft login by planting the brand inside the subdomain while registered domain is account-confirm.work.',
    technique: 'Subdomain Brand Spoofing',
  },
  {
    id: 'sc-chase',
    title: 'Chase Bank SMS Urgent Verification',
    category: 'phishing',
    targetBrand: 'Chase Bank',
    url: 'https://chase-banking-support-update.click/secure/verify-card',
    scenarioDescription: 'Typical smishing lure threatening account lock with high-risk .click TLD and chained hyphens.',
    technique: 'High-Risk TLD + Urgency Lexicon',
  },
  {
    id: 'sc-ip',
    title: 'Direct Numeric IP Address Host',
    category: 'phishing',
    targetBrand: 'Generic Banking',
    url: 'http://185.193.66.42:8080/online-banking/signin',
    scenarioDescription: 'Direct IP address on non-standard port :8080 over plain HTTP with no domain registration.',
    technique: 'Raw IP Obfuscation + Custom Port',
  },
  {
    id: 'sc-shortener',
    title: 'Bitly Hidden Redirection Cloak',
    category: 'suspicious',
    targetBrand: 'Apple ID',
    url: 'https://bit.ly/appleid-account-suspended-urgent',
    scenarioDescription: 'Uses a URL shortener to hide destination server until victim clicks.',
    technique: 'URL Redirection Concealment',
  },
  {
    id: 'sc-legit-github',
    title: 'Legitimate GitHub Repository',
    category: 'safe',
    targetBrand: 'GitHub',
    url: 'https://github.com/torvalds/linux',
    scenarioDescription: 'Official authentic domain with HTTPS, verified DNS, and standard structure.',
    technique: 'Authentic Domain Validation',
  },
  {
    id: 'sc-legit-wiki',
    title: 'Legitimate Wikipedia Reference',
    category: 'safe',
    targetBrand: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Phishing',
    scenarioDescription: 'Official educational encyclopedia domain with authentic SSL and clean subdomains.',
    technique: 'Trusted Non-Profit Domain',
  },
];

export const PresetScenarios: React.FC<PresetScenariosProps> = ({ onSelectScenario, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Real-World Attack & Benign Scenarios (1-Click Test)</span>
        </span>
        <span className="text-[11px] text-slate-400 font-mono-code">Select scenario to trigger live scan</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {PRESET_SCENARIOS.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectScenario(item.url)}
            className="text-left p-4 rounded-xl glass-panel glass-panel-hover transition-all flex flex-col justify-between group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-2">
                <span className="font-bold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {item.title}
                </span>
                {item.category === 'phishing' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                ) : item.category === 'suspicious' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </div>

              <div className="text-[11px] font-mono-code text-cyan-200/90 truncate mb-1.5 bg-[#070e1e] px-2 py-1 rounded-lg border border-cyan-950/70">
                {item.url}
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {item.scenarioDescription}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="font-mono-code text-slate-400">{item.targetBrand}</span>
              <span className="text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all font-semibold flex items-center gap-1">
                <span>Test</span>
                <span>&rarr;</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
