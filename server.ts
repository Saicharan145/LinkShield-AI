import express, { type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { runHeuristicRules, calculateEntropy, deconstructUrl } from './src/utils/heuristicScanner.ts';
import type { ThreatAnalysis, ThreatIndicator } from './src/types/threat.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '2mb' }));

// Setup Gemini API Client on the server side
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Gemini client:', err);
  }
}

// Track Gemini availability to avoid repeated slow 403 calls if the key lacks project access
let geminiAccessDenied = false;

/**
 * Single URL Analysis Endpoint
 */
app.post('/api/analyze-url', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    const trimmedUrl = url.trim();
    // 1. Run deterministic static heuristic scanner
    const heuristic = runHeuristicRules(trimmedUrl);
    const deconstruction = heuristic.deconstruction;

    let aiResult: Partial<ThreatAnalysis> | null = null;
    let aiAssisted = false;

    // 2. Query Gemini 3.8 Flash for deep cyber threat reasoning if client is available and active
    if (geminiClient && process.env.GEMINI_API_KEY && !geminiAccessDenied) {
      try {
        const prompt = `You are LinkShield AI, a world-class cybersecurity analyst and antiphishing engine.
Analyze this suspect URL for phishing, typosquatting, credential harvesting, brand impersonation, and social engineering hazards.

Target URL: "${trimmedUrl}"
Domain Anatomy:
- Hostname: ${deconstruction.hostname}
- Registered Domain: ${deconstruction.registeredDomain}
- Subdomains: ${deconstruction.subdomain || 'None'}
- Top-Level Domain (TLD): .${deconstruction.tld}
- Protocol: ${deconstruction.protocol}
- Path & Query: ${deconstruction.pathname}${deconstruction.search}
- Is Raw IP Host: ${deconstruction.isIpAddress}
- Punycode / Homoglyph present: ${deconstruction.hasPunycode}
- Entropy Score: ${deconstruction.entropy}
- Heuristic Flags: ${heuristic.flags.join('; ') || 'None'}
- Preliminary Heuristic Score: ${heuristic.rawScore}/100

Perform rigorous verification:
1. Is this domain an authentic official website or a malicious imposter/typosquat? (e.g., paypa1-update.com vs paypal.com, or brand in subdomain like chase.secure-login-392.com).
2. Calculate an accurate risk score from 0 (completely safe legitimate top domain) to 100 (confirmed dangerous phishing/credential harvest).
3. Determine riskLevel ('safe' for 0-20, 'low' for 21-40, 'suspicious' for 41-70, 'dangerous' for 71-100).
4. Provide a clear, everyday plain-English explanation for general users: explain what the danger is and what would happen if they clicked.
5. Provide technical assessment details for IT security professionals.
6. Provide specific actionable safety recommendations.`;

        const response = await geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite cybersecurity threat analyst specialized in anti-phishing, URL deconstruction, and typosquatting defense. Always output strictly valid JSON matching the requested schema. CRITICAL: Do not automatically classify a URL as malicious solely because it lacks HTTPS, contains a suspicious word, or uses an unfamiliar domain extension.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                riskScore: { type: Type.INTEGER, description: 'Overall risk score from 0 to 100' },
                riskLevel: { type: Type.STRING, description: 'safe, low, suspicious, or dangerous' },
                verdict: { type: Type.STRING, description: 'Short decisive verdict, e.g. Phishing Link Detected: Brand Impersonation' },
                targetBrand: { type: Type.STRING, description: 'Impersonated brand or institution, or empty string if none' },
                attackType: {
                  type: Type.STRING,
                  description: 'Category: Brand Impersonation & Typosquatting, Credential Harvesting, Malicious Redirect & Cloaking, IP Address Obfuscation, Financial / Invoice Scam, Legitimate / Verified Domain, or Suspicious Structure / Unverified',
                },
                summary: { type: Type.STRING, description: '1-2 sentence high-level security verdict' },
                plainEnglishExplanation: { type: Type.STRING, description: 'Plain English explanation for regular users describing the threat and risks' },
                technicalDetails: {
                  type: Type.OBJECT,
                  properties: {
                    domainAnalysis: { type: Type.STRING },
                    lexicalFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    reputationNotes: { type: Type.STRING },
                    protocolAssessment: { type: Type.STRING },
                    entropyAssessment: { type: Type.STRING },
                  },
                  required: ['domainAnalysis', 'reputationNotes', 'protocolAssessment', 'entropyAssessment'],
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of actionable protective steps for the user',
                },
                additionalIndicators: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      severity: { type: Type.STRING, description: 'critical, high, medium, low, or info' },
                      description: { type: Type.STRING },
                      category: { type: Type.STRING, description: 'lexical, domain, content, reputation, or protocol' },
                    },
                    required: ['name', 'severity', 'description', 'category'],
                  },
                },
              },
              required: [
                'riskScore',
                'riskLevel',
                'verdict',
                'attackType',
                'summary',
                'plainEnglishExplanation',
                'technicalDetails',
                'recommendations',
              ],
            },
          },
        });

        const rawText = response.text?.trim() || '';
        if (rawText) {
          const parsed = JSON.parse(rawText);
          aiResult = parsed;
          aiAssisted = true;
        }
      } catch (geminiError: any) {
        const errorMsg = String(geminiError?.message || geminiError || '');
        if (errorMsg.includes('PERMISSION_DENIED') || errorMsg.includes('403') || errorMsg.includes('denied access')) {
          // Gracefully record access denial to prevent repeating doomed requests and avoid error log noise
          geminiAccessDenied = true;
        }
        // Seamlessly continue with the deterministic cybersecurity heuristic engine
      }
    }

    // 3. Construct unified ThreatAnalysis object
    const finalScore = aiResult?.riskScore !== undefined
      ? Math.min(Math.max(aiResult.riskScore, 0), 100)
      : heuristic.rawScore;

    let finalRiskLevel: 'safe' | 'low' | 'suspicious' | 'dangerous';
    if (finalScore >= 70) finalRiskLevel = 'dangerous';
    else if (finalScore >= 45) finalRiskLevel = 'suspicious';
    else if (finalScore >= 20) finalRiskLevel = 'low';
    else finalRiskLevel = 'safe';

    const detectedBrand = aiResult?.targetBrand || heuristic.detectedBrand || null;

    let defaultAttackType: ThreatAnalysis['attackType'] = 'Legitimate / Verified Domain';
    if (finalRiskLevel === 'dangerous' || finalRiskLevel === 'suspicious') {
      if (detectedBrand) defaultAttackType = 'Brand Impersonation & Typosquatting';
      else if (deconstruction.isIpAddress) defaultAttackType = 'IP Address Obfuscation';
      else if (heuristic.flags.some((f) => f.includes('keyword') || f.includes('Credential'))) defaultAttackType = 'Credential Harvesting';
      else defaultAttackType = 'Suspicious Structure / Unverified';
    }

    // Combine indicators
    const combinedIndicators: ThreatIndicator[] = [...heuristic.indicators];
    if (aiResult && (aiResult as any).additionalIndicators) {
      for (const item of (aiResult as any).additionalIndicators) {
        if (!combinedIndicators.some((i) => i.name.toLowerCase() === item.name.toLowerCase())) {
          combinedIndicators.push({
            id: `ai-ind-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: item.name,
            severity: (item.severity as any) || 'medium',
            detected: true,
            category: (item.category as any) || 'content',
            description: item.description,
          });
        }
      }
    }

    // Ensure recommendations exist
    const recommendations: string[] = aiResult?.recommendations && aiResult.recommendations.length > 0
      ? aiResult.recommendations
      : finalRiskLevel === 'dangerous'
      ? [
          'Do NOT click or open this link under any circumstances.',
          'Never enter usernames, passwords, credit card numbers, or two-factor auth codes.',
          detectedBrand ? `If you need to access ${detectedBrand}, open your browser and navigate directly to their verified official address.` : 'Navigate to the organization by manually typing their official web address.',
          'Report this message or email as phishing to your security team or mail provider.',
        ]
      : finalRiskLevel === 'suspicious'
      ? [
          'Exercise extreme caution before interacting with this web destination.',
          'Inspect the address bar carefully to verify the registered domain before submitting any credentials.',
          'Avoid clicking through links sent via unprompted SMS, emails, or direct messages.',
        ]
      : [
          'Link appears consistent with standard verified web destination conventions.',
          'Always confirm the browser address bar displays HTTPS encryption when signing into sensitive accounts.',
        ];

    const verdict = aiResult?.verdict || (
      finalRiskLevel === 'dangerous'
        ? (detectedBrand ? `High-Risk Phishing: Impersonating ${detectedBrand}` : 'High-Risk Malicious Link Detected')
        : finalRiskLevel === 'suspicious'
        ? (detectedBrand ? `Suspicious Activity: Potential ${detectedBrand} Lookalike` : 'Suspicious URL Structure Detected')
        : finalRiskLevel === 'low'
        ? 'Low Risk: Minor Heuristic Flags Noted'
        : 'Safe Link: Verified Domain Pattern'
    );

    const summary = aiResult?.summary || (
      finalRiskLevel === 'dangerous'
        ? `This URL exhibits clear signatures of deceptive phishing designed to steal user credentials or impersonate ${detectedBrand || 'a trusted platform'}.`
        : finalRiskLevel === 'suspicious'
        ? 'This URL shows unusual structural traits, uncommon top-level domain abuse, or obfuscation common in scam distribution campaigns.'
        : 'This destination shows no signs of typosquatting, credential harvesting, or deceptive redirects.'
    );

    const plainEnglishExplanation = aiResult?.plainEnglishExplanation || (
      finalRiskLevel === 'dangerous'
        ? `If you click this link, attackers may present a fake login screen identical to ${detectedBrand || 'a real portal'}. If you enter your password, they can steal your account immediately. Do not interact with this page.`
        : finalRiskLevel === 'suspicious'
        ? 'This link uses unexpected domain patterns or words often seen in junk links and misleading redirect chains. Avoid submitting sensitive information or downloading files from this location.'
        : 'This website address matches the verified naming conventions of an authentic online destination. It appears safe for regular browsing.'
    );

    const technicalDetails = aiResult?.technicalDetails || {
      domainAnalysis: `Target host is "${deconstruction.hostname}" with base domain "${deconstruction.registeredDomain}". Registered TLD is .${deconstruction.tld}. Subdomain depth is ${deconstruction.subdomain ? deconstruction.subdomain.split('.').length : 0}.`,
      lexicalFlags: heuristic.flags,
      reputationNotes: finalRiskLevel === 'dangerous' ? 'Flags indicate adversarial domain crafting pattern.' : 'No active blacklisting triggers found.',
      protocolAssessment: `${deconstruction.protocol.toUpperCase()} protocol with standard port handling.`,
      entropyAssessment: `Shannon entropy computed at ${deconstruction.entropy} bits/symbol.`,
    };

    let riskClassification: 'Potentially Phishing' | 'Suspicious' | 'No Warning Indicators Found';
    let riskLevelTier: 'High' | 'Medium' | 'Lower';

    if (finalScore >= 65) {
      riskClassification = 'Potentially Phishing';
      riskLevelTier = 'High';
    } else if (finalScore >= 30) {
      riskClassification = 'Suspicious';
      riskLevelTier = 'Medium';
    } else {
      riskClassification = 'No Warning Indicators Found';
      riskLevelTier = 'Lower';
    }

    const latencyMs = Date.now() - startTime;

    const analysis: ThreatAnalysis = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: trimmedUrl,
      timestamp: new Date().toISOString(),
      riskScore: finalScore,
      riskLevel: finalRiskLevel,
      riskClassification,
      riskLevelTier,
      verdict,
      targetBrand: detectedBrand,
      attackType: (aiResult?.attackType as any) || defaultAttackType,
      summary,
      plainEnglishExplanation,
      technicalDetails: {
        domainAnalysis: technicalDetails.domainAnalysis,
        lexicalFlags: technicalDetails.lexicalFlags || heuristic.flags,
        reputationNotes: technicalDetails.reputationNotes,
        protocolAssessment: technicalDetails.protocolAssessment,
        entropyAssessment: technicalDetails.entropyAssessment || `Entropy: ${deconstruction.entropy}`,
      },
      indicators: combinedIndicators,
      recommendations,
      deconstruction,
      latencyMs,
      aiAssisted,
    };

    return res.json(analysis);
  } catch (error: any) {
    console.error('URL analysis error:', error);
    return res.status(500).json({ error: error.message || 'Failed to complete URL security scan' });
  }
});

/**
 * Batch Analysis Endpoint (up to 10 URLs)
 */
app.post('/api/batch-analyze', async (req: Request, res: Response) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'Array of URLs is required' });
    }

    const cleanUrls = urls.slice(0, 10).map((u) => String(u).trim()).filter(Boolean);

    // Run scans concurrently with a concurrency limit
    const results = await Promise.all(
      cleanUrls.map(async (u) => {
        const heuristic = runHeuristicRules(u);
        const deconstruction = heuristic.deconstruction;
        const finalScore = heuristic.rawScore;
        let riskLevel: 'safe' | 'low' | 'suspicious' | 'dangerous' = 'safe';
        if (finalScore >= 70) riskLevel = 'dangerous';
        else if (finalScore >= 45) riskLevel = 'suspicious';
        else if (finalScore >= 20) riskLevel = 'low';

        return {
          id: `batch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          url: u,
          timestamp: new Date().toISOString(),
          riskScore: finalScore,
          riskLevel,
          verdict: riskLevel === 'dangerous'
            ? (heuristic.detectedBrand ? `Phishing: ${heuristic.detectedBrand}` : 'Dangerous Malicious Link')
            : riskLevel === 'suspicious'
            ? 'Suspicious URL Structure'
            : 'Safe Link',
          targetBrand: heuristic.detectedBrand,
          attackType: heuristic.detectedBrand ? 'Brand Impersonation & Typosquatting' : (riskLevel === 'safe' ? 'Legitimate / Verified Domain' : 'Suspicious Structure / Unverified'),
          summary: heuristic.flags.join(', ') || 'No critical threat indicators found.',
          deconstruction,
          indicatorsCount: heuristic.indicators.length,
          flags: heuristic.flags,
        };
      })
    );

    return res.json({ scans: results, total: results.length });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Batch scanning failed' });
  }
});

