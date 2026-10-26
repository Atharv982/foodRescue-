'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import { PickupJourney, PickupStatus } from '@/types/logistics';
import {
  Truck,
  Package,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Plus,
  ArrowRight,
  MapPin,
  ExternalLink,
  ShieldCheck,
  User,
  Phone,
  RotateCcw,
  Sparkles,
  Calendar
} from 'lucide-react';

function PickupsContent() {
  const [pickups, setPickups] = useState<PickupJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'active' | 'scheduled' | 'delivered'>('all');
  const [selectedZone, setSelectedZone] = useState('All Zones');

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pickups');
      const data = await res.json();
      if (data.success) {
        setPickups(data.pickups);
      } else {
        setError(data.error || 'Failed to load pickups');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error fetching pickups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  // Filtered Pickups
  const filteredPickups = useMemo(() => {
    return pickups.filter((item) => {
      // Tab Filter
      if (selectedStatusTab === 'active') {
        const activeStatuses: PickupStatus[] = ['driver_assigned', 'en_route_pickup', 'food_collected', 'delivery_en_route', 'delivered_to_shelter'];
        if (!activeStatuses.includes(item.status)) return false;
      } else if (selectedStatusTab === 'scheduled') {
        if (item.status !== 'pickup_scheduled' && item.status !== 'donation_reviewed') return false;
      } else if (selectedStatusTab === 'delivered') {
        if (item.status !== 'delivery_confirmed') return false;
      }

      // Zone Filter
      if (selectedZone !== 'All Zones' && item.pickupZone !== selectedZone) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDonor = item.donorName.toLowerCase().includes(q);
        const matchesShelter = item.destinationShelterName ? item.destinationShelterName.toLowerCase().includes(q) : false;
        const matchesDriver = item.assignedDriverName ? item.assignedDriverName.toLowerCase().includes(q) : false;

        if (!matchesId && !matchesTitle && !matchesDonor && !matchesShelter && !matchesDriver) {
          return false;
        }
      }

      return true;
    });
  }, [pickups, selectedStatusTab, selectedZone, searchQuery]);

  // Aggregate Metrics
  const activeCount = pickups.filter((p) =>
    ['driver_assigned', 'en_route_pickup', 'food_collected', 'delivery_en_route', 'delivered_to_shelter'].includes(p.status)
  ).length;
  const scheduledCount = pickups.filter((p) => p.status === 'pickup_scheduled').length;
  const deliveredCount = pickups.filter((p) => p.status === 'delivery_confirmed').length;
  const totalMealsTracked = pickups.reduce((acc, p) => acc + p.servings, 0);

  const getStatusBadge = (status: PickupStatus) => {
    switch (status) {
      case 'delivery_en_route':
        return { label: 'Van En Route to Shelter', bg: 'bg-blue-50 text-blue-700 border-blue-300 font-bold animate-pulse' };
      case 'food_collected':
        return { label: 'Food Collected & Hot-Audit Verified', bg: 'bg-blue-50 text-blue-700 border-blue-200 font-bold' };
      case 'en_route_pickup':
        return { label: 'Van En Route to Venue', bg: 'bg-blue-50 text-blue-700 border-blue-200 font-bold animate-pulse' };
      case 'driver_assigned':
        return { label: 'Driver Assigned', bg: 'bg-blue-50 text-blue-700 border-blue-200 font-bold' };
      case 'pickup_scheduled':
        return { label: 'Upcoming / Scheduled Tonight', bg: 'bg-[#E7E8E3] text-[#202823]/80 border-slate-300 font-bold' };
      case 'delivery_confirmed':
        return { label: 'Delivered & Confirmed', bg: 'bg-[#193D30] text-white border-transparent font-bold' };
      default:
        return { label: status.replace(/_/g, ' '), bg: 'bg-[#E7E8E3] text-[#202823]/70 border-slate-300 font-medium' };
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#202823]">
      <Navbar />

      <SubpageHeader
        theme="logistics"
        breadcrumbs={[{ label: 'Rescue Hub', href: '/rescue-hub' }, { label: 'Pickup Tracking' }]}
        eyebrow="Real-Time Logistics Telemetry"
        title="Donation Pickup & Delivery Tracking"
        badge="Live Fleet Status"
        description="Monitor every celebration food rescue from the moment surplus is registered to hot-chain verification and delivery at verified shelter homes across Mumbai."
      />

      <div className="section-shell py-8 lg:py-12 space-y-6">
        {/* ============================================================== */}
        {/* METRICS OVERVIEW STRIP */}
        {/* ============================================================== */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-ink/50 text-xs font-bold uppercase tracking-wider">
              <span>Active in Transit</span>
              <Truck size={15} className="text-sky-600" />
            </div>
            <div className="font-display text-3xl font-extrabold text-ink">{activeCount}</div>
            <p className="text-[11px] text-ink/60">Insulated vans currently dispatched</p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-ink/50 text-xs font-bold uppercase tracking-wider">
              <span>Scheduled Tonight</span>
              <Clock3 size={15} className="text-moss" />
            </div>
            <div className="font-display text-3xl font-extrabold text-moss">{scheduledCount}</div>
            <p className="text-[11px] text-ink/60">Awaiting evening banquet winding down</p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-ink/50 text-xs font-bold uppercase tracking-wider">
              <span>Confirmed Deliveries</span>
              <CheckCircle2 size={15} className="text-moss" />
            </div>
            <div className="font-display text-3xl font-extrabold text-ink">{deliveredCount}</div>
            <p className="text-[11px] text-ink/60">Verified with digital recipient proof</p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-ink/50 text-xs font-bold uppercase tracking-wider">
              <span>Total Meals Tracked</span>
              <Package size={15} className="text-tomato" />
            </div>
            <div className="font-display text-3xl font-extrabold text-ink">{totalMealsTracked}</div>
            <p className="text-[11px] text-ink/60">Standardized wholesome portions</p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* FILTER CONTROLS BAR */}
        {/* ============================================================== */}
        <div className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-soft space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                placeholder="Search tracking ID (e.g. FR-TRK-8821), venue, shelter, or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 pl-11 pr-4 py-3 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
              />
            </div>

            {/* Zone Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-3 text-xs font-bold text-ink outline-hidden focus:border-moss cursor-pointer"
              >
                <option value="All Zones">All Mumbai Corridors</option>
                <option value="Western Suburbs">Western Suburbs</option>
                <option value="South Mumbai">South Mumbai</option>
                <option value="Central Mumbai">Central Mumbai</option>
                <option value="Eastern Suburbs">Eastern Suburbs</option>
                <option value="Thane & Navi Mumbai">Thane & Navi Mumbai</option>
              </select>

              <button
                type="button"
                onClick={fetchPickups}
                className="rounded-2xl border border-ink/10 bg-white p-3 text-ink/60 hover:text-ink hover:bg-cream transition cursor-pointer"
                title="Refresh Live Data"
              >
                <RotateCcw size={15} />
              </button>

              <Link
                href="/pickups/schedule"
                className="rounded-2xl bg-moss px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#224433] transition flex items-center gap-1.5 shrink-0"
              >
                <Plus size={14} /> Schedule Pickup
              </Link>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-ink/5">
            {[
              { id: 'all', label: 'All Journeys', count: pickups.length },
              { id: 'active', label: 'Active In Transit', count: activeCount },
              { id: 'scheduled', label: 'Scheduled Tonight', count: scheduledCount },
              { id: 'delivered', label: 'Delivered & Confirmed', count: deliveredCount },
            ].map((tab) => {
              const isSelected = selectedStatusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatusTab(tab.id as any)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-moss text-white shadow-xs'
                      : 'bg-cream/60 text-ink/75 hover:bg-cream hover:text-ink'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-ink/5 text-ink/50'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* PICKUP JOURNEYS LIST CARDS */}
        {/* ============================================================== */}
        {loading ? (
          <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center text-xs font-bold text-ink/50">
            <RotateCcw size={20} className="animate-spin mx-auto mb-2 text-moss" />
            Loading live pickup fleet telemetry...
          </div>
        ) : filteredPickups.length === 0 ? (
          <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center space-y-3">
            <Package size={32} className="mx-auto text-ink/30" />
            <h3 className="font-display text-lg font-bold text-ink">No pickup journeys found</h3>
            <p className="text-xs text-ink/60 max-w-sm mx-auto">
              There are no pickups matching your current search or filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatusTab('all');
                setSelectedZone('All Zones');
              }}
              className="rounded-2xl border border-ink/10 px-4 py-2 text-xs font-bold text-moss hover:bg-cream transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPickups.map((journey) => {
              const badge = getStatusBadge(journey.status);

              return (
                <div
                  key={journey.id}
                  className="rounded-[30px] border border-ink/10 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-soft hover:border-moss/40 transition space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-ink/5 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-moss bg-moss/10 px-2.5 py-1 rounded-xl">
                        {journey.id}
                      </span>
                      <span className={`rounded-xl border px-2.5 py-0.5 text-xs font-bold ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-ink/40 font-bold">· {journey.pickupZone}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-ink/60">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock3 size={13} className="text-moss" /> Window: <strong>{journey.scheduledPickupWindow}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Main Grid: Origin Venue -> Destination Shelter */}
                  <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr_auto] items-center">
                    {/* Origin */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-ink/40 block">
                        Pickup Venue (Donor)
                      </span>
                      <h4 className="font-bold text-sm text-ink">{journey.donorName}</h4>
                      <p className="text-xs text-ink/65 line-clamp-1">{journey.pickupAddress}</p>
                    </div>

                    {/* Arrow Divider */}
                    <div className="hidden md:flex flex-col items-center justify-center text-ink/30">
                      <ArrowRight size={18} />
                      <span className="text-[9px] font-bold mt-0.5">{journey.estimatedKg} kg</span>
                    </div>

                    {/* Destination Shelter */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-ink/40 block">
                        Destination Shelter (Recipient)
                      </span>
                      <h4 className="font-bold text-sm text-ink">
                        {journey.destinationShelterName || 'Pending Shelter Match'}
                      </h4>
                      <p className="text-xs text-ink/65 line-clamp-1">
                        {journey.destinationAddress || 'Assigned via Logistics Room'}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <Link
                        href={`/pickups/${journey.id}`}
                        className="rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#224433] transition flex items-center gap-1.5 shrink-0"
                      >
                        <span>Track Live Journey</span> <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* Footer metadata: Food details, assigned driver */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-ink/5 text-xs text-ink/75 bg-cream/30 p-3 rounded-2xl">
                    <div className="flex flex-wrap items-center gap-4">
                      <span>Food: <strong>{journey.servings} Servings</strong> ({journey.dietaryType})</span>
                      <span>·</span>
                      <span className="truncate max-w-xs">{journey.foodDescription}</span>
                    </div>

                    {journey.assignedDriverName && (
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="text-ink/50">Driver:</span>
                        <span className="flex items-center gap-1 text-ink">
                          <User size={13} className="text-moss" /> {journey.assignedDriverName} ({journey.assignedVehiclePlate})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function PickupsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center p-12 text-xs font-bold text-ink/50">
          Loading Pickup Tracking Dashboard...
        </div>
      }
    >
      <PickupsContent />
    </Suspense>
  );
}
