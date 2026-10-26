'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Clock3,
  MapPin,
  ArrowRight,
  Filter,
  RotateCcw,
  Sparkles,
  Info,
  Users,
  Flame,
  Check,
  Share2,
  Heart,
  LayoutGrid,
  List,
  Radar,
  Radio,
  SlidersHorizontal,
  Navigation,
  ShieldCheck,
  ChevronRight,
  BookmarkCheck,
  Truck
} from 'lucide-react';
import type { FoodBox } from '@/types/food';
import { formatTime } from '@/lib/food-data';
import CustomDropdown, { DropdownOption } from './CustomDropdown';

interface FoodBoxExplorerProps {
  boxes: FoodBox[];
  onOpen: (box: FoodBox) => void;
  onReserve: (box: FoodBox) => void;
  selectedPartner?: string | null;
  onClearPartnerFilter?: () => void;
  selectedZoneFilter?: string;
  onZoneChange?: (zone: string) => void;
}

// 1. City Zones
const zoneOptions: DropdownOption[] = [
  { value: 'All Zones', label: 'All Mumbai Zones', badge: '10 Batches', hint: 'Greater Mumbai coverage' },
  { value: 'Western Suburbs', label: 'Western Suburbs', badge: 'Bandra–Borivali', hint: 'Bandra, Andheri, Goregaon, Juhu' },
  { value: 'South Mumbai', label: 'South Mumbai', badge: 'Town & Marine', hint: 'Colaba, Lower Parel, Byculla' },
  { value: 'Central Mumbai', label: 'Central Mumbai', badge: 'Dadar & Kurla', hint: 'Dadar, Shivaji Park, Sion' },
  { value: 'Eastern Suburbs', label: 'Eastern Suburbs', badge: 'Powai–Ghatkopar', hint: 'Powai, Vikhroli, Ghatkopar' },
];

// 2. Event Types
const categoryOptions: DropdownOption[] = [
  { value: 'All Events', label: 'All Celebration Sources', badge: 'All' },
  { value: 'Wedding', label: 'Grand Wedding Feasts 💍', badge: 'Banquets', hint: 'Multi-course buffet surplus' },
  { value: 'Corporate Event', label: 'Corporate Gala Buffets 🏢', badge: 'Conventions', hint: 'Conference & summit dinners' },
  { value: 'Party / Banquet', label: 'Banquet & Birthday Parties 🎂', badge: 'Party Halls', hint: 'Celebration platters' },
  { value: 'Caterer', label: 'Community Cooking Pots 🍲', badge: 'Caterers', hint: 'Large volume bulk pots' },
  { value: 'Bakery & Café', label: 'Bakery & Deli Surplus 🥐', badge: 'Cafés', hint: 'Fresh loaves & sandwiches' },
];

// 3. Cuisines
const cuisineOptions: DropdownOption[] = [
  { value: 'All Cuisines', label: 'All Food Cuisines', badge: 'Any' },
  { value: 'North Indian Feast', label: 'North Indian Curries & Roti 🍛', hint: 'Paneer, Dal Makhani, Pulao' },
  { value: 'Biryani & Rice Bowls', label: 'Biryani & Fragrant Rice 🍚', hint: 'Dum Biryani, Pulao, Bowls' },
  { value: 'Desserts & Mithai', label: 'Desserts & Indian Sweets 🍬', hint: 'Halwas, Gulab Jamun, Mithai' },
  { value: 'Bakery & Snacks', label: 'Bakery, Breads & Wraps 🥪', hint: 'Sandwiches, Loaves, Pastries' },
  { value: 'Comfort Dal & Khichdi', label: 'Comfort Dal & Khichdi 🍲', hint: 'Panchmel Dal, Khichdi, Papad' },
  { value: 'Fresh Fruits', label: 'Fresh Seasonal Fruits 🍉', hint: 'Uncut Melons, Platters, Juices' },
];

// 4. Dietary Preferences
const dietaryOptions: DropdownOption[] = [
  { value: 'All Diets', label: 'All Dietary Classifications', badge: 'All' },
  { value: 'Pure Vegetarian', label: 'Pure Vegetarian 🌿', badge: 'Veg', hint: '100% Meat & Egg Free' },
  { value: 'Jain Friendly', label: 'Jain Satvik (No Onion/Garlic) 🕊️', badge: 'Satvik', hint: 'Ahimsa compliant root-free' },
  { value: 'Halal Certified', label: 'Halal Certified 🌙', badge: 'Halal', hint: 'Strict Halal Nikah surplus' },
  { value: 'Vegan', label: 'Vegan Friendly 🌱', badge: 'Vegan', hint: '100% Plant based, dairy free' },
  { value: 'Non-Vegetarian', label: 'Non-Vegetarian 🍗', badge: 'Non-Veg', hint: 'Chicken & Meat curries' },
];

// 5. Portion Scales
const portionScaleOptions: DropdownOption[] = [
  { value: 'All Scales', label: 'All Batch Sizes', badge: 'Any Capacity' },
  { value: 'Feeds 15–30 People', label: 'Small Batch (15–30 People)', badge: '15–30', hint: 'Ideal for small shelters' },
  { value: 'Feeds 30–50 People', label: 'Medium Batch (30–50 People)', badge: '30–50', hint: 'Feeds 1 full orphanage' },
  { value: 'Feeds 50+ People', label: 'Large Feast (50+ People)', badge: '50+', hint: 'Feeds 100+ street children' },
];

// 6. Urgency Windows
const urgencyOptions: DropdownOption[] = [
  { value: 'All Timings', label: 'All Pickup Slots', badge: '24/7' },
  { value: 'Immediate (<60 Mins)', label: '⚡ Urgent: Dispatch in <60 Mins', badge: '<60m', hint: 'Hot food ready right now' },
  { value: 'Evening (9–11 PM)', label: '🌙 Evening Slot (9:00 PM – 11:00 PM)', badge: '9–11 PM', hint: 'Dinner banquet conclusion' },
  { value: 'Late Night (11 PM–1 AM)', label: '⏳ Late Night Slot (11:00 PM – 1:00 AM)', badge: '11 PM–1 AM', hint: 'Post-wedding wrap-up' },
];

// 7. Temperature & Storage
const temperatureOptions: DropdownOption[] = [
  { value: 'All Temperatures', label: 'All Storage Conditions', badge: 'Any' },
  { value: 'Steam Hot (>65°C)', label: '🔥 Steam Hot (>65°C Verified)', badge: 'Hot', hint: 'Thermal container sealed' },
  { value: 'Chill Fresh (<5°C)', label: '❄️ Chill Insulated (<5°C)', badge: 'Cold', hint: 'Refrigerated dessert box' },
  { value: 'Room Temp Ambient', label: '🍞 Room Temperature (Sealed)', badge: 'Ambient', hint: 'Bakery loaves & bakes' },
];

// 8. Beneficiary Targets
const beneficiaryOptions: DropdownOption[] = [
  { value: 'All Beneficiaries', label: 'All Relief Recipients', badge: 'All Homes' },
  { value: 'Children Orphanages', label: '🧒 Children Orphanages', badge: 'Kids', hint: 'Sneha Sadan, Asha Sadan' },
  { value: 'Night Homeless Shelters', label: '⛺ Night Homeless Shelters', badge: 'Shelters', hint: 'Railway & station sleepers' },
  { value: 'Elderly Care', label: '👵 Senior Citizens & Elderly Care', badge: 'Elders', hint: 'Ashray Dham, Senior homes' },
  { value: 'Slum Community Relief', label: '🍲 Slum Community Relief Kitchens', badge: 'Slums', hint: 'Direct meal distribution' },
];

// 9. Proximity Radius
const distanceOptions: DropdownOption[] = [
  { value: 'Any Distance', label: 'Any Distance (Citywide)', badge: 'All Distances' },
  { value: 'Within 3 km', label: '📍 Within 3 km (Fastest Delivery)', badge: '<3 km', hint: 'Under 15 mins transit' },
  { value: 'Within 5 km', label: '📍 Within 5 km', badge: '<5 km', hint: 'Under 25 mins transit' },
  { value: 'Within 10 km', label: '📍 Within 10 km', badge: '<10 km', hint: 'Suburban coverage' },
];

// 10. Sort Options
const sortOptions: DropdownOption[] = [
  { value: 'Recommended', label: '🌟 AI Recommended Priority', badge: 'Best' },
  { value: 'Most Servings', label: '👥 Highest Serving Capacity', badge: 'Max Servings' },
  { value: 'Urgent Dispatch', label: '⚡ Most Urgent Pickup Time', badge: 'Earliest' },
  { value: 'Closest Distance', label: '📍 Closest Proximity (km)', badge: 'Nearest' },
  { value: 'Highest Value', label: '💰 Highest Rescued Food Value', badge: 'Value' },
];

// Quick Preset Filter Chips
interface FilterPreset {
  id: string;
  label: string;
  icon: string;
  apply: () => void;
  isActive: boolean;
}

export default function FoodBoxExplorer({
  boxes,
  onOpen,
  onReserve,
  selectedPartner,
  onClearPartnerFilter,
  selectedZoneFilter = 'All Zones',
  onZoneChange,
}: FoodBoxExplorerProps) {
  // Filters State
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState<string>(selectedZoneFilter);
  const [category, setCategory] = useState<string>('All Events');
  const [cuisine, setCuisine] = useState<string>('All Cuisines');
  const [dietary, setDietary] = useState<string>('All Diets');
  const [portionScale, setPortionScale] = useState<string>('All Scales');
  const [urgency, setUrgency] = useState<string>('All Timings');
  const [temperature, setTemperature] = useState<string>('All Temperatures');
  const [beneficiary, setBeneficiary] = useState<string>('All Beneficiaries');
  const [distance, setDistance] = useState<string>('Any Distance');
  const [sortBy, setSortBy] = useState<string>('Recommended');

  // UI Interactive States
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'radar'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedRadarZone, setSelectedRadarZone] = useState<string>('Western Suburbs');

  // Sync external zone filter from Navbar/Hero
  useMemo(() => {
    if (selectedZoneFilter && selectedZoneFilter !== zone) {
      setZone(selectedZoneFilter);
    }
  }, [selectedZoneFilter]);

  // Toggle Bookmark
  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  // Filter and sort boxes
  const filteredBoxes = useMemo(() => {
    return boxes
      .filter((box) => {
        // Saved only filter
        if (showSavedOnly && !savedIds.includes(box.id)) {
          return false;
        }

        // Partner filter if triggered from PartnerSpotlight
        if (selectedPartner && box.partnerName !== selectedPartner) {
          return false;
        }

        // Dropdown 1: Zone filter
        if (zone !== 'All Zones' && box.zone !== zone) {
          return false;
        }

        // Dropdown 2: Category filter
        if (category !== 'All Events' && box.category !== category) {
          return false;
        }

        // Dropdown 3: Cuisine filter
        if (cuisine !== 'All Cuisines' && box.cuisineType !== cuisine) {
          return false;
        }

        // Dropdown 4: Dietary filter
        if (dietary !== 'All Diets') {
          if (box.dietaryType !== dietary && !box.tags.includes(dietary)) {
            return false;
          }
        }

        // Dropdown 5: Portion scale filter
        if (portionScale === 'Feeds 15–30 People' && (box.servings < 15 || box.servings > 30)) return false;
        if (portionScale === 'Feeds 30–50 People' && (box.servings < 30 || box.servings > 50)) return false;
        if (portionScale === 'Feeds 50+ People' && box.servings < 50) return false;

        // Dropdown 6: Urgency filter
        if (urgency !== 'All Timings' && box.urgencyLevel !== urgency) {
          return false;
        }

        // Dropdown 7: Temperature filter
        if (temperature !== 'All Temperatures') {
          if (box.temperatureStatus !== temperature && !box.temperatureVerified.includes(temperature.split(' ')[0])) {
            return false;
          }
        }

        // Dropdown 8: Beneficiary filter
        if (beneficiary !== 'All Beneficiaries') {
          if (box.beneficiaryCategory !== beneficiary && !box.beneficiaryTarget.toLowerCase().includes(beneficiary.toLowerCase())) {
            return false;
          }
        }

        // Dropdown 9: Distance filter
        if (distance !== 'Any Distance') {
          const maxKm = distance === 'Within 3 km' ? 3 : distance === 'Within 5 km' ? 5 : 10;
          if (box.distanceKm && box.distanceKm > maxKm) return false;
        }

        // Search text matching
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchName = box.name.toLowerCase().includes(query);
          const matchPartner = box.partnerName.toLowerCase().includes(query);
          const matchLocation = box.location.toLowerCase().includes(query);
          const matchVenue = box.venueName.toLowerCase().includes(query);
          const matchTags = box.tags.some((t) => t.toLowerCase().includes(query));
          const matchItems = box.includedItems.some((i) => i.toLowerCase().includes(query));
          if (!matchName && !matchPartner && !matchLocation && !matchVenue && !matchTags && !matchItems) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Most Servings') return b.servings - a.servings;
        if (sortBy === 'Urgent Dispatch') return a.pickupStart.localeCompare(b.pickupStart);
        if (sortBy === 'Closest Distance') return (a.distanceKm || 5) - (b.distanceKm || 5);
        if (sortBy === 'Highest Value') return b.originalValue - a.originalValue;
        return 0;
      });
  }, [
    boxes,
    search,
    zone,
    category,
    cuisine,
    dietary,
    portionScale,
    urgency,
    temperature,
    beneficiary,
    distance,
    sortBy,
    selectedPartner,
    showSavedOnly,
    savedIds
  ]);

  const resetFilters = () => {
    setSearch('');
    setZone('All Zones');
    if (onZoneChange) onZoneChange('All Zones');
    setCategory('All Events');
    setCuisine('All Cuisines');
    setDietary('All Diets');
    setPortionScale('All Scales');
    setUrgency('All Timings');
    setTemperature('All Temperatures');
    setBeneficiary('All Beneficiaries');
    setDistance('Any Distance');
    setSortBy('Recommended');
    setShowSavedOnly(false);
    if (onClearPartnerFilter) onClearPartnerFilter();
  };

  const handleShare = (box: FoodBox) => {
    const text = `Food Rescue Batch: ${box.name} at ${box.venueName}, ${box.location}. Feeds ${box.servings} people! Check on FoodRescue.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(box.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Quick preset pills
  const presets: FilterPreset[] = [
    {
      id: 'urgent',
      label: '⚡ Urgent (<60m)',
      icon: '⚡',
      apply: () => {
        setUrgency('Immediate (<60 Mins)');
      },
      isActive: urgency === 'Immediate (<60 Mins)',
    },
    {
      id: 'pureveg',
      label: '🌿 Pure Vegetarian',
      icon: '🌿',
      apply: () => {
        setDietary('Pure Vegetarian');
      },
      isActive: dietary === 'Pure Vegetarian',
    },
    {
      id: 'kids',
      label: '👶 Children’s Homes',
      icon: '👶',
      apply: () => {
        setBeneficiary('Children Orphanages');
      },
      isActive: beneficiary === 'Children Orphanages',
    },
    {
      id: 'biryani',
      label: '🍚 Biryani Bowls',
      icon: '🍚',
      apply: () => {
        setCuisine('Biryani & Rice Bowls');
      },
      isActive: cuisine === 'Biryani & Rice Bowls',
    },
    {
      id: 'large',
      label: '👥 50+ Feasts',
      icon: '👥',
      apply: () => {
        setPortionScale('Feeds 50+ People');
      },
      isActive: portionScale === 'Feeds 50+ People',
    },
    {
      id: 'steamhot',
      label: '🔥 Hot (>65°C)',
      icon: '🔥',
      apply: () => {
        setTemperature('Steam Hot (>65°C)');
      },
      isActive: temperature === 'Steam Hot (>65°C)',
    },
  ];

  // Active filter count
  const activeFilterCount = [
    search !== '',
    zone !== 'All Zones',
    category !== 'All Events',
    cuisine !== 'All Cuisines',
    dietary !== 'All Diets',
    portionScale !== 'All Scales',
    urgency !== 'All Timings',
    temperature !== 'All Temperatures',
    beneficiary !== 'All Beneficiaries',
    distance !== 'Any Distance',
    sortBy !== 'Recommended',
    Boolean(selectedPartner),
    showSavedOnly,
  ].filter(Boolean).length;

  // Active vans for live radar view
  const activeVans = [
    {
      id: 'VAN-01',
      driver: 'Rajesh K.',
      zone: 'Western Suburbs',
      status: 'En route to Sneha Sadan',
      capacity: '60 Meals',
      temp: '68°C Hot',
      eta: '12 mins',
      progress: 75,
      foodType: 'North Indian Wedding Feast'
    },
    {
      id: 'VAN-02',
      driver: 'Imran S.',
      zone: 'South Mumbai',
      status: 'Loaded at Byculla Banquet',
      capacity: '85 Dum Biryani Plates',
      temp: '72°C Sealed Deg',
      eta: '18 mins',
      progress: 40,
      foodType: 'Halal Royal Nikah Biryani'
    },
    {
      id: 'VAN-03',
      driver: 'Sunil M.',
      zone: 'Eastern Suburbs',
      status: 'Delivering at Ghatkopar Relief',
      capacity: '55 Jain Meals',
      temp: '69°C Thermal Pot',
      eta: '5 mins',
      progress: 90,
      foodType: 'Satvik Mahotsav Feast'
    },
    {
      id: 'VAN-04',
      driver: 'Amit D.',
      zone: 'Central Mumbai',
      status: 'Inspecting pots at Shivaji Park',
      capacity: '75 Dal & Khichdi Portions',
      temp: '70°C Fresh Hot',
      eta: '25 mins',
      progress: 20,
      foodType: 'Community Khichdi Pots'
    }
  ];

  return (
    <section id="batches" className="scroll-mt-24 py-20 lg:py-28">
      <div className="section-shell">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">
              <Sparkles size={14} /> Multi-Zone Food Relief Batches
            </div>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Fresh celebration food.<br />
              <span className="text-moss">Ready to nourish hungry lives.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-ink/70">
              High-quality surplus rescued from grand weddings, corporate galas, and parties. Filter across 10 interactive criteria or track live rescue dispatch vans in your zone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher: Grid / List / Radar */}
            <div className="flex items-center rounded-2xl border border-ink/10 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-moss text-white shadow-xs'
                    : 'text-ink/60 hover:text-ink hover:bg-cream'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid size={14} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-moss text-white shadow-xs'
                    : 'text-ink/60 hover:text-ink hover:bg-cream'
                }`}
                title="Dense List View"
              >
                <List size={14} /> List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('radar')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'radar'
                    ? 'bg-tomato text-white shadow-xs'
                    : 'text-ink/60 hover:text-ink hover:bg-cream'
                }`}
                title="Interactive Live Van Radar View"
              >
                <Radar size={14} className={viewMode === 'radar' ? 'animate-spin' : ''} /> Live Radar
              </button>
            </div>

            {/* Saved Batches Toggle */}
            <button
              type="button"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                showSavedOnly
                  ? 'border-tomato bg-tomato/10 text-tomato ring-2 ring-tomato/20'
                  : 'border-ink/10 bg-white text-ink/70 hover:border-moss/40 hover:bg-white shadow-2xs'
              }`}
            >
              <Heart
                size={14}
                className={showSavedOnly || savedIds.length > 0 ? 'fill-tomato text-tomato' : 'text-ink/40'}
              />
              <span>Saved ({savedIds.length})</span>
            </button>

            {/* Reset All Filters */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 rounded-2xl border border-tomato/30 bg-tomato/10 px-3.5 py-2 text-xs font-bold text-[#A43D29] transition hover:bg-tomato/20 cursor-pointer"
              >
                <RotateCcw size={13} /> Reset ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Selected Partner Banner */}
        {selectedPartner && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-moss/30 bg-sage/40 px-5 py-3 shadow-2xs">
            <span className="text-xs font-bold text-moss">
              Showing rescued food batches from venue: <strong>{selectedPartner}</strong>
            </span>
            <button
              type="button"
              onClick={onClearPartnerFilter}
              className="text-xs font-extrabold text-moss underline hover:text-ink cursor-pointer"
            >
              Show all event sources
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* COMPREHENSIVE INTERACTIVE MULTI-DROPDOWN CONTROL CENTER */}
        {/* ============================================================== */}
        <div className="mt-10 rounded-[32px] border border-ink/10 bg-white p-5 lg:p-7 shadow-soft">
          {/* Top Row: Search Input + Quick Presets + Expand Toggle */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by venue name, food items, locality (e.g., Royal Palms, Biryani, Goregaon)..."
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 py-3 pr-4 pl-11 text-xs sm:text-sm font-medium text-ink placeholder:text-ink/40 transition focus:border-moss focus:bg-white focus:outline-hidden"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink/40 hover:text-ink cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Advanced Filters Expand/Collapse Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  showAdvancedFilters
                    ? 'border-moss bg-moss text-white shadow-sm'
                    : 'border-ink/10 bg-cream/50 text-ink/80 hover:bg-cream'
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>{showAdvancedFilters ? 'Simple Filters' : '10 Interactive Dropdown Filters'}</span>
                {activeFilterCount > 0 && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    showAdvancedFilters ? 'bg-white text-moss' : 'bg-moss text-white'
                  }`}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Preset Filter Chips Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/5 pt-3.5">
            <span className="text-[10px] font-bold tracking-wider text-ink/40 uppercase mr-1">
              Quick Presets:
            </span>
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={preset.apply}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition duration-200 cursor-pointer ${
                  preset.isActive
                    ? 'border-moss bg-moss text-white shadow-xs'
                    : 'border-ink/10 bg-cream/30 text-ink/70 hover:border-moss/40 hover:bg-white'
                }`}
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Primary Dropdowns Row (Always Visible: 5 essential dropdowns) */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t border-ink/5 pt-4">
            {/* Dropdown 1: City Zone */}
            <CustomDropdown
              label="1. City Zone"
              value={zone}
              options={zoneOptions}
              onChange={(val) => {
                setZone(val);
                if (onZoneChange) onZoneChange(val);
              }}
              defaultValue="All Zones"
              searchable
            />

            {/* Dropdown 2: Event Type */}
            <CustomDropdown
              label="2. Celebration Source"
              value={category}
              options={categoryOptions}
              onChange={setCategory}
              defaultValue="All Events"
            />

            {/* Dropdown 3: Cuisine */}
            <CustomDropdown
              label="3. Cuisine Speciality"
              value={cuisine}
              options={cuisineOptions}
              onChange={setCuisine}
              defaultValue="All Cuisines"
              searchable
            />

            {/* Dropdown 4: Dietary Type */}
            <CustomDropdown
              label="4. Dietary Class"
              value={dietary}
              options={dietaryOptions}
              onChange={setDietary}
              defaultValue="All Diets"
            />

            {/* Dropdown 5: Sort Order */}
            <CustomDropdown
              label="5. Sort & Rank"
              value={sortBy}
              options={sortOptions}
              onChange={setSortBy}
              defaultValue="Recommended"
            />
          </div>

          {/* Secondary / Advanced Dropdowns Row (Toggleable: 5 additional rich dropdowns) */}
          {showAdvancedFilters && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t border-ink/5 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Dropdown 6: Portion Scale */}
              <CustomDropdown
                label="6. Portion Capacity"
                value={portionScale}
                options={portionScaleOptions}
                onChange={setPortionScale}
                defaultValue="All Scales"
              />

              {/* Dropdown 7: Urgency Window */}
              <CustomDropdown
                label="7. Dispatch Window"
                value={urgency}
                options={urgencyOptions}
                onChange={setUrgency}
                defaultValue="All Timings"
              />

              {/* Dropdown 8: Temperature & Storage */}
              <CustomDropdown
                label="8. Food Temperature"
                value={temperature}
                options={temperatureOptions}
                onChange={setTemperature}
                defaultValue="All Temperatures"
              />

              {/* Dropdown 9: Target Beneficiary */}
              <CustomDropdown
                label="9. Recipient Target"
                value={beneficiary}
                options={beneficiaryOptions}
                onChange={setBeneficiary}
                defaultValue="All Beneficiaries"
              />

              {/* Dropdown 10: Radius / Distance */}
              <CustomDropdown
                label="10. Proximity Radius"
                value={distance}
                options={distanceOptions}
                onChange={setDistance}
                defaultValue="Any Distance"
              />
            </div>
          )}

          {/* Interactive Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/5 pt-3.5">
              <span className="text-[11px] font-bold text-ink/50">Filtered by:</span>

              {zone !== 'All Zones' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1 text-[11px] font-bold text-moss">
                  Zone: {zone}
                  <button
                    type="button"
                    onClick={() => {
                      setZone('All Zones');
                      if (onZoneChange) onZoneChange('All Zones');
                    }}
                    className="ml-1 text-moss/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              {category !== 'All Events' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1 text-[11px] font-bold text-moss">
                  Event: {category}
                  <button
                    type="button"
                    onClick={() => setCategory('All Events')}
                    className="ml-1 text-moss/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              {cuisine !== 'All Cuisines' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1 text-[11px] font-bold text-moss">
                  Cuisine: {cuisine}
                  <button
                    type="button"
                    onClick={() => setCuisine('All Cuisines')}
                    className="ml-1 text-moss/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              {dietary !== 'All Diets' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1 text-[11px] font-bold text-moss">
                  Diet: {dietary}
                  <button
                    type="button"
                    onClick={() => setDietary('All Diets')}
                    className="ml-1 text-moss/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              {portionScale !== 'All Scales' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1 text-[11px] font-bold text-moss">
                  Scale: {portionScale}
                  <button
                    type="button"
                    onClick={() => setPortionScale('All Scales')}
                    className="ml-1 text-moss/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              {urgency !== 'All Timings' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1 text-[11px] font-bold text-moss">
                  Timing: {urgency}
                  <button
                    type="button"
                    onClick={() => setUrgency('All Timings')}
                    className="ml-1 text-moss/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              {temperature !== 'All Temperatures' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1 text-[11px] font-bold text-moss">
                  Temp: {temperature}
                  <button
                    type="button"
                    onClick={() => setTemperature('All Temperatures')}
                    className="ml-1 text-moss/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              {beneficiary !== 'All Beneficiaries' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1 text-[11px] font-bold text-moss">
                  Target: {beneficiary}
                  <button
                    type="button"
                    onClick={() => setBeneficiary('All Beneficiaries')}
                    className="ml-1 text-moss/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              {distance !== 'Any Distance' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1 text-[11px] font-bold text-moss">
                  Distance: {distance}
                  <button
                    type="button"
                    onClick={() => setDistance('Any Distance')}
                    className="ml-1 text-moss/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              {showSavedOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-tomato/20 px-3 py-1 text-[11px] font-bold text-tomato">
                  Saved Only ({savedIds.length})
                  <button
                    type="button"
                    onClick={() => setShowSavedOnly(false)}
                    className="ml-1 text-tomato/70 hover:text-ink cursor-pointer font-black"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] font-extrabold text-tomato underline hover:opacity-80 ml-auto cursor-pointer"
              >
                Clear All Dropdowns
              </button>
            </div>
          )}

          {/* Results Summary Bar */}
          <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-3 text-xs text-ink/60">
            <span>
              Showing <strong>{filteredBoxes.length}</strong> available celebration batches
            </span>
            <span className="font-semibold text-moss">
              ⚡ Safe food pickup within 2 hours of event wrap-up
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW MODE 1: INTERACTIVE LIVE RADAR & ZONE DISPATCH (NEW) */}
        {/* ============================================================== */}
        {viewMode === 'radar' && (
          <div className="mt-10 overflow-hidden rounded-[36px] border border-ink/10 bg-white p-6 lg:p-8 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-ink/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-tomato animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-tomato">
                    Live Real-Time Rescue Dispatch Radar
                  </span>
                </div>
                <h3 className="mt-1 font-display text-2xl font-black text-ink">
                  Active Food Rescue Vans & Temperature Telemetry
                </h3>
                <p className="mt-1 text-xs text-ink/60">
                  Select a zone from the dropdown below to inspect active volunteer vehicles picking up wedding surplus right now.
                </p>
              </div>

              {/* Zone selector for Radar */}
              <div className="w-full sm:w-64">
                <CustomDropdown
                  label="Filter Radar Zone"
                  value={selectedRadarZone}
                  options={zoneOptions.filter((z) => z.value !== 'All Zones')}
                  onChange={setSelectedRadarZone}
                />
              </div>
            </div>

            {/* Radar Simulation Grid */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
              {/* Left Column: Visual Radar Terminal */}
              <div className="relative overflow-hidden rounded-3xl border border-moss/20 bg-moss/95 p-6 text-white shadow-xl">
                <div className="absolute inset-0 bg-hero-grid bg-[length:20px_20px] opacity-20" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio size={16} className="text-citrus animate-pulse" />
                      <span className="font-mono text-xs font-bold text-white/90">
                        GPS RADAR: {selectedRadarZone.toUpperCase()}
                      </span>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[10px] text-white/80">
                      FREQ 142.8 MHz • LAT 19.0760° N
                    </span>
                  </div>

                  {/* Circular Radar Sweep Graphic */}
                  <div className="relative my-8 mx-auto h-48 w-48 rounded-full border border-white/20 grid place-items-center">
                    <div className="h-32 w-32 rounded-full border border-white/15 grid place-items-center">
                      <div className="h-16 w-16 rounded-full border border-white/10 grid place-items-center">
                        <div className="h-2 w-2 rounded-full bg-citrus" />
                      </div>
                    </div>
                    {/* Blips */}
                    <div className="absolute top-8 left-12 h-3 w-3 rounded-full bg-tomato animate-ping" />
                    <div className="absolute top-8 left-12 h-3 w-3 rounded-full bg-tomato" />
                    <span className="absolute top-5 left-16 text-[9px] font-mono text-white/80">VAN #01</span>

                    <div className="absolute bottom-10 right-10 h-3 w-3 rounded-full bg-citrus animate-ping" />
                    <div className="absolute bottom-10 right-10 h-3 w-3 rounded-full bg-citrus" />
                    <span className="absolute bottom-7 right-14 text-[9px] font-mono text-white/80">VAN #04</span>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs font-bold text-white/90">
                      ⚡ Quick Dispatch Protocol Active:
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/70">
                      All volunteer vehicles carry digital infrared thermometers and food-grade insulated canisters. Batches are inspected for steam temperature (&gt;60°C) before distribution to shelters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Active Vans Telemetry Cards */}
              <div className="space-y-3.5">
                {activeVans.map((van) => (
                  <div
                    key={van.id}
                    className="rounded-2xl border border-ink/10 bg-cream/40 p-4 transition hover:border-moss/30 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-moss text-white font-bold text-xs">
                          <Truck size={16} />
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-black text-ink">
                            {van.id} — Driver: {van.driver}
                          </h4>
                          <p className="text-[11px] font-semibold text-moss">
                            {van.zone} • {van.status}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-tomato/15 px-2.5 py-0.5 text-[10px] font-black text-tomato">
                        ETA: {van.eta}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-white p-2 border border-ink/5">
                        <span className="text-[10px] text-ink/40 uppercase font-bold block">Capacity</span>
                        <span className="font-bold text-ink">{van.capacity}</span>
                      </div>
                      <div className="rounded-xl bg-white p-2 border border-ink/5">
                        <span className="text-[10px] text-ink/40 uppercase font-bold block">Food Temp</span>
                        <span className="font-bold text-tomato flex items-center gap-1">
                          <Flame size={12} /> {van.temp}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-bold text-ink/50 mb-1">
                        <span>Route Progress</span>
                        <span>{van.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
                        <div
                          className="h-full rounded-full bg-moss transition-all duration-500"
                          style={{ width: `${van.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE 2: DENSE LIST VIEW */}
        {/* ============================================================== */}
        {viewMode === 'list' && filteredBoxes.length > 0 && (
          <div className="mt-10 overflow-hidden rounded-[30px] border border-ink/10 bg-white shadow-soft">
            <div className="divide-y divide-ink/10">
              {filteredBoxes.map((box) => {
                const isAllocated = box.quantityAvailable <= 0;
                const isSaved = savedIds.includes(box.id);

                return (
                  <div
                    key={box.id}
                    className="group flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition hover:bg-cream/40"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl bg-cream">
                        <Image
                          src={box.imageUrl}
                          alt={box.name}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleSave(box.id, e)}
                          className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-ink shadow-xs cursor-pointer"
                        >
                          <Heart
                            size={12}
                            className={isSaved ? 'fill-tomato text-tomato' : 'text-ink/40'}
                          />
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-moss/10 px-2.5 py-0.5 text-[10px] font-bold text-moss">
                            {box.category}
                          </span>
                          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-semibold text-ink/70">
                            {box.zone}
                          </span>
                          {box.dietaryType && (
                            <span className="rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold text-moss">
                              {box.dietaryType}
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => onOpen(box)}
                          className="mt-1 font-display text-base font-black text-ink hover:text-moss cursor-pointer truncate"
                        >
                          {box.name}
                        </h3>

                        <p className="text-xs text-ink/60 truncate">
                          {box.venueName} • Ready: {formatTime(box.pickupStart)} – {formatTime(box.pickupEnd)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-ink/5">
                      <div className="text-left sm:text-right">
                        <span className="block font-black text-moss text-sm">
                          Feeds {box.servings} People
                        </span>
                        <span className="text-[11px] font-semibold text-ink/50">
                          {box.quantityAvailable} batch available
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpen(box)}
                          className="secondary-button px-3 py-2 text-xs"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onReserve(box)}
                          disabled={isAllocated}
                          className="primary-button px-4 py-2 text-xs"
                        >
                          {isAllocated ? 'Delivered' : 'Claim Batch'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE 3: RICH CARDS GRID (DEFAULT) */}
        {/* ============================================================== */}
        {viewMode === 'grid' && filteredBoxes.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBoxes.map((box) => {
              const isAllocated = box.quantityAvailable <= 0;
              const isSaved = savedIds.includes(box.id);

              return (
                <article
                  key={box.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-[30px] border border-ink/10 bg-white shadow-xs transition duration-300 hover:-translate-y-1.5 hover:shadow-soft"
                >
                  {/* Image & Top Overlays */}
                  <div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpen(box)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') onOpen(box);
                      }}
                      className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-cream"
                      aria-label={`View details for ${box.name}`}
                    >
                      <Image
                        src={box.imageUrl}
                        alt={box.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                      {/* Top Badges */}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-ink uppercase backdrop-blur-xs">
                          {box.category}
                        </span>
                        <span className="rounded-full bg-ink/80 px-2 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-xs">
                          {box.zone}
                        </span>
                        {isAllocated && (
                          <span className="rounded-full bg-tomato px-2.5 py-1 text-[10px] font-extrabold text-white uppercase">
                            Delivered to Shelter
                          </span>
                        )}
                      </div>

                      {/* Interactive Bookmark Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleSave(box.id, e)}
                        className={`absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition cursor-pointer ${
                          isSaved
                            ? 'bg-white text-tomato shadow-md scale-110'
                            : 'bg-white/80 text-ink/60 hover:bg-white hover:text-tomato'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save batch'}
                      >
                        <Heart size={15} className={isSaved ? 'fill-tomato' : ''} />
                      </button>

                      {/* Temperature Verification Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-ink backdrop-blur-xs">
                        <Flame size={11} className="text-tomato" />
                        <span>{box.temperatureVerified}</span>
                      </div>

                      {/* Servings Pill */}
                      <div className="absolute bottom-3 right-3 rounded-full bg-moss px-3 py-1 text-xs font-black text-white shadow-sm flex items-center gap-1">
                        <Users size={12} /> Feeds {box.servings}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-moss">
                            {box.partnerName}
                          </p>
                          <h3
                            onClick={() => onOpen(box)}
                            className="mt-1 font-display text-lg font-black tracking-tight text-ink group-hover:text-moss transition cursor-pointer"
                          >
                            {box.name}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/60">
                        {box.description}
                      </p>

                      {/* Tags & Dietary badges */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="rounded-lg bg-cream px-2 py-0.5 font-semibold text-ink/70">
                          {box.cuisineType}
                        </span>
                        {box.dietaryType && (
                          <span className="rounded-lg bg-sage/60 px-2 py-0.5 font-bold text-moss">
                            {box.dietaryType}
                          </span>
                        )}
                        {box.distanceKm && (
                          <span className="rounded-lg bg-ink/5 px-2 py-0.5 font-semibold text-ink/60 flex items-center gap-1">
                            <Navigation size={10} /> {box.distanceKm} km
                          </span>
                        )}
                      </div>

                      {/* Target Beneficiary Shelter */}
                      <div className="mt-2.5 rounded-xl bg-sage/40 px-3 py-1.5 text-[11px] font-semibold text-moss">
                        🎯 Target: {box.beneficiaryTarget}
                      </div>

                      {/* Ready Time & Venue */}
                      <div className="mt-3 flex flex-col gap-1 text-xs text-ink/60">
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={13} className="text-moss shrink-0" />
                          Ready: {formatTime(box.pickupStart)} – {formatTime(box.pickupEnd)}
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin size={13} className="text-moss shrink-0" />
                          {box.venueName}, {box.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="border-t border-ink/10 p-5 pt-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpen(box)}
                          className="flex items-center gap-1 text-xs font-bold text-ink/60 transition hover:text-moss cursor-pointer"
                        >
                          <Info size={14} /> Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShare(box)}
                          className="flex items-center gap-1 text-xs font-medium text-ink/40 transition hover:text-moss cursor-pointer"
                          title="Share batch details"
                        >
                          {copiedId === box.id ? <Check size={13} className="text-moss" /> : <Share2 size={13} />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onReserve(box)}
                        disabled={isAllocated}
                        className="primary-button px-4 py-2 text-xs cursor-pointer"
                      >
                        {isAllocated ? 'Delivered' : (
                          <>
                            Claim for Shelter <ArrowRight size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state when no matches */}
        {filteredBoxes.length === 0 && (
          <div className="mt-12 rounded-[32px] border border-dashed border-ink/20 bg-white/70 px-6 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cream text-ink/40">
              <Filter size={24} />
            </div>
            <h3 className="mt-4 font-display text-2xl font-black text-ink">
              No matching surplus food batches found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
              No food batches match your currently selected dropdown criteria. Try relaxing your dietary, zone, or timing filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="secondary-button mt-6 text-xs cursor-pointer"
            >
              <RotateCcw size={14} /> Clear All {activeFilterCount} Active Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
