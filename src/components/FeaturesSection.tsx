import React from 'react';
import { Cpu, ShieldAlert, FileText, Zap, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered URL Analysis',
      badge: 'Gemini 3.8 Flash',
      description:
        'Leverages multimodal cybersecurity reasoning to evaluate semantic context, brand mimicry, and deceptive psychological urgency hooks that traditional static blocklists overlook.',
      accent: 'text-cyan-400',
      borderGlow: 'hover:border-cyan-500/40',
    },
    {
      icon: ShieldAlert,
      title: 'Suspicious Pattern Detection',
      badge: 'Multi-Vector Heuristics',
      description:
        'Exposes typosquatting, lookalike Cyrillic homoglyphs, deep subdomain chaining, raw numeric IP hosts, and disposable high-risk TLDs (.xyz, .top, .click) before navigation.',
      accent: 'text-blue-400',
      borderGlow: 'hover:border-blue-500/40',
    },
    {
      icon: FileText,
      title: 'Explainable Risk Indicators',
      badge: 'Zero Jargon Breakdown',
      description:
        'Translates complex threat telemetry into clear, human-understandable verdicts for everyday users, alongside deep technical indicators and copyable SOC incident reports.',
      accent: 'text-emerald-400',
      borderGlow: 'hover:border-emerald-500/40',
    },
    {
      icon: Zap,
      title: 'Fast Analysis Results',
      badge: '< 800ms Latency',
      description:
        'Optimized server-side execution pairs deterministic lexical pre-checks with sub-second AI inference, delivering instantaneous risk scores from 0 (benign) to 100 (critical).',
      accent: 'text-amber-400',
      borderGlow: 'hover:border-amber-500/40',
    },
    {
      icon: Smartphone,
      title: 'Mobile-Friendly Experience',
      badge: 'Responsive Touch UI',
      description:
        'Engineered for smartphones, tablets, and desktops. Includes 1-tap clipboard paste, QR code quishing inspection, and clear visual indicators tailored for smaller screens.',
      accent: 'text-purple-400',
      borderGlow: 'hover:border-purple-500/40',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 border-t border-slate-800/80 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono-code text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Core Defensive Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive URL Threat Intelligence
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            LinkShield AI inspects the anatomy of suspect web links using a dual-engine approach combining static algorithmic metrics with advanced AI threat reasoning.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-2xl glass-panel ${item.borderGlow} transition-all space-y-4 flex flex-col justify-between group hover:-translate-y-1`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#070e1e] border border-cyan-950 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors shadow-inner">
                      <Icon className={`w-6 h-6 ${item.accent}`} />
                    </div>
                    <span className="text-[11px] font-mono-code font-semibold px-2.5 py-1 rounded-lg bg-[#070e1e] border border-cyan-950 text-slate-400">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Integrated in LinkShield Engine</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
