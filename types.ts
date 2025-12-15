export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export type Language = 'en' | 'zh';

export interface UserInput {
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthLocation: string;
}

export interface BaZiPillar {
  gan: string; // Heavenly Stem
  zhi: string; // Earthly Branch
  element?: string; // e.g., "Yang Fire"
}

export interface BaZiChart {
  year: BaZiPillar;
  month: BaZiPillar;
  day: BaZiPillar;
  hour: BaZiPillar;
}

// Intermediate result for confirmation step
export interface BaZiResult {
  userInput: UserInput;
  solarTime: string; // HH:mm
  lunarDate: string; // Lunar Date string (e.g. "一九九零年腊月初五")
  bazi: BaZiChart;
  startAge: number; // Age the Da Yun starts
  direction: string; // Forward or Backward
  daYun: string[]; // List of Big Luck pillars (e.g. "甲子", "乙丑")
}

export interface YearlyFortune {
  year: number;
  age: number;
  open: number; // Luck score start
  close: number; // Luck score end
  high: number; // Peak luck
  low: number; // Lowest luck
  summary: string; // Short summary for tooltip
  detailedReview: string; // Detailed text for bottom report
  isPeak?: boolean; // Is this a local maximum/life peak?
}

export interface ScoredContent {
  content: string;
  rating: number; // 1-10
}

export interface AnalysisResult {
  bazi: BaZiChart; // This will be the confirmed chart
  mainAttribute: string; // e.g., "Weak Fire", "Strong Wood"
  generalComment: string; // Destiny Overview
  
  // New Scored Sections
  cryptoFortune: ScoredContent;
  personality: ScoredContent;
  career: ScoredContent;
  fengShui: ScoredContent;
  wealth: ScoredContent;
  marriage: ScoredContent;
  
  volatilityAnalysis: string; // Logic analysis for the chart
  timeline: YearlyFortune[];
}
