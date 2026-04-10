-- HealthFriend Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Doctors Table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  booking_fee NUMERIC NOT NULL DEFAULT 10,
  total_fees_earned NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  patient_wallet TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  transaction_hash TEXT,
  booking_fee NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient_wallet ON appointments(patient_wallet);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Sample data for doctors
INSERT INTO doctors (name, specialty, qualifications, bio, booking_fee) VALUES
('Dr. Tony Stark', 'Orthopedic Surgeon', 'MD, MBBS - Orthopedic Surgeon', 'Dr. Stark is a dedicated orthopedic surgeon with over 15 years of experience in treating musculoskeletal conditions. He specializes in joint replacement surgery and sports medicine, helping patients regain mobility and live pain-free lives.', 50),
('Dr. Fred Hutchinson', 'Oncologist', 'MD, MBBS - Oncologist', 'Dr. Hutchinson is a dedicated and compassionate medical professional with a strong commitment to patient care with years of experience in oncology. He is one of the foremost oncologists in HealthFriend, specializing in cancer treatment and research.', 75),
('Dr. Sarah Connor', 'Cardiologist', 'MD, PhD - Cardiology', 'Dr. Connor specializes in cardiovascular diseases and has pioneered several innovative treatment approaches. With over 20 years of experience, she focuses on preventive cardiology and advanced heart failure management.', 60),
('Dr. Bruce Banner', 'General Physician', 'MBBS, MD - General Medicine', 'Dr. Banner is a highly experienced general physician who provides comprehensive primary care services. He believes in a holistic approach to healthcare and focuses on preventive medicine and patient education.', 40),
('Dr. Natasha Romanoff', 'Dermatologist', 'MD, MBBS - Dermatology', 'Dr. Romanoff is a board-certified dermatologist specializing in both medical and cosmetic dermatology. She has extensive experience in treating skin conditions and performing advanced aesthetic procedures.', 55),
('Dr. Stephen Strange', 'Neurologist', 'MD, PhD - Neurology', 'Dr. Strange is a renowned neurologist with expertise in treating complex neurological disorders. He specializes in stroke management, epilepsy, and neurodegenerative diseases with a focus on cutting-edge treatment protocols.', 80),
('Dr. Diana Prince', 'Pediatrician', 'MD, MBBS - Pediatrics', 'Dr. Prince is a compassionate pediatrician with 12 years of experience caring for children from infancy through adolescence. She specializes in developmental pediatrics and childhood immunizations, creating a warm and welcoming environment for young patients.', 45),
('Dr. Peter Parker', 'Emergency Medicine', 'MD, FACEM - Emergency Medicine', 'Dr. Parker is a highly skilled emergency medicine physician with rapid response expertise. With 10 years in critical care, he excels in trauma management, acute care, and life-saving interventions in high-pressure situations.', 65),
('Dr. Wanda Maximoff', 'Psychiatrist', 'MD, MRCPsych - Psychiatry', 'Dr. Maximoff is a board-certified psychiatrist specializing in mental health and emotional wellness. With expertise in anxiety disorders, depression, and trauma therapy, she provides compassionate care using evidence-based treatment approaches.', 70);

-- Enable Row Level Security (RLS)
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies for doctors table (public read access)
CREATE POLICY "Allow public read access to doctors"
  ON doctors FOR SELECT
  USING (true);

-- Allow updates to doctors table for fee increments
CREATE POLICY "Allow fee updates to doctors"
  ON doctors FOR UPDATE
  USING (true);

-- Policies for appointments table
CREATE POLICY "Allow users to view their own appointments"
  ON appointments FOR SELECT
  USING (true);

CREATE POLICY "Allow users to create appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Function to increment doctor's total fees earned (safe from race conditions)
CREATE OR REPLACE FUNCTION increment_doctor_fees(doctor_uuid UUID, fee_amount NUMERIC)
RETURNS void AS $$
BEGIN
  UPDATE doctors
  SET total_fees_earned = total_fees_earned + fee_amount
  WHERE id = doctor_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update doctor's total fees earned
CREATE OR REPLACE FUNCTION update_doctor_fees()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doctors
  SET total_fees_earned = total_fees_earned + NEW.booking_fee
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update doctor fees when appointment is created
CREATE TRIGGER update_doctor_fees_trigger
AFTER INSERT ON appointments
FOR EACH ROW
WHEN (NEW.status = 'confirmed')
EXECUTE FUNCTION update_doctor_fees();
