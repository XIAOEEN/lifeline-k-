import React, { useState } from 'react';
import { AnalysisResult, Language, ScoredContent } from '../types';
import { Brain, Bitcoin, Compass, Download, Briefcase, Gem, Heart, Calendar, Loader2 } from 'lucide-react';
import { getTexts } from '../locales';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface AnalysisSectionProps {
  analysis: AnalysisResult;
  lang: Language;
  theme: 'light' | 'dark';
}

const RatingBar = ({ rating, lang }: { rating: number, lang: Language }) => {
    const t = getTexts(lang);
    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest">{t.rating}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{rating} / 10</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                    className={`h-full rounded-full ${
                        rating >= 8 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        rating >= 5 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                        'bg-gradient-to-r from-orange-400 to-red-500'
                    }`}
                    style={{ width: `${rating * 10}%` }}
                ></div>
            </div>
        </div>
    )
}

const AnalysisCard = ({ title, icon: Icon, data, lang, className }: { title: string, icon: any, data: ScoredContent, lang: Language, className?: string }) => (
  <div className={`p-6 rounded-2xl border bg-white dark:bg-slate-800 shadow-sm border-gray-100 dark:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between ${className}`}>
    <div>
        <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
            <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {data.content}
        </div>
    </div>
    <RatingBar rating={data.rating} lang={lang} />
  </div>
);

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ analysis, lang, theme }) => {
  const t = getTexts(lang);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
        // We capture the entire document body or a specific container
        // To ensure good quality, we might want to temporarily expand the detailed review or use a specific print container.
        // For simplicity in this environment, we target the main content.
        
        // Find the main content div
        const element = document.querySelector('main');
        if (!element) return;

        const canvas = await html2canvas(element as HTMLElement, {
            scale: 2, // Higher resolution
            useCORS: true, // Handle external images if any
            backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb', // Match background
            logging: false,
            ignoreElements: (el) => el.classList.contains('print:hidden') // Ignore buttons
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${lang === 'zh' ? '人生K线报告' : 'Life_K_Line_Report'}.pdf`);

    } catch (error) {
        console.error("PDF Generation failed", error);
        alert("Failed to generate PDF. You can try printing the page.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* 6 Grid Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalysisCard 
            title={t.cryptoTitle} 
            icon={Bitcoin} 
            data={analysis.cryptoFortune} 
            lang={lang} 
        />
        <AnalysisCard 
            title={t.personalityTitle} 
            icon={Brain} 
            data={analysis.personality} 
            lang={lang} 
        />
        <AnalysisCard 
            title={t.careerTitle} 
            icon={Briefcase} 
            data={analysis.career} 
            lang={lang} 
        />
        <AnalysisCard 
            title={t.fengShuiTitle} 
            icon={Compass} 
            data={analysis.fengShui} 
            lang={lang} 
        />
        <AnalysisCard 
            title={t.wealthTitle} 
            icon={Gem} 
            data={analysis.wealth} 
            lang={lang} 
        />
        <AnalysisCard 
            title={t.marriageTitle} 
            icon={Heart} 
            data={analysis.marriage} 
            lang={lang} 
        />
      </div>

      {/* Yearly Detailed Evaluation */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 transition-colors">
        <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.yearlyReviewTitle}</h2>
        </div>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {analysis.timeline.map((year, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-50 dark:border-slate-700 last:border-0">
                    <div className="flex-shrink-0 w-16 text-center">
                        <div className="font-bold text-lg text-slate-800 dark:text-slate-100">{year.year}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{year.age} {lang === 'zh' ? '岁' : 'y/o'}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {year.isPeak && <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 rounded-full font-bold">★ {t.ath}</span>}
                            <div className={`w-2 h-2 rounded-full ${year.close >= year.open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{year.summary}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{year.detailedReview}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center mt-8 pb-12 print:hidden">
        <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-slate-700 text-white rounded-full font-medium hover:bg-gray-800 dark:hover:bg-slate-600 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isGeneratingPdf ? (lang === 'zh' ? '生成中...' : 'Generating...') : t.savePdf}
        </button>
      </div>
    </div>
  );
};

export default AnalysisSection;