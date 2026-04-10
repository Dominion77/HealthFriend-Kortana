"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const [appointment, setAppointment] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  async function fetchAppointmentDetails() {
    try {
      const { data: appt, error: apptError } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", appointmentId)
        .single();

      if (apptError) throw apptError;
      setAppointment(appt);

      const { data: doc, error: docError } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", appt.doctor_id)
        .single();

      if (docError) throw docError;
      setDoctor(doc);
    } catch (error) {
      console.error("Error fetching appointment:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appointment || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Appointment Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(appointment.date);
  const formattedDate = appointmentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            HealthFriend
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Appointment Confirmed!
            </h1>
            <p className="text-gray-600">
              Your appointment has been successfully booked and payment confirmed on the blockchain.
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-semibold text-gray-900">{doctor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Specialty:</span>
              <span className="font-semibold text-gray-900">{doctor.specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold text-gray-900">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold text-gray-900">{appointment.time_slot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Fee:</span>
              <span className="font-semibold text-green-600">{appointment.booking_fee} DNR</span>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
            <p className="text-gray-700">
              HealthFriend Telemedicine Center<br />
              Virtual Consultation via Kortana Network
            </p>
          </div>

          {appointment.transaction_hash && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Transaction Details</h3>
              <p className="text-xs text-gray-600 break-all">
                {appointment.transaction_hash}
              </p>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Link
              href="/appointments"
              className="flex-1 px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Appointments
            </Link>
            <Link
              href="/"
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors"
            >
              Book Another
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
