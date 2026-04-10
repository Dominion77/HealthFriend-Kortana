import { AppointmentBooking } from "@/components/AppointmentBooking";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ConnectButton } from "@/components/ConnectButton";
import Link from "next/link";
import Image from "next/image";

// Disable caching to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: doctor, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !doctor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              HealthFriend
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            {doctor.image_url ? (
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={doctor.image_url}
                  alt={doctor.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 flex-shrink-0">
                {doctor.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
              <p className="text-lg text-gray-600 mb-1">{doctor.qualifications}</p>
              <p className="text-lg font-medium text-blue-600">{doctor.specialty}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-700 leading-relaxed mb-6">{doctor.bio}</p>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Booking Fee</p>
                <p className="text-2xl font-bold text-gray-900">{doctor.booking_fee} DNR</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Fees Earned</p>
                <p className="text-2xl font-bold text-green-600">{doctor.total_fees_earned} DNR</p>
              </div>
            </div>
          </div>
        </div>

        <AppointmentBooking doctor={doctor} />
      </div>
    </main>
  );
}