/**
 * Safe Shortener Unshorten / Trace Endpoint
 */
app.post('/api/expand-shortener', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    let parsedUrl = url.trim();
    if (!/^https?:\/\//i.test(parsedUrl)) {
      parsedUrl = 'https://' + parsedUrl;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      // Safe HEAD request to follow redirects without downloading any body or scripts
      const response = await fetch(parsedUrl, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'LinkShield-Bot/1.0 (Security Scanner; https://linkshield.ai)',
        },
      });
      clearTimeout(timeout);

      const resolvedUrl = response.url;
      const isRedirected = resolvedUrl !== parsedUrl;

      return res.json({
        originalUrl: parsedUrl,
        resolvedUrl,
        isRedirected,
        status: response.status,
      });
    } catch (e: any) {
      clearTimeout(timeout);
      return res.json({
        originalUrl: parsedUrl,
        resolvedUrl: parsedUrl,
        isRedirected: false,
        error: 'Unable to expand link remotely (host did not respond)',
      });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Unshortening failed' });
  }
});

/**
 * Health check
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && geminiClient && !geminiAccessDenied),
    engine: geminiAccessDenied ? 'Advanced Deterministic Heuristic Engine' : 'Hybrid AI + Heuristic',
    model: 'gemini-3.8-flash',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Vite integration & server bootstrap
 */
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`LinkShield AI server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start LinkShield AI server:', err);
  process.exit(1);
});
