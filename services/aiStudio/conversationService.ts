import { supabase } from '../supabaseClient.ts';
import {
  AiStudioConversation,
  CreateConversationData,
  UpdateConversationData,
  DatabaseResponse,
  PaginationOptions,
  PaginatedResponse
} from '../../types/aiStudio.ts';

/**
 * Service for managing AI Studio conversations in Supabase
 */
export class ConversationService {
  private readonly tableName = 'AiStudioConverstionSync';

  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationData): Promise<DatabaseResponse<AiStudioConversation>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert({
          ...data,
          ConversionID: crypto.randomUUID(),
          ConverstionTokensCount: data.ConverstionTokensCount || 0,
          ClearConversion: data.ClearConversion || false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: result, error: null };
    } catch (error) {
      console.error('Unexpected error creating conversation:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get a conversation by ID
   */
  async getConversation(conversationId: string): Promise<DatabaseResponse<AiStudioConversation>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('ConversionID', conversationId)
        .single();

      if (error) {
        console.error('Error fetching conversation:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error fetching conversation:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all conversations with pagination
   */
  async getConversations(options: PaginationOptions = {}): Promise<PaginatedResponse<AiStudioConversation>> {
    try {
      const { limit = 50, offset = 0 } = options;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching conversations:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const hasMore = count ? offset + limit < count : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    } catch (error) {
      console.error('Unexpected error fetching conversations:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  /**
   * Update a conversation
   */
  async updateConversation(
    conversationId: string,
    data: UpdateConversationData
  ): Promise<DatabaseResponse<AiStudioConversation>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq('ConversionID', conversationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating conversation:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: result, error: null };
    } catch (error) {
      console.error('Unexpected error updating conversation:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('ConversionID', conversationId);

      if (error) {
        console.error('Error deleting conversation:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: null, error: null };
    } catch (error) {
      console.error('Unexpected error deleting conversation:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Search conversations by title
   */
  async searchConversations(
    searchTerm: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<AiStudioConversation>> {
    try {
      const { limit = 50, offset = 0 } = options;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .ilike('ConverstionTitle', `%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error searching conversations:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const hasMore = count ? offset + limit < count : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    } catch (error) {
      console.error('Unexpected error searching conversations:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  /**
   * Get conversations by token count range
   */
  async getConversationsByTokenRange(
    minTokens: number,
    maxTokens: number,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<AiStudioConversation>> {
    try {
      const { limit = 50, offset = 0 } = options;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .gte('ConverstionTokensCount', minTokens)
        .lte('ConverstionTokensCount', maxTokens)
        .order('ConverstionTokensCount', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching conversations by token range:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const hasMore = count ? offset + limit < count : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    } catch (error) {
      console.error('Unexpected error fetching conversations by token range:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  /**
   * Update conversation token count
   */
  async updateTokenCount(conversationId: string, tokenCount: number): Promise<DatabaseResponse<AiStudioConversation>> {
    return this.updateConversation(conversationId, { ConverstionTokensCount: tokenCount });
  }

  /**
   * Toggle clear conversion flag
   */
  async toggleClearConversion(conversationId: string, clear: boolean): Promise<DatabaseResponse<AiStudioConversation>> {
    return this.updateConversation(conversationId, { ClearConversion: clear });
  }
}

// Export singleton instance
export const conversationService = new ConversationService();