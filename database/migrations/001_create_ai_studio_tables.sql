-- Migration: Create AI Studio Tables
-- Description: Creates the AiStudioConverstionSync and AiPrompts tables with proper structure, indexes, and RLS policies
-- Date: 2025-09-21

-- Create AiStudioConverstionSync table
CREATE TABLE IF NOT EXISTS "public"."AiStudioConverstionSync" (
    "ConversionID" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "ConverstionTitle" TEXT NOT NULL,
    "ConverstionTokensCount" INTEGER DEFAULT 0,
    "ClearConversion" BOOLEAN DEFAULT false,
    "ConverstionSystemInstructions" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Create AiPrompts table
CREATE TABLE IF NOT EXISTS "public"."AiPrompts" (
    "PromptID" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "UserPrompt" TEXT NOT NULL,
    "AiResponse" TEXT,
    "AiModel" TEXT NOT NULL,
    "IsResponsed" BOOLEAN DEFAULT false,
    "EnableGrounding" BOOLEAN DEFAULT false,
    "EnableUrlContext" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aistudio_conversations_title ON "public"."AiStudioConverstionSync"("ConverstionTitle");
CREATE INDEX IF NOT EXISTS idx_aistudio_conversations_tokens ON "public"."AiStudioConverstionSync"("ConverstionTokensCount");
CREATE INDEX IF NOT EXISTS idx_aistudio_conversations_created ON "public"."AiStudioConverstionSync"("created_at");

CREATE INDEX IF NOT EXISTS idx_aiprompts_model ON "public"."AiPrompts"("AiModel");
CREATE INDEX IF NOT EXISTS idx_aiprompts_responsed ON "public"."AiPrompts"("IsResponsed");
CREATE INDEX IF NOT EXISTS idx_aiprompts_grounding ON "public"."AiPrompts"("EnableGrounding");
CREATE INDEX IF NOT EXISTS idx_aiprompts_created ON "public"."AiPrompts"("created_at");

-- Enable Row Level Security (RLS)
ALTER TABLE "public"."AiStudioConverstionSync" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."AiPrompts" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for AiStudioConverstionSync
CREATE POLICY "Enable read access for authenticated users" ON "public"."AiStudioConverstionSync"
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON "public"."AiStudioConverstionSync"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON "public"."AiStudioConverstionSync"
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON "public"."AiStudioConverstionSync"
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for AiPrompts
CREATE POLICY "Enable read access for authenticated users" ON "public"."AiPrompts"
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON "public"."AiPrompts"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON "public"."AiPrompts"
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON "public"."AiPrompts"
    FOR DELETE USING (auth.role() = 'authenticated');

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."AiStudioConverstionSync";
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."AiPrompts";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_aistudio_conversations_updated_at
    BEFORE UPDATE ON "public"."AiStudioConverstionSync"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aiprompts_updated_at
    BEFORE UPDATE ON "public"."AiPrompts"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();