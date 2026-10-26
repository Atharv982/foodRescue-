'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import ReservationModal from '@/components/ReservationModal';
import { foodBoxes } from '@/lib/food-data';
import type { FoodBox } from '@/types/food';
import {
  Sparkles,
  Utensils,
  MapPin,
  Clock,
  Flame,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Navigation,
  ExternalLink,
  Package,
  AlertCircle,
  Building2,
  Heart,
  Share2
} from 'lucide-react';

export default function BatchDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const initialBox = foodBoxes.find((b) => b.id === id);
  const [box, setBox] = useState<FoodBox | undefined>(initialBox);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!box) {
    return (
      <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
        <Navbar />
        <div className="section-shell py-24 text-center">
          <AlertCircle size={48} className="mx-auto text-tomato mb-4" />
          <h1 className="font-display text-2xl font-bold text-ink">Food Batch Not Found</h1>
          <p className="mt-2 text-sm text-ink/60">
            The batch ID you requested does not exist or has already completed distribution.
          </p>
          <Link
            href="/batches"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#224433]"
          >
            <ArrowLeft size={14} /> Back to Available Batches
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isAvailable = box.quantityAvailable > 0;

  const handleReservationSuccess = (foodBoxId: string, quantity: number) => {
    setBox((curr) =>
      curr ? { ...curr, quantityAvailable: Math.max(0, curr.quantityAvailable - quantity) } : curr
    );
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar selectedZone={box.zone} />

      <SubpageHeader
        breadcrumbs={[
          { label: 'Available Batches', href: '/batches' },
          { label: box.name },
        ]}
        eyebrow={`Verified ${box.category} Surplus · ${box.zone}`}
        title={box.name}
        badge={isAvailable ? `${box.quantityAvailable} Crates Live` : 'Collected'}
        description={`Freshly prepared event feast donated by ${box.partnerName} at ${box.venueName}. Inspected and ready for relief transport.`}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={13} />
              <span>{copied ? 'Link Copied!' : 'Share Batch'}</span>
            </button>
            <Link
              href="/batches"
              className="rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> All Batches
            </Link>
          </div>
        }
      />

      <div className="section-shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left 2 Cols: Main Batch Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-3xl bg-ink/5 shadow-md">
              <img
                src={box.imageUrl}
                alt={box.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {box.category}
                </span>
                {box.dietaryType && (
                  <span className="rounded-full bg-moss/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    {box.dietaryType}
                  </span>
                )}
                <span className="rounded-full bg-tomato/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md flex items-center gap-1">
                  <Flame size={12} /> {box.temperatureStatus || 'Steam Hot (>65°C)'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-ink mb-3">About This Celebration Batch</h2>
              <p className="text-sm text-ink/75 leading-relaxed">{box.description}</p>

              {/* Tags */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {box.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl bg-cream px-3 py-1 text-xs font-semibold text-ink/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Included Menu Items Breakdown */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                  <Utensils size={18} className="text-moss" /> Included Dishes & Items
                </h2>
                <span className="rounded-full bg-sage/60 px-2.5 py-0.5 text-xs font-extrabold text-moss">
                  {box.includedItems.length} Dishes
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {box.includedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-2xl border border-ink/5 bg-cream/30 p-3.5"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-xl bg-moss/10 text-xs font-black text-moss shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Safety & Packaging Protocol */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                <ShieldCheck size={20} className="text-moss" /> Food Safety & Chain of Custody
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-ink/5 bg-cream/40 p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-ink/50 tracking-wider">
                    Infrared Temp Verification
                  </span>
                  <p className="font-bold text-moss text-sm">{box.temperatureVerified}</p>
                  <p className="text-ink/60">Verified with laser thermometer upon kitchen handover.</p>
                </div>

                <div className="rounded-2xl border border-ink/5 bg-cream/40 p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-ink/50 tracking-wider">
                    Packaging Standard
                  </span>
                  <p className="font-bold text-ink text-sm">{box.packagingType || 'Stainless Thermal Pots'}</p>
                  <p className="text-ink/60">Food-grade hermetic seal prevents airborne exposure.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Logistics, Allocation & Action Box */}
          <div className="space-y-6">
            {/* Claim Card */}
            <div className="sticky top-24 rounded-3xl border border-ink/10 bg-white p-6 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                  Total Nutrition Ready
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display text-4xl font-black text-moss">
                    {box.servings}
                  </span>
                  <span className="text-sm font-bold text-ink/60">Servings</span>
                </div>
                <p className="text-xs text-ink/50 mt-1">
                  Estimated value: ₹{box.originalValue.toLocaleString('en-IN')} (Free distribution)
                </p>
              </div>

              {/* Status indicator */}
              <div className="rounded-2xl bg-cream/60 p-3.5 border border-ink/5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-ink/60">Batch Status:</span>
                  <span className={`font-black ${isAvailable ? 'text-moss' : 'text-tomato'}`}>
                    {isAvailable ? '● Ready for Pickup' : '✕ Fully Reserved'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink/60">Collection Window:</span>
                  <span className="font-bold text-ink">{box.pickupStart} – {box.pickupEnd}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink/60">Target Beneficiaries:</span>
                  <span className="font-bold text-ink truncate max-w-[150px]" title={box.beneficiaryTarget}>
                    {box.beneficiaryCategory || 'Shelters & Relief'}
                  </span>
                </div>
              </div>

              {/* Claim Action */}
              {isAvailable ? (
                <button
                  type="button"
                  onClick={() => setReservationOpen(true)}
                  className="primary-button w-full justify-center py-3.5 text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  <Sparkles size={16} /> Reserve Batch for Shelter
                </button>
              ) : (
                <div className="rounded-2xl bg-tomato/10 p-3 text-center text-xs font-bold text-tomato border border-tomato/20">
                  This batch has already been reserved and dispatched.
                </div>
              )}

              {/* Venue Info & Directions */}
              <div className="pt-4 border-t border-ink/5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Building2 size={16} className="text-moss shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-ink">{box.partnerName}</h4>
                    <p className="text-[11px] text-ink/60">{box.venueName}</p>
                    <p className="text-[11px] text-ink/50 mt-0.5">{box.location}, {box.zone}</p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(box.location + ' ' + box.venueName + ' Mumbai')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-ink/10 bg-cream/40 py-2.5 text-xs font-bold text-ink transition hover:bg-cream"
                >
                  <Navigation size={13} className="text-moss" /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Reservation Modal */}
      {reservationOpen && (
        <ReservationModal
          box={box}
          onClose={() => setReservationOpen(false)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  );
}
