-- Create plugins table
CREATE TABLE plugins (
  id TEXT PRIMARY KEY,
  manifest JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  install_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  update_date TIMESTAMP WITH TIME ZONE,
  settings JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own plugins"
  ON plugins
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plugins"
  ON plugins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plugins"
  ON plugins
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plugins"
  ON plugins
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for plugin files
INSERT INTO storage.buckets (id, name, public)
VALUES ('plugins', 'plugins', true);

-- Enable storage RLS
CREATE POLICY "Anyone can view plugin files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'plugins');

CREATE POLICY "Authenticated users can upload plugin files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'plugins' AND
    auth.role() = 'authenticated'
  );
