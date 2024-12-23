-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS database_views;
DROP TABLE IF EXISTS blocks;
DROP TABLE IF EXISTS pages;

-- Create pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  icon TEXT,
  cover_image TEXT,
  parent_id UUID REFERENCES pages(id),
  workspace_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  last_edited_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Create blocks table
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  parent_block_id UUID REFERENCES blocks(id),
  position INTEGER NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create database_views table
CREATE TABLE database_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  filters JSONB DEFAULT '{}',
  sorts JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX blocks_page_id_idx ON blocks(page_id);
CREATE INDEX blocks_parent_block_id_idx ON blocks(parent_block_id);
CREATE INDEX blocks_position_idx ON blocks(position);
CREATE INDEX pages_parent_id_idx ON pages(parent_id);
CREATE INDEX pages_workspace_id_idx ON pages(workspace_id);
CREATE INDEX database_views_page_id_idx ON database_views(page_id);

-- Enable Row Level Security (RLS)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_views ENABLE ROW LEVEL SECURITY;

-- Create policies for pages
CREATE POLICY "Enable read access for authenticated users" ON pages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON pages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable update access for authenticated users" ON pages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = last_edited_by)
  WITH CHECK (auth.uid() = created_by OR auth.uid() = last_edited_by);

CREATE POLICY "Enable delete access for authenticated users" ON pages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create policies for blocks
CREATE POLICY "Enable read access for authenticated users" ON blocks
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = blocks.page_id
    AND (pages.created_by = auth.uid() OR pages.last_edited_by = auth.uid())
  ));

CREATE POLICY "Enable insert access for authenticated users" ON blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = blocks.page_id
    AND (pages.created_by = auth.uid() OR pages.last_edited_by = auth.uid())
  ));

CREATE POLICY "Enable update access for authenticated users" ON blocks
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = blocks.page_id
    AND (pages.created_by = auth.uid() OR pages.last_edited_by = auth.uid())
  ));

CREATE POLICY "Enable delete access for authenticated users" ON blocks
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = blocks.page_id
    AND (pages.created_by = auth.uid() OR pages.last_edited_by = auth.uid())
  ));

-- Create policies for database_views
CREATE POLICY "Enable read access for authenticated users" ON database_views
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = database_views.page_id
    AND (pages.created_by = auth.uid() OR pages.last_edited_by = auth.uid())
  ));

CREATE POLICY "Enable insert access for authenticated users" ON database_views
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = database_views.page_id
    AND (pages.created_by = auth.uid() OR pages.last_edited_by = auth.uid())
  ));

CREATE POLICY "Enable update access for authenticated users" ON database_views
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = database_views.page_id
    AND (pages.created_by = auth.uid() OR pages.last_edited_by = auth.uid())
  ));

CREATE POLICY "Enable delete access for authenticated users" ON database_views
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = database_views.page_id
    AND (pages.created_by = auth.uid() OR pages.last_edited_by = auth.uid())
  ));
