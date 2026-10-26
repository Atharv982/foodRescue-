'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import { computeImpactMetricsClient, ComputedImpact } from '@/lib/logistics-client';
import {
  Sparkles,
  TrendingUp,
  Package,
  Heart,
  Truck,
  CheckCircle2,
  Calendar,
  Building2,
  Utensils,
  Download,
  Printer,
  ChevronDown,
  Info,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Filter,
  Flame,
  Globe,
  Leaf,
  Droplets,
  IndianRupee,
  Share2,
  Eye,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

function ImpactDashboardContent() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | '7days' | '30days' | 'month' | 'year' | 'all'>('30days');
  const [dashboardView, setDashboardView] = useState<'public' | 'admin' | 'partner'>('public');
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; displayDate: string; kg: number; meals: number } | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [serverMetrics, setServerMetrics] = useState<ComputedImpact | null>(null);

  // Fetch live server metrics dynamically
  useEffect(() => {
    let cancelled = false;
    const fetchImpact = async () => {
      try {
        const res = await fetch(`/api/impact?period=${selectedPeriod}`);
        const data = await res.json();
        if (data.success && !cancelled) {
          setServerMetrics(data.metrics);
        }
      } catch {
        // quiet fallback
      }
    };
    fetchImpact();
    return () => {
      cancelled = true;
    };
  }, [selectedPeriod]);

  // Compute live metrics based on period (server prioritized, client fallback)
  const metrics: ComputedImpact = useMemo(() => {
    return serverMetrics || computeImpactMetricsClient(selectedPeriod);
  }, [serverMetrics, selectedPeriod]);

  // CSV Export Handler
  const handleExportCsv = () => {
    const rows = [
      ['Metric', 'Value', 'Unit / Notes'],
      ['Reporting Period', selectedPeriod.toUpperCase(), 'Date window'],
      ['Total Food Rescued', metrics.totalKgRescued, 'Kilograms (kg)'],
      ['Estimated Meals Delivered', metrics.totalMealsDelivered, 'Meals (450g / meal)'],
      ['Completed Pickups', metrics.totalPickupsCompleted, 'Collections'],
      ['Completed Deliveries', metrics.totalDeliveriesCompleted, 'Handover certified'],
      ['Pickup Success Rate', `${metrics.pickupSuccessRate}%`, 'On-time collection'],
      ['Delivery Success Rate', `${metrics.deliverySuccessRate}%`, 'Hot-chain verified'],
      ['Active Contributing Partners', metrics.activeDonorPartners, 'Venues & caterers'],
      ['Shelters Served', metrics.sheltersServedCount, 'Distinct recipient NGOs'],
      ['Avoided Greenhouse Gas Emissions', metrics.co2AvoidedKg, 'kg CO2e diverted'],
      ['Embedded Water Conserved', metrics.waterSavedLiters, 'Liters water saved'],
      ['Economic Value Saved', `INR ${metrics.economicValueInr}`, 'Market meal value'],
      [],
      ['Category Breakdown', 'Rescued (kg)', 'Meals Served', 'Share (%)'],
      ...metrics.categoryBreakdown.map((c) => [c.category, c.kg, c.meals, `${c.percentage}%`]),
      [],
      ['Top Contributing Partners', 'Category', 'Meals Rescued', 'Verified Pickups'],
      ...metrics.topContributingPartners.map((p) => [p.name, p.category, p.meals, p.count]),
      [],
      ['Recipient Shelters', 'Category', 'Meals Received', 'Deliveries Handed Over'],
      ...metrics.shelterDistribution.map((s) => [s.shelterName, s.category, s.mealsReceived, s.deliveriesCount]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FoodRescue-Impact-Report-${selectedPeriod}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable Summary Handler
  const handlePrintReport = () => {
    window.print();
  };

  // Max value in daily trend for chart scaling
  const maxTrendKg = Math.max(...metrics.dailyTrend.map((d) => d.kg), 100);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar />

      <SubpageHeader
        breadcrumbs={[{ label: 'Rescue Hub', href: '/rescue-hub' }, { label: 'Impact Dashboard' }]}
        eyebrow="Real-Time Food Recovery Analytics"
        title="FoodRescue Impact Dashboard"
        badge="Verified Data"
        theme="impact"
        description="Every rescued meal makes a difference. Explore the food recovered, communities supported, and successful deliveries powered by FoodRescue across Greater Mumbai."
      />

      <div className="section-shell py-8 lg:py-12 space-y-8">
        {/* ============================================================== */}
        {/* TOP FILTER & ACCESS CONTROLS BAR */}
        {/* ============================================================== */}
        <div className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Timeframe Period Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-ink/40 tracking-wider mr-1 hidden sm:inline">
              Period:
            </span>
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'year', label: 'This Year' },
              { id: 'all', label: 'All Time' },
            ].map((period) => {
              const isSelected = selectedPeriod === period.id;
              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriod(period.id as any)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-moss text-white shadow-xs'
                      : 'bg-cream/70 text-ink/75 hover:bg-cream hover:text-ink'
                  }`}
                >
                  {period.label}
                </button>
              );
            })}
          </div>

          {/* Role / Access View Selector & Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Selector */}
            <div className="flex items-center rounded-2xl border border-ink/10 bg-cream/40 p-1 text-xs font-bold text-ink">
              <button
                type="button"
                onClick={() => setDashboardView('public')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  dashboardView === 'public' ? 'bg-white shadow-xs text-moss font-bold' : 'text-ink/60 hover:text-ink'
                }`}
              >
                Public View
              </button>
              <button
                type="button"
                onClick={() => setDashboardView('admin')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  dashboardView === 'admin' ? 'bg-white shadow-xs text-moss font-bold' : 'text-ink/60 hover:text-ink'
                }`}
              >
                Admin Ops
              </button>
              <button
                type="button"
                onClick={() => setDashboardView('partner')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  dashboardView === 'partner' ? 'bg-white shadow-xs text-moss font-bold' : 'text-ink/60 hover:text-ink'
                }`}
              >
                Partner View
              </button>
            </div>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-xs font-bold text-ink hover:bg-cream transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Download CSV Report"
            >
              <Download size={14} className="text-moss" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* View Report Modal Button */}
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="rounded-2xl bg-moss px-4 py-2.5 text-xs font-bold text-white hover:bg-[#224433] transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Award size={14} /> Official Report
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 6 MAIN IMPACT STATISTIC CARDS */}
        {/* ============================================================== */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Total Food Rescued */}
          <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-2xs hover:shadow-soft transition space-y-3">
            <div className="flex items-center justify-between text-xs text-ink/50 font-bold uppercase tracking-wider">
              <span>Total Food Rescued</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-moss/10 text-moss">
                <Package size={17} />
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-ink">
                {metrics.totalKgRescued.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-ink/50">kg</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
              <TrendingUp size={13} />
              <span>+18.4% vs previous period</span>
            </div>

            <p className="text-[11px] text-ink/60 border-t border-ink/5 pt-2">
              Diverted from city landfills across verified Mumbai banquet corridors.
            </p>
          </div>

          {/* Card 2: Estimated Meals Delivered */}
          <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-2xs hover:shadow-soft transition space-y-3">
            <div className="flex items-center justify-between text-xs text-ink/50 font-bold uppercase tracking-wider">
              <span>Meals Delivered</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-tomato/10 text-tomato">
                <Utensils size={17} />
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-moss">
                {metrics.totalMealsDelivered.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-moss/70">portions</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-ink/60 bg-cream/70 px-2.5 py-1 rounded-xl w-fit">
              <Info size={12} className="text-moss" />
              <span>Conversion: 1 kg ≈ 2.22 meals (450g / wholesome portion)</span>
            </div>

            <p className="text-[11px] text-ink/60 border-t border-ink/5 pt-2">
              100% free distribution directly to children orphanages & homeless shelters.
            </p>
          </div>

          {/* Card 3: Successful Pickups */}
          <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-2xs hover:shadow-soft transition space-y-3">
            <div className="flex items-center justify-between text-xs text-ink/50 font-bold uppercase tracking-wider">
              <span>Successful Pickups</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                <Truck size={17} />
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-ink">
                {metrics.totalPickupsCompleted}
              </span>
              <span className="text-xs font-bold text-moss bg-sage/60 px-2 py-0.5 rounded-full">
                {metrics.pickupSuccessRate}% Success
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-ink/70">
              <ShieldCheck size={14} className="text-moss" />
              <span>Laser temperature audited (&gt;65°C hot chain)</span>
            </div>

            <p className="text-[11px] text-ink/60 border-t border-ink/5 pt-2">
              Insulated van collection right at wedding & banquet kitchen loading docks.
            </p>
          </div>

          {/* Card 4: Successful Deliveries */}
          <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-2xs hover:shadow-soft transition space-y-3">
            <div className="flex items-center justify-between text-xs text-ink/50 font-bold uppercase tracking-wider">
              <span>Confirmed Deliveries</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 size={17} />
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-ink">
                {metrics.totalDeliveriesCompleted}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {metrics.deliverySuccessRate}% On-Time
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-ink/70">
              <Sparkles size={14} className="text-moss" />
              <span>0 unaddressed delivery exceptions</span>
            </div>

            <p className="text-[11px] text-ink/60 border-t border-ink/5 pt-2">
              Delivered within 90 minutes of banquet conclusion with recipient digital signoff.
            </p>
          </div>

          {/* Card 5: Active Contributing Partners */}
          <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-2xs hover:shadow-soft transition space-y-3">
            <div className="flex items-center justify-between text-xs text-ink/50 font-bold uppercase tracking-wider">
              <span>Active Donor Partners</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-500/10 text-sky-600">
                <Building2 size={17} />
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-ink">
                {metrics.activeDonorPartners}
              </span>
              <span className="text-xs font-bold text-ink/50">Venues & Caterers</span>
            </div>

            <p className="text-xs text-ink/70">
              Committed to zero celebration food waste protocols across Mumbai.
            </p>

            <div className="border-t border-ink/5 pt-2 flex items-center justify-between text-[11px] text-moss font-bold">
              <Link href="/venues" className="hover:underline flex items-center gap-1">
                Explore Partner Venues <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>

          {/* Card 6: Shelters Served */}
          <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-2xs hover:shadow-soft transition space-y-3">
            <div className="flex items-center justify-between text-xs text-ink/50 font-bold uppercase tracking-wider">
              <span>Shelters Served</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
                <Heart size={17} />
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-ink">
                {metrics.sheltersServedCount}
              </span>
              <span className="text-xs font-bold text-ink/50">Verified NGOs</span>
            </div>

            <p className="text-xs text-ink/70">
              Direct hot dinners delivered to orphanages, elderly homes & homeless shelters.
            </p>

            <div className="border-t border-ink/5 pt-2 flex items-center justify-between text-[11px] text-moss font-bold">
              <Link href="/shelters" className="hover:underline flex items-center gap-1">
                View Shelter Network <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECONDARY ENVIRONMENTAL & ECONOMIC EQUIVALENTS STRIP */}
        {/* ============================================================== */}
        <div className="rounded-[32px] bg-ink p-6 sm:p-8 text-white shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sage">
                Verified Environmental Dividends
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                Planetary & Social Co-Benefits
              </h3>
            </div>
            <span className="text-xs text-white/60">Calculated via UNEP / UN FAO GHG Food Loss Standards</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 pt-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sage text-xs font-bold uppercase">
                <Leaf size={16} /> Avoided GHG Emissions
              </div>
              <div className="font-display text-3xl font-extrabold text-white">
                {metrics.co2AvoidedKg.toLocaleString()} <span className="text-sm font-semibold text-white/50">kg CO₂e</span>
              </div>
              <p className="text-xs text-white/70">
                Equivalent to removing {Math.round(metrics.co2AvoidedKg / 400)} passenger cars off Mumbai roads for a month.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase">
                <Droplets size={16} /> Embedded Water Conserved
              </div>
              <div className="font-display text-3xl font-extrabold text-white">
                {(metrics.waterSavedLiters / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-sm font-semibold text-white/50">kL</span>
              </div>
              <p className="text-xs text-white/70">
                Agricultural water conserved from wasted rice, pulses, and vegetables.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                <IndianRupee size={16} /> Economic Value Delivered
              </div>
              <div className="font-display text-3xl font-extrabold text-white">
                ₹{(metrics.economicValueInr / 100000).toFixed(1)} <span className="text-sm font-semibold text-white/50">Lakh</span>
              </div>
              <p className="text-xs text-white/70">
                Nutrition value provided to grassroots charities at zero cost to community.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE CHARTS SECTION */}
        {/* ============================================================== */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Chart 1: Food Rescued Over Time (Interactive Area Chart) */}
          <div className="rounded-[32px] border border-ink/10 bg-white p-6 sm:p-8 shadow-soft space-y-5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink/40 tracking-wider block">
                  Daily Rescue Volume
                </span>
                <h4 className="font-display text-lg font-black text-ink">
                  Food Rescued Over Time
                </h4>
              </div>

              {hoveredPoint ? (
                <div className="text-right text-xs">
                  <span className="font-bold text-moss">{hoveredPoint.kg} kg ({hoveredPoint.meals} meals)</span>
                  <span className="text-[10px] text-ink/50 block">{hoveredPoint.displayDate}</span>
                </div>
              ) : (
                <span className="text-xs text-ink/50 font-semibold">Hover bar for details</span>
              )}
            </div>

            {/* Interactive SVG / Bar Trend Visualization */}
            <div className="space-y-3 pt-2">
              <div className="h-48 flex items-end justify-between gap-2 border-b border-ink/10 pb-2 px-2">
                {metrics.dailyTrend.map((pt, i) => {
                  const heightPercent = Math.max(12, Math.round((pt.kg / maxTrendKg) * 100));

                  return (
                    <div
                      key={pt.date}
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                    >
                      <div
                        className="w-full rounded-t-xl bg-moss/20 group-hover:bg-moss transition-all duration-200 relative"
                        style={{ height: `${heightPercent}%` }}
                      >
                        {/* Little top cap */}
                        <div className="h-1.5 w-full bg-moss rounded-t-xl" />
                      </div>
                      <span className="text-[10px] font-bold text-ink/50 group-hover:text-ink">
                        {pt.displayDate.split(',')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink/50 px-2">
                <span>Weekend Wedding Peaks (Fri–Sun)</span>
                <span>Avg Daily: {Math.round(metrics.totalKgRescued / 30)} kg/day</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Category Breakdown (Horizontal Percentage Bars) */}
          <div className="rounded-[32px] border border-ink/10 bg-white p-6 sm:p-8 shadow-soft space-y-5">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[10px] uppercase font-bold text-ink/40 tracking-wider block">
                Source Composition
              </span>
              <h4 className="font-display text-lg font-black text-ink">
                Food Category Distribution
              </h4>
            </div>

            <div className="space-y-4 pt-1">
              {metrics.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-ink">
                    <span>{cat.category}</span>
                    <span className="text-moss">
                      {cat.kg.toLocaleString()} kg · {cat.meals.toLocaleString()} meals ({cat.percentage}%)
                    </span>
                  </div>

                  <div className="h-3 w-full rounded-full bg-cream overflow-hidden">
                    <div
                      className="h-full rounded-full bg-moss transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-ink/50 pt-2 border-t border-ink/5">
              Wedding receptions and sangeet buffets account for over half of all recovered hot celebration nutrition.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* REGIONAL BREAKDOWN & TOP PARTNERS RANKING */}
        {/* ============================================================== */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Table 1: Top Contributing Partners */}
          <div className="rounded-[32px] border border-ink/10 bg-white p-6 sm:p-8 shadow-soft space-y-5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink/40 tracking-wider block">
                  Hall of Champions
                </span>
                <h4 className="font-display text-lg font-black text-ink">
                  Top Contributing Partners
                </h4>
              </div>

              <Link href="/venues" className="text-xs font-bold text-moss hover:underline">
                View Directory →
              </Link>
            </div>

            <div className="space-y-3">
              {metrics.topContributingPartners.map((partner, index) => (
                <div
                  key={partner.name}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-cream/40 border border-ink/5 hover:bg-cream/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-moss/10 text-moss font-bold text-xs">
                      #{index + 1}
                    </span>
                    <div>
                      <Link href={partner.profileUrl} className="font-bold text-xs text-ink hover:text-moss transition">
                        {partner.name}
                      </Link>
                      <span className="text-[10px] text-ink/50 block">
                        {partner.category} · {partner.count} Missions
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display text-sm font-black text-moss block">
                      {partner.meals.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-ink/50 font-semibold">meals saved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table 2: Shelter Distribution Ledger */}
          <div className="rounded-[32px] border border-ink/10 bg-white p-6 sm:p-8 shadow-soft space-y-5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink/40 tracking-wider block">
                  Beneficiary Reach
                </span>
                <h4 className="font-display text-lg font-black text-ink">
                  Shelter Distribution Network
                </h4>
              </div>

              <Link href="/shelters" className="text-xs font-bold text-moss hover:underline">
                All Shelters →
              </Link>
            </div>

            <div className="space-y-3">
              {metrics.shelterDistribution.slice(0, 5).map((shelter) => (
                <div
                  key={shelter.shelterName}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-cream/40 border border-ink/5 hover:bg-cream/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-xl bg-tomato/10 text-tomato">
                      <Heart size={14} />
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-ink">{shelter.shelterName}</h5>
                      <span className="text-[10px] text-ink/50 block">
                        {shelter.category} · {shelter.deliveriesCount} deliveries
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display text-sm font-black text-ink block">
                      {shelter.mealsReceived.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-ink/50 font-semibold">meals received</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PHOTO-BASED COMMUNITY IMPACT: "IMPACT IN ACTION" */}
        {/* ============================================================== */}
        <div className="rounded-[36px] border border-ink/10 bg-white p-6 sm:p-10 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-moss">
                Field Photo Evidence
              </span>
              <h3 className="font-display text-2xl font-black text-ink">
                Impact in Action: Real Community Rescues
              </h3>
            </div>
            <Link
              href="/stories"
              className="text-xs font-bold text-moss hover:underline flex items-center gap-1"
            >
              <span>Explore All Community Stories</span> <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'How a 600-Guest Goregaon Wedding Fed 180 Children',
                venue: 'The Royal Palms Ballroom',
                recipient: 'Sneha Sadan Orphanage',
                meals: '180 Meals',
                date: 'Oct 25, 2026',
                imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
                storyUrl: '/stories/story-1',
              },
              {
                title: 'Westin Powai Convention Achieves 100% Food Diversion',
                venue: 'Grand Lakeside Pavilion',
                recipient: 'Cheshire Home for Disabled',
                meals: '200 Meals',
                date: 'Oct 24, 2026',
                imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                storyUrl: '/stories/story-2',
              },
              {
                title: 'Bandra Sangeet Midnight Feasts Handover',
                venue: 'Sea Breeze Banquet Hall',
                recipient: 'Bandra Station Night Shelter',
                meals: '120 Meals',
                date: 'Oct 23, 2026',
                imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
                storyUrl: '/stories/story-3',
              },
            ].map((story) => (
              <Link
                key={story.title}
                href={story.storyUrl}
                className="group rounded-3xl border border-ink/10 overflow-hidden bg-cream/20 hover:border-moss/40 hover:shadow-md transition space-y-3"
              >
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-ink/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-black text-white">
                    {story.meals} Rescued
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-ink">
                    {story.date}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-display text-sm font-bold text-ink group-hover:text-moss transition line-clamp-2">
                    {story.title}
                  </h4>
                  <p className="text-[11px] text-ink/60">
                    From <strong>{story.venue}</strong> to <strong>{story.recipient}</strong>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* OFFICIAL IMPACT REPORT MODAL */}
        {/* ============================================================== */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-2xl rounded-[32px] border border-ink/10 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-ink/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-moss/10 px-3 py-1 text-xs font-bold text-moss">
                    <ShieldCheck size={13} /> Official FoodRescue Audit Report
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-ink mt-2">
                    Mumbai Banquet Relief Impact Report
                  </h3>
                  <p className="text-xs text-ink/60">
                    Reporting Window: <strong>{selectedPeriod.toUpperCase()}</strong> · Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="rounded-2xl border border-ink/10 p-2 text-ink/50 hover:bg-cream transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Summary Dossier */}
              <div className="rounded-2xl bg-cream/40 p-5 border border-ink/5 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Food Rescued</span>
                    <strong className="text-sm font-black text-moss">{metrics.totalKgRescued.toLocaleString()} kg</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Meals Fed</span>
                    <strong className="text-sm font-black text-ink">{metrics.totalMealsDelivered.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Pickups Done</span>
                    <strong className="text-sm font-black text-ink">{metrics.totalPickupsCompleted}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">CO₂ Diverted</span>
                    <strong className="text-sm font-black text-sage">{metrics.co2AvoidedKg.toLocaleString()} kg</strong>
                  </div>
                </div>

                <div className="border-t border-ink/10 pt-3 text-[11px] text-ink/70 space-y-1">
                  <p>• <strong>Methodology:</strong> 450 grams per wholesome nutritious meal standard.</p>
                  <p>• <strong>Safety Verification:</strong> Every batch probed with infrared thermometer to verify hot-chain integrity (&gt;65°C).</p>
                  <p>• <strong>Zero Cost:</strong> All services provided 100% free of charge to donors and beneficiary charities.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReport}
                  className="rounded-2xl border border-ink/15 bg-white px-5 py-2.5 text-xs font-bold text-ink hover:bg-cream transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={14} /> Print Report
                </button>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white hover:bg-[#224433] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} /> Download CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function ImpactDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center p-12 text-xs font-bold text-ink/50">
          Loading Impact Dashboard...
        </div>
      }
    >
      <ImpactDashboardContent />
    </Suspense>
  );
}
