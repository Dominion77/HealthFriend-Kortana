"use client";

import Link from "next/link";
import Image from "next/image";
import { type Doctor } from "@/lib/supabase";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6 text-center">
        <div className="flex flex-col items-center mb-4">
          {doctor.image_url ? (
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
              <Image
                src={doctor.image_url}
                alt={doctor.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-3">
              {doctor.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
            <p className="text-sm text-gray-600">{doctor.qualifications}</p>
            <p className="text-sm font-medium text-blue-600 mt-1">{doctor.specialty}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">Booking Fee</p>
            <p className="text-lg font-bold text-gray-900">{doctor.booking_fee} DNR</p>
          </div>
          <Link
            href={`/doctors/${doctor.id}`}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
