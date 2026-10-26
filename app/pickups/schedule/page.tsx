'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import { sheltersData } from '@/lib/directory-data';
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Package,
  Phone,
  User,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react';

function SchedulePickupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const prefillTitle = searchParams?.get('title') || '';
  const prefillVenue = searchParams?.get('venue') || '';
  const prefillServings = searchParams?.get('servings') || '85';
  const prefillDonationId = searchParams?.get('donationId') || '';

  const [form, setForm] = useState({
    donationId: prefillDonationId || `DON-${Date.now().toString(36).toUpperCase()}`,
    title: prefillTitle || (prefillVenue ? `${prefillVenue} Evening Feast` : ''),
    donorName: prefillVenue || '',
    donorCategory: 'Wedding Hall',
    donorContactPhone: '',
    pickupAddress: prefillVenue ? `${prefillVenue}, Mumbai` : '',
    pickupNeighborhood: 'Goregaon East',
    pickupZone: 'Western Suburbs',
    servings: Number(prefillServings) || 85,
    foodCategory: 'Wedding Feasts',
    dietaryType: 'Pure Vegetarian',
    foodDescription: 'Shahi Paneer, Dal Makhani, Jeera Rice, Tandoori Rotis',
    packagingStatus: 'Stainless Thermal Pots (FoodRescue Provided)',
    scheduledPickupWindow: '22:30 - 23:45',
    scheduledDate: 'Tonight',
    destinationShelterId: sheltersData[0]?.id || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to schedule pickup');
      }

      router.push(`/pickups/${data.journeyId}`);
    } catch (err: any) {
      setError(err?.message || 'Error submitting pickup schedule request');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar />

      <SubpageHeader
        breadcrumbs={[
          { label: 'Rescue Hub', href: '/rescue-hub' },
          { label: 'Pickups', href: '/pickups' },
          { label: 'Schedule Pickup' },
        ]}
        eyebrow="Fleet Dispatch & Recovery Booking"
        title="Schedule a Food Rescue Pickup"
        badge="Zero Cost Fleet"
        description="Book certified volunteer food rescue handlers and insulated thermal vans for surplus banquet food across Greater Mumbai."
      />

      <div className="section-shell py-8 lg:py-14">
        <div className="max-w-2xl mx-auto rounded-[32px] border border-ink/10 bg-white p-6 sm:p-10 shadow-soft space-y-6">
          <div className="border-b border-ink/10 pb-4">
            <h2 className="font-display text-2xl font-black text-ink">
              Banquet Surplus Dispatch Form
            </h2>
            <p className="text-xs text-ink/65 mt-1">
              Confirm your banquet timing and destination shelter for hot-chain recovery.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-tomato/30 bg-tomato/10 p-4 text-xs font-bold text-tomato flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Event Title & Donor Venue */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-ink mb-1">
                  Event / Celebration Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verma & Sharma Wedding Reception"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Venue / Caterer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Royal Palms Grand Ballroom"
                  value={form.donorName}
                  onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                  className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                />
              </div>
            </div>

            {/* Address & Zone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-ink mb-1">
                  Exact Banquet Address & Gate *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gate 3, Aarey Milk Colony, Goregaon East"
                  value={form.pickupAddress}
                  onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                  className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Mumbai Relief Corridor *
                </label>
                <select
                  value={form.pickupZone}
                  onChange={(e) => setForm({ ...form, pickupZone: e.target.value as any })}
                  className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                >
                  <option value="Western Suburbs">Western Suburbs (Bandra–Goregaon)</option>
                  <option value="South Mumbai">South Mumbai (Colaba–Worli)</option>
                  <option value="Central Mumbai">Central Mumbai (Dadar–Kurla)</option>
                  <option value="Eastern Suburbs">Eastern Suburbs (Powai–Ghatkopar)</option>
                  <option value="Thane & Navi Mumbai">Thane & Navi Mumbai</option>
                </select>
              </div>
            </div>

            {/* Servings, Dietary & Contact */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block font-bold text-ink mb-1">
                  Estimated Servings *
                </label>
                <input
                  type="number"
                  min={10}
                  max={3000}
                  required
                  value={form.servings}
                  onChange={(e) => setForm({ ...form, servings: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Dietary Category *
                </label>
                <select
                  value={form.dietaryType}
                  onChange={(e) => setForm({ ...form, dietaryType: e.target.value })}
                  className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                >
                  <option value="Pure Vegetarian">Pure Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Mixed Buffet">Mixed Buffet</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Contact Mobile *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="98200 00000"
                  value={form.donorContactPhone}
                  onChange={(e) => setForm({ ...form, donorContactPhone: e.target.value })}
                  className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                />
              </div>
            </div>

            {/* Food Description */}
            <div>
              <label className="block font-bold text-ink mb-1">
                Dishes Prepared / Food Description *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Shahi Paneer, Dal Makhani, Jeera Rice, Tandoori Rotis, Gulab Jamun"
                value={form.foodDescription}
                onChange={(e) => setForm({ ...form, foodDescription: e.target.value })}
                className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
              />
            </div>

            {/* Pickup Window & Destination Shelter */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-ink mb-1">
                  Pickup Time Window *
                </label>
                <select
                  value={form.scheduledPickupWindow}
                  onChange={(e) => setForm({ ...form, scheduledPickupWindow: e.target.value })}
                  className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                >
                  <option value="21:30 - 22:30">Evening (9:30 PM – 10:30 PM)</option>
                  <option value="22:30 - 23:45">Late Evening (10:30 PM – 11:45 PM)</option>
                  <option value="23:45 - 01:00">Midnight (11:45 PM – 1:00 AM)</option>
                  <option value="Next Morning 07:00">Next Morning (7:00 AM – Breakfast)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  Target Destination Shelter *
                </label>
                <select
                  value={form.destinationShelterId}
                  onChange={(e) => setForm({ ...form, destinationShelterId: e.target.value })}
                  className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                >
                  {sheltersData.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.beneficiaryCount} Residents · {s.neighborhood})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-ink/10 flex items-center justify-between gap-3">
              <Link
                href="/pickups"
                className="rounded-2xl border border-ink/10 px-5 py-3 font-bold text-ink hover:bg-cream transition flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-moss px-7 py-3 font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#224433] transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {submitting ? 'Confirming Fleet Schedule...' : 'Confirm Free Scheduled Rescue Pickup'}
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SchedulePickupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center p-12 text-xs font-bold text-ink/50">
          Loading Pickup Form...
        </div>
      }
    >
      <SchedulePickupFormContent />
    </Suspense>
  );
}
