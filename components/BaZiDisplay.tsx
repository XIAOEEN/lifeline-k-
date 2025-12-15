import React from 'react';
import { BaZiChart, Language } from '../types';
import { getTexts } from '../locales';

interface BaZiDisplayProps {
  bazi: BaZiChart;
  mainAttribute: string;
  lang: Language;
}

const PillarCard = ({ title, gan, zhi }: { title: string; gan: string; zhi: string }) => (
  <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/50 min-w-[80px] transition-colors">
    <span className="text-xs text-purple-600 dark:text-purple-300 font-medium mb-2 uppercase tracking-wide">{title}</span>
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 serif">{gan}</span>
      <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 serif">{zhi}</span>
    </div>
  </div>
);

const BaZiDisplay: React.FC<BaZiDisplayProps> = ({ bazi, mainAttribute, lang }) => {
  const t = getTexts(lang);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mb-8 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-6 w-1 bg-purple-600 rounded-full"></div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.baziTitle}</h3>
        <span className="ml-auto px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full uppercase">
          {mainAttribute}
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <PillarCard title={t.year} gan={bazi.year.gan} zhi={bazi.year.zhi} />
        <PillarCard title={t.month} gan={bazi.month.gan} zhi={bazi.month.zhi} />
        <PillarCard title={t.day} gan={bazi.day.gan} zhi={bazi.day.zhi} />
        <PillarCard title={t.hour} gan={bazi.hour.gan} zhi={bazi.hour.zhi} />
      </div>
    </div>
  );
};

export default BaZiDisplay;