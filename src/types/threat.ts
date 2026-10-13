export type RiskLevel = 'safe' | 'low' | 'suspicious' | 'dangerous';

export interface ThreatIndicator {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  detected: boolean;
  description: string;
  category: 'lexical' | 'domain' | 'content' | 'reputation' | 'protocol';
}

export interface UrlDeconstructed {
  raw: string;
  protocol: string;
  hostname: string;
  subdomain: string;
  registeredDomain: string;
  tld: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  isIpAddress: boolean;
  hasPunycode: boolean;
  entropy: number;
  length: number;
}

export type RiskClassification = 'Potentially Phishing' | 'Suspicious' | 'No Warning Indicators Found';
export type RiskLevelTier = 'High' | 'Medium' | 'Lower';

export interface ThreatAnalysis {
  id: string;
  url: string;
  timestamp: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  riskClassification: RiskClassification;
  riskLevelTier: RiskLevelTier;
  verdict: string;
  targetBrand: string | null;
  attackType:
    | 'Brand Impersonation & Typosquatting'
    | 'Credential Harvesting'
    | 'Malicious Redirect & Cloaking'
    | 'IP Address Obfuscation'
    | 'Financial / Invoice Scam'
    | 'Legitimate / Verified Domain'
    | 'Suspicious Structure / Unverified';
  summary: string;
  plainEnglishExplanation: string;
  technicalDetails: {
    domainAnalysis: string;
    lexicalFlags: string[];
    reputationNotes: string;
    protocolAssessment: string;
    entropyAssessment: string;
  };
  indicators: ThreatIndicator[];
  recommendations: string[];
  deconstruction: UrlDeconstructed;
  latencyMs: number;
  aiAssisted: boolean;
}

export interface PresetScenario {
  id: string;
  title: string;
  category: 'phishing' | 'safe' | 'suspicious';
  targetBrand: string;
  url: string;
  scenarioDescription: string;
  technique: string;
}
