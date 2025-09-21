import { supabase } from '../supabaseClient.ts';
import {
  AiPrompt,
  CreatePromptData,
  UpdatePromptData,
  DatabaseResponse,
  PaginationOptions,
  PaginatedResponse
} from '../../types/aiStudio.ts';

/**
 * Service for managing AI prompts in Supabase
 */
export class PromptService {
  private readonly tableName = 'AiPrompts';

  /**
   * Create a new prompt
   */
  async createPrompt(data: CreatePromptData): Promise<DatabaseResponse<AiPrompt>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert({
          ...data,
          PromptID: crypto.randomUUID(),
          IsResponsed: data.IsResponsed || false,
          EnableGrounding: data.EnableGrounding || false,
          EnableUrlContext: data.EnableUrlContext || false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating prompt:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: result, error: null };
    } catch (error) {
      console.error('Unexpected error creating prompt:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get a prompt by ID
   */
  async getPrompt(promptId: string): Promise<DatabaseResponse<AiPrompt>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('PromptID', promptId)
        .single();

      if (error) {
        console.error('Error fetching prompt:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error fetching prompt:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all prompts with pagination
   */
  async getPrompts(options: PaginationOptions = {}): Promise<PaginatedResponse<AiPrompt>> {
    try {
      const { limit = 50, offset = 0 } = options;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching prompts:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const hasMore = count ? offset + limit < count : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    } catch (error) {
      console.error('Unexpected error fetching prompts:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  /**
   * Update a prompt
   */
  async updatePrompt(
    promptId: string,
    data: UpdatePromptData
  ): Promise<DatabaseResponse<AiPrompt>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq('PromptID', promptId)
        .select()
        .single();

      if (error) {
        console.error('Error updating prompt:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: result, error: null };
    } catch (error) {
      console.error('Unexpected error updating prompt:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete a prompt
   */
  async deletePrompt(promptId: string): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('PromptID', promptId);

      if (error) {
        console.error('Error deleting prompt:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: null, error: null };
    } catch (error) {
      console.error('Unexpected error deleting prompt:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Search prompts by user prompt text
   */
  async searchPrompts(
    searchTerm: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<AiPrompt>> {
    try {
      const { limit = 50, offset = 0 } = options;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .ilike('UserPrompt', `%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error searching prompts:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const hasMore = count ? offset + limit < count : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    } catch (error) {
      console.error('Unexpected error searching prompts:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  /**
   * Get prompts by AI model
   */
  async getPromptsByModel(
    model: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<AiPrompt>> {
    try {
      const { limit = 50, offset = 0 } = options;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('AiModel', model)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching prompts by model:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const hasMore = count ? offset + limit < count : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    } catch (error) {
      console.error('Unexpected error fetching prompts by model:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  /**
   * Get prompts that have been responded to
   */
  async getRespondedPrompts(options: PaginationOptions = {}): Promise<PaginatedResponse<AiPrompt>> {
    try {
      const { limit = 50, offset = 0 } = options;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('IsResponsed', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching responded prompts:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const hasMore = count ? offset + limit < count : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    } catch (error) {
      console.error('Unexpected error fetching responded prompts:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  /**
   * Get prompts that haven't been responded to
   */
  async getUnrespondedPrompts(options: PaginationOptions = {}): Promise<PaginatedResponse<AiPrompt>> {
    try {
      const { limit = 50, offset = 0 } = options;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('IsResponsed', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching unresponded prompts:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const hasMore = count ? offset + limit < count : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    } catch (error) {
      console.error('Unexpected error fetching unresponded prompts:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  /**
   * Get prompts with grounding enabled
   */
  async getGroundedPrompts(options: PaginationOptions = {}): Promise<PaginatedResponse<AiPrompt>> {
    try {
      const { limit = 50, offset = 0 } = options;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('EnableGrounding', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching grounded prompts:', error);
        return { data: [], count: 0, hasMore: false };
      }

      const hasMore = count ? offset + limit < count : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    } catch (error) {
      console.error('Unexpected error fetching grounded prompts:', error);
      return { data: [], count: 0, hasMore: false };
    }
  }

  /**
   * Mark prompt as responded
   */
  async markAsResponded(promptId: string): Promise<DatabaseResponse<AiPrompt>> {
    return this.updatePrompt(promptId, { IsResponsed: true });
  }

  /**
   * Toggle grounding for a prompt
   */
  async toggleGrounding(promptId: string, enable: boolean): Promise<DatabaseResponse<AiPrompt>> {
    return this.updatePrompt(promptId, { EnableGrounding: enable });
  }

  /**
   * Toggle URL context for a prompt
   */
  async toggleUrlContext(promptId: string, enable: boolean): Promise<DatabaseResponse<AiPrompt>> {
    return this.updatePrompt(promptId, { EnableUrlContext: enable });
  }
}

// Export singleton instance
export const promptService = new PromptService();