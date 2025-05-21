/*
  # Create tables for school management system

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - role (text)
      - full_name (text)
      - avatar_url (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - announcements
      - id (uuid)
      - title (text)
      - body (text)
      - file_url (text)
      - created_by (uuid, references auth.users)
      - created_at (timestamptz)
    
    - groups
      - id (uuid)
      - name (text)
      - created_by (uuid, references auth.users)
      - role_access (text[])
      - created_at (timestamptz)
    
    - group_members
      - group_id (uuid, references groups)
      - user_id (uuid, references auth.users)
      - created_at (timestamptz)
    
    - messages
      - id (uuid)
      - sender_id (uuid, references auth.users)
      - receiver_id (uuid, references auth.users)
      - group_id (uuid, references groups)
      - message_text (text)
      - file_url (text)
      - created_at (timestamptz)
    
    - holidays
      - id (uuid)
      - date (date)
      - title (text)
      - description (text)
      - added_by (uuid, references auth.users)
      - created_at (timestamptz)
    
    - settings
      - id (uuid)
      - chat_enabled (boolean)
      - daily_logs_enabled (boolean)
      - video_lessons_enabled (boolean)
      - attendance_enabled (boolean)
      - feedback_enabled (boolean)
      - announcements_enabled (boolean)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'parent')),
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  file_url text,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  role_access text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  group_id uuid REFERENCES groups ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users NOT NULL,
  receiver_id uuid REFERENCES auth.users,
  group_id uuid REFERENCES groups,
  message_text text NOT NULL,
  file_url text,
  created_at timestamptz DEFAULT now(),
  CHECK (
    (receiver_id IS NOT NULL AND group_id IS NULL) OR
    (receiver_id IS NULL AND group_id IS NOT NULL)
  )
);

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  title text NOT NULL,
  description text,
  added_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_enabled boolean DEFAULT true,
  daily_logs_enabled boolean DEFAULT true,
  video_lessons_enabled boolean DEFAULT true,
  attendance_enabled boolean DEFAULT true,
  feedback_enabled boolean DEFAULT true,
  announcements_enabled boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for announcements
CREATE POLICY "Announcements are viewable by everyone"
  ON announcements FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create announcements"
  ON announcements FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policies for groups
CREATE POLICY "Users can view groups they belong to"
  ON groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can create groups"
  ON groups FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policies for group_members
CREATE POLICY "Users can view their group memberships"
  ON group_members FOR SELECT
  USING (user_id = auth.uid());

-- Policies for messages
CREATE POLICY "Users can view messages in their groups"
  ON messages FOR SELECT
  USING (
    (receiver_id = auth.uid()) OR
    (sender_id = auth.uid()) OR
    (
      group_id IN (
        SELECT group_id FROM group_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policies for holidays
CREATE POLICY "Holidays are viewable by everyone"
  ON holidays FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create holidays"
  ON holidays FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policies for settings
CREATE POLICY "Settings are viewable by everyone"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update settings"
  ON settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Insert initial settings
INSERT INTO settings (id) VALUES (gen_random_uuid());