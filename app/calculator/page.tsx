'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import {
  Calculator,
  Users,
  Utensils,
  Sparkles,
  Award,
  Leaf,
  Info,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

export default function CalculatorPage() {
  const [eventType, setEventType] = useState('Wedding Reception');
  const [guestCount, setGuestCount] = useState(350);
  const [cateringStyle, setCateringStyle] = useState('Multi-Cuisine Buffet');
  const [surplusRate, setSurplusRate] = useState(18); // percentage

  // Calculations
  // Standard banquet catering serves approximately 450 grams of food per guest.
  // Over-preparation rate ranges between 10% to 30% depending on catering style.
  const calculations = useMemo(() => {
    const foodPerGuestKg = 0.45; // 450g per guest
    const totalFoodPreparedKg = guestCount * foodPerGuestKg;
    const surplusKg = totalFoodPreparedKg * (surplusRate / 100);

    // Each dignified rescued meal plate is estimated at 350 grams (0.35 kg)
    const mealsRescued = Math.round(surplusKg / 0.35);

    // Environmental impact: 1 kg of avoided food landfill waste saves ~1.38 kg CO2 equivalent
    const co2AvoidedKg = Math.round(surplusKg * 1.38);

    // Financial food value (average banquet portion valued at ₹180 per plate)
    const financialValue = Math.round(mealsRescued * 180);

    // Standard 15-liter stainless thermal containers needed (~12 kg per container)
    const containersRequired = Math.ceil(surplusKg / 12);

    return {
      totalPreparedKg: Math.round(totalFoodPreparedKg),
      surplusKg: Math.round(surplusKg),
      mealsRescued,
      co2AvoidedKg,
      financialValue,
      containersRequired,
    };
  }, [guestCount, surplusRate]);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar />

      <SubpageHeader
        breadcrumbs={[{ label: 'Event Calculator' }]}
        eyebrow="Banquet Over-Catering Estimator"
        title="Event Food Surplus & Impact Calculator"
        badge="Science-Backed Model"
        description="Calculate estimated surplus meals from your upcoming wedding, sangeet, or corporate banquet. Learn how many people can be fed and the carbon emissions avoided."
      />

      <div className="section-shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Input Configuration (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
              <Calculator size={20} className="text-moss" /> Configure Event Parameters
            </h2>

            {/* Event Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/60">
                Type of Celebration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Wedding Reception',
                  'Sangeet / Mehendi',
                  'Corporate Summit',
                  'Milestone Birthday',
                  'Anniversary Banquet',
                  'Community Feast',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEventType(type)}
                    className={`rounded-2xl p-2.5 text-xs font-bold transition text-left cursor-pointer border ${
                      eventType === type
                        ? 'border-moss bg-sage/20 text-moss'
                        : 'border-ink/10 bg-cream/40 text-ink/70 hover:bg-cream'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-ink/60">
                  Guest Headcount
                </label>
                <span className="font-display text-xl font-black text-moss">
                  {guestCount.toLocaleString('en-IN')} Guests
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-moss h-2 bg-cream rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-ink/40 font-bold">
                <span>50 Guests</span>
                <span>500 Guests</span>
                <span>1,000 Guests</span>
                <span>2,000 Guests</span>
              </div>
            </div>

            {/* Catering Service Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/60">
                Buffet & Catering Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { style: 'Multi-Cuisine Buffet', defaultRate: 20, desc: 'Highest overage (18–25%) due to variety requirements' },
                  { style: 'Traditional Thali / Pangat', defaultRate: 15, desc: 'Moderate overage (12–16%) with controlled batches' },
                  { style: 'Plated Sit-Down Dinner', defaultRate: 12, desc: 'Lowest overage (10–14%) with fixed portions' },
                  { style: 'High-Tea & Heavy Snacks', defaultRate: 16, desc: 'Finger foods & dessert overages (14–18%)' },
                ].map((item) => (
                  <button
                    key={item.style}
                    type="button"
                    onClick={() => {
                      setCateringStyle(item.style);
                      setSurplusRate(item.defaultRate);
                    }}
                    className={`rounded-2xl p-3 text-left transition cursor-pointer border ${
                      cateringStyle === item.style
                        ? 'border-moss bg-sage/20 shadow-2xs'
                        : 'border-ink/10 bg-cream/40 hover:bg-cream'
                    }`}
                  >
                    <span className="text-xs font-bold block text-ink">{item.style}</span>
                    <span className="text-[11px] text-ink/60 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Buffer Rate Slider */}
            <div className="space-y-2 pt-2 border-t border-ink/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-ink/60">
                  Estimated Food Buffer / Overage
                </label>
                <span className="font-bold text-xs text-moss">{surplusRate}% Buffer</span>
              </div>
              <input
                type="range"
                min="8"
                max="30"
                step="1"
                value={surplusRate}
                onChange={(e) => setSurplusRate(Number(e.target.value))}
                className="w-full accent-moss h-2 bg-cream rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-ink/50">
                Standard Indian banquet hospitality guidelines recommend a 15% to 20% overage to avoid any dishes running out before the final guest arrives.
              </p>
            </div>
          </div>

          {/* Results Output (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                  Potential Relief Output
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black text-moss">
                    {calculations.mealsRescued}
                  </span>
                  <span className="text-base font-bold text-ink/60">Meals Rescued</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">
                  From an estimated {calculations.surplusKg} kg of untouched buffet food.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-cream/60 p-3.5 border border-ink/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink/40 block">CO₂ Emissions Averted</span>
                  <span className="font-display text-lg font-black text-ink">{calculations.co2AvoidedKg} kg</span>
                  <span className="text-[10px] text-moss block">Landfill diversion</span>
                </div>

                <div className="rounded-2xl bg-cream/60 p-3.5 border border-ink/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink/40 block">Nutritional Value Saved</span>
                  <span className="font-display text-lg font-black text-ink">₹{calculations.financialValue.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-moss block">Wholesome food</span>
                </div>

                <div className="rounded-2xl bg-cream/60 p-3.5 border border-ink/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink/40 block">Van Thermal Pots</span>
                  <span className="font-display text-lg font-black text-ink">{calculations.containersRequired} Pots</span>
                  <span className="text-[10px] text-ink/50 block">Stainless canisters</span>
                </div>

                <div className="rounded-2xl bg-cream/60 p-3.5 border border-ink/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink/40 block">Shelters Nourished</span>
                  <span className="font-display text-lg font-black text-ink">
                    {Math.max(1, Math.round(calculations.mealsRescued / 80))} Centers
                  </span>
                  <span className="text-[10px] text-tomato block">Orphanages / Night Homes</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/schedule-pickup?servings=${calculations.mealsRescued}&type=${encodeURIComponent(eventType)}`}
                className="primary-button w-full justify-center py-3.5 text-xs uppercase tracking-wider shadow-md"
              >
                <Sparkles size={16} /> Schedule Pickup For This Event
              </Link>

              {/* Explicit Assumptions Documentation */}
              <div className="rounded-2xl bg-cream/30 p-3.5 border border-ink/5 space-y-1.5 text-[11px] text-ink/60">
                <span className="font-bold text-moss flex items-center gap-1">
                  <Info size={12} /> Calculation Assumptions & Model
                </span>
                <p>
                  • Average wedding buffet prepared at 450 grams per guest headcount.
                </p>
                <p>
                  • 1 rescued meal corresponds to 350 grams of balanced cooked food (dal, sabzi, roti, rice).
                </p>
                <p>
                  • 1.38 kg CO₂ equivalent avoided per kg of food diverted from municipal landfill methane decomposition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
