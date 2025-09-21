import { useState, useEffect, useCallback } from 'react';
import { conversationService } from '../../services/aiStudio/conversationService';
import {
  AiStudioConversation,
  CreateConversationData,
  UpdateConversationData,
  PaginationOptions,
  PaginatedResponse
} from '../../types/aiStudio';

export interface UseAiStudioConversationsReturn {
  conversations: AiStudioConversation[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  createConversation: (data: CreateConversationData) => Promise<AiStudioConversation | null>;
  getConversation: (id: string) => Promise<AiStudioConversation | null>;
  updateConversation: (id: string, data: UpdateConversationData) => Promise<AiStudioConversation | null>;
  deleteConversation: (id: string) => Promise<boolean>;
  searchConversations: (searchTerm: string, options?: PaginationOptions) => Promise<void>;
  getConversationsByTokenRange: (minTokens: number, maxTokens: number, options?: PaginationOptions) => Promise<void>;
  loadMoreConversations: () => Promise<void>;
  refreshConversations: () => Promise<void>;
  updateTokenCount: (id: string, tokenCount: number) => Promise<AiStudioConversation | null>;
  toggleClearConversion: (id: string, clear: boolean) => Promise<AiStudioConversation | null>;
}

export const useAiStudioConversations = (): UseAiStudioConversationsReturn => {
  const [conversations, setConversations] = useState<AiStudioConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const CONVERSATIONS_PER_PAGE = 20;

  const loadConversations = useCallback(async (options: PaginationOptions = {}, searchTerm = '') => {
    setLoading(true);
    setError(null);

    try {
      let result: PaginatedResponse<AiStudioConversation>;

      if (searchTerm) {
        result = await conversationService.searchConversations(searchTerm, options);
      } else {
        result = await conversationService.getConversations(options);
      }

      if (options.offset === 0) {
        setConversations(result.data);
      } else {
        setConversations(prev => [...prev, ...result.data]);
      }

      setTotalCount(result.count);
      setHasMore(result.hasMore);
      setCurrentOffset(options.offset || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshConversations = useCallback(async () => {
    setCurrentOffset(0);
    await loadConversations({ limit: CONVERSATIONS_PER_PAGE, offset: 0 }, currentSearchTerm);
  }, [loadConversations, currentSearchTerm]);

  const loadMoreConversations = useCallback(async () => {
    if (!hasMore || loading) return;

    const nextOffset = currentOffset + CONVERSATIONS_PER_PAGE;
    await loadConversations(
      { limit: CONVERSATIONS_PER_PAGE, offset: nextOffset },
      currentSearchTerm
    );
  }, [hasMore, loading, currentOffset, loadConversations, currentSearchTerm]);

  const createConversation = useCallback(async (data: CreateConversationData): Promise<AiStudioConversation | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await conversationService.createConversation(data);

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      if (result.data) {
        setConversations(prev => [result.data!, ...prev]);
        setTotalCount(prev => prev + 1);
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation';
      setError(errorMessage);
      console.error('Error creating conversation:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getConversation = useCallback(async (id: string): Promise<AiStudioConversation | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await conversationService.getConversation(id);

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get conversation';
      setError(errorMessage);
      console.error('Error getting conversation:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConversation = useCallback(async (id: string, data: UpdateConversationData): Promise<AiStudioConversation | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await conversationService.updateConversation(id, data);

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      if (result.data) {
        setConversations(prev =>
          prev.map(conv => conv.ConversionID === id ? result.data! : conv)
        );
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update conversation';
      setError(errorMessage);
      console.error('Error updating conversation:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteConversation = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await conversationService.deleteConversation(id);

      if (result.error) {
        setError(result.error.message);
        return false;
      }

      setConversations(prev => prev.filter(conv => conv.ConversionID !== id));
      setTotalCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete conversation';
      setError(errorMessage);
      console.error('Error deleting conversation:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchConversations = useCallback(async (searchTerm: string, options: PaginationOptions = {}) => {
    setCurrentSearchTerm(searchTerm);
    setIsSearchMode(true);
    setCurrentOffset(0);
    await loadConversations({ limit: CONVERSATIONS_PER_PAGE, offset: 0, ...options }, searchTerm);
  }, [loadConversations]);

  const getConversationsByTokenRange = useCallback(async (minTokens: number, maxTokens: number, options: PaginationOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await conversationService.getConversationsByTokenRange(minTokens, maxTokens, {
        limit: CONVERSATIONS_PER_PAGE,
        offset: 0,
        ...options
      });

      setConversations(result.data);
      setTotalCount(result.count);
      setHasMore(result.hasMore);
      setCurrentOffset(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations by token range';
      setError(errorMessage);
      console.error('Error loading conversations by token range:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTokenCount = useCallback(async (id: string, tokenCount: number): Promise<AiStudioConversation | null> => {
    return updateConversation(id, { ConverstionTokensCount: tokenCount });
  }, [updateConversation]);

  const toggleClearConversion = useCallback(async (id: string, clear: boolean): Promise<AiStudioConversation | null> => {
    return updateConversation(id, { ClearConversion: clear });
  }, [updateConversation]);

  // Load initial conversations on mount
  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  return {
    conversations,
    loading,
    error,
    totalCount,
    hasMore,
    createConversation,
    getConversation,
    updateConversation,
    deleteConversation,
    searchConversations,
    getConversationsByTokenRange,
    loadMoreConversations,
    refreshConversations,
    updateTokenCount,
    toggleClearConversion,
  };
};