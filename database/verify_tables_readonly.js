/**
 * Read-Only AI Studio Tables Verification Script
 *
 * This script verifies that the AI Studio tables exist and are accessible
 * without requiring insert permissions (for RLS testing).
 *
 * Usage:
 * 1. Make sure your Supabase environment variables are set in .env
 * 2. Run: node database/verify_tables_readonly.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read environment variables from .env file
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const env = {};

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });

    return env;
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in .env file');
  console.log('📝 Please check your .env file contains:');
  console.log('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('   VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTables() {
  console.log('🔍 Verifying AI Studio tables (read-only)...\n');

  // Test 1: Check if tables exist by trying to query them
  console.log('1. Checking table existence...');

  try {
    // Check AiStudioConverstionSync table
    const { data: conversations, error: convError } = await supabase
      .from('AiStudioConverstionSync')
      .select('*')
      .limit(1);

    if (convError) {
      console.error('❌ Error accessing AiStudioConverstionSync table:', convError.message);
      console.log('💡 This might be due to Row Level Security (RLS) policies');
      console.log('   Try updating RLS policies to allow anon access for testing');
      return false;
    }

    console.log('✅ AiStudioConverstionSync table exists and is accessible');

    // Check AiPrompts table
    const { data: prompts, error: promptError } = await supabase
      .from('AiPrompts')
      .select('*')
      .limit(1);

    if (promptError) {
      console.error('❌ Error accessing AiPrompts table:', promptError.message);
      console.log('💡 This might be due to Row Level Security (RLS) policies');
      console.log('   Try updating RLS policies to allow anon access for testing');
      return false;
    }

    console.log('✅ AiPrompts table exists and is accessible');

  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return false;
  }

  // Test 2: Test table structure by checking column names
  console.log('\n2. Testing table structure...');

  try {
    // Test a simple query to verify structure
    const { data: testData, error: testError } = await supabase
      .from('AiStudioConverstionSync')
      .select('ConversionID, ConverstionTitle, created_at')
      .limit(1);

    if (testError) {
      console.error('❌ Error testing table structure:', testError.message);
      return false;
    }

    console.log('✅ Table structure is correct');
    console.log('   Available columns: ConversionID, ConverstionTitle, created_at');

    // Test AiPrompts structure
    const { data: promptTestData, error: promptTestError } = await supabase
      .from('AiPrompts')
      .select('PromptID, UserPrompt, AiModel, IsResponsed')
      .limit(1);

    if (promptTestError) {
      console.error('❌ Error testing AiPrompts structure:', promptTestError.message);
      return false;
    }

    console.log('✅ AiPrompts structure is correct');
    console.log('   Available columns: PromptID, UserPrompt, AiModel, IsResponsed');

  } catch (error) {
    console.error('❌ Error during structure verification:', error.message);
    return false;
  }

  // Test 3: Test unresponded prompts query (read-only)
  console.log('\n3. Testing unresponded prompts query...');

  try {
    const { data: unrespondedPrompts, error: unrespondedError } = await supabase
      .from('AiPrompts')
      .select('PromptID, UserPrompt, IsResponsed')
      .eq('IsResponsed', false);

    if (unrespondedError) {
      console.error('❌ Error querying unresponded prompts:', unrespondedError.message);
      return false;
    }

    console.log('✅ Unresponded prompts query works');
    console.log(`   Found ${unrespondedPrompts.length} unresponded prompt(s)`);

  } catch (error) {
    console.error('❌ Error during unresponded prompts test:', error.message);
    return false;
  }

  console.log('\n🎉 All read-only tests passed! AI Studio tables are working correctly.');
  console.log('\n📝 Note: If you need to insert data, you may need to update RLS policies');
  console.log('   or use the service role key for testing.');
  return true;
}

// Run verification
verifyTables().then(success => {
  if (!success) {
    process.exit(1);
  }
});