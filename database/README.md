# AI Studio Database Setup

This directory contains the database migration files for the AI Studio Supabase integration.

## Tables Created

### 1. AiStudioConverstionSync
- **Purpose**: Stores AI conversation sessions
- **Key Fields**:
  - `ConversionID` (UUID, Primary Key)
  - `ConverstionTitle` (TEXT, NOT NULL)
  - `ConverstionTokensCount` (INTEGER, Default: 0)
  - `ClearConversion` (BOOLEAN, Default: false)
  - `ConverstionSystemInstructions` (TEXT)
  - `created_at`, `updated_at` (TIMESTAMPTZ)

### 2. AiPrompts
- **Purpose**: Stores individual AI prompts and responses
- **Key Fields**:
  - `PromptID` (UUID, Primary Key)
  - `UserPrompt` (TEXT, NOT NULL)
  - `AiResponse` (TEXT)
  - `AiModel` (TEXT, NOT NULL)
  - `IsResponsed` (BOOLEAN, Default: false)
  - `EnableGrounding` (BOOLEAN, Default: false)
  - `EnableUrlContext` (BOOLEAN, Default: false)
  - `created_at`, `updated_at` (TIMESTAMPTZ)

## How to Execute the Migration

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `migrations/001_create_ai_studio_tables.sql`
4. Click "Run" to execute the migration

### Option 2: Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: Direct SQL Execution
If you have direct database access, you can run:
```sql
\i database/migrations/001_create_ai_studio_tables.sql
```

## Post-Migration Verification

After running the migration, verify the tables were created successfully:

1. **Check Tables Exist**:
   - Go to Table Editor in Supabase Dashboard
   - Verify both `AiStudioConverstionSync` and `AiPrompts` tables appear

2. **Test with Sample Data**:
   ```sql
   -- Insert a test conversation
   INSERT INTO "AiStudioConverstionSync" ("ConverstionTitle", "ConverstionSystemInstructions")
   VALUES ('Test Conversation', 'You are a helpful assistant');

   -- Insert a test prompt
   INSERT INTO "AiPrompts" ("UserPrompt", "AiModel")
   VALUES ('Hello, how are you?', 'gpt-3.5-turbo');
   ```

3. **Verify RLS Policies**:
   - Tables should have Row Level Security enabled
   - Real-time subscriptions should be active

## Features Enabled

- ✅ **Row Level Security (RLS)** - Secure access control
- ✅ **Real-time Subscriptions** - Live data updates
- ✅ **Automatic Timestamps** - created_at/updated_at tracking
- ✅ **Performance Indexes** - Optimized queries
- ✅ **UUID Primary Keys** - Scalable unique identifiers

## Troubleshooting

### Tables Not Visible
- Refresh the Supabase Dashboard
- Check the SQL Editor for any error messages
- Verify your user has the necessary permissions

### Permission Errors
- Ensure you're using the service role key for initial setup
- Check that RLS policies are correctly configured
- Verify your authentication setup

### Connection Issues
- Verify your Supabase URL and keys in the environment variables
- Check network connectivity to Supabase
- Ensure the project is active in your Supabase dashboard