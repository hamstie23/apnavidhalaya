/*
  # Academic Records Schema
  
  1. New Tables
    - attendance: Student attendance records
    - assignments: Class assignments
    - submissions: Assignment submissions
    - grades: Student grades
  
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks text,
  marked_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, class_id, date)
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  due_date timestamptz NOT NULL,
  max_score numeric(5,2),
  assignment_type text NOT NULL CHECK (assignment_type IN ('homework', 'quiz', 'test', 'project', 'exam')),
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  submitted_at timestamptz DEFAULT now(),
  content text,
  attachments jsonb,
  status text DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded')),
  score numeric(5,2),
  feedback text,
  graded_by uuid REFERENCES profiles(id),
  graded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  term text NOT NULL,
  academic_year text NOT NULL,
  grade_value numeric(5,2) NOT NULL,
  grade_type text NOT NULL CHECK (grade_type IN ('assignment', 'quiz', 'test', 'exam', 'final')),
  remarks text,
  graded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Teachers can manage attendance for their classes"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN profiles p ON p.id = auth.uid()
      WHERE c.id = attendance.class_id
      AND (c.teacher_id = p.id OR p.role = 'admin')
    )
  );

CREATE POLICY "Students can view their own attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage assignments for their classes"
  ON assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN profiles p ON p.id = auth.uid()
      WHERE c.id = assignments.class_id
      AND (c.teacher_id = p.id OR p.role = 'admin')
    )
  );

CREATE POLICY "Students can view assignments for their classes"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.student_id = auth.uid()
      AND e.class_id = assignments.class_id
    )
  );

-- Create indexes
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_grades_academic_year ON grades(academic_year, term);