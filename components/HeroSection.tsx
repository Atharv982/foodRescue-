'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Heart,
  Users,
  Clock,
  CheckCircle,
  Search,
  Flame,
  Radio,
  SlidersHorizontal,
  Truck
} from 'lucide-react';
import type { FoodBox } from '@/types/food';
import CustomDropdown, { DropdownOption } from './CustomDropdown';

interface HeroSectionProps {
  featuredBox: FoodBox;
  onReserve: (box: FoodBox) => void;
  onOpen: (box: FoodBox) => void;
  onQuickFilter?: (filters: { zone: string; category: string; minServings: number }) => void;
}

const heroZones: DropdownOption[] = [
  { value: 'All Zones', label: 'All Mumbai Zones', badge: '10 Batches' },
  { value: 'Western Suburbs', label: 'Western Suburbs', badge: 'Bandra-Borivali' },
  { value: 'South Mumbai', label: 'South Mumbai', badge: 'Town & Marine' },
  { value: 'Central Mumbai', label: 'Central Mumbai', badge: 'Dadar & Kurla' },
  { value: 'Eastern Suburbs', label: 'Eastern Suburbs', badge: 'Powai-Ghatkopar' },
];

const heroTypes: DropdownOption[] = [
  { value: 'All Events', label: 'All Celebrations', badge: 'All Sources' },
  { value: 'Wedding', label: 'Wedding Feasts 💍', badge: 'Banquets' },
  { value: 'Party / Banquet', label: 'Party / Banquets 🎂', badge: 'Parties' },
  { value: 'Corporate Event', label: 'Corporate Gala Buffets 🏢', badge: 'Summits' },
  { value: 'Caterer', label: 'Community Pots 🍲', badge: 'Bulk Pots' },
  { value: 'Bakery & Café', label: 'Bakery & Café 🥐', badge: 'Deli Bakes' },
];

const heroDietary: DropdownOption[] = [
  { value: 'All Diets', label: 'All Dietary Classifications', badge: 'Any' },
  { value: 'Pure Vegetarian', label: 'Pure Vegetarian 🌿', badge: 'Veg' },
  { value: 'Jain Friendly', label: 'Jain Satvik (No Root Veg) 🕊️', badge: 'Satvik' },
  { value: 'Halal Certified', label: 'Halal Certified 🌙', badge: 'Halal' },
  { value: 'Vegan', label: 'Vegan Friendly 🌱', badge: 'Vegan' },
];

const heroServings: DropdownOption[] = [
  { value: 'All Sizes', label: 'All Batch Sizes', badge: 'Any' },
  { value: '15–30 People', label: 'Small Batch (15–30 People)', badge: '15–30' },
  { value: '30+ People', label: 'Medium Batch (30+ People)', badge: '30–50' },
  { value: '50+ People', label: 'Large Feast (50+ People)', badge: '50+' },
];

const activeRadarVans = [
  {
    id: 'ALL',
    label: 'All Active Vans (4 En Route)',
    headline: 'Tonight: 340+ hot celebration meals saved across Mumbai',
    badge: '4 Active Vans',
    location: 'Citywide coverage'
  },
  {
    id: 'VAN-01',
    label: 'Van #01: Western Suburbs',
    headline: 'Van #01: En route to Sneha Sadan Orphanage with 60 Royal Palms buffet plates (68°C)',
    badge: 'ETA 12m',
    location: 'Aarey Colony → Andheri'
  },
  {
    id: 'VAN-02',
    label: 'Van #02: South Mumbai',
    headline: 'Van #02: Loaded 85 Dum Biryani portions at Byculla Nikah banquet, bound for Dockside Relief',
    badge: 'ETA 18m',
    location: 'Byculla → Cotton Green'
  },
  {
    id: 'VAN-03',
    label: 'Van #03: Eastern Suburbs',
    headline: 'Van #03: Delivering 55 Satvik Jain feast portions directly to Ghatkopar Senior Home',
    badge: 'ETA 5m',
    location: 'Ghatkopar East'
  },
  {
    id: 'VAN-04',
    label: 'Van #04: Central Mumbai',
    headline: 'Van #04: Picked up 75 hot Khichdi & Dal portions from Shivaji Park Community Hall',
    badge: 'ETA 25m',
    location: 'Dadar West'
  },
];

