import React, { useState } from 'react';
import { QrCode, ShieldAlert, AlertTriangle, ArrowRight, Scan, HelpCircle, CheckCircle } from 'lucide-react';

interface QuishingInspectorProps {
  onAnalyzeUrl: (url: string) => void;
}

export const QuishingInspector: React.FC<QuishingInspectorProps> = ({ onAnalyzeUrl }) => {
  const [qrUrl, setQrUrl] = useState('');

  const QUISHING_SAMPLES = [
    {
      title: 'Parking Meter Quishing Scam',
      context: 'Stickers placed over legitimate physical municipal parking meters.',
      url: 'https://pay-city-parking-meter.click/checkout?space=491',
      vector: 'Physical Sticker Spoofing + Fake Gateway',
    },
    {
      title: 'Executive MFA Reset Email QR',
      context: 'PDF email attachment with a QR code asking employee to "Resynchronize Microsoft Authenticator".',
      url: 'https://login.microsoftonline.account-confirm.work/auth/mfa-sync',
      vector: 'Email Filter Bypass + Credential Trap',
    },
    {
      title: 'USPS Package Delivery Fee Scam',
      context: 'Physical card dropped in mailbox claiming package customs fee is owed.',
      url: 'https://usps-redelivery-portal.xyz/pay-customs-fee',
      vector: 'Physical Mail Delivery Impersonation',
    },
  ];

  const handleTestSample = (sampleUrl: string) => {
    setQrUrl(sampleUrl);
    onAnalyzeUrl(sampleUrl);
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>QR Code Phishing ("Quishing") Threat Inspector</span>
              <span className="text-[10px] font-mono-code bg-purple-950/80 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded">
                High Growth Threat
              </span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cybercriminals exploit QR codes because humans cannot visually parse the destination URL before scanning. Attackers place stickers on parking meters, restaurants, or send QR images in emails to bypass enterprise email security filters.
            </p>
          </div>
        </div>

        {/* Input box */}
        <div className="pt-2 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Enter the URL decoded from any QR code scanner:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={qrUrl}
              onChange={(e) => setQrUrl(e.target.value)}
              placeholder="e.g. https://pay-city-parking-meter.click/checkout"
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
            />
            <button
              onClick={() => qrUrl.trim() && onAnalyzeUrl(qrUrl.trim())}
              disabled={!qrUrl.trim()}
              className="flex items-center justify-center gap-1.5 px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md shadow-purple-600/20"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Inspect QR Destination</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-world Quishing Scenarios */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-purple-400" />
          <span>Real-World Quishing Campaign Presets (Click to Inspect)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUISHING_SAMPLES.map((sample, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3"
            >
              <div>
                <span className="text-[10px] font-mono-code text-purple-300 bg-purple-950/60 border border-purple-800/60 px-1.5 py-0.5 rounded block w-fit mb-2">
                  {sample.vector}
                </span>
                <h4 className="text-xs font-bold text-slate-100 mb-1">{sample.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  {sample.context}
                </p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono-code text-[11px] text-slate-300 break-all">
                  {sample.url}
                </div>
              </div>

              <button
                onClick={() => handleTestSample(sample.url)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <span>Analyze with LinkShield</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Defense Checklist for QR Codes */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Rules for Scanning Physical QR Codes safely</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-100 block">1. Check for Overlaid Physical Stickers</span>
            <p className="text-slate-400">
              Run your finger across physical QR codes at kiosks or parking meters. If you feel a raised sticker placed over the real plaque, do not scan it.
            </p>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-100 block">2. Preview URL Before Confirming Opening</span>
            <p className="text-slate-400">
              Your smartphone camera app displays the domain banner before navigating. Check the registered root domain, not just the path.
            </p>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-100 block">3. Beware of Corporate Login QR Codes</span>
            <p className="text-slate-400">
              Authentic IT helpdesks almost never ask you to scan a QR code in an email to "upgrade your inbox" or "re-verify credentials".
            </p>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-100 block">4. Never Download Apps From QR Codes</span>
            <p className="text-slate-400">
              Always install mobile banking or parking apps directly through the official Apple App Store or Google Play Store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
