import React from 'react';
import { RiskLevel } from '../types/threat';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface RiskScoreGaugeProps {
  score: number;
  level: RiskLevel;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ score, level }) => {
  // SVG circular gauge math
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getTheme = () => {
    switch (level) {
      case 'dangerous':
        return {
          stroke: '#ef4444',
          bgRing: 'stroke-rose-950/40',
          text: 'text-rose-400',
          badgeBg: 'bg-rose-950/60 border-rose-800/80 text-rose-300',
          label: 'Critical Hazard',
          icon: AlertOctagon,
        };
      case 'suspicious':
        return {
          stroke: '#f59e0b',
          bgRing: 'stroke-amber-950/40',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-950/60 border-amber-800/80 text-amber-300',
          label: 'Elevated Threat',
          icon: AlertTriangle,
        };
      case 'low':
        return {
          stroke: '#3b82f6',
          bgRing: 'stroke-blue-950/40',
          text: 'text-blue-400',
          badgeBg: 'bg-blue-950/60 border-blue-800/80 text-blue-300',
          label: 'Minimal Anomaly',
          icon: ShieldCheck,
        };
      case 'safe':
      default:
        return {
          stroke: '#10b981',
          bgRing: 'stroke-emerald-950/40',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300',
          label: 'Verified Benign',
          icon: CheckCircle2,
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-900/90 border border-slate-800 rounded-xl">
      {/* Radial Gauge */}
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
          {/* Background circle track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-slate-800/90"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={theme.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold font-mono-code tracking-tight ${theme.text}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono-code">
            / 100 Score
          </span>
        </div>
      </div>

      {/* Details & Tier Description */}
      <div className="flex-1 text-center sm:text-left space-y-2">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold font-mono-code uppercase tracking-wider rounded border ${theme.badgeBg}`}>
            <Icon className="w-3.5 h-3.5" />
            {theme.label}
          </span>
          <span className="text-xs text-slate-400 font-mono-code">
            {score >= 70 ? 'Action: Block & Evade' : score >= 45 ? 'Action: Inspect & Verify' : 'Action: Safe to Navigate'}
          </span>
        </div>

        <h3 className="text-base font-semibold text-slate-100">
          {level === 'dangerous'
            ? 'High Phishing Risk Identified'
            : level === 'suspicious'
            ? 'Suspicious Structural Inconsistencies'
            : level === 'low'
            ? 'Low Probability of Malicious Intent'
            : 'Authentic Verified Web Destination'}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          {level === 'dangerous'
            ? 'Multiple high-severity vectors detected. Strong likelihood of credential theft or brand impersonation.'
            : level === 'suspicious'
            ? 'Heuristics reveal anomalies such as unverified redirection, uncommon TLD, or lexical obfuscation.'
            : level === 'low'
            ? 'Minor structural traits detected, but baseline domain appears authentic with standard encryption.'
            : 'Domain corresponds to a validated entity with no deceptive subdomains, typosquatting, or cloak mechanics.'}
        </p>

        {/* Threat Spectrum Bar */}
        <div className="pt-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono-code mb-1">
            <span>0 Safe</span>
            <span>45 Suspicious</span>
            <span>100 Critical</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="w-[20%] bg-emerald-500/70" />
            <div className="w-[25%] bg-blue-500/70" />
            <div className="w-[25%] bg-amber-500/70" />
            <div className="w-[30%] bg-rose-500/70" />
          </div>
        </div>
      </div>
    </div>
  );
};
