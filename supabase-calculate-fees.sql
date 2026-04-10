-- Run this to manually calculate and update all doctor fees based on confirmed appointments

-- Update each doctor's total_fees_earned based on their confirmed appointments
UPDATE doctors
SET total_fees_earned = COALESCE(
  (SELECT SUM(booking_fee) 
   FROM appointments 
   WHERE appointments.doctor_id = doctors.id 
   AND appointments.status = 'confirmed'),
  0
);

-- Verify the results
SELECT 
  d.name,
  d.specialty,
  d.total_fees_earned,
  COUNT(a.id) as appointment_count,
  SUM(a.booking_fee) as calculated_total
FROM doctors d
LEFT JOIN appointments a ON d.id = a.doctor_id AND a.status = 'confirmed'
GROUP BY d.id, d.name, d.specialty, d.total_fees_earned
ORDER BY d.name;
