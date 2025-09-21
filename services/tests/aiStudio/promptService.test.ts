import { describe, it, expect, beforeEach, vi } from 'vitest';
import { promptService } from '../../aiStudio/promptService';
import { CreatePromptData, UpdatePromptData } from '../../../types/aiStudio';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn()
};

vi.mock('../../supabaseClient', () => ({
  supabase: mockSupabase
}));

describe('PromptService', () => {
  const mockPrompt = {
    PromptID: '123e4567-e89b-12d3-a456-426614174000',
    UserPrompt: 'Test user prompt',
    AiResponse: 'Test AI response',
    AiModel: 'gpt-3.5-turbo',
    IsResponsed: true,
    EnableGrounding: false,
    EnableUrlContext: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPrompt', () => {
    it('should create a prompt successfully', async () => {
      const createData: CreatePromptData = {
        UserPrompt: 'New user prompt',
        AiResponse: 'New AI response',
        AiModel: 'gpt-4'
      };

      const mockResult = {
        data: { ...mockPrompt, ...createData, PromptID: 'new-id' },
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

      const result = await promptService.createPrompt(createData);

      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data?.UserPrompt).toBe('New user prompt');
    });

    it('should handle creation errors', async () => {
      const createData: CreatePromptData = {
        UserPrompt: 'New user prompt',
        AiResponse: 'New AI response',
        AiModel: 'gpt-4'
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

      const result = await promptService.createPrompt(createData);

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Database error');
      expect(result.data).toBeNull();
    });
  });

  describe('getPrompt', () => {
    it('should fetch a prompt by ID', async () => {
      const mockResult = {
        data: mockPrompt,
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

      const result = await promptService.getPrompt('123e4567-e89b-12d3-a456-426614174000');

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockPrompt);
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

      const result = await promptService.getPrompt('invalid-id');

      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
    });
  });

  describe('getPrompts', () => {
    it('should fetch prompts with pagination', async () => {
      const mockData = [mockPrompt];
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

      const result = await promptService.getPrompts({ limit: 10, offset: 0 });

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(1);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('updatePrompt', () => {
    it('should update a prompt successfully', async () => {
      const updateData: UpdatePromptData = {
        UserPrompt: 'Updated user prompt'
      };

      const mockResult = {
        data: { ...mockPrompt, ...updateData },
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

      const result = await promptService.updatePrompt('123e4567-e89b-12d3-a456-426614174000', updateData);

      expect(result.error).toBeNull();
      expect(result.data?.UserPrompt).toBe('Updated user prompt');
    });
  });

  describe('deletePrompt', () => {
    it('should delete a prompt successfully', async () => {
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

      const result = await promptService.deletePrompt('123e4567-e89b-12d3-a456-426614174000');

      expect(result.error).toBeNull();
      expect(result.data).toBeNull();
    });
  });

  describe('searchPrompts', () => {
    it('should search prompts by user prompt text', async () => {
      const mockData = [mockPrompt];
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

      const result = await promptService.searchPrompts('Test');

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(1);
    });
  });

  describe('getPromptsByModel', () => {
    it('should fetch prompts by AI model', async () => {
      const mockData = [mockPrompt];
      const mockResult = {
        data: mockData,
        error: null,
        count: 1
      };

      const mockRange = vi.fn().mockResolvedValue(mockResult);
      const mockOrder = vi.fn(() => ({ range: mockRange }));
      const mockEq = vi.fn(() => ({ order: mockOrder }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: mockSelect,
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await promptService.getPromptsByModel('gpt-3.5-turbo');

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(1);
    });
  });

  describe('getRespondedPrompts', () => {
    it('should fetch responded prompts', async () => {
      const mockData = [mockPrompt];
      const mockResult = {
        data: mockData,
        error: null,
        count: 1
      };

      const mockRange = vi.fn().mockResolvedValue(mockResult);
      const mockOrder = vi.fn(() => ({ range: mockRange }));
      const mockEq = vi.fn(() => ({ order: mockOrder }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: mockSelect,
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await promptService.getRespondedPrompts();

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(1);
    });
  });

  describe('getUnrespondedPrompts', () => {
    it('should fetch unresponded prompts', async () => {
      const mockData = [mockPrompt];
      const mockResult = {
        data: mockData,
        error: null,
        count: 1
      };

      const mockRange = vi.fn().mockResolvedValue(mockResult);
      const mockOrder = vi.fn(() => ({ range: mockRange }));
      const mockEq = vi.fn(() => ({ order: mockOrder }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: mockSelect,
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await promptService.getUnrespondedPrompts();

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(1);
    });
  });

  describe('getGroundedPrompts', () => {
    it('should fetch grounded prompts', async () => {
      const mockData = [mockPrompt];
      const mockResult = {
        data: mockData,
        error: null,
        count: 1
      };

      const mockRange = vi.fn().mockResolvedValue(mockResult);
      const mockOrder = vi.fn(() => ({ range: mockRange }));
      const mockEq = vi.fn(() => ({ order: mockOrder }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(),
        select: mockSelect,
        update: vi.fn(),
        delete: vi.fn()
      });

      const result = await promptService.getGroundedPrompts();

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(1);
    });
  });

  describe('markAsResponded', () => {
    it('should mark prompt as responded', async () => {
      const mockResult = {
        data: { ...mockPrompt, IsResponsed: true },
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

      const result = await promptService.markAsResponded('123e4567-e89b-12d3-a456-426614174000');

      expect(result.error).toBeNull();
      expect(result.data?.IsResponsed).toBe(true);
    });
  });

  describe('toggleGrounding', () => {
    it('should toggle grounding for a prompt', async () => {
      const mockResult = {
        data: { ...mockPrompt, EnableGrounding: true },
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

      const result = await promptService.toggleGrounding('123e4567-e89b-12d3-a456-426614174000', true);

      expect(result.error).toBeNull();
      expect(result.data?.EnableGrounding).toBe(true);
    });
  });

  describe('toggleUrlContext', () => {
    it('should toggle URL context for a prompt', async () => {
      const mockResult = {
        data: { ...mockPrompt, EnableUrlContext: false },
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

      const result = await promptService.toggleUrlContext('123e4567-e89b-12d3-a456-426614174000', false);

      expect(result.error).toBeNull();
      expect(result.data?.EnableUrlContext).toBe(false);
    });
  });
});