export default function HeroSection({ featuredBox, onReserve, onOpen, onQuickFilter }: HeroSectionProps) {
  const [quickZone, setQuickZone] = useState('All Zones');
  const [quickType, setQuickType] = useState('All Events');
  const [quickDiet, setQuickDiet] = useState('All Diets');
  const [quickServings, setQuickServings] = useState('All Sizes');
  const [selectedVanId, setSelectedVanId] = useState('ALL');

  // Animation and Parallax Tilt States
  const [isMounted, setIsMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Restrained, elegant tilt (max 2.5 degrees)
    setTilt({
      x: -(y / (rect.height / 2)) * 2.2,
      y: (x / (rect.width / 2)) * 2.2,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const selectedVan = activeRadarVans.find((v) => v.id === selectedVanId) || activeRadarVans[0];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onQuickFilter) {
      let minServings = 0;
      if (quickServings === '30+ People') minServings = 30;
      if (quickServings === '50+ People') minServings = 50;

      onQuickFilter({
        zone: quickZone,
        category: quickType === 'All Events' ? 'All' : quickType,
        minServings,
      });
    }

    const el = document.getElementById('batches');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-16 lg:pt-10 lg:pb-24">
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 -z-10 bg-hero-grid bg-[length:26px_26px] opacity-35 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/4 -z-10 h-96 w-96 rounded-full bg-sage/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-10 -z-10 h-80 w-80 rounded-full bg-moss/10 blur-3xl" />

      {/* Live Rescue Radar Pill Ticker with Interactive Van Selector Dropdown */}
      <div className="section-shell mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-moss/20 bg-white/90 p-2.5 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
            <div className="flex items-center gap-1.5 rounded-full bg-tomato/15 px-2.5 py-1 text-[10px] font-black text-tomato uppercase tracking-wider shrink-0">
              <Radio size={12} className="animate-pulse" /> Live Dispatch Radar
            </div>
            <div className="overflow-hidden whitespace-nowrap text-xs font-semibold text-ink/75 truncate">
              {selectedVan.headline}
            </div>
          </div>

          {/* Interactive Van Selector Dropdown */}
          <div className="shrink-0 w-full sm:w-auto">
            <CustomDropdown
              value={selectedVanId}
              options={activeRadarVans.map((v) => ({
                value: v.id,
                label: v.label,
                badge: v.badge,
                hint: v.location,
              }))}
              onChange={setSelectedVanId}
              size="sm"
              clearable={false}
              className="min-w-[210px]"
            />
          </div>
        </div>
      </div>

      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white/90 px-4 py-1.5 text-xs font-bold tracking-wide text-forest shadow-xs backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-coral animate-ping" />
            <Heart size={14} className="fill-coral text-coral" />
            <span>Connecting Banquet & Wedding Surplus to Hungry Lives</span>
          </div>

          {/* Headline with Evergreen & Forest Typography */}
          <h1 className="mt-6 font-display text-5xl font-black leading-[1.03] tracking-[-0.04em] text-evergreen sm:text-6xl lg:text-7xl">
            Don’t let celebration food <span className="text-forest">go to waste.</span><br />
            Feed those in need.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/75 sm:text-xl">
            At the end of grand weddings, parties, and banquets, huge pots of delicious, untouched food are often thrown away. FoodRescue picks up fresh surplus and delivers warm, dignified meals to children’s shelter homes, night shelters, and hungry families within 2 hours.
          </p>

          {/* Quick Rescue Finder Bar with 4 Rich Interactive Dropdowns */}
          <form onSubmit={handleQuickSearch} className="mt-8 rounded-3xl border border-ink/10 bg-white p-4 lg:p-5 shadow-soft">
            <div className="flex items-center justify-between px-1 pb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                Interactive Food Batch Finder:
              </p>
              <span className="rounded-full bg-sage/60 px-2 py-0.5 text-[10px] font-bold text-moss">
                ⚡ 10 Batches Ready
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Dropdown 1: Zone */}
              <CustomDropdown
                label="City Zone"
                value={quickZone}
                options={heroZones}
                onChange={setQuickZone}
                defaultValue="All Zones"
                size="sm"
              />

              {/* Dropdown 2: Event Type */}
              <CustomDropdown
                label="Event Source"
                value={quickType}
                options={heroTypes}
                onChange={setQuickType}
                defaultValue="All Events"
                size="sm"
              />

              {/* Dropdown 3: Dietary Classification */}
              <CustomDropdown
                label="Dietary Class"
                value={quickDiet}
                options={heroDietary}
                onChange={setQuickDiet}
                defaultValue="All Diets"
                size="sm"
              />

              {/* Dropdown 4: Servings Capacity */}
              <CustomDropdown
                label="Batch Capacity"
                value={quickServings}
                options={heroServings}
                onChange={setQuickServings}
                defaultValue="All Sizes"
                size="sm"
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-ink/5 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="px-1 text-[11px] text-ink/50">
                Instant match against verified food temperature & insulated transport vans.
              </span>
              <button
                type="submit"
                className="primary-button text-xs py-2.5 px-5 cursor-pointer"
              >
                <Search size={14} /> Filter Food Batches
              </button>
            </div>
          </form>

          {/* Dual CTAs with subtle coral accent */}
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <a
              href="#donate-form"
              className="relative group inline-flex items-center justify-center gap-2.5 rounded-full bg-forest px-8 py-4 text-base font-black text-white shadow-xl shadow-forest/25 ring-2 ring-coral/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-evergreen hover:ring-coral/60 hover:shadow-2xl active:translate-y-0"
            >
              <span>Schedule Event Food Pickup</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-coral text-white transition group-hover:translate-x-0.5">
                <ArrowRight size={14} />
              </span>
            </a>
            <a
              href="#calculator"
              className="secondary-button px-6 py-4 text-base"
            >
              Calculate Waste for Your Event
            </a>
          </div>

          {/* Recent Rescue Activity Preview Avatars & Trust badges */}
          <div className="mt-10 pt-6 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=120&q=80"
                  alt="Wedding feast rescue"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=120&q=80"
                  alt="Banquet ballroom handover"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=120&q=80"
                  alt="Shelter meal distribution"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
                />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-evergreen">18,400+ Meals Nourished</p>
                <p className="text-ink/50 text-[11px]">From 340+ Mumbai wedding celebrations</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-ink/60">
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-forest" /> &lt;2h Pickup
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-forest" /> &gt;65°C Verified
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VISUAL HERO FEATURE CARD WITH PREMIUM FLOATING & HOVER PARALLAX */}
        {/* ============================================================== */}
        <div className="relative mx-auto w-full max-w-[560px]">
          {/* Floating badge 1: Live availability (Independent float timing & reveal) */}
          <div
            className={`absolute -left-6 top-8 z-20 hidden rounded-2xl border border-ink/10 bg-white/95 px-4 py-3 shadow-soft backdrop-blur-md sm:block animate-float-status-1 transition-all duration-700 ${
              isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Tonight’s Mission</p>
            <p className="mt-0.5 flex items-center gap-1.5 font-display text-sm font-extrabold text-moss">
              <Sparkles size={14} className="animate-pulse" /> 3 Weddings & 2 Banquets Rescued
            </p>
          </div>

          {/* Floating badge 2: People Fed (Independent float timing & reveal) */}
          <div
            className={`absolute -right-4 -bottom-6 z-20 rounded-3xl border border-white/80 bg-white/95 p-4 shadow-soft backdrop-blur-md sm:-right-8 animate-float-status-2 transition-all duration-700 ${
              isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-sage text-moss">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">Feeds Hungry People</p>
                <p className="font-display text-2xl font-black text-moss">{featuredBox.servings}+ Meals</p>
              </div>
            </div>
            <p className="mt-1 text-[11px] font-medium text-ink/60">Delivered directly to local orphanages</p>
          </div>

          {/* Main Card Container with Floating Motion, Initial Load Reveal, and Interactive Desktop Hover Parallax */}
          <div
            className={`animate-float-hero transition-all duration-700 ease-out ${
              isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 scale-95'
            }`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              perspective: 1000,
            }}
          >
            <div
              className="overflow-hidden rounded-[36px] border border-ink/10 bg-white p-3.5 shadow-2xl transition-all duration-300 ease-out hover:shadow-[0_28px_65px_-15px_rgba(47,93,70,0.22)] cursor-pointer"
              style={{
                transform: isHovered
                  ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025)`
                  : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative aspect-[4/4.2] overflow-hidden rounded-[28px]">
                <Image
                  src={featuredBox.imageUrl}
                  alt={featuredBox.name}
                  fill
                  priority
                  className={`object-cover transition-transform duration-700 ease-out ${
                    isHovered ? 'scale-108' : 'scale-100'
                  }`}
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

                {/* Top Chips with Gentle Temperature Indicator Pulse */}
                <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-10">
                  <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur">
                    Live Wedding Surplus Batch
                  </span>
                  <span className="rounded-full bg-moss px-3 py-1 text-xs font-extrabold text-white shadow-sm flex items-center gap-1.5 animate-temp-pulse">
                    <Flame size={12} className="text-[#f7c96a]" />
                    <span>{featuredBox.temperatureVerified}</span>
                  </span>
                </div>

                {/* Bottom Card Content with Glassmorphic Detail Panel */}
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/30 bg-white/95 p-5 shadow-lg backdrop-blur-md transition-transform duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-moss">
                        {featuredBox.category} · {featuredBox.partnerName}
                      </span>
                      <h2 className="mt-0.5 font-display text-xl font-black tracking-tight text-ink sm:text-2xl">
                        {featuredBox.name}
                      </h2>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
                        <MapPin size={13} className="text-moss" /> {featuredBox.venueName} · {featuredBox.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="rounded-full bg-sage px-3 py-1 font-display text-sm font-black text-moss block">
                        Feeds {featuredBox.servings} People
                      </span>
                      <span className="block mt-1 text-[11px] text-ink/50">
                        Cooked at {featuredBox.cookedTime}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
                    <span className="text-xs font-semibold text-moss">
                      📍 Target: {featuredBox.beneficiaryTarget}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(featuredBox);
                        }}
                        className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-cream cursor-pointer"
                      >
                        View Menu
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReserve(featuredBox);
                        }}
                        className="primary-button px-4 py-1.5 text-xs cursor-pointer"
                      >
                        Claim for Relief
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
