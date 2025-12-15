import OpenAI from "openai";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { UserInput, AnalysisResult, Language, BaZiResult } from "../types";

// 读取环境变量
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const baseURL = import.meta.env.VITE_BASE_URL || "";
const modelId = import.meta.env.VITE_MODEL_NAME || "gemini-2.0-flash-thinking-exp-01-21";

// 判断使用哪种 API 模式
const useNativeGemini = !baseURL; // 如果 baseURL 为空，使用原生 Gemini API

// 初始化客户端
let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;

if (useNativeGemini) {
  // 使用原生 Gemini API
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  // 使用第三方转发平台
  openai = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
    defaultHeaders: { "x-foo": "true" },
    dangerouslyAllowBrowser: true
  });
}

// ------------------------------------------------------------------
// Schema 定义（用于原生 Gemini）
// ------------------------------------------------------------------

const baziCalculationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    solarTime: { type: SchemaType.STRING, description: "Calculated True Solar Time in HH:mm format" },
    lunarDate: { type: SchemaType.STRING, description: "Lunar Date representation (e.g., '1990年腊月初五')" },
    bazi: {
      type: SchemaType.OBJECT,
      properties: {
        year: { type: SchemaType.OBJECT, properties: { gan: { type: SchemaType.STRING }, zhi: { type: SchemaType.STRING } } },
        month: { type: SchemaType.OBJECT, properties: { gan: { type: SchemaType.STRING }, zhi: { type: SchemaType.STRING } } },
        day: { type: SchemaType.OBJECT, properties: { gan: { type: SchemaType.STRING }, zhi: { type: SchemaType.STRING } } },
        hour: { type: SchemaType.OBJECT, properties: { gan: { type: SchemaType.STRING }, zhi: { type: SchemaType.STRING } } },
      },
    },
    startAge: { type: SchemaType.INTEGER, description: "The age when the first Big Luck cycle starts" },
    direction: { type: SchemaType.STRING, description: "Forward or Backward based on Gender and Year Stem" },
    daYun: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of the first 8-10 Big Luck Pillars (GanZhi) e.g. ['甲子', '乙丑']"
    }
  },
  required: ["solarTime", "lunarDate", "bazi", "startAge", "direction", "daYun"]
};

const scoredContentSchema = {
  type: SchemaType.OBJECT,
  properties: {
    content: { type: SchemaType.STRING },
    rating: { type: SchemaType.INTEGER, description: "Rating from 1 to 10" }
  },
  required: ["content", "rating"]
};

const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    mainAttribute: { type: SchemaType.STRING, description: "e.g., 'Weak Fire', 'Strong Metal'" },
    generalComment: { type: SchemaType.STRING, description: "A summary of the life destiny." },
    cryptoFortune: scoredContentSchema,
    personality: scoredContentSchema,
    career: scoredContentSchema,
    fengShui: scoredContentSchema,
    wealth: scoredContentSchema,
    marriage: scoredContentSchema,
    volatilityAnalysis: { type: SchemaType.STRING, description: "Analysis of the volatility logic in the chart." },
    timeline: {
      type: SchemaType.ARRAY,
      description: "A list of 100 years of fortune data starting STRICTLY from the user's Birth Year.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          year: { type: SchemaType.INTEGER, description: "Calendar Year (e.g. 2002)" },
          age: { type: SchemaType.INTEGER, description: "Virtual Age (e.g. 1)" },
          open: { type: SchemaType.INTEGER },
          close: { type: SchemaType.INTEGER },
          high: { type: SchemaType.INTEGER },
          low: { type: SchemaType.INTEGER },
          summary: { type: SchemaType.STRING },
          detailedReview: { type: SchemaType.STRING, description: "A detailed 1-2 sentence review of this specific year." },
          isPeak: { type: SchemaType.BOOLEAN },
        },
        required: ["year", "age", "open", "close", "high", "low", "summary", "detailedReview"],
      },
    },
  },
  required: ["timeline", "personality", "cryptoFortune", "career", "fengShui", "wealth", "marriage", "generalComment", "mainAttribute", "volatilityAnalysis"],
};

// ------------------------------------------------------------------
// Schema Prompt（用于 OpenAI 格式）
// ------------------------------------------------------------------

