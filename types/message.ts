
import { PipelineStep } from './pipeline';
import { PlanStep } from './plan';

export interface Attachment {
  base64: string;
  mimeType: string;
}

export interface Message {
  id: string;
  text: string;
  summary?: string;
  sender: 'user' | string; // agent id or 'user' or 'system'
  attachment?: Attachment;
  timestamp: string;
  responseTimeMs?: number;
  isBookmarked?: boolean;
  isEditing?: boolean;
  isStreaming?: boolean;
  alternatives?: Omit<Message, 'id' | 'alternatives' | 'activeAlternativeIndex'>[];
  activeAlternativeIndex?: number;
  pipeline?: PipelineStep[];
  plan?: PlanStep[];
  messageType?: 'insight' | 'topic_divider';
}
