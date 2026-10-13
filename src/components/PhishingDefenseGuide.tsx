import React, { useState } from 'react';
import { BookOpen, ShieldCheck, AlertTriangle, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface PhishingDefenseGuideProps {
  onTestUrl: (url: string) => void;
}

export const PhishingDefenseGuide: React.FC<PhishingDefenseGuideProps> = ({ onTestUrl }) => {
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<boolean | null>(null);

  const TACTICS = [
    {
      title: '1. Typosquatting & Character Substitution',
      description: 'Attackers register domain names that are slight misspellings or visual lookalikes of popular websites.',
      exampleBad: 'https://paypa1-security.com',
      exampleGood: 'https://www.paypal.com',
      takeaway: 'Notice the digit "1" substituted for the letter "l". Always inspect each letter in the domain carefully.',
    },
    {
      title: '2. Subdomain Masquerading',
      description: 'Attackers prepend the legitimate company name into a subdomain to trick people reading left-to-right.',
      exampleBad: 'https://microsoft.online-verification-support.work',
      exampleGood: 'https://login.microsoftonline.com',
      takeaway: 'The registered root domain is "online-verification-support.work", NOT Microsoft! The domain right before the .tld is the true owner.',
    },
    {
      title: '3. Homoglyph & Punycode Spoofing',
      description: 'Using letters from non-Latin alphabets (like Cyrillic "а" or Greek "о") that look 100% identical on screen.',
      exampleBad: 'https://pаypal.com (uses Cyrillic "а" U+0430)',
      exampleGood: 'https://paypal.com (uses standard Latin "a")',
      takeaway: 'Browsers translate these to "xn--..." punycode strings. LinkShield automatically flags Punycode indicators.',
    },
    {
      title: '4. High-Risk Disposable TLDs',
      description: 'Cybercriminals love ultra-cheap top-level domains like .xyz, .top, .click, and .work for throwaway attack pages.',
      exampleBad: 'https://chase-bank-verify.click',
      exampleGood: 'https://www.chase.com',
      takeaway: 'Major banks and financial institutions almost never conduct customer account business on .click or .xyz domains.',
    },
    {
      title: '5. Direct IP Address Hosts',
      description: 'Directly routing users to a numeric server IP address without a registered DNS domain name.',
      exampleBad: 'http://185.193.66.42:8080/bank/login',
      exampleGood: 'https://bankofamerica.com',
      takeaway: 'Legitimate corporate services never present raw numeric IP hosts to retail consumers.',
    },
    {
      title: '6. URL Shortener Concealment',
      description: 'Wrapping phishing landing pages in bit.ly or tinyurl links to bypass email security scanners and conceal the real URL.',
      exampleBad: 'https://bit.ly/apple-id-suspended-now',
      exampleGood: 'https://appleid.apple.com',
      takeaway: 'Use LinkShield’s "Unshorten Link" feature to trace the actual landing destination before clicking.',
    },
  ];

  const QUIZ_ITEMS = [
    {
      question: 'Which of these two URLs is the authentic Chase Bank website?',
      choiceA: { url: 'https://chase.online-security-update-994.click/auth', isCorrect: false, reason: 'Phishing! The root domain is online-security-update-994.click, not chase.com.' },
      choiceB: { url: 'https://www.chase.com/personal/banking', isCorrect: true, reason: 'Authentic! Registered domain is legitimately chase.com.' },
    },
    {
      question: 'Which of these is the authentic Netflix account portal?',
      choiceA: { url: 'https://www.netflix.com/youraccount', isCorrect: true, reason: 'Authentic! Root domain is netflix.com with standard path.' },
      choiceB: { url: 'https://netf1ix-billing-renew.xyz/update', isCorrect: false, reason: 'Phishing! Contains typosquat "1" instead of "l" and disposable .xyz TLD.' },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Anti-Phishing Tactical Defense Guide</h2>
            <p className="text-xs text-slate-400">
              Master the exact techniques threat actors use to bypass human vigilance and steal credentials.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Key Attack Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TACTICS.map((item, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{item.title}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="space-y-1.5 pt-1 text-xs font-mono-code">
                <div className="p-2 rounded bg-rose-950/40 border border-rose-900/50 text-rose-300 flex items-start gap-1.5">
                  <span className="font-bold text-rose-400 shrink-0">Spoof:</span>
                  <span className="break-all">{item.exampleBad}</span>
                </div>
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-900/50 text-emerald-300 flex items-start gap-1.5">
                  <span className="font-bold text-emerald-400 shrink-0">Legit:</span>
                  <span className="break-all">{item.exampleGood}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] leading-tight mr-2">{item.takeaway}</span>
              <button
                onClick={() => onTestUrl(item.exampleBad.replace(/ \(.*\)/, ''))}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap cursor-pointer"
              >
                <span>Scan Spoof &rarr;</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Spot-the-Phish Drill */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Interactive Spot-the-Phish Verification Drill</span>
        </h3>
        <p className="text-xs text-slate-400">
          Can you tell the authentic domain from the malicious lookalike? Test your skills:
        </p>

        <div className="space-y-4">
          {QUIZ_ITEMS.map((q, qIdx) => (
            <div key={qIdx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <span className="font-semibold text-xs text-slate-200 block">
                {qIdx + 1}. {q.question}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveQuizIndex(qIdx);
                    setQuizAnswerSelected(q.choiceA.isCorrect);
                  }}
                  className="p-3 text-left rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-mono-code text-slate-200 transition-colors cursor-pointer"
                >
                  <span className="text-slate-400 font-sans block mb-1">Option A:</span>
                  <span className="break-all">{q.choiceA.url}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveQuizIndex(qIdx);
                    setQuizAnswerSelected(q.choiceB.isCorrect);
                  }}
                  className="p-3 text-left rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-mono-code text-slate-200 transition-colors cursor-pointer"
                >
                  <span className="text-slate-400 font-sans block mb-1">Option B:</span>
                  <span className="break-all">{q.choiceB.url}</span>
                </button>
              </div>

              {activeQuizIndex === qIdx && quizAnswerSelected !== null && (
                <div
                  className={`p-3 rounded-lg text-xs font-sans space-y-1 ${
                    quizAnswerSelected
                      ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/50 border border-rose-800 text-rose-300'
                  }`}
                >
                  <span className="font-bold block">
                    {quizAnswerSelected ? 'Correct! Sharp eye.' : 'Incorrect! Look closer.'}
                  </span>
                  <p className="text-slate-300">
                    {q.choiceA.isCorrect ? q.choiceA.reason : q.choiceB.reason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
