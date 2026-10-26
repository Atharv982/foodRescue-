'use client';

import { useState } from 'react';
import {
  Calculator,
  ArrowRight,
  Heart,
  Users,
  Sparkles,
  Utensils,
  ShieldCheck,
  Award,
  Leaf,
  DollarSign,
  Truck,
  PackageCheck
} from 'lucide-react';


// 1. Event Occasion Options
interface OccasionOption {
  value: string;
  label: string;
  badge: string;
  hint: string;
}

const occasionOptions: OccasionOption[] = [
  { value: 'wedding', label: 'Grand Royal Wedding Reception 💍', badge: 'High Volume', hint: 'Typically 350–1,200 guests' },
  { value: 'sangeet', label: 'Sangeet & Mehendi Night 🎶', badge: 'Evening Feast', hint: 'Heavy snacks & dinner buffet' },
  { value: 'corporate', label: 'Corporate Gala & Tech Summit 🏢', badge: 'Plated Buffet', hint: 'Summit conference dinner' },
  { value: 'birthday', label: 'Milestone Birthday / Anniversary 🎂', badge: 'Family Banquet', hint: 'Banquet hall gathering' },
  { value: 'religious', label: 'Religious Langar / Community Feast 🕊️', badge: 'Bulk Pots', hint: 'Mass community feeding' },
  { value: 'charity', label: 'Charity Fundraiser Dinner 🏆', badge: 'Cocktail Gala', hint: 'High-end catered courses' },
];

// 2. Buffet Service Styles
const buffetStyles = [
  {
    id: 'multi-course',
    label: 'Grand Multi-Course Buffet & Live Counters (22% surplus)',
    rate: 0.22,
    badge: '22% Buffer',
    hint: 'Elaborate multi-cuisine setups'
  },
  {
    id: 'thali',
    label: 'Traditional Sit-Down Banana Leaf / Thali (25% surplus)',
    rate: 0.25,
    badge: '25% Buffer',
    hint: 'Generous Indian traditional refills'
  },
  {
    id: 'cocktail',
    label: 'Heavy Cocktail & Starters Reception (16% surplus)',
    rate: 0.16,
    badge: '16% Buffer',
    hint: 'Appetizers & finger food emphasis'
  },
  {
    id: 'corporate-buffet',
    label: 'Corporate Conference Buffet (12% surplus)',
    rate: 0.12,
    badge: '12% Buffer',
    hint: 'Strict headcount control'
  },
  {
    id: 'family',
    label: 'Family Banquet Dinner (18% surplus)',
    rate: 0.18,
    badge: '18% Buffer',
    hint: 'Standard celebratory feast'
  },
];

// 3. Relief Distribution Zones
const shelterDistricts = [
  {
    id: 'all',
    label: 'Citywide Rapid Response Fleet (All Mumbai)',
    factor: 'Citywide Relief to 12 Shelters',
    badge: 'Citywide'
  },
  {
    id: 'west',
    label: 'Western Suburbs (Sneha Sadan, Andheri & Bandra)',
    factor: 'Direct to 4 Orphanages & Street Children',
    badge: 'Western'
  },
  {
    id: 'south',
    label: 'South Mumbai (Dockside Relatives & Asha Sadan)',
    factor: 'Direct to 3 Destitute Care Homes',
    badge: 'Town'
  },
  {
    id: 'central',
    label: 'Central Mumbai (Shivaji Park & Station Sleepers)',
    factor: 'Direct to Railway Night Sleeper Food Drive',
    badge: 'Central'
  },
  {
    id: 'east',
    label: 'Eastern Suburbs (Powai & Ghatkopar Slum Relinquish)',
    factor: 'Direct to 5 Community Slum Kitchens',
    badge: 'Eastern'
  },
];

