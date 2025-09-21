/**
 * Database types for AI Studio tables
 */

// AiStudioConverstionSync table types
export interface AiStudioConversation {
  ConversionID: string;
  ConverstionTitle: string;
  ConverstionTokensCount: number;
  ClearConversion: boolean;
  ConverstionSystemInstructions: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateConversationData {
  ConverstionTitle: string;
  ConverstionTokensCount?: number;
  ClearConversion?: boolean;
  ConverstionSystemInstructions: string;
}

export interface UpdateConversationData {
  ConverstionTitle?: string;
  ConverstionTokensCount?: number;
  ClearConversion?: boolean;
  ConverstionSystemInstructions?: string;
}

// AiPrompts table types
export interface AiPrompt {
  PromptID: string;
  UserPrompt: string;
  AiResponse: string;
  AiModel: string;
  IsResponsed: boolean;
  EnableGrounding: boolean;
  EnableUrlContext: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromptData {
  UserPrompt: string;
  AiResponse: string;
  AiModel: string;
  IsResponsed?: boolean;
  EnableGrounding?: boolean;
  EnableUrlContext?: boolean;
}

export interface UpdatePromptData {
  UserPrompt?: string;
  AiResponse?: string;
  AiModel?: string;
  IsResponsed?: boolean;
  EnableGrounding?: boolean;
  EnableUrlContext?: boolean;
}

// Database response types
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

// Pagination types
export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
}