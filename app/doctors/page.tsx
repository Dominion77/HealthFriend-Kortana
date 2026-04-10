import Link from "next/link";
import { DoctorSearch } from "@/components/DoctorSearch";
import { ConnectButton } from "@/components/ConnectButton";

export default function DoctorsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              HealthFriend
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/appointments" className="text-gray-600 hover:text-blue-600">
                My Appointments
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black tracking-tighter text-gray-900 mb-4">
              Find Your Doctor
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our network of verified medical professionals and book appointments instantly.
            </p>
          </div>

          <DoctorSearch />
        </div>
      </section>

      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Find a Doctor</h1>
        <DoctorSearch />
      </div> */}
    </main>
  );
}