const baziCalculationSchemaPrompt = `
Return ONLY valid JSON matching this exact schema (no markdown, no code blocks):
{
  "solarTime": "string - Calculated True Solar Time in HH:mm format",
  "lunarDate": "string - Lunar Date representation (e.g., '1990年腊月初五')",
  "bazi": {
    "year": { "gan": "string", "zhi": "string" },
    "month": { "gan": "string", "zhi": "string" },
    "day": { "gan": "string", "zhi": "string" },
    "hour": { "gan": "string", "zhi": "string" }
  },
  "startAge": "integer - The age when the first Big Luck cycle starts",
  "direction": "string - Forward or Backward based on Gender and Year Stem",
  "daYun": ["array of strings - List of the first 8-10 Big Luck Pillars (GanZhi) e.g. ['甲子', '乙丑']"]
}
`;

const analysisSchemaPrompt = `
Return ONLY valid JSON matching this exact schema (no markdown, no code blocks):
{
  "mainAttribute": "string - e.g., 'Weak Fire', 'Strong Metal'",
  "generalComment": "string - A summary of the life destiny",
  "cryptoFortune": {
    "content": "string - Analysis of crypto/trading fortune",
    "rating": "integer - Rating from 1 to 10"
  },
  "personality": {
    "content": "string - Personality analysis",
    "rating": "integer - Rating from 1 to 10"
  },
  "career": {
    "content": "string - Career analysis",
    "rating": "integer - Rating from 1 to 10"
  },
  "fengShui": {
    "content": "string - Feng Shui recommendations",
    "rating": "integer - Rating from 1 to 10"
  },
  "wealth": {
    "content": "string - Wealth level analysis",
    "rating": "integer - Rating from 1 to 10"
  },
  "marriage": {
    "content": "string - Marriage/emotion analysis",
    "rating": "integer - Rating from 1 to 10"
  },
  "volatilityAnalysis": "string - Analysis of the volatility logic in the chart",
  "timeline": [
    {
      "year": "integer - Calendar Year (e.g. 2002)",
      "age": "integer - Virtual Age (e.g. 1)",
      "open": "integer - 0-100",
      "close": "integer - 0-100",
      "high": "integer - 0-100",
      "low": "integer - 0-100",
      "summary": "string - Brief summary of the year",
      "detailedReview": "string - A detailed 1-2 sentence review of this specific year",
      "isPeak": "boolean - false for most years"
    }
  ]
}
IMPORTANT: The timeline array must contain EXACTLY 100 entries.
`;

// ------------------------------------------------------------------
// 1. Calculate BaZi (Preliminary Step)
// ------------------------------------------------------------------

