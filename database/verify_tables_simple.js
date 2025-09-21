/**
 * Simple AI Studio Tables Verification Script
 *
 * This script verifies that the AI Studio tables have been created successfully
 * without requiring additional dependencies.
 *
 * Usage:
 * 1. Make sure your Supabase environment variables are set in .env
 * 2. Run: node database/verify_tables_simple.js
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
  console.log('🔍 Verifying AI Studio tables...\n');

  // Test 1: Check if tables exist
  console.log('1. Checking table existence...');

  try {
    // Check AiStudioConverstionSync table
    const { data: conversations, error: convError } = await supabase
      .from('AiStudioConverstionSync')
      .select('*')
      .limit(1);

    if (convError && convError.code !== 'PGRST116') {
      console.error('❌ Error accessing AiStudioConverstionSync table:', convError.message);
      return false;
    }
    console.log('✅ AiStudioConverstionSync table exists');

    // Check AiPrompts table
    const { data: prompts, error: promptError } = await supabase
      .from('AiPrompts')
      .select('*')
      .limit(1);

    if (promptError && promptError.code !== 'PGRST116') {
      console.error('❌ Error accessing AiPrompts table:', promptError.message);
      return false;
    }
    console.log('✅ AiPrompts table exists');

  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return false;
  }

  // Test 2: Test table structure
  console.log('\n2. Testing table structure...');

  try {
    // Test conversation creation
    const testConversation = {
      ConverstionTitle: 'Test Conversation',
      ConverstionSystemInstructions: 'You are a helpful assistant for testing'
    };

    const { data: newConv, error: createError } = await supabase
      .from('AiStudioConverstionSync')
      .insert(testConversation)
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating test conversation:', createError.message);
      return false;
    }

    console.log('✅ Conversation creation works');
    console.log('   Created conversation:', newConv.ConverstionTitle);

    // Test prompt creation
    const testPrompt = {
      UserPrompt: 'Hello, this is a test prompt',
      AiModel: 'gpt-3.5-turbo'
    };

    const { data: newPrompt, error: promptCreateError } = await supabase
      .from('AiPrompts')
      .insert(testPrompt)
      .select()
      .single();

    if (promptCreateError) {
      console.error('❌ Error creating test prompt:', promptCreateError.message);
      return false;
    }

    console.log('✅ Prompt creation works');
    console.log('   Created prompt:', newPrompt.UserPrompt.substring(0, 30) + '...');

    // Test 3: Test unresponded prompts query
    console.log('\n3. Testing unresponded prompts query...');

    const { data: unrespondedPrompts, error: unrespondedError } = await supabase
      .from('AiPrompts')
      .select('*')
      .eq('IsResponsed', false);

    if (unrespondedError) {
      console.error('❌ Error querying unresponded prompts:', unrespondedError.message);
      return false;
    }

    console.log('✅ Unresponded prompts query works');
    console.log(`   Found ${unrespondedPrompts.length} unresponded prompt(s)`);

    // Test 4: Clean up test data
    console.log('\n4. Cleaning up test data...');

    const { error: deleteConvError } = await supabase
      .from('AiStudioConverstionSync')
      .delete()
      .eq('ConversionID', newConv.ConversionID);

    const { error: deletePromptError } = await supabase
      .from('AiPrompts')
      .delete()
      .eq('PromptID', newPrompt.PromptID);

    if (deleteConvError || deletePromptError) {
      console.error('⚠️  Warning: Could not clean up test data');
    } else {
      console.log('✅ Test data cleaned up successfully');
    }

  } catch (error) {
    console.error('❌ Error during verification:', error.message);
    return false;
  }

  console.log('\n🎉 All tests passed! AI Studio tables are working correctly.');
  return true;
}

// Run verification
verifyTables().then(success => {
  if (!success) {
    process.exit(1);
  }
});