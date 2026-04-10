"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { supabase, type Doctor } from "@/lib/supabase";
import { BOOKING_WALLET_ADDRESS } from "@/lib/contracts";
import { useRouter } from "next/navigation";

interface AppointmentBookingProps {
  doctor: Doctor;
}

export function AppointmentBooking({ doctor }: AppointmentBookingProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const savedRef = useRef(false); // Prevent duplicate saves

  const { sendTransaction, data: hash, reset } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const timeSlots = [
    "09:00 - 10:30",
    "10:30 - 12:00",
    "12:00 - 13:30",
    "14:00 - 15:30",
    "15:30 - 17:00",
    "17:00 - 18:30",
  ];

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleBooking = async () => {
    if (!isConnected || !address || !selectedDate || !selectedTime) {
      alert("Please connect wallet and select date and time");
      return;
    }

    setIsBooking(true);
    savedRef.current = false; // Reset the saved flag
    reset(); // Reset previous transaction state

    try {
      const amount = parseEther(doctor.booking_fee.toString());

      sendTransaction({
        to: BOOKING_WALLET_ADDRESS,
        value: amount,
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to process payment");
      setIsBooking(false);
    }
  };

  // Use useEffect to handle transaction success only once
  useEffect(() => {
    if (isSuccess && hash && !savedRef.current) {
      savedRef.current = true; // Mark as saved to prevent duplicates
      saveAppointment(hash);
    }
  }, [isSuccess, hash]);

  async function saveAppointment(txHash: string) {
    try {
      // Insert the appointment - the database trigger will automatically update doctor fees
      const { data, error } = await supabase
        .from("appointments")
        .insert({
          doctor_id: doctor.id,
          patient_wallet: address,
          date: selectedDate,
          time_slot: selectedTime,
          status: "confirmed",
          transaction_hash: txHash,
          booking_fee: doctor.booking_fee,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/confirmation?appointmentId=${data.id}`);
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Payment successful but failed to save appointment");
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h2>

      {!isConnected ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Please connect your wallet to book an appointment</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a date</option>
              {generateDates().map((date) => (
                <option key={date.toISOString()} value={date.toISOString().split("T")[0]}>
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time Slot
            </label>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`px-4 py-3 border rounded-lg transition-colors ${
                    selectedTime === slot
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:border-blue-600"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Booking Fee:</span>
              <span className="text-2xl font-bold text-gray-900">{doctor.booking_fee} DNR</span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime || isBooking || isConfirming}
            className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isBooking || isConfirming ? "Processing..." : "Confirm Booking & Pay"}
          </button>
        </div>
      )}
    </div>
  );
}
