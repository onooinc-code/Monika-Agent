
import { Message } from './message';

export interface HistoryView {
    fullMessages: Message[];
    summarizedMessages: { id: string; summary: string }[];
    overallSummary: string;
    topics: string[];
}
