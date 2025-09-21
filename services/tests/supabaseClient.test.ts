import { describe, it, expect } from 'vitest';
import { supabase } from '../supabaseClient';

describe('Supabase Client', () => {
  it('should be initialized', () => {
    expect(supabase).toBeDefined();
    expect(supabase).not.toBeNull();
  });

  it('should have the correct URL configured', () => {
    const expectedUrl = import.meta.env.VITE_SUPABASE_URL;
    expect(supabase.supabaseUrl).toBe(expectedUrl);
  });
});
