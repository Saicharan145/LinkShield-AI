import React from 'react';
import { Clipboard, Search, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksSectionProps {
  onTryNow: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onTryNow }) => {
  const steps = [
    {
      number: '01',
      title: 'Paste a URL',
      subtitle: 'Input any suspect address',
      description:
        'Copy any link received via email, text message (SMS smishing), QR code, or social media and paste it into LinkShield AI’s scanner without clicking it in your browser.',
      icon: Clipboard,
      accent: 'from-blue-600 to-cyan-500',
    },
    {
      number: '02',
      title: 'Analyze Its Characteristics',
      subtitle: 'Real-time multi-vector deconstruction',
      description:
        'LinkShield deconstructs the domain anatomy in an isolated environment. It evaluates Shannon entropy, homoglyph lookalikes, TLD reputation, and queries Gemini 3.8 AI threat intelligence.',
      icon: Search,
      accent: 'from-cyan-500 to-teal-400',
    },
    {
      number: '03',
      title: 'Review Risk Assessment & Warnings',
      subtitle: 'Decisive scoring and clear guidance',
      description:
        'Receive an instant risk score from 0 to 100, identify impersonated brands (e.g. PayPal, Chase, Microsoft), review plain-English explanations, and follow actionable defensive next steps.',
      icon: ShieldCheck,
      accent: 'from-teal-400 to-emerald-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-t border-slate-800/80 bg-[#070d1c]/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono-code text-cyan-300">
            <span>Streamlined Workflow</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How LinkShield AI Protects You
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Verify links in three simple steps before they ever have a chance to touch your device or compromise your credentials.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl glass-panel glass-panel-hover transition-all flex flex-col justify-between space-y-5 relative group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-black font-mono-code text-transparent bg-clip-text bg-gradient-to-r ${s.accent}`}>
                      {s.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#070e1e] border border-cyan-950 flex items-center justify-center text-cyan-300 shadow-inner group-hover:border-cyan-400/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {s.title}
                    </h3>
                    <span className="text-xs font-mono-code text-cyan-400/90 block mt-0.5">
                      {s.subtitle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero execution risk</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0b1b36] to-cyan-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-white">
              Have a suspicious link in your clipboard right now?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Run an instant security scan with LinkShield AI in under a second.
            </p>
          </div>

          <button
            onClick={onTryNow}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/25 cursor-pointer shrink-0"
          >
            <span>Scan a Link Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
