import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { YearlyFortune, Language } from '../types';
import { COLOR_BEAR, COLOR_BULL } from '../constants';
import { getTexts } from '../locales';
import { TrendingUp } from 'lucide-react';

interface KLineChartProps {
  data: YearlyFortune[];
  volatilityAnalysis: string;
  lang: Language;
  theme: 'light' | 'dark';
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, lang, theme }: any) => {
  if (active && payload && payload.length) {
    const data: YearlyFortune = payload[0].payload;
    const isBull = data.close >= data.open;
    const t = getTexts(lang);
    
    // Theme styles for tooltip
    const bgClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-100 text-gray-800';
    const textTitleClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const subTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const labelClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const descClass = theme === 'dark' ? 'text-gray-300 border-slate-700' : 'text-gray-700 border-gray-100';

    return (
      <div className={`${bgClass} p-4 border shadow-xl rounded-lg max-w-[250px] z-50`}>
        <div className="flex justify-between items-center mb-2">
            <h4 className={`font-bold ${textTitleClass}`}>{data.year} <span className={`text-sm font-normal ${subTextClass}`}>({data.age} y/o)</span></h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isBull ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                {isBull ? 'BULL' : 'BEAR'}
            </span>
        </div>
        
        <div className={`grid grid-cols-2 gap-x-4 gap-y-1 text-xs ${labelClass} mb-3`}>
          <span>{t.open}: {data.open}</span>
          <span>{t.close}: {data.close}</span>
          <span>{t.high}: {data.high}</span>
          <span>{t.low}: {data.low}</span>
        </div>
        <p className={`text-sm italic border-t pt-2 ${descClass}`}>
          "{data.summary}"
        </p>
      </div>
    );
  }
  return null;
};

// Custom Candle Shape
const CandleShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  const { open, close, high, low } = payload;
  
  const isBull = close >= open;
  const color = isBull ? COLOR_BULL : COLOR_BEAR;
  
  const bodyTopVal = Math.max(open, close);
  const bodyBottomVal = Math.min(open, close);
  const bodyRange = bodyTopVal - bodyBottomVal;
  
  // Avoid division by zero for Doji (Open == Close)
  const safeBodyRange = bodyRange === 0 ? 1 : bodyRange;
  const pixelPerUnit = height / safeBodyRange; 
  
  const highDiff = high - bodyTopVal;
  const lowDiff = bodyBottomVal - low;
  
  const wickTopY = y - (highDiff * pixelPerUnit);
  const wickBottomY = (y + height) + (lowDiff * pixelPerUnit);
  
  // Center of the bar
  const cx = x + width / 2;

  return (
    <g>
      {/* Wick */}
      <line x1={cx} y1={wickTopY} x2={cx} y2={wickBottomY} stroke={color} strokeWidth={1.5} />
      {/* Body */}
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={Math.max(height, 1)} // Ensure at least 1px visibility
        fill={color} 
        stroke="none" 
      />
    </g>
  );
};

// Star Icon for Peak
const PeakStar = (props: any) => {
  const { x, y, width, value } = props;
  
  // CRITICAL: Only render if value exists (high value)
  if (!value) return null;

  return (
    <text x={x + width / 2} y={y - 12} fill="#EF4444" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="bold" style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))' }}>
      ★
    </text>
  );
};

const KLineChart: React.FC<KLineChartProps> = ({ data, volatilityAnalysis, lang, theme }) => {
  const t = getTexts(lang);
  
  // Determine chart colors based on theme
  const gridColor = theme === 'dark' ? '#334155' : '#f0f0f0';
  const tickColor = theme === 'dark' ? '#64748b' : '#9CA3AF';
  const axisColor = theme === 'dark' ? '#475569' : '#e5e7eb';

  const chartData = data.map((d) => ({
    ...d,
    peakMarker: d.isPeak ? d.high : null
  }));

  return (
    <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 mb-8 transition-colors">
        <div className="flex justify-between items-end mb-6">
            <div>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.klineTitle}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.klineSubtitle}</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div> {t.bullMarket}
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div> {t.bearMarket}
                </div>
            </div>
        </div>

      <div className="h-[400px] w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
                dataKey="age" 
                tickLine={false} 
                axisLine={{ stroke: axisColor }}
                tick={{fill: tickColor, fontSize: 10}}
                interval={9} // Show every 10 years roughly
            />
            <YAxis 
                domain={[0, 110]} // Add padding for the star
                hide={false}
                tickLine={false}
                axisLine={{ stroke: axisColor }}
                tick={{fill: tickColor, fontSize: 10}}
                orientation="right"
            />
            <Tooltip content={<CustomTooltip lang={lang} theme={theme} />} cursor={{fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}} />
            
            {/* Candle Bar */}
            <Bar 
                dataKey={(datum) => [Math.min(datum.open, datum.close), Math.max(datum.open, datum.close)]} 
                shape={<CandleShape />} 
                animationDuration={1500}
                isAnimationActive={false} // optimization
            >
                <LabelList dataKey="peakMarker" content={<PeakStar />} />
            </Bar>
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volatility Logic Analysis */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
            <TrendingUp size={16} />
            {t.volatilityAnalysis}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {volatilityAnalysis}
        </p>
      </div>
    </div>
  );
};

export default KLineChart;