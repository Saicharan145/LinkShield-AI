import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { UrlInputBar } from './components/UrlInputBar';
import { PresetScenarios } from './components/PresetScenarios';
import { ThreatAnalysisResult } from './components/ThreatAnalysisResult';
import { ScanLoadingState } from './components/ScanLoadingState';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutSection } from './components/AboutSection';
import { BatchScanner } from './components/BatchScanner';
import { QuishingInspector } from './components/QuishingInspector';
import { ScanHistory } from './components/ScanHistory';
import { PhishingDefenseGuide } from './components/PhishingDefenseGuide';
import { ReportModal } from './components/ReportModal';
import { PolicyModals } from './components/PolicyModals';
import { Footer } from './components/Footer';
import { ThreatAnalysis } from './types/threat';
import { ShieldCheck, Lock, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

const STORAGE_KEY = 'linkshield_scan_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'batch' | 'quishing' | 'history' | 'guide'>('scanner');
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tracing, setTracing] = useState<boolean>(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ThreatAnalysis | null>(null);
  const [scanHistory, setScanHistory] = useState<ThreatAnalysis[]>([]);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scannerRef = useRef<HTMLDivElement>(null);

  // Load scan history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setScanHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Could not load history from storage:', err);
    }
  }, []);

  const saveToHistory = (analysis: ThreatAnalysis) => {
    setScanHistory((prev) => {
      const updated = [analysis, ...prev.filter((i) => i.url !== analysis.url)].slice(0, 50);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history to storage:', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setScanHistory([]);
  };

  const handleFocusScanner = () => {
    setActiveTab('scanner');
    setTimeout(() => {
      scannerRef.current?.scrollIntoView({ behavior: 'smooth' });
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  };

  const handleAnalyzeUrl = async (urlToAnalyze?: string) => {
    const target = (urlToAnalyze || url).trim();
    if (!target) return;

    setLoading(true);
    setErrorMessage(null);

    // Switch to scanner view
    setActiveTab('scanner');
    if (urlToAnalyze) {
      setUrl(urlToAnalyze);
    }

    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server inspection failed.');
      }

      const data: ThreatAnalysis = await res.json();
      setCurrentAnalysis(data);
      saveToHistory(data);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(err.message || 'Unable to complete link security scan.');
    } finally {
      setLoading(false);
    }
  };

  const handleTraceShortener = async (shortUrl: string) => {
    setTracing(true);
    try {
      const res = await fetch('/api/expand-shortener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: shortUrl }),
      });
      const data = await res.json();
      if (data.resolvedUrl && data.resolvedUrl !== shortUrl) {
        setUrl(data.resolvedUrl);
        await handleAnalyzeUrl(data.resolvedUrl);
      }
    } catch (err) {
      console.warn('Could not unshorten link:', err);
    } finally {
      setTracing(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setUrl('');
    setCurrentAnalysis(null);
    setErrorMessage(null);
    handleFocusScanner();
  };

  const handleNavigateSection = (id: string) => {
    setActiveTab('scanner');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#060b17] text-slate-100 cyber-canvas-bg flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCheckLinkClick={handleFocusScanner}
        scanCount={scanHistory.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {activeTab === 'scanner' ? (
          <>
            {/* HERO SECTION */}
            <section id="home" className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono-code text-cyan-300 shadow-sm shadow-cyan-950/40">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <span>AI-Powered Cybersecurity Platform</span>
                </div>

                {/* Primary Requested Headline */}
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  Think Before You{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                    Click.
                  </span>
                </h1>

                {/* Supporting Text */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                  Analyze suspicious links and understand potential phishing risks before visiting a website.
                </p>
              </div>

              {/* URL Input Anchor & Scanner Bar */}
              <div ref={scannerRef} className="max-w-4xl mx-auto space-y-3">
                <UrlInputBar
                  url={url}
                  setUrl={setUrl}
                  onAnalyze={() => handleAnalyzeUrl()}
                  loading={loading}
                />

                {/* Small Privacy & Security Disclaimer */}
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center px-2">
                  <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>
                    Privacy & Security Disclaimer: Scanned in a secure, isolated sandbox. Links are never executed and no personal data is tracked or shared.
                  </span>
                </div>

                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="mt-3 p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg shadow-rose-950/40 animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Scanning Telemetry Radar State */}
              {loading && (
                <div className="max-w-4xl mx-auto animate-fadeIn">
                  <ScanLoadingState url={url} />
                </div>
              )}

              {/* Threat Analysis Results */}
              {!loading && currentAnalysis && (
                <div className="max-w-5xl mx-auto">
                  <ThreatAnalysisResult
                    analysis={currentAnalysis}
                    onOpenReportModal={() => setReportModalOpen(true)}
                    onTraceShortener={handleTraceShortener}
                    tracing={tracing}
                    onAnalyzeAnother={handleAnalyzeAnother}
                  />
                </div>
              )}

              {/* 1-Click Real-World Attack Scenarios */}
              <div className="max-w-5xl mx-auto pt-6 border-t border-slate-800/80">
                <PresetScenarios
                  onSelectScenario={(presetUrl) => handleAnalyzeUrl(presetUrl)}
                  disabled={loading}
                />
              </div>
            </section>

            {/* FEATURES SECTION */}
            <FeaturesSection />

            {/* HOW IT WORKS SECTION */}
            <HowItWorksSection onTryNow={handleFocusScanner} />

            {/* ABOUT SECTION */}
            <AboutSection />
          </>
        ) : activeTab === 'batch' ? (
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
            <BatchScanner
              onInspectSingleUrl={(batchUrl) => {
                setUrl(batchUrl);
                handleAnalyzeUrl(batchUrl);
              }}
            />
          </div>
        ) : activeTab === 'quishing' ? (
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
            <QuishingInspector
              onAnalyzeUrl={(qrUrl) => {
                setUrl(qrUrl);
                handleAnalyzeUrl(qrUrl);
              }}
            />
          </div>
        ) : activeTab === 'history' ? (
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
            <ScanHistory
              history={scanHistory}
              onSelectScan={(item) => {
                setCurrentAnalysis(item);
                setUrl(item.url);
                setActiveTab('scanner');
              }}
              onClearHistory={handleClearHistory}
            />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
            <PhishingDefenseGuide
              onTestUrl={(testUrl) => {
                setUrl(testUrl);
                handleAnalyzeUrl(testUrl);
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setPolicyModal('privacy')}
        onOpenTerms={() => setPolicyModal('terms')}
        onNavigateSection={handleNavigateSection}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* SOC Incident Report Modal */}
      {reportModalOpen && currentAnalysis && (
        <ReportModal
          analysis={currentAnalysis}
          onClose={() => setReportModalOpen(false)}
        />
      )}

      {/* Privacy Policy & Terms of Use Modal */}
      {policyModal && (
        <PolicyModals
          type={policyModal}
          onClose={() => setPolicyModal(null)}
        />
      )}
    </div>
  );
}
