
export interface Review {
  id: string;
  text: string;
  rating?: number;
  date?: string;
  author?: string;
}

export interface Theme {
  name: string;
  count: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface EmotionData {
  name: string;
  value: number;
}

export interface ActionSuggestions {
  improvements: string[];
  marketing: string[];
  support: string[];
}

export interface IndividualAnalysis {
  index: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  emotions: string[];
}

export interface AnalysisResult {
  summary: string;
  overallSentiment: 'Positive' | 'Neutral' | 'Negative';
  sentimentScore: number;
  themes: Theme[];
  topKeywords: {
    positive: string[];
    negative: string[];
  };
  emotionDistribution: EmotionData[];
  repeatedComplaints: string[];
  repeatedHighlights: string[];
  actionSuggestions: ActionSuggestions;
  individualAnalysis: IndividualAnalysis[];
}

export type ViewType = 'upload' | 'dashboard' | 'reviews' | 'actions' | 'history';

export interface SavedAnalysis {
  id: string;
  timestamp: number;
  businessName: string;
  reviewCount: number;
  result: AnalysisResult;
}
