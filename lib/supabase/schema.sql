-- TTRPG Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Characters Table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  name TEXT NOT NULL,
  race TEXT NOT NULL,
  class TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,

  -- Ability Scores
  strength INTEGER NOT NULL DEFAULT 10,
  dexterity INTEGER NOT NULL DEFAULT 10,
  constitution INTEGER NOT NULL DEFAULT 10,
  intelligence INTEGER NOT NULL DEFAULT 10,
  wisdom INTEGER NOT NULL DEFAULT 10,
  charisma INTEGER NOT NULL DEFAULT 10,

  -- Combat Stats
  max_hp INTEGER NOT NULL DEFAULT 10,
  current_hp INTEGER NOT NULL DEFAULT 10,
  armor_class INTEGER NOT NULL DEFAULT 10,
  initiative INTEGER NOT NULL DEFAULT 0,
  speed INTEGER NOT NULL DEFAULT 30,

  -- Skills & Equipment
  proficiencies TEXT[] DEFAULT '{}',
  skills JSONB DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',

  -- Background
  background TEXT,
  backstory TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Sessions Table
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,

  campaign_name TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  game_state JSONB DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dice Rolls Table (for history/logging)
CREATE TABLE dice_rolls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,

  dice_type TEXT NOT NULL,
  num_dice INTEGER NOT NULL,
  modifier INTEGER DEFAULT 0,
  results INTEGER[] NOT NULL,
  total INTEGER NOT NULL,
  purpose TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_character_id ON game_sessions(character_id);
CREATE INDEX idx_dice_rolls_session_id ON dice_rolls(session_id);

-- Row Level Security (RLS) Policies
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dice_rolls ENABLE ROW LEVEL SECURITY;

-- Characters policies
CREATE POLICY "Users can view their own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters"
  ON characters FOR DELETE
  USING (auth.uid() = user_id);

-- Game sessions policies
CREATE POLICY "Users can view their own sessions"
  ON game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON game_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON game_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Dice rolls policies
CREATE POLICY "Users can view dice rolls from their sessions"
  ON dice_rolls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM game_sessions
      WHERE game_sessions.id = dice_rolls.session_id
      AND game_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert dice rolls to their sessions"
  ON dice_rolls FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM game_sessions
      WHERE game_sessions.id = dice_rolls.session_id
      AND game_sessions.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
