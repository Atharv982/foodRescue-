'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import ReservationModal from '@/components/ReservationModal';
import FoodBoxDetailModal from '@/components/FoodBoxDetailModal';
import { foodBoxes as initialFoodBoxes } from '@/lib/food-data';
import type { FoodBox } from '@/types/food';
import {
  Sparkles,
  Utensils,
  MapPin,
  Clock,
  Flame,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  SlidersHorizontal,
  Navigation,
  CheckCircle2,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';

export default function BatchesPage() {
  const [boxes, setBoxes] = useState<FoodBox[]>(initialFoodBoxes);
  const [selectedBox, setSelectedBox] = useState<FoodBox | null>(null);
  const [reservationBox, setReservationBox] = useState<FoodBox | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'servings' | 'distance' | 'urgency'>('newest');

  // Handle successful reservation
  const handleReservationSuccess = (foodBoxId: string, quantity: number) => {
    setBoxes((current) =>
      current.map((box) =>
        box.id === foodBoxId
          ? { ...box, quantityAvailable: Math.max(0, box.quantityAvailable - quantity) }
          : box
      )
    );
  };

  const filteredBoxes = useMemo(() => {
    let result = [...boxes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.partnerName.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.includedItems.some((item) => item.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((b) => b.category === selectedCategory);
    }

    if (selectedZone !== 'All Zones') {
      result = result.filter((b) => b.zone === selectedZone);
    }

    if (selectedDietary !== 'All') {
      result = result.filter((b) => b.dietaryType === selectedDietary);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'servings') return b.servings - a.servings;
      if (sortBy === 'distance') return (a.distanceKm ?? 99) - (b.distanceKm ?? 99);
      if (sortBy === 'urgency') {
        const priority = { 'Immediate (<60 Mins)': 1, 'Evening (9–11 PM)': 2, 'Late Night (11 PM–1 AM)': 3 };
        return (priority[a.urgencyLevel] || 4) - (priority[b.urgencyLevel] || 4);
      }
      return 0; // Default order
    });

    return result;
  }, [boxes, searchQuery, selectedCategory, selectedZone, selectedDietary, sortBy]);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

      <SubpageHeader
        breadcrumbs={[{ label: 'Available Batches' }]}
        eyebrow="Live Marketplace · Temperature Verified"
        title="Surplus Food Batches"
        badge={`${filteredBoxes.length} Batches Ready`}
        theme="food"
        description="Fresh, untouched food donations from wedding banquets, corporate galas, and celebration caterers across Mumbai. Reserved for verified orphanages, shelters, and relief kitchens."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/map"
              className="rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition flex items-center gap-1.5"
            >
              <Navigation size={14} className="text-moss" />
              <span>Map View</span>
            </Link>
            <Link
              href="/schedule-pickup"
              className="primary-button text-xs py-2.5 px-4"
            >
              <Sparkles size={14} /> Schedule a Pickup
            </Link>
          </div>
        }
      />

      {/* Main Filter & Listing Section */}
      <div className="section-shell py-10 lg:py-14">
        {/* Search & Filter Bar */}
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm space-y-4 mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                placeholder="Search dish, banquet, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 pl-10 pr-4 py-2.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden focus:border-moss"
              />
            </div>

            {/* Zone Selector */}
            <div>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="All Zones">All Mumbai Zones</option>
                <option value="Western Suburbs">Western Suburbs</option>
                <option value="South Mumbai">South Mumbai</option>
                <option value="Central Mumbai">Central Mumbai</option>
                <option value="Eastern Suburbs">Eastern Suburbs</option>
              </select>
            </div>

            {/* Event Category */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="All">All Event Categories</option>
                <option value="Wedding">Wedding Banquets</option>
                <option value="Party / Banquet">Private Banquets</option>
                <option value="Corporate Event">Corporate Summits</option>
                <option value="Caterer">Direct Caterer Batches</option>
                <option value="Bakery & Café">Breads & Bakery</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="newest">Sort: Latest Added</option>
                <option value="servings">Sort: Highest Servings</option>
                <option value="distance">Sort: Nearest Distance</option>
                <option value="urgency">Sort: Collection Urgency</option>
              </select>
            </div>
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ink/5">
            <span className="text-[11px] font-bold text-ink/50 uppercase tracking-wider mr-2">
              Dietary:
            </span>
            {['All', 'Pure Vegetarian', 'Non-Vegetarian', 'Jain Friendly', 'Vegan'].map((diet) => (
              <button
                key={diet}
                type="button"
                onClick={() => setSelectedDietary(diet)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  selectedDietary === diet
                    ? 'bg-moss text-white shadow-2xs font-bold'
                    : 'bg-cream/60 text-ink/70 hover:bg-cream hover:text-ink'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Cards Grid */}
        {filteredBoxes.length === 0 ? (
          <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center">
            <Utensils size={40} className="mx-auto text-ink/30 mb-3" />
            <h3 className="font-display text-lg font-bold text-ink">No Surplus Batches Found</h3>
            <p className="mt-1 text-sm text-ink/60 max-w-md mx-auto">
              No live food batches matched your current filter selection. Try selecting a different zone or clearing your search.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedZone('All Zones');
                setSelectedDietary('All');
              }}
              className="mt-4 rounded-2xl bg-moss px-4 py-2 text-xs font-bold text-white transition hover:bg-[#224433]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBoxes.map((box) => {
              const isAvailable = box.quantityAvailable > 0;

              return (
                <div
                  key={box.id}
                  className="group flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-5 shadow-sm transition hover:shadow-xl hover:border-moss/30"
                >
                  <div>
                    {/* Image & Top Badges */}
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-ink/5 mb-4">
                      <img
                        src={box.imageUrl}
                        alt={box.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                          {box.category}
                        </span>
                        {box.dietaryType && (
                          <span className="rounded-full bg-moss/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                            {box.dietaryType}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-black text-moss shadow-sm backdrop-blur-md">
                          {box.servings} Servings
                        </span>
                      </div>
                    </div>

                    {/* Venue & Location */}
                    <div className="flex items-center justify-between text-xs text-ink/60 mb-1.5">
                      <span className="font-bold text-moss truncate">{box.partnerName}</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <MapPin size={12} className="text-tomato" />
                        {box.zone}
                      </span>
                    </div>

                    {/* Batch Title */}
                    <h3 className="font-display text-base font-bold text-ink leading-snug group-hover:text-moss transition">
                      {box.name}
                    </h3>

                    {/* Included Dishes Pill List */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {box.includedItems.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-cream/80 px-2 py-0.5 text-[10px] font-medium text-ink/80"
                        >
                          {item}
                        </span>
                      ))}
                      {box.includedItems.length > 3 && (
                        <span className="rounded-lg bg-ink/5 px-1.5 py-0.5 text-[10px] font-bold text-ink/60">
                          +{box.includedItems.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Food Safety & Pickup Details */}
                    <div className="mt-4 space-y-2 rounded-2xl bg-[#DDE9DF]/30 p-3.5 text-xs border border-ink/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#202823]/70 flex items-center gap-1.5 font-medium">
                          <Flame size={13} className="text-[#F4775B]" /> Safe Temp:
                        </span>
                        <span className="font-bold text-[#285C45] bg-[#285C45]/10 px-2 py-0.5 rounded-lg">{box.temperatureStatus || 'Steam Hot (>65°C)'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#202823]/70 flex items-center gap-1.5 font-medium">
                          <Clock size={13} className="text-[#F4775B]" /> Collection Deadline:
                        </span>
                        <span className="font-bold text-[#F4775B] bg-[#F4775B]/10 px-2 py-0.5 rounded-lg border border-[#F4775B]/20">{box.pickupEnd}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#202823]/70 font-medium">Availability:</span>
                        <span className={`font-bold px-2 py-0.5 rounded-lg ${isAvailable ? 'text-[#285C45] bg-[#285C45]/10 border border-[#285C45]/20' : 'text-[#F4775B] bg-[#F4775B]/10 border border-[#F4775B]/20'}`}>
                          {isAvailable ? `${box.quantityAvailable} Crates Ready` : 'Collected / Reserved'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center gap-2 pt-3 border-t border-ink/5">
                    <Link
                      href={`/batches/${box.id}`}
                      className="rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-xs font-bold text-ink transition hover:bg-cream hover:border-moss/40 flex-1 text-center"
                    >
                      View Details
                    </Link>

                    {isAvailable ? (
                      <button
                        type="button"
                        onClick={() => setReservationBox(box)}
                        className="rounded-2xl bg-moss px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#224433] flex-1 text-center cursor-pointer shadow-sm"
                      >
                        Claim Batch
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="rounded-2xl bg-ink/10 px-4 py-2.5 text-xs font-bold text-ink/40 flex-1 text-center cursor-not-allowed"
                      >
                        Claimed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* Reservation Modal */}
      {reservationBox && (
        <ReservationModal
          box={reservationBox}
          onClose={() => setReservationBox(null)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  );
}