export default function ImpactCalculator() {
  const [occasion, setOccasion] = useState('wedding');
  const [selectedBuffetId, setSelectedBuffetId] = useState('multi-course');
  const [selectedDistrictId, setSelectedDistrictId] = useState('all');
  const [guests, setGuests] = useState(400);

  const currentBuffet = buffetStyles.find((b) => b.id === selectedBuffetId) || buffetStyles[0];
  const currentDistrict = shelterDistricts.find((d) => d.id === selectedDistrictId) || shelterDistricts[0];

  // Mathematical impact estimates
  const estimatedSurplusPlates = Math.round(guests * currentBuffet.rate);
  const estimatedKg = Math.round(estimatedSurplusPlates * 0.45); // ~450g per full meal
  const co2Avoided = Math.round(estimatedKg * 2.5); // kg CO2e
  const monetaryValue = Math.round(estimatedSurplusPlates * 280); // ₹280 average plate cost
  const shelterDaysFed = (estimatedSurplusPlates / 45).toFixed(1); // average shelter has ~45 kids

  const presets = [
    { label: 'Intimate Banquet (100 guests)', guests: 100, buffet: 'family' },
    { label: 'Medium Reception (250 guests)', guests: 250, buffet: 'cocktail' },
    { label: 'Classic Indian Wedding (500 guests)', guests: 500, buffet: 'multi-course' },
    { label: 'Mega Royal Wedding (1,000+ guests)', guests: 1000, buffet: 'thali' },
  ];

  return (
    <section id="calculator" className="scroll-mt-24 py-20 lg:py-28">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-bold tracking-wider text-moss uppercase shadow-2xs">
            <Calculator size={14} /> Interactive Celebration Food Waste & Hunger Estimator
          </div>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Planning a wedding or celebration?<br />
            <span className="text-moss">See how many hungry lives you can feed.</span>
          </h2>
          <p className="mt-4 text-base text-ink/65 sm:text-lg">
            Choose your celebration type, food service style, and expected guest count to see the precise volume of surplus food and your relief impact on local orphanages.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[36px] border border-ink/10 bg-white shadow-soft lg:grid lg:grid-cols-[1.15fr_0.85fr]">
          {/* Interactive controls */}
          <div className="p-8 sm:p-12 lg:p-14">
            {/* 1. Event Occasion Selection (Direct Pills - No Dropdown) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-2.5">
                1. Celebration Occasion
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {occasionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOccasion(opt.value)}
                    className={`flex flex-col items-start p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                      occasion === opt.value
                        ? 'border-moss bg-sage/35 text-moss font-bold shadow-2xs ring-1 ring-moss/30'
                        : 'border-ink/10 bg-white text-ink/80 hover:border-moss/40 hover:bg-cream/40'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight">{opt.label}</span>
                    <span className="text-[10px] text-ink/50 mt-1">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Food Service Style Selection (Direct Pills - No Dropdown) */}
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-2.5">
                2. Food Service Style & Buffer Rate
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {buffetStyles.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBuffetId(b.id)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                      selectedBuffetId === b.id
                        ? 'border-moss bg-sage/35 text-moss font-bold shadow-2xs ring-1 ring-moss/30'
                        : 'border-ink/10 bg-white text-ink/80 hover:border-moss/40 hover:bg-cream/40'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-xs font-bold block truncate">{b.label.split('(')[0].trim()}</span>
                      <span className="text-[10px] text-ink/50 block">{b.hint}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      selectedBuffetId === b.id ? 'bg-moss text-white' : 'bg-ink/5 text-ink/60'
                    }`}>
                      {b.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Distribution Zone Selection (Direct Pills - No Dropdown) */}
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-2.5">
                3. Distribution Relief Corridor
              </label>
              <div className="flex flex-wrap gap-2">
                {shelterDistricts.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDistrictId(d.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      selectedDistrictId === d.id
                        ? 'border-moss bg-moss text-white font-bold shadow-2xs'
                        : 'border-ink/10 bg-white text-ink/70 hover:border-moss/40 hover:bg-cream/40'
                    }`}
                  >
                    {d.badge}: {d.label.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider: Guest Count */}
            <div className="mt-8 rounded-2xl border border-ink/10 bg-cream/30 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/50">
                  Total Expected Guests
                </span>
                <span className="rounded-full bg-sage px-4 py-1.5 font-display text-base font-extrabold text-moss shadow-2xs">
                  {guests} Guests
                </span>
              </div>

              <div className="mt-4">
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-cream accent-moss focus:outline-hidden"
                  aria-label="Expected number of guests at the celebration"
                />
                <div className="mt-2 flex justify-between text-xs font-semibold text-ink/40">
                  <span>50 guests</span>
                  <span>400 guests</span>
                  <span>800 guests</span>
                  <span>1,500+ guests</span>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                Or pick a quick celebration preset:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setGuests(preset.guests);
                      setSelectedBuffetId(preset.buffet);
                    }}
                    className={`rounded-2xl border px-3.5 py-1.5 text-xs font-bold transition duration-200 cursor-pointer ${
                      guests === preset.guests && selectedBuffetId === preset.buffet
                        ? 'border-moss bg-moss text-white shadow-xs'
                        : 'border-ink/10 bg-cream/60 text-ink/75 hover:bg-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature & Hygiene Guarantee Note */}
            <div className="mt-6 rounded-2xl border border-moss/20 bg-sage/30 p-4 text-xs leading-relaxed text-ink/75">
              <p className="flex items-center gap-1.5 font-bold text-moss">
                <Sparkles size={14} /> Certified Food Quality Protocol:
              </p>
              <p className="mt-1">
                Volunteer vans carry digital infrared laser thermometers and sterile food-grade thermal containers. Hot curries and rice are maintained above 65°C throughout transit.
              </p>
            </div>
          </div>

          {/* Dynamic Results Card */}
          <div className="flex flex-col justify-between border-t border-ink/10 bg-ink p-8 text-white sm:p-12 lg:border-t-0 lg:border-l">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-white/40 uppercase">
                  Projected Relief Potential
                </span>
                <span className="rounded-full bg-moss/40 px-3 py-1 text-[10px] font-bold text-sage">
                  Live Dynamic Output
                </span>
              </div>

              {/* Main Stat: People Fed */}
              <div className="mt-6 rounded-2xl bg-white/10 p-5 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-sage">
                  <Users size={16} /> Needy People Nourished
                </div>
                <div className="mt-1 font-display text-4xl font-black text-white sm:text-5xl">
                  {estimatedSurplusPlates} Warm Meals
                </div>
                <p className="mt-2 text-xs text-white/60">
                  Target Destination: <strong className="text-white">{currentDistrict.factor}</strong>
                </p>
              </div>

              {/* Secondary Stats Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Food Rescued
                  </span>
                  <div className="mt-1 font-display text-2xl font-black text-white">
                    ~{estimatedKg} kg
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/50">High-grade edible feast</p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    CO₂ Prevented
                  </span>
                  <div className="mt-1 font-display text-2xl font-black text-white">
                    {co2Avoided} kg
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/50">Landfill emissions averted</p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Rescued Food Value
                  </span>
                  <div className="mt-1 font-display text-2xl font-black text-citrus">
                    ₹{monetaryValue.toLocaleString('en-IN')}
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/50">Commercial value saved</p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Equivalent Support
                  </span>
                  <div className="mt-1 font-display text-2xl font-black text-white">
                    {shelterDaysFed} Days
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/50">Full shelter fed</p>
                </div>
              </div>

              {/* Equivalence highlight */}
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/80">
                <Award size={18} className="text-sage shrink-0" />
                <span>
                  <strong>Nourishes an entire shelter of 45 children for {shelterDaysFed} full days with dignified banquet meals!</strong>
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href="#donate-form"
                className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-ink transition duration-200 hover:bg-sage hover:text-moss cursor-pointer"
              >
                Schedule Pickup for My Celebration <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
