import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Binary, Search, CheckCircle2 } from 'lucide-react';

interface ScanLoadingStateProps {
  url: string;
}

export const ScanLoadingState: React.FC<ScanLoadingStateProps> = ({ url }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Deconstructing URL syntax, subdomains & protocol', icon: Search },
    { title: 'Calculating Shannon entropy & lexical distributions', icon: Binary },
    { title: 'Cross-referencing brand impersonation & lookalikes', icon: Shield },
    { title: 'Synthesizing Gemini 3.8 AI threat intelligence', icon: Cpu },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 350);
    const timer2 = setTimeout(() => setCurrentStep(2), 750);
    const timer3 = setTimeout(() => setCurrentStep(3), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl glass-panel border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 space-y-6">
      {/* Radar scanning animation */}
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Concentric radar rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-25" />
          <div className="absolute inset-2 rounded-full border border-blue-500/30" />
          <div className="absolute inset-4 rounded-full border border-cyan-400/40" />

          {/* Center pulsating cyber core */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse">
            <Shield className="w-4 h-4 text-slate-950" />
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Analyzing Threat Vectors
          </h3>
          <p className="text-xs text-slate-400 font-mono-code truncate max-w-md mx-auto mt-1">
            Target: <span className="text-cyan-300">{url}</span>
          </p>
        </div>
      </div>

      {/* Cyber animated progress bar */}
      <div className="w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Verification Steps List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {steps.map((s, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const Icon = s.icon;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all text-xs flex items-center gap-3 ${
                isDone
                  ? 'bg-slate-900/80 border-cyan-500/30 text-slate-200'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-cyan-400/50 text-cyan-200 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 animate-spin'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              <span className="truncate leading-tight font-medium">
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
