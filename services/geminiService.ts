
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Review } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeReviews = async (reviews: Review[], businessName: string, businessType: string): Promise<AnalysisResult> => {
  const modelName = 'gemini-3-flash-preview';
  
  const reviewsText = reviews.map((r, i) => `Review #${i}: "${r.text}"`).join('\n\n');

  const systemInstruction = `
    You are a world-class customer experience and business analyst. 
    Analyze the provided customer reviews for "${businessName}" (${businessType}).
    Extract sentiment, themes, emotions, and actionable insights.
    Provide a comprehensive, high-quality JSON response.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: 'Executive summary of the overall analysis.' },
      overallSentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] },
      sentimentScore: { type: Type.NUMBER, description: 'Score from 0 to 100 representing health of customer satisfaction.' },
      themes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            count: { type: Type.NUMBER },
            sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] }
          },
          required: ['name', 'count', 'sentiment']
        }
      },
      topKeywords: {
        type: Type.OBJECT,
        properties: {
          positive: { type: Type.ARRAY, items: { type: Type.STRING } },
          negative: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['positive', 'negative']
      },
      emotionDistribution: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            value: { type: Type.NUMBER }
          },
          required: ['name', 'value']
        }
      },
      repeatedComplaints: { type: Type.ARRAY, items: { type: Type.STRING } },
      repeatedHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
      actionSuggestions: {
        type: Type.OBJECT,
        properties: {
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketing: { type: Type.ARRAY, items: { type: Type.STRING } },
          support: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['improvements', 'marketing', 'support']
      },
      individualAnalysis: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            index: { type: Type.NUMBER },
            sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
            category: { type: Type.STRING },
            emotions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['index', 'sentiment', 'category', 'emotions']
        }
      }
    },
    required: [
      'summary', 'overallSentiment', 'sentimentScore', 'themes', 
      'topKeywords', 'emotionDistribution', 'repeatedComplaints', 
      'repeatedHighlights', 'actionSuggestions', 'individualAnalysis'
    ]
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Analyze these reviews for ${businessName}:\n\n${reviewsText}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.1,
    }
  });

  return JSON.parse(response.text) as AnalysisResult;
};
