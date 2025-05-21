/*
  # Initial Schema Setup for School Management System
  
  1. Core Tables
    - profiles: User profiles with role-based access
    - students: Student information and enrollment
    - teachers: Teacher details and assignments
    - classes: Class/grade organization
    - subjects: Subject information
    - attendance: Student attendance tracking
    - grades: Academic performance records
    
  2. Security
    - RLS policies for each table
    - Role-based access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  contact_number text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES profiles(id),
  grade text NOT NULL,
  section text,
  date_of_birth date,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  specialization text,
  qualifications text[],
  join_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'retired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  grade text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teacher_subjects table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS teacher_subjects (
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (teacher_id, subject_id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id),
  date date DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  remarks text,
  created_at timestamptz DEFAULT now()
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id),
  teacher_id uuid REFERENCES teachers(id),
  assessment_type text NOT NULL,
  score numeric NOT NULL,
  max_score numeric NOT NULL,
  term text NOT NULL,
  academic_year text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for students
CREATE POLICY "Students viewable by authenticated users" ON students
  FOR SELECT USING (auth.role() IN ('admin', 'teacher', 'parent'));

CREATE POLICY "Admins can manage students" ON students
  FOR ALL USING (auth.role() = 'admin');

-- Create policies for teachers
CREATE POLICY "Teachers viewable by authenticated users" ON teachers
  FOR SELECT USING (auth.role() IN ('admin', 'teacher', 'parent'));

CREATE POLICY "Admins can manage teachers" ON teachers
  FOR ALL USING (auth.role() = 'admin');

-- Create policies for subjects
CREATE POLICY "Subjects viewable by authenticated users" ON subjects
  FOR SELECT USING (auth.role() IN ('admin', 'teacher', 'parent', 'student'));

CREATE POLICY "Admins and teachers can manage subjects" ON subjects
  FOR ALL USING (auth.role() IN ('admin', 'teacher'));

-- Create policies for attendance
CREATE POLICY "Attendance viewable by authenticated users" ON attendance
  FOR SELECT USING (auth.role() IN ('admin', 'teacher', 'parent'));

CREATE POLICY "Teachers can manage attendance" ON attendance
  FOR ALL USING (auth.role() IN ('admin', 'teacher'));

-- Create policies for grades
CREATE POLICY "Grades viewable by authenticated users" ON grades
  FOR SELECT USING (auth.role() IN ('admin', 'teacher', 'parent'));

CREATE POLICY "Teachers can manage grades" ON grades
  FOR ALL USING (auth.role() IN ('admin', 'teacher'));

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (new.id, new.email, 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();