export const calculateBaZi = async (input: UserInput): Promise<BaZiResult> => {
  const prompt = `
    You are an expert in Traditional Chinese BaZi (Four Pillars).

    Calculate the BaZi chart for:
    Date: ${input.birthDate}
    Clock Time: ${input.birthTime}
    Location: ${input.birthLocation} (Use this to calculate True Solar Time deviation from UTC/Standard time)
    Gender: ${input.gender}

    1. Calculate True Solar Time (真太阳时).
    2. Convert the date to Chinese Lunar Date (农历).
    3. Arrange the Year, Month, Day, and Hour pillars accurately based on Solar Time.
    4. Calculate the Start Age (起运岁数) and Direction (Forward/Backward).
    5. List the first 10 Big Luck (Da Yun) pillars.

    ${useNativeGemini ? 'Return JSON only.' : baziCalculationSchemaPrompt}
  `;

  try {
    let text: string | null = null;

    if (useNativeGemini && genAI) {
      // 使用原生 Gemini API
      const model = genAI.getGenerativeModel({
        model: modelId,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: baziCalculationSchema,
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      text = response.text();
    } else if (openai) {
      // 使用第三方转发平台
      const response = await openai.chat.completions.create({
        model: modelId,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      text = response.choices[0]?.message?.content || null;
    }

    if (text) {
      const data = JSON.parse(text);
      return {
        ...data,
        userInput: input
      };
    }
    throw new Error("Failed to calculate BaZi");
  } catch (error) {
    console.error("Gemini BaZi Calc Error:", error);
    throw error;
  }
};

// ------------------------------------------------------------------
// 2. Generate Full Analysis (Final Step)
// ------------------------------------------------------------------

export const generateDestinyAnalysis = async (confirmedBaZi: BaZiResult, lang: Language = 'en'): Promise<AnalysisResult> => {
  const langInstruction = lang === 'zh' ? "Simplified Chinese (简体中文)" : "English";

  // We explicitly provide the CONFIRMED bazi to the AI so it doesn't recalculate it differently.
  const baziString = JSON.stringify(confirmedBaZi.bazi);
  const daYunString = confirmedBaZi.daYun.join(", ");

  // Extract birth year reliably
  let birthYear = 1990;
  try {
     birthYear = parseInt(confirmedBaZi.userInput.birthDate.split('-')[0]);
  } catch (e) {
     console.error("Error parsing birth year", e);
  }

  const prompt = `
    You are a master of BaZi and Financial Analysis.

    Input Data (CONFIRMED BY USER - DO NOT RECALCULATE, USE AS TRUTH):
    BaZi Chart: ${baziString}
    Gender: ${confirmedBaZi.userInput.gender}
    Big Luck Cycles: ${daYunString}
    Start Age: ${confirmedBaZi.startAge}
    Birth Year: ${birthYear}

    Task:
    1. Analyze the user's "Life Stock Market" based strictly on the provided BaZi chart.
    2. Generate 100 years of fortune data (K-Line style: Open, Close, High, Low 0-100).
       - **CRITICAL**: The timeline MUST start exactly from the Birth Year (${birthYear}).
       - Entry 1: Year = ${birthYear}, Age = 1 (Virtual Age).
       - Entry 2: Year = ${birthYear + 1}, Age = 2...
       - ...
       - Entry 100: Year = ${birthYear + 99}, Age = 100.
       - Ensure the array contains exactly 100 entries.
       - Note that the "Big Luck" (Da Yun) starts at age ${confirmedBaZi.startAge}. Before this age, fortune is determined by the Month Pillar and Small Luck (Xiao Yun).

       - **CRITICAL**: You MUST generate both Bull (Up) and Bear (Down) years.
       - If a year is unlucky or declining, Ensure 'Close' < 'Open' to create a RED candle.
       - If a year is lucky or improving, Ensure 'Close' > 'Open' to create a GREEN candle.
       - Create realistic volatility. Do not make all years green.

    3. Provide structured analysis for the following sections with a 1-10 rating:
       - Crypto/Web3 Trading Luck (币圈交易运势)
       - Personality Analysis (性格分析)
       - Career/Industry (事业行业)
       - Development Feng Shui (发展风水)
       - Wealth Level (财富层级)
       - Marriage/Emotion (婚姻情感)
    4. Provide a "Volatility Logic Analysis" paragraph explaining why the chart moves the way it does.

    IMPORTANT: Output text in ${langInstruction}.

    ${useNativeGemini ? 'Return JSON matching the schema.' : analysisSchemaPrompt}
  `;

  try {
    let text: string | null = null;

    if (useNativeGemini && genAI) {
      // 使用原生 Gemini API
      const model = genAI.getGenerativeModel({
        model: modelId,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
        },
      });

      const genResult = await model.generateContent(prompt);
      const response = genResult.response;
      text = response.text();
    } else if (openai) {
      // 使用第三方转发平台
      const response = await openai.chat.completions.create({
        model: modelId,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      text = response.choices[0]?.message?.content || null;
    }

    if (text) {
      const result = JSON.parse(text);

      // -----------------------------------------------------------------------
      // DATA CLEANUP: STRICTLY ENFORCE SINGLE PEAK
      // -----------------------------------------------------------------------
      // Logic: Highest 'high', tie-break with 'close', tie-break with earliest year.
      let maxHigh = -Infinity;
      let maxClose = -Infinity;
      let peakIdx = -1;

      // First pass: find the absolute peak
      if (result.timeline && Array.isArray(result.timeline)) {
        result.timeline.forEach((item: any, idx: number) => {
          // Normalize AI noise
          item.isPeak = false;

          if (item.high > maxHigh) {
            maxHigh = item.high;
            maxClose = item.close;
            peakIdx = idx;
          } else if (item.high === maxHigh) {
            if (item.close > maxClose) {
               maxClose = item.close;
               peakIdx = idx;
            }
          }
        });

        // Set single peak
        if (peakIdx !== -1 && result.timeline[peakIdx]) {
           result.timeline[peakIdx].isPeak = true;
        }
      }

      return {
        ...result,
        bazi: confirmedBaZi.bazi
      };
    }
    throw new Error("No analysis data returned");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
