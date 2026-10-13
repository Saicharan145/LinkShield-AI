import React, { useState } from 'react';
import { ThreatAnalysis, ThreatIndicator } from '../types/threat';
import { RiskScoreGauge } from './RiskScoreGauge';
import { UrlDeconstructor } from './UrlDeconstructor';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Search,
  Info,
  CheckCircle,
  Copy,
  Check,
  FileText,
  ExternalLink,
  Cpu,
  Terminal,
  Zap,
} from 'lucide-react';

interface ThreatAnalysisResultProps {
  analysis: ThreatAnalysis;
  onOpenReportModal: () => void;
  onTraceShortener: (url: string) => Promise<void>;
  tracing: boolean;
  onAnalyzeAnother?: () => void;
}

export const ThreatAnalysisResult: React.FC<ThreatAnalysisResultProps> = ({
  analysis,
  onOpenReportModal,
  onTraceShortener,
  tracing,
  onAnalyzeAnother,
}) => {
  const [copiedResults, setCopiedResults] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const {
    url,
    riskScore,
    riskLevel,
    verdict,
    targetBrand,
    attackType,
    summary,
    plainEnglishExplanation,
    technicalDetails,
    indicators,
    recommendations,
    deconstruction,
    latencyMs,
    aiAssisted,
  } = analysis;

  // Determine standardized 3-tier risk classification as requested:
  // "Potentially Phishing", "Suspicious", or "No Warning Indicators Found"
  const classification: 'Potentially Phishing' | 'Suspicious' | 'No Warning Indicators Found' =
    analysis.riskClassification ||
    (riskScore >= 65 || riskLevel === 'dangerous'
      ? 'Potentially Phishing'
      : riskScore >= 30 || riskLevel === 'suspicious'
      ? 'Suspicious'
      : 'No Warning Indicators Found');

  // Determine standardized 3-tier risk level: "High", "Medium", or "Lower"
  const riskLevelDisplay: 'High' | 'Medium' | 'Lower' =
    analysis.riskLevelTier ||
    (classification === 'Potentially Phishing'
      ? 'High'
      : classification === 'Suspicious'
      ? 'Medium'
      : 'Lower');

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyResults = () => {
    const text = `=========================================
LINKSHIELD AI — URL ANALYSIS REPORT
=========================================
Submitted URL: ${url}
Overall Risk Classification: ${classification}
Risk Level: ${riskLevelDisplay} (Score: ${riskScore}/100)
Verdict: ${verdict}
Target Brand: ${targetBrand || 'None detected'}

Summary:
${summary}

Suspicious Characteristics Detected (${indicators.length}):
${indicators.map((ind, idx) => `${idx + 1}. [${ind.severity.toUpperCase()}] ${ind.name}: ${ind.description}`).join('\n')}

Recommended Next Steps:
${recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}
=========================================`;

    navigator.clipboard.writeText(text);
    setCopiedResults(true);
    setTimeout(() => setCopiedResults(false), 2000);
  };

  const filteredIndicators = indicators.filter((ind) => {
    if (selectedFilter === 'all') return true;
    return ind.severity === selectedFilter;
  });

  const getSeverityBadge = (sev: ThreatIndicator['severity']) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/80';
      case 'high':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      case 'medium':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-800/80';
      case 'low':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/80';
      case 'info':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Primary Overview & Control Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-7 transition-all glass-panel ${
          classification === 'Potentially Phishing'
            ? 'border-rose-500/50 shadow-2xl shadow-rose-950/40 bg-gradient-to-b from-[#180915]/95 to-[#0b1329]/95'
            : classification === 'Suspicious'
            ? 'border-amber-500/50 shadow-2xl shadow-amber-950/40 bg-gradient-to-b from-[#191408]/95 to-[#0b1329]/95'
            : 'border-emerald-500/50 shadow-2xl shadow-emerald-950/40 bg-gradient-to-b from-[#06171b]/95 to-[#0b1329]/95'
        }`}
      >
        {/* Top Header: Submitted URL bar with Copy button */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#060b17]/90 border border-cyan-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Submitted URL:
            </span>
            <span className="font-mono-code text-xs sm:text-sm text-cyan-300 truncate font-semibold select-all">
              {url}
            </span>
          </div>
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            title="Copy submitted URL"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'URL Copied' : 'Copy URL'}</span>
          </button>
        </div>

        {/* Classification & Visual Risk Indicator Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-3">
            {/* Visual Risk Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Overall Risk Classification Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono-code text-xs font-black uppercase tracking-wider ${
                  classification === 'Potentially Phishing'
                    ? 'bg-rose-950/90 border-rose-600 text-rose-200 shadow-sm shadow-rose-950'
                    : classification === 'Suspicious'
                    ? 'bg-amber-950/90 border-amber-600 text-amber-200 shadow-sm shadow-amber-950'
                    : 'bg-emerald-950/90 border-emerald-600 text-emerald-200 shadow-sm shadow-emerald-950'
                }`}
              >
                {classification === 'Potentially Phishing' ? (
                  <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
                ) : classification === 'Suspicious' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
                <span>Classification: {classification}</span>
              </div>

              {/* Risk Level Badge: High / Medium / Lower */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono-code text-xs font-bold uppercase tracking-wider ${
                  riskLevelDisplay === 'High'
                    ? 'bg-rose-900/60 border-rose-700/80 text-rose-300'
                    : riskLevelDisplay === 'Medium'
                    ? 'bg-amber-900/60 border-amber-700/80 text-amber-300'
                    : 'bg-emerald-900/60 border-emerald-700/80 text-emerald-300'
                }`}
              >
                <span>Risk Level: {riskLevelDisplay}</span>
              </div>

              {aiAssisted && (
                <span className="flex items-center gap-1 text-[11px] font-mono-code text-cyan-300 bg-cyan-950/70 border border-cyan-800/70 px-2.5 py-1 rounded-lg">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Gemini 3.8 Intelligence
                </span>
              )}
            </div>

            {/* Verdict Headline & Summary */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {verdict}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl pt-1">
                {summary}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Button to Analyze Another URL */}
            {onAnalyzeAnother && (
              <button
                onClick={onAnalyzeAnother}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/80 transition-all cursor-pointer shadow-sm hover:border-cyan-400"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Analyze Another URL</span>
              </button>
            )}

            {/* Copyable Results Button */}
            <button
              onClick={handleCopyResults}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all cursor-pointer hover:border-cyan-500/40"
            >
              {copiedResults ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedResults ? 'Results Copied!' : 'Copy Results'}</span>
            </button>

            {/* SOC Incident Report */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:brightness-110 text-slate-950 transition-all cursor-pointer shadow-md shadow-cyan-500/25"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>SOC Incident Report</span>
            </button>

            {/* Shortener Expansion */}
            {(deconstruction.hostname.includes('bit.ly') || deconstruction.hostname.includes('tinyurl')) && (
              <button
                onClick={() => onTraceShortener(url)}
                disabled={tracing}
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                <span>{tracing ? 'Tracing...' : 'Unshorten Link'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Brand Impersonation Alert Banner if detected */}
        {targetBrand && riskLevel !== 'safe' && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-900/50 text-rose-300 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-200">
                  Target Brand Mimicry Detected: {targetBrand}
                </h4>
                <p className="text-xs text-rose-300/90 mt-0.5">
                  This page attempts to visually pass as <strong className="text-white">{targetBrand}</strong>, but the registered domain is <code className="bg-rose-950 px-1 py-0.5 rounded text-white font-mono-code">{deconstruction.registeredDomain}</code>.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] text-slate-400 block font-mono-code">Legitimate official portal:</span>
              <span className="text-xs font-bold text-emerald-400 font-mono-code underline flex items-center gap-1 justify-end">
                Official {targetBrand} Site
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}

        {/* Risk Score Gauge & High-level details */}
        <div className="mt-5">
          <RiskScoreGauge score={riskScore} level={riskLevel} />
        </div>
      </div>

      {/* Plain-English Explanation Section */}
      <div className="p-6 rounded-2xl glass-panel space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Plain-English Threat Assessment</h3>
          <span className="text-xs text-slate-400 font-mono-code">(For Non-Technical Users)</span>
        </div>
        <div className="p-4 rounded-xl bg-[#070e1e]/80 border border-cyan-900/30 text-slate-200 text-xs sm:text-sm leading-relaxed">
          {plainEnglishExplanation}
        </div>
      </div>

      {/* Interactive URL Breakdown */}
      <UrlDeconstructor deconstruction={deconstruction} />

      {/* Suspicious Characteristics Detected Section */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Suspicious Characteristics Detected</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Examining HTTPS encryption, URL length, IP hostnames, sensitive keywords (login, verify, password, account, claim), subdomains, hyphens, @ structures, and domain extensions.
            </p>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#070e1e] rounded-xl border border-cyan-950/80 shrink-0">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedFilter(lvl)}
                className={`px-3 py-1 text-xs font-mono-code font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedFilter === lvl
                    ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Anti-False-Positive Policy Reassurance */}
        <div className="p-3.5 rounded-xl bg-[#070e1e] border border-cyan-950/80 text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Balanced Threat Evaluation:</strong> LinkShield AI does not automatically classify a URL as malicious solely because it lacks HTTPS, contains a suspicious word, or uses an unfamiliar domain extension. Isolated traits remain Medium or Lower risk unless compounding attack indicators or brand impersonation are detected.
          </span>
        </div>

        {filteredIndicators.length === 0 ? (
          <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-200">No Warning Indicators Found</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              This address exhibits clean structure with no anomalies across SSL/TLS encryption, registered domain name conventions, subdomains, or redirection mechanisms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredIndicators.map((ind) => (
              <div
                key={ind.id}
                className="p-4 rounded-xl bg-[#070e1e]/90 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-slate-200 line-clamp-1">
                    {ind.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${getSeverityBadge(
                      ind.severity
                    )}`}
                  >
                    {ind.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {ind.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technical SOC Assessment & Recommended Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical SOC Details */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Technical Security Breakdown</h3>
          </div>

          <div className="space-y-2.5 text-xs font-mono-code">
            <div className="p-3 rounded-xl bg-[#070e1e] border border-cyan-950/60">
              <span className="text-cyan-400/90 block mb-1">Domain Verification:</span>
              <span className="text-slate-200">{technicalDetails.domainAnalysis}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#070e1e] border border-cyan-950/60">
              <span className="text-cyan-400/90 block mb-1">Protocol & Ports:</span>
              <span className="text-slate-200">{technicalDetails.protocolAssessment}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#070e1e] border border-cyan-950/60">
              <span className="text-cyan-400/90 block mb-1">Reputation & Threat Feeds:</span>
              <span className="text-slate-200">{technicalDetails.reputationNotes}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#070e1e] border border-cyan-950/60">
              <span className="text-cyan-400/90 block mb-1">Entropy Measurement:</span>
              <span className="text-slate-200">{technicalDetails.entropyAssessment}</span>
            </div>
          </div>
        </div>

        {/* Recommended Next Steps Checklist */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Recommended Next Steps</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#070e1e]/90 border border-slate-800/80 flex items-start gap-3 hover:border-emerald-500/30 transition-all"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono-code font-bold text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-slate-300 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
