-- Run this in your Supabase SQL Editor to fix the fees update issue

-- 1. Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Allow fee updates to doctors" ON doctors;

CREATE POLICY "Allow fee updates to doctors"
  ON doctors FOR UPDATE
  USING (true);

-- 2. Create function to safely increment doctor fees
CREATE OR REPLACE FUNCTION increment_doctor_fees(doctor_uuid UUID, fee_amount NUMERIC)
RETURNS void AS $$
BEGIN
  UPDATE doctors
  SET total_fees_earned = total_fees_earned + fee_amount
  WHERE id = doctor_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Verify the trigger exists (if not, create it)
CREATE OR REPLACE FUNCTION update_doctor_fees()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doctors
  SET total_fees_earned = total_fees_earned + NEW.booking_fee
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_doctor_fees_trigger ON appointments;

-- Create the trigger
CREATE TRIGGER update_doctor_fees_trigger
AFTER INSERT ON appointments
FOR EACH ROW
WHEN (NEW.status = 'confirmed')
EXECUTE FUNCTION update_doctor_fees();
