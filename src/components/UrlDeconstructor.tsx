import React, { useState } from 'react';
import { UrlDeconstructed } from '../types/threat';
import { Network, HelpCircle, Binary, ShieldAlert } from 'lucide-react';

interface UrlDeconstructorProps {
  deconstruction: UrlDeconstructed;
}

export const UrlDeconstructor: React.FC<UrlDeconstructorProps> = ({ deconstruction }) => {
  const [activeSegment, setActiveSegment] = useState<'protocol' | 'subdomain' | 'domain' | 'tld' | 'path' | 'entropy' | null>(null);

  const {
    protocol,
    subdomain,
    registeredDomain,
    tld,
    pathname,
    search,
    isIpAddress,
    hasPunycode,
    entropy,
    length,
  } = deconstruction;

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <Network className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Interactive URL Anatomy & Deconstruction</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono-code">
          <span>Length: {length} chars</span>
          <span aria-hidden="true" className="text-cyan-600">·</span>
          <span>Entropy: <strong className="text-cyan-300">{entropy}</strong> bits</span>
        </div>
      </div>

      <p className="text-xs text-slate-300">
        Attackers manipulate specific URL segments to deceive victims. Select any highlighted segment below to inspect its mechanics:
      </p>

      {/* Visual URL Segment Blocks */}
      <div className="p-4 bg-[#070e1e] border border-cyan-950/80 rounded-xl overflow-x-auto shadow-inner">
        <div className="flex flex-wrap items-baseline font-mono-code text-sm sm:text-base gap-1 select-none">
          {/* Protocol */}
          <button
            onClick={() => setActiveSegment(activeSegment === 'protocol' ? null : 'protocol')}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
              protocol === 'http:'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                : 'bg-slate-800/80 text-emerald-300 hover:bg-slate-700/80'
            } ${activeSegment === 'protocol' ? 'ring-2 ring-emerald-400' : ''}`}
            title="Click to inspect protocol"
          >
            {protocol}//
          </button>

          {/* Subdomain */}
          {subdomain ? (
            <button
              onClick={() => setActiveSegment(activeSegment === 'subdomain' ? null : 'subdomain')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                subdomain.includes('-') || subdomain.split('.').length > 1
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  : 'bg-slate-800/80 text-cyan-300 hover:bg-slate-700/80'
              } ${activeSegment === 'subdomain' ? 'ring-2 ring-amber-400' : ''}`}
              title="Click to inspect subdomain"
            >
              {subdomain}.
            </button>
          ) : null}

          {/* Registered Domain Name */}
          <button
            onClick={() => setActiveSegment(activeSegment === 'domain' ? null : 'domain')}
            className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
              isIpAddress || hasPunycode
                ? 'bg-rose-950/90 text-rose-300 border border-rose-700'
                : 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
            } ${activeSegment === 'domain' ? 'ring-2 ring-indigo-400' : ''}`}
            title="Click to inspect registered root domain"
          >
            {registeredDomain.split('.')[0]}
          </button>

          {/* Top-Level Domain (TLD) */}
          <button
            onClick={() => setActiveSegment(activeSegment === 'tld' ? null : 'tld')}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
              ['xyz', 'top', 'click', 'work', 'icu', 'tk'].includes(tld)
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                : 'bg-slate-800/80 text-purple-300 hover:bg-slate-700/80'
            } ${activeSegment === 'tld' ? 'ring-2 ring-purple-400' : ''}`}
            title="Click to inspect top-level domain"
          >
            .{tld}
          </button>

          {/* Path & Query */}
          {(pathname !== '/' || search) && (
            <button
              onClick={() => setActiveSegment(activeSegment === 'path' ? null : 'path')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 ${
                activeSegment === 'path' ? 'ring-2 ring-slate-400 text-slate-100' : ''
              }`}
              title="Click to inspect path and parameters"
            >
              {pathname}
              {search}
            </button>
          )}
        </div>
      </div>

      {/* Segment Explanation Box */}
      <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-3.5 text-xs space-y-1.5">
        {activeSegment === 'protocol' && (
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Protocol Analysis: {protocol}</span>
            </div>
            <p className="text-slate-300">
              {protocol === 'https:'
                ? 'Traffic is encrypted via TLS/SSL. However, having HTTPS does NOT prove a website is safe; over 80% of modern phishing sites obtain free valid SSL certificates.'
                : 'CRITICAL: Unencrypted HTTP connection. Any data or passwords entered here are transmitted in plain text across the network.'}
            </p>
          </div>
        )}

        {activeSegment === 'subdomain' && (
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Subdomain Analysis: {subdomain || 'None'}</span>
            </div>
            <p className="text-slate-300">
              Attackers frequently create deceptive subdomains like <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200">paypal.auth-portal.com</code> to trick users who only read the beginning of the domain name. The actual website owner is always determined by the registered root domain, NOT the subdomain.
            </p>
          </div>
        )}

        {activeSegment === 'domain' && (
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-indigo-400 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Registered Domain Analysis: {registeredDomain}</span>
            </div>
            <p className="text-slate-300">
              {isIpAddress
                ? 'CRITICAL: Hostname is a raw numeric IP address. Authentic corporate brands never direct legitimate users to raw IP addresses.'
                : hasPunycode
                ? 'CRITICAL: Internationalized punycode detected. Attackers use lookalike Cyrillic letters (e.g. Cyrillic "а" instead of Latin "a") to build spoofed identical-looking URLs.'
                : `This is the authoritative legal entity that owns this website. Always verify this matches the exact official spelling of the organization.`}
            </p>
          </div>
        )}

        {activeSegment === 'tld' && (
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-purple-400 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Top-Level Domain (TLD) Analysis: .{tld}</span>
            </div>
            <p className="text-slate-300">
              TLDs like <code className="bg-slate-800 px-1 py-0.5 rounded text-purple-200">.xyz</code>, <code className="bg-slate-800 px-1 py-0.5 rounded text-purple-200">.top</code>, and <code className="bg-slate-800 px-1 py-0.5 rounded text-purple-200">.click</code> are frequently preferred by cybercriminals due to automated instant registrations and negligible cost.
            </p>
          </div>
        )}

        {activeSegment === 'path' && (
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Path & Query String: {pathname}{search}</span>
            </div>
            <p className="text-slate-300">
              Contains endpoint directories, scripts, or token parameters. Phishing attacks often embed encoded victim email addresses or redirect tokens inside parameters to auto-fill victim credentials.
            </p>
          </div>
        )}

        {!activeSegment && (
          <div className="flex items-center gap-2 text-slate-400">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Select any colored segment above (Protocol, Subdomain, Domain, TLD, Path) to view specific risk mechanics.</span>
          </div>
        )}
      </div>

      {/* Lexical Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
          <div className="text-slate-400 mb-1 flex items-center gap-1">
            <Binary className="w-3.5 h-3.5 text-cyan-400" />
            <span>Shannon Entropy</span>
          </div>
          <span className="font-mono-code font-bold text-slate-100 text-sm">{entropy}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{entropy > 4.0 ? 'Elevated (Randomized)' : 'Normal distribution'}</span>
        </div>

        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
          <div className="text-slate-400 mb-1">Host Format</div>
          <span className="font-mono-code font-bold text-slate-100 text-sm">
            {isIpAddress ? 'Raw IP' : 'FQDN Domain'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isIpAddress ? 'High risk' : 'Standard DNS name'}
          </span>
        </div>

        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
          <div className="text-slate-400 mb-1">Punycode / Homograph</div>
          <span className="font-mono-code font-bold text-slate-100 text-sm">
            {hasPunycode ? 'Detected' : 'Clean (ASCII)'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {hasPunycode ? 'Spoof risk' : 'No Cyrillic spoof'}
          </span>
        </div>

        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
          <div className="text-slate-400 mb-1">Subdomain Depth</div>
          <span className="font-mono-code font-bold text-slate-100 text-sm">
            {subdomain ? subdomain.split('.').length : 0} Level(s)
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {subdomain && subdomain.split('.').length > 2 ? 'Deep chaining' : 'Standard'}
          </span>
        </div>
      </div>
    </div>
  );
};
