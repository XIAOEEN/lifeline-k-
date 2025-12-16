# Life K-Line | 人生 K 线

<div align="center">

[中文](./README.md) | [English](./README_en.md)

---

**Understand Life's Ups & Downs, Foresee Your Life Trajectory**

An AI-powered destiny analysis tool combining traditional Chinese BaZi numerology with modern financial data visualization

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

</div>

## 📖 Introduction

Life K-Line is an innovative destiny analysis application that combines traditional Chinese BaZi (Four Pillars) numerology with modern financial K-line chart visualization. Through AI-powered analysis, it transforms your lifetime fortune into intuitive stock-like charts, helping you:

- 🎯 Discover "bull market" periods in your life
- ⚠️ Avoid "bear market" risks
- 🔮 Seize key turning points
- 📊 Foresee your 100-year life trajectory

## 📸 System Screenshots

<div align="center">

**Official Landing Page**

When you first visit the application, you'll see an elegant landing page showcasing core features and product highlights.

<img src="doc/首页.png" alt="Homepage" width="800"/>

**BaZi Charting**

<img src="doc/八字排盘.png" alt="BaZi Charting" width="800"/>

**K-Line Analysis**

<img src="doc/k线.png" alt="K-Line Analysis" width="800"/>

</div>

## ✨ Key Features

- **Official Landing Page**: Elegant landing page showcasing product features and core capabilities
- **Smart BaZi Charting**: Automatic calculation of true solar time and lunar dates
- **AI Destiny Analysis**: Detailed life fortune reports powered by Gemini AI
- **K-Line Visualization**: 100-year fortune displayed as financial candlesticks
- **Multi-dimensional Analysis**:
  - Crypto/Web3 Trading Fortune
  - Personality Analysis
  - Career & Industry
  - Feng Shui Recommendations
  - Wealth Level
  - Marriage & Relationships
- **Multi-language Support**: Chinese/English interface switching
- **Theme Modes**: Light/Dark theme support
- **PDF Export**: One-click save of complete destiny analysis report

## 🛠 Tech Stack

- **Framework**: React 18.3 + TypeScript 5.8
- **Build Tool**: Vite 6.2
- **UI Components**:
  - Recharts (Chart visualization)
  - Lucide React (Icons)
- **AI Services**:
  - Google Generative AI (Native Gemini API)
  - OpenAI SDK (Third-party forwarding support)
- **Other Tools**:
  - html2canvas (Screenshots)
  - jsPDF (PDF generation)

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/XIAOEEN/lifeline-k-.git
cd life-destiny-k-line
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env.local` file in the project root:

```env
# Gemini API Key (Required)
VITE_GEMINI_API_KEY=your_api_key_here

# Model name (Optional, default: gemini-2.0-flash-thinking-exp-01-21)
VITE_MODEL_NAME=gemini-2.0-flash-thinking-exp-01-21

# API Base URL (Optional)
# Leave empty for native Gemini API
# Fill in URL for third-party forwarding (e.g., https://api.gpt.ge/v1/)
VITE_BASE_URL=
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the application**

Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔑 API Configuration

The project supports two API calling methods:

### Method 1: Native Gemini API
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_BASE_URL=
```

### Method 2: Third-party Forwarding Platform
```env
VITE_GEMINI_API_KEY=your_api_key
VITE_BASE_URL=https://api.gpt.ge/v1/
```

## 🎨 User Guide

1. **Enter Birth Information**
   - Name (Optional)
   - Gender
   - Birth Date (Gregorian)
   - Birth Time
   - Birth Location

2. **Confirm BaZi Chart**
   - AI automatically calculates true solar time
   - Generates Four Pillars
   - Calculates Big Luck start age

3. **View Fortune Analysis**
   - 100-year fortune K-line chart
   - Six-dimensional detailed analysis
   - Annual detailed reviews

4. **Export Report**
   - Click "Save Report as PDF" button
   - Generate PDF file with complete analysis

## 🌐 Supported Models

- `gemini-2.0-flash-thinking-exp-01-21` (Default)
- `gemini-2.5-flash-thinking`
- `gemini-3-pro-preview-low`
- Other Gemini/OpenAI compatible models

## 📝 Development

- Use `npm run dev` to start development server (with hot reload)
- Use `npm run build` to build for production
- Use `npm run preview` to preview production build

## ⚠️ Disclaimer

1. This project is for entertainment and cultural research purposes only
2. Requires a valid Gemini API Key to use
3. API calls may incur costs, please monitor usage
4. True solar time calculation is based on geographic location and may have errors

## 📄 License

MIT License

## 👨‍💻 Author

@xiaoeen

---

<div align="center">

**Made with ❤️ by @xiaoeen**

⭐ Star this repo if you find it helpful!

</div>
