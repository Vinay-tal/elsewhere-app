-- Supabase schema for Elsewhere
-- Run this in your Supabase SQL Editor to initialize persistent user tables

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT DEFAULT 'Mindful Explorer',
  selected_interests TEXT[] DEFAULT ARRAY['Psychology', 'Science', 'Philosophy'],
  daily_session_goal_minutes INTEGER DEFAULT 15,
  total_mindful_minutes INTEGER DEFAULT 0,
  sound_enabled BOOLEAN DEFAULT true,
  haptic_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'save', 'dismiss', 'view')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS completed_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  challenge_id TEXT NOT NULL,
  selected_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS completed_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  activity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_activities ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only read & write their own records
CREATE POLICY "Users can manage own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users can manage own interactions"
  ON user_interactions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own challenge completions"
  ON completed_challenges FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own offline activities"
  ON completed_activities FOR ALL
  USING (auth.uid() = user_id);
