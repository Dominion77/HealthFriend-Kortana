# HealthFriend - Telemedicine Platform on Kortana

A decentralized telemedicine platform built on Kortana testnet where patients can search for doctors, book appointments, and pay booking fees in DNR tokens.

## Features

- 🔍 Search doctors by name or specialty
- 📅 Book appointments with available time slots
- 💰 Pay booking fees in DNR tokens on Kortana testnet
- 🔗 All appointments indexed on-chain as transactions
- 📊 Doctor dashboard showing total fees earned
- 💼 Patient appointment history
- 🔐 Dual wallet support: Kortana Wallet & MetaMask

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Blockchain**: Kortana Testnet
- **Web3**: Wagmi + Viem
- **Token**: DNR (Kortana testnet)
- **Wallet Support**: Kortana Wallet, MetaMask, and other injected wallets

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_KORTANA_CHAIN_ID=72511
NEXT_PUBLIC_KORTANA_RPC_URL=https://poseidon-rpc.testnet.kortana.xyz/
NEXT_PUBLIC_KORTANA_EXPLORER=https://explorer.testnet.kortana.xyz
NEXT_PUBLIC_BOOKING_WALLET_ADDRESS=your_booking_wallet_address
```

**Note**: DNR is the native token of Kortana blockchain (like ETH on Ethereum), so no token contract address is needed.

### 3. Setup Supabase Database

Create the following tables in your Supabase project:

#### Doctors Table
```sql
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  booking_fee NUMERIC NOT NULL DEFAULT 10,
  total_fees_earned NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Appointments Table
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  patient_wallet TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  transaction_hash TEXT,
  booking_fee NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Seed Sample Doctors

```sql
INSERT INTO doctors (name, specialty, qualifications, bio, booking_fee) VALUES
('Dr. Tony Stark', 'Orthopedic Surgeon', 'MD, MBBS', 'Dr. Stark is a dedicated orthopedic surgeon with over 15 years of experience in treating musculoskeletal conditions.', 50),
('Dr. Fred Hutchinson', 'Oncologist', 'MD, MBBS', 'Dr. Hutchinson is a dedicated and compassionate medical professional with a strong commitment to patient care with years of experience in oncology.', 75),
('Dr. Sarah Connor', 'Cardiologist', 'MD, PhD', 'Dr. Connor specializes in cardiovascular diseases and has pioneered several innovative treatment approaches.', 60);
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Connect Wallet**: Choose between Kortana Wallet, MetaMask, or other browser wallets
2. **Search Doctors**: Browse available doctors by name or specialty
3. **Select Doctor**: View doctor profile with qualifications, bio, and booking fee
4. **Book Appointment**: Choose date and time slot
5. **Pay with DNR**: Confirm payment transaction on Kortana testnet
6. **Confirmation**: Receive appointment confirmation with transaction hash
7. **Track Appointments**: View all your appointments in the dashboard

## Wallet Support

HealthFriend supports multiple wallet options:

- **Kortana Wallet** (Native): The native wallet for Kortana blockchain with seamless integration
- **MetaMask**: Universal EVM wallet with automatic network switching
- **Other Wallets**: Any browser-injected wallet (Brave Wallet, Core, etc.)

The wallet connection system automatically detects available wallets and handles:
- Multi-wallet environments (when both Kortana Wallet and MetaMask are installed)
- Automatic network switching to Kortana testnet
- Network addition if Kortana testnet is not configured
- EIP-1193 provider polyfills for compatibility

## Payment Flow

- All booking fees are paid in DNR (native token of Kortana blockchain)
- DNR works like ETH on Ethereum - it's the native currency, not an ERC-20 token
- Payments are sent directly to a single booking wallet address using native transfers
- Each doctor's profile displays their total accumulated fees
- All transactions are recorded on the Kortana blockchain
- Appointment records are stored in Supabase with transaction hashes

## Project Structure

```
healthfriend-kortana/
├── app/
│   ├── page.tsx                 # Home page with doctor search
│   ├── doctors/
│   │   ├── page.tsx            # All doctors listing
│   │   └── [id]/page.tsx       # Individual doctor page with booking
│   ├── appointments/page.tsx    # Patient appointment history
│   ├── confirmation/page.tsx    # Booking confirmation page
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   └── providers.tsx           # Web3 providers
├── components/
│   ├── DoctorSearch.tsx        # Doctor search component
│   ├── DoctorCard.tsx          # Doctor card component
│   ├── AppointmentBooking.tsx  # Booking form with payment
│   ├── WalletModal.tsx         # Wallet connection modal
│   └── ConnectButton.tsx       # Wallet connect/disconnect button
├── lib/
│   ├── supabase.ts             # Supabase client and types
│   ├── wagmi.ts                # Wagmi configuration
│   └── contracts.ts            # Smart contract ABIs and addresses
└── README.md
```

## Notes

- DNR is the native token of Kortana blockchain (like ETH on Ethereum), not an ERC-20 token
- Ensure you have DNR in your wallet on Kortana testnet
- The booking wallet address receives all payments via native transfers
- Doctor earnings are tracked but not automatically distributed
- Appointments are stored both on-chain (as transactions) and off-chain (in Supabase)

## License

MIT
