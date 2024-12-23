-- Create AI blocks table
CREATE TABLE ai_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT,
  response_type TEXT CHECK (response_type IN ('text', 'image')),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE ai_blocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own AI blocks"
  ON ai_blocks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI blocks"
  ON ai_blocks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI blocks"
  ON ai_blocks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI blocks"
  ON ai_blocks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON ai_blocks
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime (updated_at);

-- Create index
CREATE INDEX idx_ai_blocks_user_id ON ai_blocks(user_id);
CREATE INDEX idx_ai_blocks_created_at ON ai_blocks(created_at);

-- Create storage bucket for AI generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ai-images', 'ai-images', true);

-- Enable storage RLS
CREATE POLICY "Anyone can view AI images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ai-images');

CREATE POLICY "Authenticated users can upload AI images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ai-images' AND
    auth.role() = 'authenticated'
  );
