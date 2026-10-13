# 🛡️ LinkShield AI — Phishing & Typosquatting URL Detector

**Think Before You Click.**

LinkShield AI is a web-based project that analyzes submitted URLs for potentially suspicious characteristics associated with phishing, typosquatting, misleading hostnames, and other deceptive URL patterns. It presents a risk assessment and explanations intended to help users make more informed decisions before visiting a link.

> **Project status:** Student PBL / educational prototype. Its results are preliminary and must not be treated as a guarantee that a URL is safe.

🌐 **Live Demo:** https://linkshield-ai-nqsy.onrender.com  
📂 **GitHub Repository:** https://github.com/Saicharan145/LinkShield-AI

---

## 📑 Contents

- [Overview](#-overview)
- [Objectives](#-objectives)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Technology Stack](#-technology-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Limitations](#-limitations)
- [Future Improvements](#-future-improvements)
- [Security and Privacy Notes](#-security-and-privacy-notes)
- [Disclaimer](#-disclaimer)
- [Author](#-author)

---

## 🎯 Overview

Phishing links may imitate familiar services, use misleading subdomains, hide the true destination behind URL shorteners, or use lookalike spellings to mislead users. LinkShield AI provides a browser-based interface where users can submit a URL and review a preliminary analysis.

The interface displays a risk classification, a numeric score, explanatory indicators, and additional analysis views. The project explores how URL heuristics and AI-assisted analysis can be combined in a web application.

LinkShield AI is intended for learning, demonstration, and cybersecurity awareness. It has not been established as a production-grade phishing detection service.

## 🎓 Objectives

- Build and deploy a web application for preliminary URL analysis.
- Demonstrate URL input validation and suspicious-pattern analysis.
- Present risk information in a clear, user-friendly interface.
- Explore AI-assisted analysis through the Google Gemini API.
- Demonstrate full-stack development and deployment using GitHub and Render.
- Identify limitations and possible future improvements for phishing detection.

## ✨ Features

The interface includes the following features. The behavior of each feature depends on the current implementation and configuration.

- **URL scanning:** Submit a URL for analysis.
- **Risk assessment:** Display a risk category and a score.
- **Heuristic indicators:** Highlight potentially suspicious URL structures and patterns.
- **AI-assisted analysis:** Integrate with the Google Gemini API where configured.
- **Plain-English assessment:** Explain potential concerns in accessible language.
- **URL anatomy:** Display URL components such as protocol, hostname, top-level domain, and path.
- **Batch scan interface:** Provide an option for submitting multiple URLs.
- **QR code analysis interface:** Provide an option to inspect URLs obtained from QR codes.
- **Scan history interface:** Provide access to previous scan results where supported.
- **Report interface:** Provide an option to prepare or copy an incident-style report.
- **URL unshortening option:** Display an option for investigating shortened links where supported.
- **Responsive dark interface:** Use a cybersecurity-themed dashboard with risk indicators and explanatory cards.

> These are interface and project capabilities, not a claim that every feature has been independently verified or that every result is accurate.

## 🔍 How It Works

1. **Submit a URL:** The user pastes a link into the scanner.
2. **Validate the input:** The application checks whether the submitted text can be treated as a URL.
3. **Analyze URL characteristics:** The configured scanner examines URL structure and heuristic indicators.
4. **Use AI assistance where available:** The server can use the configured Gemini integration to contribute analysis.
5. **Review the result:** The interface displays a classification, risk score, warning indicators, and a plain-English explanation.
6. **Make a cautious decision:** The user reviews the result and independently verifies the destination before sharing sensitive information.

A risk score is an application-generated assessment, not necessarily a calibrated probability of malicious activity.

## 🧰 Technology Stack

The repository configuration identifies the following technologies:

| Technology | Role |
|---|---|
| React | User interface |
| TypeScript | Application and server-side code |
| Vite | Frontend development and production build |
| Node.js | JavaScript runtime |
| Express | HTTP server |
| Google Gemini API (`@google/genai`) | AI-assisted analysis when configured |
| Tailwind CSS tooling | Styling support |
| Lucide React | Interface icons |
| GitHub | Source control and project hosting |
| Render | Web-service deployment |

## 🖼️ Screenshots

The following screenshots show the application's interface and example output. They illustrate the prototype's appearance and workflow; they do not independently prove detection accuracy.

### 1. Homepage and URL Scanner

![LinkShield AI homepage and URL scanner](screenshots/home.png)

The homepage presents the URL input field, main navigation, scenario cards, and the primary scan action.

### 2. Suspicious URL Result

![LinkShield AI suspicious URL scan result](screenshots/scan-result.png)

Example result showing a suspicious classification, medium risk label, and a score of 60/100. This is an example application output, not a validated probability.

### 3. Risk Assessment and Explanation

![LinkShield AI risk assessment](screenshots/risk-assessment.png)

The result view includes a risk indicator and a plain-English explanation to help users understand the application's assessment.

### 4. URL Anatomy and Deconstruction

![LinkShield AI URL anatomy](screenshots/url-anatomy.png)

The interface illustrates URL components and selected structural indicators.

### 5. How LinkShield AI Works

![How LinkShield AI works](screenshots/how-it-works.png)

A three-step overview of URL submission, analysis, and reviewing the result.

### 6. Feature Overview

![LinkShield AI feature cards](screenshots/features.png)

Feature cards describe AI-assisted analysis, suspicious-pattern detection, explainable indicators, and the responsive interface.

**Screenshot setup:** Upload the screenshots to a `screenshots/` folder in this repository and use the exact filenames listed above. If your uploaded files have different names, update the image paths accordingly.

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Git, if cloning the repository locally
- A Google Gemini API key if the AI analysis route requires it

### Clone the repository

```bash
git clone https://github.com/Saicharan145/LinkShield-AI.git
cd LinkShield-AI
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a local `.env` file for development and add the required environment variables. Use `.env.example` as a reference if it documents them.

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Replace the placeholder with your own key. Never commit the real `.env` file or API key.

### Build and run

```bash
npm run build
npm start
```

The server uses the configured `PORT` environment variable and defaults to port `3000` in the current configuration. Open the local address shown by the server if you are running the project locally.

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | API key used by the Google Gemini integration |
| `PORT` | Port used by the server; defaults to `3000` in the current configuration |

For Render deployment, configure secrets in the Render service's **Environment Variables** settings. Do not publish API keys in source files, screenshots, or commits.

## 📁 Project Structure

```text
LinkShield-AI/
├── src/
│   ├── utils/
│   │   └── heuristicScanner.ts
│   └── types/
│       └── threat.ts
├── index.html
├── server.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── metadata.json
├── .env.example
├── .gitignore
├── screenshots/
│   ├── home.png
│   ├── scan-result.png
│   ├── risk-assessment.png
│   ├── url-anatomy.png
│   ├── how-it-works.png
│   └── features.png
└── README.md
```

This is a simplified overview. The exact files and subfolders may differ from this outline.

## 🧪 Testing

Before demonstrating the project, test a small set of controlled inputs and record the actual results.

| Test case | Example input | What to check |
|---|---|---|
| Familiar domain | `https://www.google.com` | Does the scanner return a result without an error? |
| Example domain | `https://example.com` | Does the scanner process a normal URL? |
| Deceptive hostname structure | `https://paypal.com.example.org/login` | Does it identify `example.org` as the hostname rather than `paypal.com`? |
| Plain HTTP | `http://example.com` | Does it explain that HTTP lacks transport encryption without claiming HTTP alone proves phishing? |
| Invalid input | `not-a-url` | Does the app reject it with a clear validation message? |

These are suggested tests, not recorded accuracy results. Do not open suspicious links or submit credentials to test them.

## ⚠️ Limitations

- A URL classified as low risk is not guaranteed to be safe.
- Heuristic rules can produce false positives and false negatives.
- AI-generated analysis may be incomplete, inconsistent, or incorrect.
- A score from 0 to 100 should not be interpreted as a probability unless it has been calibrated and validated.
- A URL-only analysis may not reveal malicious content on the destination website.
- The application should not be assumed to query live threat-intelligence databases unless such integrations are implemented and verified.
- Real-world detection performance has not been established by the example screenshots.
- The project requires systematic evaluation with a representative, labelled dataset before it can be relied on for security decisions.

## 🔮 Future Improvements

- Add automated tests for URL parsing and hostname edge cases.
- Improve detection of lookalike domains and misleading subdomains.
- Integrate trusted phishing-intelligence services where appropriate.
- Evaluate performance using a representative labelled dataset.
- Measure precision, recall, F1-score, and false-positive rates.
- Add rate limiting, request validation, and safer error handling.
- Improve accessibility and mobile usability.
- Document which features are implemented, tested, and dependent on external APIs.

## 🔒 Security and Privacy Notes

- Keep `GEMINI_API_KEY` on the server and configure it through environment variables.
- Do not commit secrets or personal data.
- Treat submitted URLs as untrusted input.
- If URL unshortening or server-side URL fetching is implemented, protect the server against server-side request forgery (SSRF), unsafe redirects, and requests to internal network addresses.
- Avoid opening suspicious links directly during testing.
- Do not enter passwords, banking details, or other sensitive information on untrusted websites.

## ⚖️ Disclaimer

LinkShield AI is an educational student project for demonstrating web development, URL analysis, and cybersecurity awareness. It provides preliminary indicators only and is not a substitute for professional security tools or independent verification. No scan result guarantees that a website is safe.

## 👨‍💻 Author

**Sai Charan**

- GitHub: [@Saicharan145](https://github.com/Saicharan145)
- Project repository: [LinkShield AI](https://github.com/Saicharan145/LinkShield-AI)
- Live demo: [LinkShield AI on Render](https://linkshield-ai-nqsy.onrender.com)

---

*Built as a student project to explore AI-assisted URL analysis and cybersecurity awareness.*
