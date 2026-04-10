import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";
import { IoShieldCheckmark, IoFlash, IoGlobe } from "react-icons/io5";
import { BsActivity } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Glassmorphism Navigation */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tighter text-gray-900">
              Health<span className="text-primary">Friend</span>
            </h1>
            <div className="flex items-center gap-8">
              <Link href="/doctors" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                Doctors
              </Link>
              <Link href="/appointments" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                Appointments
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left: Headline */}
            <div className="col-span-12 lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full mb-6">
                <div className="w-2 h-2 bg-primary rounded-full ping-animation"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Live on Kortana Testnet</span>
              </div>
              
              <h2 className="text-6xl font-black tracking-tighter text-gray-900 mb-6 leading-none">
                The Operating System for Modern Medicine
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                Decentralized telemedicine infrastructure. Book appointments, pay in DNR, and access healthcare on the blockchain.
              </p>
              
              <div className="flex gap-4">
                <Link href="/doctors" className="btn-primary">
                  Browse Doctors
                </Link>
                <Link href="/appointments" className="px-6 py-3 border-2 border-border rounded hover:border-primary transition-colors font-semibold text-sm">
                  View Appointments
                </Link>
              </div>
            </div>

            {/* Right: 3D Globe Visualization */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bento-box p-12 bg-surface relative overflow-hidden min-h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <IoGlobe className="w-80 h-80 text-gray-400 animate-spin" style={{ animationDuration: '20s', strokeWidth: '1.5px' }} />
                  <div className="absolute w-5 h-5 bg-primary rounded-full ping-animation shadow-lg shadow-primary/50" style={{ top: '30%', left: '40%' }}></div>
                  <div className="absolute w-5 h-5 bg-primary rounded-full ping-animation shadow-lg shadow-primary/50" style={{ top: '60%', left: '70%', animationDelay: '0.5s' }}></div>
                  <div className="absolute w-5 h-5 bg-primary rounded-full ping-animation shadow-lg shadow-primary/50" style={{ top: '50%', left: '20%', animationDelay: '1s' }}></div>
                  <div className="absolute w-4 h-4 bg-primary rounded-full ping-animation shadow-lg shadow-primary/50" style={{ top: '40%', left: '60%', animationDelay: '1.5s' }}></div>
                  <div className="absolute w-4 h-4 bg-primary rounded-full ping-animation shadow-lg shadow-primary/50" style={{ top: '70%', left: '35%', animationDelay: '2s' }}></div>
                </div>
                {/* Grid overlay for technical feel */}
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: 'linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Feature 1: Live Data */}
            <div className="col-span-12 lg:col-span-8 bento-box">
              <div className="flex items-center gap-3 mb-4">
                <BsActivity className="w-6 h-6 text-primary icon-thin" />
                <h3 className="text-xl font-black tracking-tighter">Real-Time Synchronization</h3>
              </div>
              <div className="code-snippet">
                <pre className="text-xs text-gray-700">
{`// Live appointment data sync
const appointment = await supabase
  .from('appointments')
  .insert({
    doctor_id: '${String.fromCharCode(97 + Math.floor(Math.random() * 26))}${Math.random().toString(36).substr(2, 7)}',
    patient_wallet: '0x${Math.random().toString(16).substr(2, 40)}',
    status: 'confirmed',
    transaction_hash: '0x${Math.random().toString(16).substr(2, 64)}'
  });

// ✓ Synced to Kortana blockchain
// ✓ Payment verified: 50 DNR`}
                </pre>
              </div>
            </div>

            {/* Feature 2: Security */}
            <div className="col-span-12 lg:col-span-4 bento-box bg-primary text-white">
              <IoShieldCheckmark className="w-12 h-12 mb-4 icon-thin" />
              <h3 className="text-2xl font-black tracking-tighter mb-2">Blockchain Secured</h3>
              <p className="text-sm text-blue-700">Every transaction is immutable and verifiable on Kortana testnet.</p>
            </div>

            {/* Feature 3: Performance */}
            <div className="col-span-12 lg:col-span-4 bento-box">
              <IoFlash className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-black tracking-tighter mb-2">Instant Payments</h3>
              <p className="text-sm text-gray-600">Pay booking fees in DNR with sub-second confirmation times.</p>
            </div>

            {/* Feature 4: Stats */}
            <div className="col-span-12 lg:col-span-8 bento-box">
              <h3 className="text-xl font-black tracking-tighter mb-6">Platform Metrics</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-black text-primary mb-1">9</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">Specialists</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-primary mb-1">100%</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">On-Chain</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-primary mb-1">&lt;1s</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">Confirmation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-12 gap-12">
            {/* Brand Column */}
            <div className="col-span-12 lg:col-span-4">
              <h3 className="text-2xl font-black tracking-tighter text-gray-900 mb-4">
                Health<span className="text-primary">Friend</span>
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Decentralized telemedicine infrastructure built on Kortana blockchain. Secure, transparent, and accessible healthcare for everyone.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-primary hover:bg-primary hover:text-white transition-all text-gray-700">
                  <FaGithub className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-primary hover:bg-primary hover:text-white transition-all text-gray-700">
                  <FaXTwitter className="w-5 h-5" />
                </a>
                <a href="mailto:hello@healthfriend.io" className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-primary hover:bg-primary hover:text-white transition-all text-gray-700">
                  <IoMail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div className="col-span-6 lg:col-span-2">
              <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/doctors" className="text-sm text-gray-600 hover:text-primary transition-colors">Browse Doctors</Link></li>
                <li><Link href="/appointments" className="text-sm text-gray-600 hover:text-primary transition-colors">Appointments</Link></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="col-span-6 lg:col-span-2">
              <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Support</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="col-span-6 lg:col-span-2">
              <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="col-span-6 lg:col-span-2">
              <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} HealthFriend. Built on <span className="text-primary font-semibold">Kortana Testnet</span>.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://explorer.testnet.kortana.xyz" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Block Explorer
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Network Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
