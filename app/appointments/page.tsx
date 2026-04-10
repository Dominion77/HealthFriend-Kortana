"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";
import { IoOpen, IoCalendar, IoTimeOutline, IoWallet, IoKeyOutline, IoCheckmarkCircle, IoCopy } from "react-icons/io5";

export default function AppointmentsPage() {
  const { address, isConnected } = useAccount();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const explorerUrl = process.env.NEXT_PUBLIC_KORTANA_EXPLORER || "https://explorer.testnet.kortana.xyz";

  useEffect(() => {
    if (isConnected && address) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  async function fetchAppointments() {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          doctors (*)
        `)
        .eq("patient_wallet", address)
        .order("date", { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              HealthFriend
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Book New Appointment
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>

        {!isConnected ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">Please connect your wallet to view appointments</p>
            <ConnectButton />
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">You don't have any appointments yet</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {appointment.doctors.name}
                      </h3>
                      <p className="text-blue-700 font-medium">{appointment.doctors.specialty}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800 border-2 border-green-300"
                          : appointment.status === "completed"
                          ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800 border-2 border-red-300"
                          : "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <IoCalendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                          <p className="text-gray-900 font-medium">
                            {new Date(appointment.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <IoTimeOutline className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Time Slot</p>
                          <p className="text-gray-900 font-medium">{appointment.time_slot}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <IoWallet className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Booking Fee</p>
                          <p className="text-gray-900 font-bold text-lg">{appointment.booking_fee} DNR</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <IoCheckmarkCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Appointment ID</p>
                          <p className="text-gray-900 font-mono text-sm">{appointment.id.slice(0, 13)}...</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <IoCalendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Booked On</p>
                          <p className="text-gray-900 font-medium">
                            {new Date(appointment.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {appointment.transaction_hash && (
                        <div className="flex items-start gap-3">
                          <IoKeyOutline className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Transaction Hash</p>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-900 font-mono text-xs break-all">
                                {formatAddress(appointment.transaction_hash)}
                              </p>
                              <button
                                onClick={() => copyToClipboard(appointment.transaction_hash)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Copy full hash"
                              >
                                <IoCopy className={`w-4 h-4 ${copiedHash === appointment.transaction_hash ? 'text-green-600' : 'text-gray-500'}`} />
                              </button>
                              <a
                                href={`${explorerUrl}/tx/${appointment.transaction_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="View on explorer"
                              >
                                <IoOpen className="w-4 h-4 text-blue-600" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Patient Wallet */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <IoWallet className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Patient Wallet</p>
                        <p className="text-gray-700 font-mono text-sm">{appointment.patient_wallet}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
