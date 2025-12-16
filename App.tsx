import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import InputForm from './components/InputForm';
import BaZiDisplay from './components/BaZiDisplay';
import BaZiConfirmation from './components/BaZiConfirmation';
import KLineChart from './components/KLineChart';
import AnalysisSection from './components/AnalysisSection';
import ApiQuotaDialog from './components/ApiQuotaDialog';
import { UserInput, AnalysisResult, Language, BaZiResult } from './types';
import { calculateBaZi, generateDestinyAnalysis } from './services/geminiService';
import { Sparkles, Languages, Moon, Sun } from 'lucide-react';
import { Github } from 'lucide-react';
import { getTexts } from './locales';

const App: React.FC = () => {
  const [step, setStep] = useState<'landing' | 'input' | 'confirmation' | 'result'>('landing');
  const [loading, setLoading] = useState(false);
  const [showQuotaDialog, setShowQuotaDialog] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      // Default to dark theme if no saved preference
      if (savedTheme) {
        return savedTheme as 'light' | 'dark';
      }
      return 'dark';
    }
    return 'dark';
  });

  const [lang, setLang] = useState<Language>('zh'); 

  const [preliminaryBaZi, setPreliminaryBaZi] = useState<BaZiResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const t = getTexts(lang);

  // Effect to apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  // Step 1: Calculate BaZi
  const handleInitialSubmit = async (data: UserInput) => {
    setLoading(true);
    try {
      const result = await calculateBaZi(data);
      setPreliminaryBaZi(result);
      setStep('confirmation');
    } catch (error: any) {
      console.error(error);
      // Show quota dialog for all API errors
      setShowQuotaDialog(true);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm BaZi and Generate K-Line
  const handleBaZiConfirm = async (confirmedData: BaZiResult) => {
    setLoading(true);
    try {
      const result = await generateDestinyAnalysis(confirmedData, lang);
      setAnalysis(result);
      setStep('result');
    } catch (error: any) {
      console.error(error);
      // Show quota dialog for all API errors
      setShowQuotaDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('landing');
    setPreliminaryBaZi(null);
    setAnalysis(null);
    window.scrollTo(0, 0);
  };

  const handleGetStarted = () => {
    setStep('input');
    window.scrollTo(0, 0);
  };

  // Show landing page without header
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 font-sans">
        {/* Minimal Header for Landing */}
        <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-teal-500 text-white p-1.5 rounded-lg">
                  <Sparkles size={18} />
              </div>
              <div>
                  <h1 className="font-bold text-white text-lg leading-none">{t.appTitle}</h1>
                  <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">AI Destiny Analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               {/* VeeverseAI Logo */}
               <a
                  href="https://veeverseai.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700 hover:border-teal-500/50"
                  title="Visit VeeverseAI"
               >
                  <span className="text-teal-400">V</span>
                  <span>eeverseAI</span>
               </a>

               {/* GitHub Link */}
               <a
                  href="https://github.com/XIAOEEN/lifeline-k-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors"
                  title="View on GitHub"
               >
                  <Github size={16} />
               </a>

               {/* Theme Toggle */}
               <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors"
                  title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
               >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
               </button>

               <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-medium transition-colors"
               >
                  <Languages size={14} />
                  {lang === 'en' ? '中文' : 'English'}
               </button>
            </div>
          </div>
        </header>

        <LandingPage onGetStarted={handleGetStarted} lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-black dark:bg-slate-700 text-white p-1.5 rounded-lg transition-colors">
                <Sparkles size={18} />
            </div>
            <div>
                <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-none transition-colors">{t.appTitle}</h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase transition-colors">AI Destiny Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {/* VeeverseAI Logo */}
             <a
                href="https://veeverseai.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-gray-200 dark:border-slate-600 hover:border-purple-500/50 dark:hover:border-purple-500/50"
                title="Visit VeeverseAI"
             >
                <span className="text-purple-600 dark:text-purple-400">V</span>
                <span>eeverseAI</span>
             </a>

             {/* GitHub Link */}
             <a
                href="https://github.com/XIAOEEN/lifeline-k-"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                title="View on GitHub"
             >
                <Github size={16} />
             </a>

             {/* Theme Toggle */}
             <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
             >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
             </button>

             <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors"
             >
                <Languages size={14} />
                {lang === 'en' ? '中文' : 'English'}
             </button>

             {step !== 'input' && (
                <button
                    onClick={handleReset}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ml-1"
                >
                    ← <span className="hidden sm:inline">{t.newReading}</span>
                </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10 max-w-5xl">
        {step === 'input' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
                {/* Hero Section */}
                <div className="text-center mb-12 max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        {t.heroTitle1}
                    </h2>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-6">
                        {t.heroTitle2}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
                        {t.heroDescription}
                    </p>
                </div>

                <InputForm onSubmit={handleInitialSubmit} isLoading={loading} lang={lang} />
            </div>
        )}

        {step === 'confirmation' && preliminaryBaZi && (
             <BaZiConfirmation 
                data={preliminaryBaZi}
                onConfirm={handleBaZiConfirm}
                onRetry={() => setStep('input')}
                lang={lang}
                isLoading={loading}
             />
        )}

        {step === 'result' && analysis && (
            <div className="animate-fade-in space-y-8">
                {/* BaZi Header (Read Only in result view) */}
                <BaZiDisplay bazi={analysis.bazi} mainAttribute={analysis.mainAttribute} lang={lang} />
                
                {/* Chart */}
                <KLineChart 
                  data={analysis.timeline} 
                  volatilityAnalysis={analysis.volatilityAnalysis}
                  lang={lang}
                  theme={theme}
                />

                {/* Detailed Analysis */}
                <AnalysisSection analysis={analysis} lang={lang} theme={theme} />
            </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 py-6 mt-auto print:hidden transition-colors">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-400 dark:text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {t.appTitle}. {t.footer}</p>
        </div>
      </footer>

      {/* API Quota Dialog */}
      <ApiQuotaDialog
        isOpen={showQuotaDialog}
        onClose={() => setShowQuotaDialog(false)}
        lang={lang}
      />
    </div>
  );
};

export default App;