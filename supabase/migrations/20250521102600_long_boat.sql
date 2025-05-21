/*
  # School Management System Schema

  1. Core Tables
    - users: Core user table with role-based access
    - announcements: School-wide announcements
    - messages: Internal messaging system
    - attendance: Student attendance tracking
    - academic_records: Student grades and assessments
    - health_logs: Student health records
    - timetable: Class schedules
    - feature_visibility: Feature access control

  2. Security
    - Row Level Security (RLS) enabled on all tables
    - Role-based access policies
    - Data validation constraints
    
  3. Performance
    - Optimized indexes for common queries
    - Efficient relationship structures
*/

-- Create users table with role-based access
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  roll_no text,
  class text,
  linked_student_roll text,
  assigned_teacher_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create announcements table
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  for_roles text[] NOT NULL,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id),
  receiver_id uuid NOT NULL REFERENCES users(id),
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Create attendance table
CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id),
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create academic records table
CREATE TABLE academic_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id),
  subject text NOT NULL,
  score numeric NOT NULL,
  max_score numeric NOT NULL,
  test_date date NOT NULL,
  remarks text,
  recorded_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create health logs table
CREATE TABLE health_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id),
  date date NOT NULL,
  details text NOT NULL,
  recorded_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create timetable table
CREATE TABLE timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id text NOT NULL,
  day text NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  period integer NOT NULL,
  subject text NOT NULL,
  teacher_id uuid NOT NULL REFERENCES users(id),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create feature visibility table
CREATE TABLE feature_visibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  screen_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  is_visible boolean DEFAULT true,
  UNIQUE(screen_name, role)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_visibility ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" 
  ON users FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view assigned students" 
  ON users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher'
    ) AND (
      assigned_teacher_id = auth.uid() OR 
      (role = 'parent' AND EXISTS (
        SELECT 1 FROM users 
        WHERE role = 'student' 
        AND assigned_teacher_id = auth.uid() 
        AND roll_no = linked_student_roll
      ))
    )
  );

CREATE POLICY "Parents can view their linked student" 
  ON users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'parent'
    ) AND 
    role = 'student' AND 
    roll_no = (
      SELECT linked_student_roll FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Students can view their teacher" 
  ON users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'student'
    ) AND 
    id = (
      SELECT assigned_teacher_id FROM users WHERE id = auth.uid()
    )
  );

-- Announcements policies
CREATE POLICY "Anyone can view announcements for their role" 
  ON announcements FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = ANY(announcements.for_roles)
    )
  );

-- Messages policies
CREATE POLICY "Users can see their own messages" 
  ON messages FOR SELECT 
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" 
  ON messages FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

-- Attendance policies
CREATE POLICY "Teachers can mark attendance" 
  ON attendance FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'teacher'
    ) AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = attendance.student_id 
      AND assigned_teacher_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_assigned_teacher ON users(assigned_teacher_id);
CREATE INDEX idx_messages_participants ON messages(sender_id, receiver_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_academic_records_student ON academic_records(student_id);
CREATE INDEX idx_timetable_class_day ON timetable(class_id, day);