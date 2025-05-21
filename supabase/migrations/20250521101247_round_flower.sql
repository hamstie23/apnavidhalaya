/*
  # Schema Improvements
  
  1. Performance Optimizations
    - Add indexes for frequently queried columns
    - Add missing foreign key constraints
    - Standardize timestamp handling
    
  2. Data Integrity
    - Add NOT NULL constraints where appropriate
    - Add CHECK constraints for data validation
    
  3. Security
    - Add missing RLS policies
*/

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date DESC);
CREATE INDEX IF NOT EXISTS idx_academic_records_test_date ON academic_records(test_date DESC);

-- Add missing foreign key constraints with proper cascading
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE messages ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE messages ADD CONSTRAINT messages_receiver_id_fkey 
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE;

-- Standardize timestamp handling
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE messages ALTER COLUMN timestamp SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE announcements ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

-- Add NOT NULL constraints
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE messages ALTER COLUMN message SET NOT NULL;
ALTER TABLE announcements ALTER COLUMN title SET NOT NULL;
ALTER TABLE announcements ALTER COLUMN content SET NOT NULL;

-- Add CHECK constraints
ALTER TABLE academic_records ADD CONSTRAINT check_valid_score 
  CHECK (score >= 0 AND score <= max_score);

ALTER TABLE attendance ADD CONSTRAINT check_valid_status 
  CHECK (status IN ('present', 'absent', 'late'));

-- Add missing RLS policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read messages they sent or received"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Add archival support
ALTER TABLE announcements ADD COLUMN archived boolean DEFAULT false;
ALTER TABLE messages ADD COLUMN archived boolean DEFAULT false;

CREATE INDEX idx_announcements_archived ON announcements(archived) WHERE archived = false;
CREATE INDEX idx_messages_archived ON messages(archived) WHERE archived = false;