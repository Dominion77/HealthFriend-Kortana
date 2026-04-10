import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  bio: string;
  image_url?: string;
  booking_fee: number;
  total_fees_earned: number;
  created_at: string;
};

export type Appointment = {
  id: string;
  doctor_id: string;
  patient_wallet: string;
  date: string;
  time_slot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  transaction_hash?: string;
  booking_fee: number;
  created_at: string;
};
