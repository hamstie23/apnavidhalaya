/*
  # Initial Schema Setup

  1. Tables
    - users: Core user table with role-based access
    - messages: Direct and group messaging
    - feature_visibility: Feature toggle management
    - attendance: Student attendance tracking
    - academic_records: Student academic performance
    - health_logs: Student health records
    - timetable: Class schedules

  2. Security
    - Enable RLS on all tables
    - Role-based access policies
    - Data protection policies
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS health_logs CASCADE;
DROP TABLE IF EXISTS academic_records CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS feature_visibility CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  roll_no text,
  class text,
  linked_student_roll text,
  assigned_teacher_id uuid,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (assigned_teacher_id) REFERENCES users(id),
  FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Create feature_visibility table
CREATE TABLE feature_visibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  screen_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  is_visible boolean DEFAULT true,
  UNIQUE (screen_name, role)
);

-- Create attendance table
CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (marked_by) REFERENCES users(id)
);

-- Create academic_records table
CREATE TABLE academic_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  subject text NOT NULL,
  score numeric NOT NULL,
  max_score numeric NOT NULL,
  test_date date NOT NULL,
  remarks text,
  recorded_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Create health_logs table
CREATE TABLE health_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  date date NOT NULL,
  details text NOT NULL,
  recorded_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Create timetable table
CREATE TABLE timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id text NOT NULL,
  day text NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  period integer NOT NULL,
  subject text NOT NULL,
  teacher_id uuid NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Admins can create users" ON users
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users users_1
    WHERE users_1.id = auth.uid()
    AND users_1.role = 'admin'
  ));

CREATE POLICY "Admins can update users" ON users
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users users_1
    WHERE users_1.id = auth.uid()
    AND users_1.role = 'admin'
  ));

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users users_1
    WHERE users_1.id = auth.uid()
    AND users_1.role = 'admin'
  ));

CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Teachers can view assigned students" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users users_1
      WHERE users_1.id = auth.uid()
      AND users_1.role = 'teacher'
    )
    AND (
      assigned_teacher_id = auth.uid()
      OR (
        role = 'parent'
        AND EXISTS (
          SELECT 1 FROM users users_1
          WHERE users_1.role = 'student'
          AND users_1.assigned_teacher_id = auth.uid()
          AND users_1.roll_no = users_1.linked_student_roll
        )
      )
    )
  );

CREATE POLICY "Parents can view their linked student" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users users_1
      WHERE users_1.id = auth.uid()
      AND users_1.role = 'parent'
    )
    AND role = 'student'
    AND roll_no = (
      SELECT users_1.linked_student_roll
      FROM users users_1
      WHERE users_1.id = auth.uid()
    )
  );

CREATE POLICY "Students can view their teacher" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users users_1
      WHERE users_1.id = auth.uid()
      AND users_1.role = 'student'
    )
    AND id = (
      SELECT users_1.assigned_teacher_id
      FROM users users_1
      WHERE users_1.id = auth.uid()
    )
  );

-- Messages table policies
CREATE POLICY "Users can see their own messages" ON messages
  FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can mark messages as read" ON messages
  FOR UPDATE TO authenticated
  USING (receiver_id = auth.uid());

-- Feature visibility policies
CREATE POLICY "All users can view feature visibility" ON feature_visibility
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage feature visibility" ON feature_visibility
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Attendance policies
CREATE POLICY "Teachers can mark attendance" ON attendance
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = attendance.student_id
      AND users.assigned_teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view attendance for their students" ON attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = attendance.student_id
      AND users.assigned_teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own attendance" ON attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'student'
    )
    AND student_id = auth.uid()
  );

CREATE POLICY "Parents can view attendance for their child" ON attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'parent'
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = attendance.student_id
      AND users.roll_no = (
        SELECT users_1.linked_student_roll
        FROM users users_1
        WHERE users_1.id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all attendance" ON attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Academic records policies
CREATE POLICY "Teachers can add academic records" ON academic_records
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = academic_records.student_id
      AND users.assigned_teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view academic records for their students" ON academic_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = academic_records.student_id
      AND users.assigned_teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own academic records" ON academic_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'student'
    )
    AND student_id = auth.uid()
  );

CREATE POLICY "Parents can view academic records for their child" ON academic_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'parent'
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = academic_records.student_id
      AND users.roll_no = (
        SELECT users_1.linked_student_roll
        FROM users users_1
        WHERE users_1.id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all academic records" ON academic_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Health logs policies
CREATE POLICY "Teachers can add health logs" ON health_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = health_logs.student_id
      AND users.assigned_teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view health logs for their students" ON health_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = health_logs.student_id
      AND users.assigned_teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own health logs" ON health_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'student'
    )
    AND student_id = auth.uid()
  );

CREATE POLICY "Parents can view health logs for their child" ON health_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'parent'
    )
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = health_logs.student_id
      AND users.roll_no = (
        SELECT users_1.linked_student_roll
        FROM users users_1
        WHERE users_1.id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all health logs" ON health_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Timetable policies
CREATE POLICY "All users can view timetable" ON timetable
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage timetable" ON timetable
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );