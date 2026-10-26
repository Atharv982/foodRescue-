'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronDown,
  Check,
  PhoneCall,
  Compass,
  Building2,
  HelpCircle,
  Calculator,
  MessageSquare,
  ShieldAlert,
  Clock3,
  Truck,
  Utensils,
  ShieldCheck,
  Users,
  Award,
  Navigation,
  FileText,
  Calendar,
  Flame,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Info,
  ExternalLink,
  MessageCircle,
  Radio,
  Share2,
  Bell
} from 'lucide-react';

interface NavbarProps {
  selectedZone?: string;
  onSelectZone?: (zone: string) => void;
}

type DropdownId =
  | 'zone'
  | 'rescue-hub'
  | 'batches'
  | 'partners'
  | 'hotline'
  | 'schedule'
  | null;

export default function Navbar({ selectedZone = 'All Zones', onSelectZone }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global click outside and escape key listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Clean timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Hover handlers with debounce
  const handleMouseEnter = (id: DropdownId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleDropdown = (id: DropdownId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown((current) => (current === id ? null : id));
  };

  const closeAll = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(null);
    setMobileOpen(false);
  };

  // 1. Zones Data
  const zones = [
    { name: 'All Zones', hint: 'Greater Mumbai coverage', count: '10 Batches' },
    { name: 'Western Suburbs', hint: 'Bandra, Andheri, Goregaon, Juhu', count: '5 Batches' },
    { name: 'South Mumbai', hint: 'Colaba, Lower Parel, Byculla', count: '2 Batches' },
    { name: 'Central Mumbai', hint: 'Dadar, Shivaji Park, Kurla', count: '1 Batch' },
    { name: 'Eastern Suburbs', hint: 'Powai, Vikhroli, Ghatkopar', count: '2 Batches' },
  ];

  const handleZonePick = (zoneName: string) => {
    if (onSelectZone) onSelectZone(zoneName);
    closeAll();
    router.push(`/zones`);
  };

  // 2. Rescue Hub Items (Dedicated Operations Sections)
  const quickActionItems = [
    { label: 'Food Rescue Live Map', desc: 'Interactive Google Map with venues, batches, shelters & vans', href: '/live-map', icon: Radio, badge: 'Live Map' },
    { label: 'Pickup & Delivery Tracking', desc: 'Traceable donation journey from booking to shelter handover', href: '/pickups', icon: Truck, badge: 'Live Fleet' },
    { label: 'FoodRescue Impact Dashboard', desc: 'Verified food rescued, meals fed & CO₂ diverted analytics', href: '/impact-dashboard', icon: Award, badge: 'Impact' },
    { label: 'Operations Overview', desc: 'Live rescue metrics, active alerts & transit statuses', href: '/rescue-hub?tab=overview', icon: Compass, badge: 'Overview' },
    { label: 'Donation Management', desc: 'Surplus donation intakes, approvals & pickup assignments', href: '/rescue-hub?tab=donations', icon: FileText, badge: 'Intakes' },
    { label: 'Shelter Network Quotas', desc: 'Recipient orphanages, meal capacity & batch allocation', href: '/rescue-hub?tab=shelters', icon: Heart, badge: 'Shelters' },
  ];

  // 3. Dropdown Menu 1: Available Batches
  const batchesSubmenu = [
    { label: 'Browse Available Batches', desc: 'Explore all live celebration food ready for dispatch', href: '/batches', icon: Utensils, badge: '10 Ready' },
    { label: 'Food Rescue Live Map', desc: 'Locate batches and active rescue vans on map', href: '/live-map', icon: Radio, badge: 'Live Map' },
    { label: 'Pickup & Delivery Tracking', desc: 'Follow surplus batches en route to recipient shelters', href: '/pickups', icon: Truck, badge: 'Tracking' },
    { label: 'Recently Added Batches', desc: 'Fresh surplus collected from evening wedding banquets', href: '/batches?sort=newest', icon: Clock3, badge: 'Just In' },
    { label: 'High Servings Batches', desc: 'Banquet feasts with 50+ servings for large shelters', href: '/batches?sort=servings', icon: Flame, badge: 'Large Feasts' },
  ];

  // 4. Dropdown Menu 2: Event Calculator
  const calculatorSubmenu = [
    { label: 'Surplus Meal Estimator', desc: 'Interactive surplus meal estimator for weddings & banquets', href: '/calculator', icon: Calculator, badge: 'Live Tool' },
    { label: 'Calculate Servings Capacity', desc: 'Translate guest headcount into dignified meals fed', href: '/calculator', icon: Users },
    { label: 'Carbon & Waste Reduction', desc: 'Compute avoided CO₂ emissions and landfill diversion', href: '/calculator', icon: Award, badge: 'CO₂ & ₹' },
    { label: 'Buffet vs Plated Overages', desc: 'Compare multi-cuisine buffet vs thali overage rates', href: '/calculator', icon: Sparkles },
  ];

  // 5. Dropdown Menu 3: Venues & Shelters
  const venuesSubmenu = [
    { label: 'Food Rescue Live Map', desc: 'Explore venues, caterers, and shelters with live routes', href: '/live-map', icon: Radio, badge: 'Live Map' },
    { label: 'Wedding & Banquet Venues', desc: 'Premier wedding halls, lawns & hotels donating surplus', href: '/venues', icon: Building2, badge: '12 Venues' },
    { label: 'Wedding Caterers Directory', desc: 'Celebration caterers equipped with thermal food safety', href: '/caterers', icon: Utensils, badge: '8 Caterers' },
    { label: 'Recipient Shelter Homes', desc: 'Verified orphanages, night shelters & community kitchens', href: '/shelters', icon: Heart, badge: '6 Shelters' },
    { label: 'FoodRescue Impact Dashboard', desc: 'Explore verified kilograms, meals fed & partner contributions', href: '/impact-dashboard', icon: Award, badge: 'Impact' },
  ];

  // 6. Dropdown Menu 4: Stories
  const storiesSubmenu = [
    { label: 'All Community Stories', desc: 'Inspiring journeys from wedding buffets to orphanages', href: '/stories', icon: MessageSquare, badge: 'Verified' },
    { label: 'Wedding Feast Highlights', desc: 'How a 600-guest Goregaon wedding fed 180 children', href: '/stories/story-1', icon: Heart, badge: 'Spotlight' },
    { label: 'Zero Waste Summit Milestone', desc: 'How Westin Powai achieved 100% zero food waste', href: '/stories/story-2', icon: Award },
    { label: 'Chef & Caterer Pledges', desc: 'Head Chef Vikram’s zero-waste kitchen protocol', href: '/stories/story-3', icon: Users },
  ];

  // 7. Dropdown Menu 5: FAQs
  const faqSubmenu = [
    { label: 'Help Center & FAQ Search', desc: 'Instant search across all FoodRescue operational questions', href: '/faq', icon: HelpCircle },
    { label: 'Food Safety & Temperatures', desc: 'Infrared laser testing & 90-minute hot chain rules', href: '/faq', icon: ShieldCheck, badge: 'Protocol' },
    { label: 'Rapid Van Pickup Process', desc: 'How our insulated vehicles arrive within 30–45 mins', href: '/faq', icon: Truck },
    { label: 'Donor Eligibility Guidelines', desc: 'Surplus food criteria, minimum servings, and packaging', href: '/faq', icon: FileText },
    { label: 'Contact Support Helpdesk', desc: 'Get assistance from our 24/7 Mumbai operations room', href: '/hotline', icon: MessageCircle },
  ];

  // 8. Dropdown Menu 6: 24/7 Hotline
  const hotlineSubmenu = [
    { label: 'Call Toll-Free Helpline', desc: '1800-FOOD-RESCUE (1800-366-3737) · Toll-free 24/7', href: 'tel:18003663737', icon: PhoneCall, badge: 'Toll-Free', external: true },
    { label: 'Urgent Same-Night Dispatch', desc: 'Surplus food ending tonight? Immediate van dispatch form', href: '/hotline?type=emergency', icon: ShieldAlert, badge: 'Urgent' },
    { label: 'Report Pickup Delay', desc: 'Update banquet wrap-up time or gate entry instructions', href: '/hotline?type=delay', icon: AlertCircle },
    { label: 'WhatsApp Dispatch Desk', desc: 'Chat directly with Mumbai dispatch coordinators', href: 'https://wa.me/919820044555', icon: MessageCircle, badge: 'Active', external: true },
  ];

  // 9. Dropdown Menu 7: Schedule Pickup
  const scheduleSubmenu = [
    { label: 'Schedule Free Rescue Pickup', desc: 'Book our certified volunteer van for your wedding or party', href: '/schedule-pickup', icon: Sparkles, badge: '100% Free' },
    { label: 'Live Pickup Journey Tracking', desc: 'Track your dispatched van and shelter handover in real-time', href: '/pickups', icon: Truck, badge: 'Track Live' },
    { label: 'Food Rescue Live Map', desc: 'Locate vehicles and nearby shelters across your corridor', href: '/live-map', icon: Radio },
    { label: 'List Your Venue or Caterer', desc: 'Enroll your banquet hall or catering kitchen for pickups', href: '/partner-register', icon: Building2 },
  ];

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-ink/10 bg-[#f7f4ec]/95 shadow-sm backdrop-blur-md'
          : 'border-b border-ink/5 bg-[#f7f4ec]/85 backdrop-blur-sm'
      }`}
    >
      <div className="section-shell flex h-20 items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="FoodRescue Home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-moss text-white shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-[#224433]">
            <Heart size={22} className="fill-white" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-xl font-extrabold tracking-tight text-ink">
              Food<span className="text-moss">Rescue</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-moss uppercase">
              Wedding & Event Surplus to Needy
            </span>
          </div>
        </Link>

        {/* ============================================================== */}
        {/* DESKTOP DROPDOWN CLUSTER: ZONE + RESCUE HUB */}
        {/* ============================================================== */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Zone Selector */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('zone')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => toggleDropdown('zone')}
              className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                activeDropdown === 'zone'
                  ? 'border-moss bg-white shadow-sm text-moss'
                  : 'border-ink/10 bg-white/90 text-ink shadow-2xs hover:border-moss/40 hover:bg-white'
              }`}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'zone'}
            >
              <MapPin size={14} className="text-moss" />
              <span>Zone: <strong>{selectedZone}</strong></span>
              <ChevronDown
                size={14}
                className={`text-ink/40 transition-transform duration-200 ${
                  activeDropdown === 'zone' ? 'rotate-180 text-moss' : ''
                }`}
              />
            </button>

            {activeDropdown === 'zone' && (
              <div
                role="menu"
                className="absolute left-0 mt-2 w-72 rounded-2xl border border-ink/10 bg-white p-2 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 z-50"
              >
                <div className="px-3 py-1.5 border-b border-ink/5 mb-1 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Select Relief Zone
                  </p>
                  <Link
                    href="/zones"
                    onClick={closeAll}
                    className="text-[10px] font-bold text-moss hover:underline"
                  >
                    View All Corridors →
                  </Link>
                </div>
                <div className="space-y-1">
                  {zones.map((z) => (
                    <button
                      key={z.name}
                      type="button"
                      role="menuitem"
                      onClick={() => handleZonePick(z.name)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition cursor-pointer ${
                        selectedZone === z.name ? 'bg-sage/50 text-moss font-bold' : 'text-ink/80 hover:bg-cream'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{z.name}</span>
                        <span className="text-[10px] text-ink/50 block">{z.hint}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[9px] font-bold text-ink/60">
                          {z.count}
                        </span>
                        {selectedZone === z.name && <Check size={14} className="text-moss" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rescue Hub */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('rescue-hub')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => toggleDropdown('rescue-hub')}
              className={`flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                activeDropdown === 'rescue-hub'
                  ? 'border-moss bg-white shadow-sm text-moss'
                  : 'border-transparent text-ink/80 hover:border-ink/10 hover:bg-white'
              }`}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'rescue-hub'}
            >
              <Compass size={14} className="text-moss" />
              <span>Rescue Hub</span>
              <ChevronDown
                size={14}
                className={`text-ink/40 transition-transform duration-200 ${
                  activeDropdown === 'rescue-hub' ? 'rotate-180 text-moss' : ''
                }`}
              />
            </button>

            {activeDropdown === 'rescue-hub' && (
              <div
                role="menu"
                className="absolute left-0 mt-2 w-80 rounded-2xl border border-ink/10 bg-white p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 z-50"
              >
                <div className="px-3 py-1.5 border-b border-ink/5 mb-1.5 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Rescue Operations Hub
                  </p>
                  <Link
                    href="/rescue-hub"
                    onClick={closeAll}
                    className="text-[10px] font-bold text-moss hover:underline"
                  >
                    Full Dashboard →
                  </Link>
                </div>
                <div className="space-y-1">
                  {quickActionItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={closeAll}
                        className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-cream/60 group"
                      >
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-moss/10 text-moss shrink-0 group-hover:bg-moss group-hover:text-white transition">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink group-hover:text-moss truncate">{item.label}</span>
                            {item.badge && (
                              <span className="rounded-full bg-tomato/15 px-2 py-0.5 text-[9px] font-black text-tomato">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-ink/50 truncate">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP 5 CORE NAV HEADING DROPDOWNS */}
        {/* ============================================================== */}
        <nav className="hidden xl:flex items-center gap-1.5" aria-label="Primary navigation">
          {/* 1. Available Batches */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('batches')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => toggleDropdown('batches')}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeDropdown === 'batches'
                  ? 'bg-white text-moss font-bold shadow-2xs'
                  : 'text-ink/80 hover:text-moss hover:bg-white/60'
              }`}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'batches'}
            >
              <span>Available Batches</span>
              <ChevronDown
                size={13}
                className={`text-ink/40 transition-transform duration-200 ${
                  activeDropdown === 'batches' ? 'rotate-180 text-moss' : ''
                }`}
              />
            </button>

            {activeDropdown === 'batches' && (
              <div
                role="menu"
                className="absolute left-0 mt-2 w-80 rounded-2xl border border-ink/10 bg-white p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 z-50"
              >
                <div className="px-3 py-1.5 border-b border-ink/5 mb-1.5 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Live Surplus Marketplace
                  </p>
                  <Link href="/batches" onClick={closeAll} className="text-[10px] font-bold text-moss hover:underline">
                    All Batches →
                  </Link>
                </div>
                <div className="space-y-1">
                  {batchesSubmenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={closeAll}
                        className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-cream/60 group"
                      >
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-moss/10 text-moss shrink-0 group-hover:bg-moss group-hover:text-white transition">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink group-hover:text-moss truncate">{item.label}</span>
                            {item.badge && (
                              <span className="rounded-full bg-tomato/15 px-2 py-0.5 text-[9px] font-black text-tomato">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-ink/50 truncate">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Event Calculator (Direct Link - No Dropdown) */}
          <Link
            href="/calculator"
            onClick={closeAll}
            className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-ink/80 transition hover:text-moss hover:bg-white/60"
          >
            Event Calculator
          </Link>

          {/* 3. Venues & Shelters */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('partners')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => toggleDropdown('partners')}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeDropdown === 'partners'
                  ? 'bg-white text-moss font-bold shadow-2xs'
                  : 'text-ink/80 hover:text-moss hover:bg-white/60'
              }`}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'partners'}
            >
              <span>Venues & Shelters</span>
              <ChevronDown
                size={13}
                className={`text-ink/40 transition-transform duration-200 ${
                  activeDropdown === 'partners' ? 'rotate-180 text-moss' : ''
                }`}
              />
            </button>

            {activeDropdown === 'partners' && (
              <div
                role="menu"
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl border border-ink/10 bg-white p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 z-50"
              >
                <div className="px-3 py-1.5 border-b border-ink/5 mb-1.5 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Banquets & Relief Homes
                  </p>
                  <Link href="/venues" onClick={closeAll} className="text-[10px] font-bold text-moss hover:underline">
                    View All →
                  </Link>
                </div>
                <div className="space-y-1">
                  {venuesSubmenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={closeAll}
                        className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-cream/60 group"
                      >
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-moss/10 text-moss shrink-0 group-hover:bg-moss group-hover:text-white transition">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink group-hover:text-moss truncate">{item.label}</span>
                            {item.badge && (
                              <span className="rounded-full bg-moss/10 px-2 py-0.5 text-[9px] font-black text-moss">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-ink/50 truncate">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Stories (Direct Link - No Dropdown) */}
          <Link
            href="/stories"
            onClick={closeAll}
            className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-ink/80 transition hover:text-moss hover:bg-white/60"
          >
            Stories
          </Link>

          {/* 5. FAQs (Direct Link - No Dropdown) */}
          <Link
            href="/faq"
            onClick={closeAll}
            className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-ink/80 transition hover:text-moss hover:bg-white/60"
          >
            FAQs
          </Link>
        </nav>

        {/* ============================================================== */}
        {/* RIGHT CTA CLUSTER: 24/7 HOTLINE & SCHEDULE PICKUP DROPDOWNS */}
        {/* ============================================================== */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* 24/7 Hotline */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('hotline')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => toggleDropdown('hotline')}
              className={`flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                activeDropdown === 'hotline'
                  ? 'border-tomato bg-tomato/20 text-[#A43D29] shadow-sm'
                  : 'border-tomato/30 bg-tomato/10 text-tomato hover:bg-tomato/20 shadow-2xs'
              }`}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'hotline'}
              title="24/7 Emergency Food Rescue Hotline"
            >
              <PhoneCall size={13} className="animate-pulse" />
              <span>24/7 Hotline</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  activeDropdown === 'hotline' ? 'rotate-180 text-tomato' : ''
                }`}
              />
            </button>

            {activeDropdown === 'hotline' && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-ink/10 bg-white p-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 z-50"
              >
                <div className="flex items-center justify-between border-b border-ink/5 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert size={15} className="text-tomato" />
                    <span className="text-xs font-black text-ink">Emergency Food Dispatch</span>
                  </div>
                  <span className="rounded-full bg-tomato/15 px-2 py-0.5 text-[9px] font-black text-tomato animate-pulse">
                    Active 24/7
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {hotlineSubmenu.map((item) => {
                    const Icon = item.icon;
                    if (item.external) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          role="menuitem"
                          onClick={closeAll}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-cream/60 group"
                        >
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-tomato/10 text-tomato shrink-0 group-hover:bg-tomato group-hover:text-white transition">
                            <Icon size={15} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-ink group-hover:text-tomato truncate">{item.label}</span>
                              {item.badge && (
                                <span className="rounded-full bg-tomato/15 px-2 py-0.5 text-[9px] font-black text-tomato">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-ink/50 truncate">{item.desc}</p>
                          </div>
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={closeAll}
                        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-cream/60 group"
                      >
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-tomato/10 text-tomato shrink-0 group-hover:bg-tomato group-hover:text-white transition">
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink group-hover:text-tomato truncate">{item.label}</span>
                            {item.badge && (
                              <span className="rounded-full bg-tomato/15 px-2 py-0.5 text-[9px] font-black text-tomato">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-ink/50 truncate">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-2.5 rounded-xl bg-cream/70 p-2.5 border border-ink/5 text-[10px] text-ink/60">
                  <span className="font-bold text-moss">Toll-Free Dispatch: </span>
                  Call <strong>1800-FOOD-RESCUE</strong> for volunteer van arrival within 30–60 minutes.
                </div>
              </div>
            )}
          </div>

          {/* Schedule Pickup */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('schedule')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => toggleDropdown('schedule')}
              className={`primary-button text-xs uppercase tracking-wider py-2.5 px-4 cursor-pointer gap-1.5 ${
                activeDropdown === 'schedule' ? 'bg-[#224433] ring-2 ring-moss/20' : ''
              }`}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'schedule'}
            >
              <Sparkles size={14} />
              <span>Schedule Pickup</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  activeDropdown === 'schedule' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {activeDropdown === 'schedule' && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-ink/10 bg-white p-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 z-50"
              >
                <div className="flex items-center justify-between border-b border-ink/5 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={15} className="text-moss" />
                    <span className="text-xs font-black text-ink">Event Surplus Collection</span>
                  </div>
                  <span className="rounded-full bg-sage/60 px-2 py-0.5 text-[9px] font-black text-moss">
                    100% Free
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {scheduleSubmenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={closeAll}
                        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-cream/60 group"
                      >
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-moss/10 text-moss shrink-0 group-hover:bg-moss group-hover:text-white transition">
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink group-hover:text-moss truncate">{item.label}</span>
                            {item.badge && (
                              <span className="rounded-full bg-sage/60 px-2 py-0.5 text-[9px] font-black text-moss">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-ink/50 truncate">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-2.5 pt-2 border-t border-ink/5">
                  <Link
                    href="/schedule-pickup"
                    onClick={closeAll}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-moss py-2 text-xs font-bold text-white transition hover:bg-[#224433]"
                  >
                    Open Pickup Booking Form <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}
          </div>


        </div>

        {/* Mobile menu toggle button */}
        <button
          className="grid h-11 w-11 place-items-center rounded-2xl border border-ink/10 bg-white text-ink transition hover:bg-cream xl:hidden cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ============================================================== */}
      {/* MOBILE NAVIGATION DRAWER WITH ACCORDION SUBMENUS */}
      {/* ============================================================== */}
      {mobileOpen && (
        <nav
          className="animate-in fade-in slide-in-from-top-4 duration-200 border-t border-ink/10 bg-[#f7f4ec] px-5 py-6 shadow-xl xl:hidden max-h-[85vh] overflow-y-auto space-y-4"
          aria-label="Mobile navigation"
        >

          {/* Mobile Zone Selector */}
          <div className="rounded-2xl border border-ink/10 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                Select Relief Zone
              </span>
              <Link href="/zones" onClick={closeAll} className="text-[10px] font-bold text-moss hover:underline">
                Explore Zones →
              </Link>
            </div>
            <select
              value={selectedZone}
              onChange={(e) => {
                if (onSelectZone) onSelectZone(e.target.value);
                setMobileOpen(false);
                router.push('/zones');
              }}
              className="w-full rounded-xl border border-ink/10 bg-cream/40 p-2.5 text-xs font-bold text-ink outline-hidden"
            >
              {zones.map((z) => (
                <option key={z.name} value={z.name}>
                  {z.name} ({z.count})
                </option>
              ))}
            </select>
          </div>

          {/* Accordion Group of All Navigation Headings */}
          <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden divide-y divide-ink/5 shadow-2xs">
            {/* Rescue Hub Accordion */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedSection(
                    mobileExpandedSection === 'hub' ? null : 'hub'
                  )
                }
                className="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-ink transition hover:bg-cream/40"
              >
                <span className="flex items-center gap-2">
                  <Compass size={15} className="text-moss" />
                  <span>Rescue Hub Operations</span>
                </span>
                <ChevronDown
                  size={15}
                  className={`text-ink/40 transition-transform ${
                    mobileExpandedSection === 'hub' ? 'rotate-180 text-moss' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'hub' && (
                <div className="bg-cream/40 px-3.5 pb-3 pt-1 space-y-1 animate-in fade-in duration-150">
                  {quickActionItems.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={closeAll}
                      className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold text-ink/80 hover:bg-white hover:text-moss"
                    >
                      <span>{sub.label}</span>
                      <ArrowRight size={13} className="text-ink/30" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 1. Available Batches Accordion */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedSection(
                    mobileExpandedSection === 'batches' ? null : 'batches'
                  )
                }
                className="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-ink transition hover:bg-cream/40"
              >
                <span className="flex items-center gap-2">
                  <Utensils size={15} className="text-moss" />
                  <span>Available Batches</span>
                  <span className="rounded-full bg-sage/60 px-1.5 py-0.2 text-[9px] text-moss font-bold">10</span>
                </span>
                <ChevronDown
                  size={15}
                  className={`text-ink/40 transition-transform ${
                    mobileExpandedSection === 'batches' ? 'rotate-180 text-moss' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'batches' && (
                <div className="bg-cream/40 px-3.5 pb-3 pt-1 space-y-1 animate-in fade-in duration-150">
                  {batchesSubmenu.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={closeAll}
                      className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold text-ink/80 hover:bg-white hover:text-moss"
                    >
                      <span>{sub.label}</span>
                      <ArrowRight size={13} className="text-ink/30" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Event Calculator (Direct Link - No Dropdown) */}
            <Link
              href="/calculator"
              onClick={closeAll}
              className="flex items-center justify-between p-3.5 text-xs font-bold text-ink transition hover:bg-cream/40"
            >
              <span className="flex items-center gap-2">
                <Calculator size={15} className="text-moss" />
                <span>Event Calculator</span>
              </span>
              <ArrowRight size={13} className="text-ink/30" />
            </Link>

            {/* 3. Venues & Shelters Accordion */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedSection(
                    mobileExpandedSection === 'partners' ? null : 'partners'
                  )
                }
                className="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-ink transition hover:bg-cream/40"
              >
                <span className="flex items-center gap-2">
                  <Building2 size={15} className="text-moss" />
                  <span>Venues & Shelters</span>
                </span>
                <ChevronDown
                  size={15}
                  className={`text-ink/40 transition-transform ${
                    mobileExpandedSection === 'partners' ? 'rotate-180 text-moss' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'partners' && (
                <div className="bg-cream/40 px-3.5 pb-3 pt-1 space-y-1 animate-in fade-in duration-150">
                  {venuesSubmenu.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={closeAll}
                      className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold text-ink/80 hover:bg-white hover:text-moss"
                    >
                      <span>{sub.label}</span>
                      <ArrowRight size={13} className="text-ink/30" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Stories Direct Link */}
            <Link
              href="/stories"
              onClick={closeAll}
              className="flex items-center justify-between p-3.5 text-xs font-bold text-ink transition hover:bg-cream/40"
            >
              <span className="flex items-center gap-2">
                <MessageSquare size={15} className="text-moss" />
                <span>Stories</span>
              </span>
              <ArrowRight size={13} className="text-ink/30" />
            </Link>

            {/* 5. FAQs Direct Link */}
            <Link
              href="/faq"
              onClick={closeAll}
              className="flex items-center justify-between p-3.5 text-xs font-bold text-ink transition hover:bg-cream/40"
            >
              <span className="flex items-center gap-2">
                <HelpCircle size={15} className="text-moss" />
                <span>FAQs & Help</span>
              </span>
              <ArrowRight size={13} className="text-ink/30" />
            </Link>

            {/* 6. 24/7 Hotline Accordion */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedSection(
                    mobileExpandedSection === 'hotline' ? null : 'hotline'
                  )
                }
                className="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-tomato transition hover:bg-tomato/5"
              >
                <span className="flex items-center gap-2">
                  <PhoneCall size={15} className="text-tomato" />
                  <span>24/7 Hotline</span>
                  <span className="rounded-full bg-tomato/15 px-1.5 py-0.2 text-[9px] font-black text-tomato">Emergency</span>
                </span>
                <ChevronDown
                  size={15}
                  className={`text-tomato/60 transition-transform ${
                    mobileExpandedSection === 'hotline' ? 'rotate-180 text-tomato' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'hotline' && (
                <div className="bg-tomato/5 px-3.5 pb-3 pt-1 space-y-1 animate-in fade-in duration-150">
                  {hotlineSubmenu.map((sub) => {
                    if (sub.external) {
                      return (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={closeAll}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold text-ink/80 hover:bg-white hover:text-tomato"
                        >
                          <span>{sub.label}</span>
                          <ArrowRight size={13} className="text-ink/30" />
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={closeAll}
                        className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold text-ink/80 hover:bg-white hover:text-tomato"
                      >
                        <span>{sub.label}</span>
                        <ArrowRight size={13} className="text-ink/30" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 7. Schedule Pickup Accordion */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedSection(
                    mobileExpandedSection === 'schedule' ? null : 'schedule'
                  )
                }
                className="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-moss transition hover:bg-sage/20"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={15} className="text-moss" />
                  <span>Schedule Pickup</span>
                  <span className="rounded-full bg-sage/60 px-1.5 py-0.2 text-[9px] font-black text-moss">Free</span>
                </span>
                <ChevronDown
                  size={15}
                  className={`text-moss/60 transition-transform ${
                    mobileExpandedSection === 'schedule' ? 'rotate-180 text-moss' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'schedule' && (
                <div className="bg-sage/20 px-3.5 pb-3 pt-1 space-y-1 animate-in fade-in duration-150">
                  {scheduleSubmenu.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={closeAll}
                      className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold text-ink/80 hover:bg-white hover:text-moss"
                    >
                      <span>{sub.label}</span>
                      <ArrowRight size={13} className="text-ink/30" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Primary Actions in Mobile Menu */}
          <div className="pt-2 space-y-2">
            <Link
              href="/schedule-pickup"
              onClick={closeAll}
              className="primary-button w-full justify-center py-3.5 text-xs uppercase tracking-wider"
            >
              Schedule Wedding / Banquet Pickup <ArrowRight size={15} />
            </Link>

            <a
              href="tel:18003663737"
              className="flex items-center justify-center gap-2 rounded-full border border-tomato/30 bg-tomato/10 py-3 text-xs font-bold text-tomato w-full transition hover:bg-tomato/20"
            >
              <PhoneCall size={14} className="animate-pulse" /> 24/7 Hotline: 1800-FOOD-RESCUE
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
