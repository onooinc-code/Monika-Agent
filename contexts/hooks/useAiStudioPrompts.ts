import { useState, useEffect, useCallback } from 'react';
import { promptService } from '../../services/aiStudio/promptService';
import {
  AiPrompt,
  CreatePromptData,
  UpdatePromptData,
  PaginationOptions,
  PaginatedResponse
} from '../../types/aiStudio';

export interface UseAiStudioPromptsReturn {
  prompts: AiPrompt[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  createPrompt: (data: CreatePromptData) => Promise<AiPrompt | null>;
  getPrompt: (id: string) => Promise<AiPrompt | null>;
  updatePrompt: (id: string, data: UpdatePromptData) => Promise<AiPrompt | null>;
  deletePrompt: (id: string) => Promise<boolean>;
  searchPrompts: (searchTerm: string, options?: PaginationOptions) => Promise<void>;
  getPromptsByModel: (model: string, options?: PaginationOptions) => Promise<void>;
  getRespondedPrompts: (options?: PaginationOptions) => Promise<void>;
  getUnrespondedPrompts: (options?: PaginationOptions) => Promise<void>;
  getGroundedPrompts: (options?: PaginationOptions) => Promise<void>;
  loadMorePrompts: () => Promise<void>;
  refreshPrompts: () => Promise<void>;
  markAsResponded: (id: string) => Promise<AiPrompt | null>;
  toggleGrounding: (id: string, enable: boolean) => Promise<AiPrompt | null>;
  toggleUrlContext: (id: string, enable: boolean) => Promise<AiPrompt | null>;
}

export const useAiStudioPrompts = (): UseAiStudioPromptsReturn => {
  const [prompts, setPrompts] = useState<AiPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<{
    type: 'all' | 'model' | 'responded' | 'unresponded' | 'grounded' | 'search';
    value?: string;
  }>({ type: 'all' });

  const PROMPTS_PER_PAGE = 20;

  const loadPrompts = useCallback(async (options: PaginationOptions = {}, filter = currentFilter) => {
    setLoading(true);
    setError(null);

    try {
      let result: PaginatedResponse<AiPrompt>;

      switch (filter.type) {
        case 'model':
          result = await promptService.getPromptsByModel(filter.value!, options);
          break;
        case 'responded':
          result = await promptService.getRespondedPrompts(options);
          break;
        case 'unresponded':
          result = await promptService.getUnrespondedPrompts(options);
          break;
        case 'grounded':
          result = await promptService.getGroundedPrompts(options);
          break;
        case 'search':
          result = await promptService.searchPrompts(filter.value!, options);
          break;
        default:
          result = await promptService.getPrompts(options);
      }

      if (options.offset === 0) {
        setPrompts(result.data);
      } else {
        setPrompts(prev => [...prev, ...result.data]);
      }

      setTotalCount(result.count);
      setHasMore(result.hasMore);
      setCurrentOffset(options.offset || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompts');
      console.error('Error loading prompts:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFilter]);

  const refreshPrompts = useCallback(async () => {
    setCurrentOffset(0);
    await loadPrompts({ limit: PROMPTS_PER_PAGE, offset: 0 });
  }, [loadPrompts]);

  const loadMorePrompts = useCallback(async () => {
    if (!hasMore || loading) return;

    const nextOffset = currentOffset + PROMPTS_PER_PAGE;
    await loadPrompts({ limit: PROMPTS_PER_PAGE, offset: nextOffset });
  }, [hasMore, loading, currentOffset, loadPrompts]);

  const createPrompt = useCallback(async (data: CreatePromptData): Promise<AiPrompt | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await promptService.createPrompt(data);

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      if (result.data) {
        setPrompts(prev => [result.data!, ...prev]);
        setTotalCount(prev => prev + 1);
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create prompt';
      setError(errorMessage);
      console.error('Error creating prompt:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPrompt = useCallback(async (id: string): Promise<AiPrompt | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await promptService.getPrompt(id);

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get prompt';
      setError(errorMessage);
      console.error('Error getting prompt:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePrompt = useCallback(async (id: string, data: UpdatePromptData): Promise<AiPrompt | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await promptService.updatePrompt(id, data);

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      if (result.data) {
        setPrompts(prev =>
          prev.map(prompt => prompt.PromptID === id ? result.data! : prompt)
        );
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update prompt';
      setError(errorMessage);
      console.error('Error updating prompt:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePrompt = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await promptService.deletePrompt(id);

      if (result.error) {
        setError(result.error.message);
        return false;
      }

      setPrompts(prev => prev.filter(prompt => prompt.PromptID !== id));
      setTotalCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete prompt';
      setError(errorMessage);
      console.error('Error deleting prompt:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPrompts = useCallback(async (searchTerm: string, options: PaginationOptions = {}) => {
    setCurrentFilter({ type: 'search', value: searchTerm });
    setCurrentOffset(0);
    await loadPrompts({ limit: PROMPTS_PER_PAGE, offset: 0, ...options }, { type: 'search', value: searchTerm });
  }, [loadPrompts]);

  const getPromptsByModel = useCallback(async (model: string, options: PaginationOptions = {}) => {
    setCurrentFilter({ type: 'model', value: model });
    setCurrentOffset(0);
    await loadPrompts({ limit: PROMPTS_PER_PAGE, offset: 0, ...options }, { type: 'model', value: model });
  }, [loadPrompts]);

  const getRespondedPrompts = useCallback(async (options: PaginationOptions = {}) => {
    setCurrentFilter({ type: 'responded' });
    setCurrentOffset(0);
    await loadPrompts({ limit: PROMPTS_PER_PAGE, offset: 0, ...options }, { type: 'responded' });
  }, [loadPrompts]);

  const getUnrespondedPrompts = useCallback(async (options: PaginationOptions = {}) => {
    setCurrentFilter({ type: 'unresponded' });
    setCurrentOffset(0);
    await loadPrompts({ limit: PROMPTS_PER_PAGE, offset: 0, ...options }, { type: 'unresponded' });
  }, [loadPrompts]);

  const getGroundedPrompts = useCallback(async (options: PaginationOptions = {}) => {
    setCurrentFilter({ type: 'grounded' });
    setCurrentOffset(0);
    await loadPrompts({ limit: PROMPTS_PER_PAGE, offset: 0, ...options }, { type: 'grounded' });
  }, [loadPrompts]);

  const markAsResponded = useCallback(async (id: string): Promise<AiPrompt | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await promptService.markAsResponded(id);

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      if (result.data) {
        setPrompts(prev =>
          prev.map(prompt => prompt.PromptID === id ? result.data! : prompt)
        );
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark prompt as responded';
      setError(errorMessage);
      console.error('Error marking prompt as responded:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleGrounding = useCallback(async (id: string, enable: boolean): Promise<AiPrompt | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await promptService.toggleGrounding(id, enable);

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      if (result.data) {
        setPrompts(prev =>
          prev.map(prompt => prompt.PromptID === id ? result.data! : prompt)
        );
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle grounding';
      setError(errorMessage);
      console.error('Error toggling grounding:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleUrlContext = useCallback(async (id: string, enable: boolean): Promise<AiPrompt | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await promptService.toggleUrlContext(id, enable);

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      if (result.data) {
        setPrompts(prev =>
          prev.map(prompt => prompt.PromptID === id ? result.data! : prompt)
        );
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle URL context';
      setError(errorMessage);
      console.error('Error toggling URL context:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial prompts on mount
  useEffect(() => {
    refreshPrompts();
  }, [refreshPrompts]);

  return {
    prompts,
    loading,
    error,
    totalCount,
    hasMore,
    createPrompt,
    getPrompt,
    updatePrompt,
    deletePrompt,
    searchPrompts,
    getPromptsByModel,
    getRespondedPrompts,
    getUnrespondedPrompts,
    getGroundedPrompts,
    loadMorePrompts,
    refreshPrompts,
    markAsResponded,
    toggleGrounding,
    toggleUrlContext,
  };
};