import { describe, it, expect, beforeEach, vi } from 'vitest';
import { conversationService } from '../../aiStudio/conversationService';
import { CreateConversationData, UpdateConversationData } from '../../../types/aiStudio';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn()
};

vi.mock('../../supabaseClient', () => ({
  supabase: mockSupabase
}));

describe('ConversationService', () => {
  const mockConversation = {
    ConversionID: '123e4567-e89b-12d3-a456-426614174000',
    ConverstionTitle: 'Test Conversation',
    ConverstionTokensCount: 150,
    ClearConversion: false,
    ConverstionSystemInstructions: 'Test system instructions',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createConversation', () => {
    it('should create a conversation successfully', async () => {
      const createData: CreateConversationData = {
        ConverstionTitle: 'New Conversation',
        ConverstionSystemInstructions: 'System instructions'
      };

      const mockResult = {
        data: { ...mockConversation, ...createData, ConversionID: 'new-id' },
        error: null
      };

      const mockSingle = vi.fn().mockResolvedValue(mockResult);
      const mockSelect = vi.fn(() => ({ single: mockSingle }));
      const mockInsert = vi.fn(() => ({ select: mockSelect }));

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await conversationService.createConversation(createData);

      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data?.ConverstionTitle).toBe('New Conversation');
    });

    it('should handle creation errors', async () => {
      const createData: CreateConversationData = {
        ConverstionTitle: 'New Conversation',
        ConverstionSystemInstructions: 'System instructions'
      };

      const mockResult = {
        data: null,
        error: { message: 'Database error' }
      };

      const mockSingle = vi.fn().mockResolvedValue(mockResult);
      const mockSelect = vi.fn(() => ({ single: mockSingle }));
      const mockInsert = vi.fn(() => ({ select: mockSelect }));

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await conversationService.createConversation(createData);

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Database error');
      expect(result.data).toBeNull();
    });
  });

  describe('getConversation', () => {
    it('should fetch a conversation by ID', async () => {
      const mockResult = {
        data: mockConversation,
        error: null
      };

      const mockSingle = vi.fn().mockResolvedValue(mockResult);
      const mockEq = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: mockSelect,
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await conversationService.getConversation('123e4567-e89b-12d3-a456-426614174000');

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockConversation);
    });

    it('should handle fetch errors', async () => {
      const mockResult = {
        data: null,
        error: { message: 'Not found' }
      };

      const mockSingle = vi.fn().mockResolvedValue(mockResult);
      const mockEq = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: mockSelect,
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await conversationService.getConversation('invalid-id');

      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
    });
  });

  describe('getConversations', () => {
    it('should fetch conversations with pagination', async () => {
      const mockData = [mockConversation];
      const mockResult = {
        data: mockData,
        error: null,
        count: 1
      };

      const mockRange = vi.fn().mockResolvedValue(mockResult);
      const mockOrder = vi.fn(() => ({ range: mockRange }));
      const mockSelect = vi.fn(() => ({ order: mockOrder }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: mockSelect,
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await conversationService.getConversations({ limit: 10, offset: 0 });

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(1);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('updateConversation', () => {
    it('should update a conversation successfully', async () => {
      const updateData: UpdateConversationData = {
        ConverstionTitle: 'Updated Title'
      };

      const mockResult = {
        data: { ...mockConversation, ...updateData },
        error: null
      };

      const mockSingle = vi.fn().mockResolvedValue(mockResult);
      const mockSelect = vi.fn(() => ({ single: mockSingle }));
      const mockEq = vi.fn(() => ({ select: mockSelect }));
      const mockUpdate = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: vi.fn(),
        update: mockUpdate,
        delete: vi.fn()
      });

      const result = await conversationService.updateConversation('123e4567-e89b-12d3-a456-426614174000', updateData);

      expect(result.error).toBeNull();
      expect(result.data?.ConverstionTitle).toBe('Updated Title');
    });
  });

  describe('deleteConversation', () => {
    it('should delete a conversation successfully', async () => {
      const mockResult = {
        error: null
      };

      const mockEq = vi.fn().mockResolvedValue(mockResult);
      const mockDelete = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: vi.fn(),
        update: vi.fn(),
        delete: mockDelete
      });

      const result = await conversationService.deleteConversation('123e4567-e89b-12d3-a456-426614174000');

      expect(result.error).toBeNull();
      expect(result.data).toBeNull();
    });
  });

  describe('searchConversations', () => {
    it('should search conversations by title', async () => {
      const mockData = [mockConversation];
      const mockResult = {
        data: mockData,
        error: null,
        count: 1
      };

      const mockRange = vi.fn().mockResolvedValue(mockResult);
      const mockOrder = vi.fn(() => ({ range: mockRange }));
      const mockIlike = vi.fn(() => ({ order: mockOrder }));
      const mockSelect = vi.fn(() => ({ ilike: mockIlike }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: mockSelect,
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await conversationService.searchConversations('Test');

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(1);
    });
  });

  describe('getConversationsByTokenRange', () => {
    it('should fetch conversations by token range', async () => {
      const mockData = [mockConversation];
      const mockResult = {
        data: mockData,
        error: null,
        count: 1
      };

      const mockRange = vi.fn().mockResolvedValue(mockResult);
      const mockOrder = vi.fn(() => ({ range: mockRange }));
      const mockLte = vi.fn(() => ({ order: mockOrder }));
      const mockGte = vi.fn(() => ({ lte: mockLte }));
      const mockSelect = vi.fn(() => ({ gte: mockGte }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: mockSelect,
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await conversationService.getConversationsByTokenRange(100, 200);

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(1);
    });
  });

  describe('updateTokenCount', () => {
    it('should update conversation token count', async () => {
      const mockResult = {
        data: { ...mockConversation, ConverstionTokensCount: 300 },
        error: null
      };

      const mockSingle = vi.fn().mockResolvedValue(mockResult);
      const mockSelect = vi.fn(() => ({ single: mockSingle }));
      const mockEq = vi.fn(() => ({ select: mockSelect }));
      const mockUpdate = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: vi.fn(),
        update: mockUpdate,
        delete: vi.fn()
      });

      const result = await conversationService.updateTokenCount('123e4567-e89b-12d3-a456-426614174000', 300);

      expect(result.error).toBeNull();
      expect(result.data?.ConverstionTokensCount).toBe(300);
    });
  });

  describe('toggleClearConversion', () => {
    it('should toggle clear conversion flag', async () => {
      const mockResult = {
        data: { ...mockConversation, ClearConversion: true },
        error: null
      };

      const mockSingle = vi.fn().mockResolvedValue(mockResult);
      const mockSelect = vi.fn(() => ({ single: mockSingle }));
      const mockEq = vi.fn(() => ({ select: mockSelect }));
      const mockUpdate = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: vi.fn(),
        update: mockUpdate,
        delete: vi.fn()
      });

      const result = await conversationService.toggleClearConversion('123e4567-e89b-12d3-a456-426614174000', true);

      expect(result.error).toBeNull();
      expect(result.data?.ClearConversion).toBe(true);
    });
  });
});