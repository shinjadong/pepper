export interface EditorContext {
  content: string;
  cursorPosition: number;
  selectedText?: string;
  fileType: string;
  previousContext?: string;
}

export interface AnalysisResult {
  sentiment: string;
  topics: string[];
  summary: string;
  suggestions: string[];
  confidence: number;
}

export interface Suggestion {
  text: string;
  type: 'completion' | 'correction' | 'enhancement';
  confidence: number;
  explanation?: string;
}

export interface Completion {
  text: string;
  confidence: number;
  alternatives?: string[];
}

export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  modelVersion: string;
  maxTokens: number;
  temperature: number;
}
