'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import LiveRescueMap, { LiveMapCategory, LiveMapEntity } from '@/components/LiveRescueMap';
import { venuesData, caterersData, sheltersData } from '@/lib/directory-data';
import { foodBoxes } from '@/lib/food-data';
import {
  getNearbyShelterMatches,
  calculateHaversineDistance,
  initialDrivers,
  initialPickups,
} from '@/lib/logistics-client';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Utensils,
  Heart,
  Truck,
  Package,
  SlidersHorizontal,
  ExternalLink,
  Navigation,
  Sparkles,
  Phone,
  Mail,
  Clock3,
  ShieldCheck,
  CheckCircle2,
  Route,
  ArrowRight,
  LocateFixed,
  X,
  Compass
} from 'lucide-react';

function LiveMapContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LiveMapCategory>('all');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [distanceRadiusKm, setDistanceRadiusKm] = useState<number>(0); // 0 = all
  const [selectedEntity, setSelectedEntity] = useState<LiveMapEntity | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocating, setUserLocating] = useState(false);

  // Shelter Match Modal State
  const [matchingDonation, setMatchingDonation] = useState<LiveMapEntity | null>(null);
  const [shelterMatches, setShelterMatches] = useState<any[]>([]);
  const [journeys, setJourneys] = useState(initialPickups);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const res = await fetch('/api/pickups');
        const data = await res.json();
        if (data.success && Array.isArray(data.journeys)) {
          setJourneys(data.journeys);
        }
      } catch {
        // quiet fallback
      }
    };
    fetchJourneys();
  }, []);

  // Active Route State
  const [activeRoute, setActiveRoute] = useState<{
    originName: string;
    originLat: number;
    originLng: number;
    destName: string;
    destLat: number;
    destLng: number;
    distanceKm: number;
    estimatedMins: number;
  } | null>(null);

  // Compile all entities across the application
  const allEntities: LiveMapEntity[] = useMemo(() => {
    const list: LiveMapEntity[] = [];

    // 1. Venues
    venuesData.forEach((v) => {
      list.push({
        id: v.id,
        name: v.name,
        category: 'venue',
        categoryLabel: 'Wedding Venue',
        address: v.address,
        neighborhood: v.neighborhood,
        zone: v.zone,
        lat: v.lat,
        lng: v.lng,
        contactPhone: v.contactPhone,
        contactEmail: v.contactEmail,
        website: v.website,
        imageUrl: v.featuredImage,
        googleMapsUrl: v.googleMapsUrl,
        directionsUrl: v.directionsUrl,
        capacity: v.capacity,
        foodSafetyRating: v.foodSafetyRating,
        badge: `${v.capacity} Guests`,
        status: 'Active Partner',
      });
    });

    // 2. Caterers
    caterersData.forEach((c) => {
      list.push({
        id: c.id,
        name: c.name,
        category: 'caterer',
        categoryLabel: 'Catering Kitchen',
        address: c.address,
        neighborhood: c.neighborhood,
        zone: c.zone,
        lat: c.lat,
        lng: c.lng,
        contactPhone: c.contactPhone,
        contactEmail: c.contactEmail,
        website: c.website,
        imageUrl: c.featuredImage,
        googleMapsUrl: c.googleMapsUrl,
        directionsUrl: c.directionsUrl,
        badge: `${c.capacityPerEvent} Feasts`,
        status: 'FSSAI Certified',
      });
    });

    // 3. Shelters & NGOs
    sheltersData.forEach((s) => {
      list.push({
        id: s.id,
        name: s.name,
        category: 'shelter',
        categoryLabel: s.category,
        address: s.address,
        neighborhood: s.neighborhood,
        zone: s.zone,
        lat: s.lat,
        lng: s.lng,
        contactPhone: s.contactPhone,
        googleMapsUrl: s.googleMapsUrl,
        directionsUrl: s.directionsUrl,
        beneficiaryCount: s.beneficiaryCount,
        dailyRequirement: s.dailyRequirementServings,
        urgencyLevel: s.urgencyLevel,
        badge: `${s.beneficiaryCount} Residents`,
        status: s.urgencyLevel,
      });
    });

    // 4. Available Food Donations (from foodBoxes)
    foodBoxes.forEach((b) => {
      // Find matching venue coordinates or approximate based on zone
      const venue = venuesData.find((v) => v.name.toLowerCase().includes(b.partnerName.toLowerCase()));
      const lat = venue ? venue.lat : b.zone === 'Western Suburbs' ? 19.14 : b.zone === 'South Mumbai' ? 18.96 : 19.11;
      const lng = venue ? venue.lng : b.zone === 'Western Suburbs' ? 72.84 : b.zone === 'South Mumbai' ? 72.82 : 72.90;

      list.push({
        id: `box-${b.id}`,
        name: `${b.name} (${b.servings} Servings)`,
        category: 'donation',
        categoryLabel: 'Surplus Banquet Feast',
        address: b.location,
        neighborhood: b.venueName,
        zone: b.zone,
        lat,
        lng,
        imageUrl: b.imageUrl,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        servings: b.servings,
        estimatedKg: Math.round(b.servings * 0.45),
        dietaryType: b.dietaryType || 'Pure Vegetarian',
        foodDescription: b.includedItems.join(', '),
        pickupTimeWindow: `${b.pickupStart} – ${b.pickupEnd}`,
        collectionDeadline: b.pickupEnd,
        badge: `${b.servings} Meals`,
        status: 'Available Tonight',
      });
    });

    // 5. Active Vehicles & In-Transit Pickups
    const drivers = initialDrivers;

    drivers.forEach((d) => {
      if (d.status === 'on_delivery' || d.status === 'on_pickup') {
        const assignedJourney = journeys.find((j) => j.assignedDriverId === d.id && j.status !== 'delivery_confirmed');

        list.push({
          id: `veh-${d.id}`,
          name: `Rescue Van: ${d.name} (${d.vehiclePlate})`,
          category: 'vehicle',
          categoryLabel: d.vehicleType,
          address: assignedJourney ? assignedJourney.pickupAddress : 'Mumbai Transit Corridor',
          neighborhood: d.assignedZone,
          zone: d.assignedZone,
          lat: d.lastLocation.lat,
          lng: d.lastLocation.lng,
          contactPhone: d.phone,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${d.lastLocation.lat},${d.lastLocation.lng}`,
          directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${d.lastLocation.lat},${d.lastLocation.lng}`,
          driverName: d.name,
          driverPhone: d.phone,
          vehiclePlate: d.vehiclePlate,
          vehicleType: d.vehicleType,
          badge: d.status === 'on_delivery' ? 'En Route to Shelter' : 'En Route to Venue',
          status: 'Active Van',
          destinationShelterName: assignedJourney?.destinationShelterName,
          destinationLat: assignedJourney?.destinationLat,
          destinationLng: assignedJourney?.destinationLng,
        });
      }
    });

    return list;
  }, []);

  // Filter entities according to search, category, zone, and distance radius
  const filteredEntities = useMemo(() => {
    return allEntities.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Zone filter
      if (selectedZone !== 'All Zones' && item.zone !== selectedZone) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesAddress = item.address.toLowerCase().includes(q);
        const matchesNeighborhood = item.neighborhood.toLowerCase().includes(q);
        const matchesDesc = item.foodDescription ? item.foodDescription.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesAddress && !matchesNeighborhood && !matchesDesc) {
          return false;
        }
      }

      // Distance Radius Filter (if user location is available and radius selected)
      if (distanceRadiusKm > 0 && userLocation) {
        const dist = calculateHaversineDistance(userLocation.lat, userLocation.lng, item.lat, item.lng);
        if (dist > distanceRadiusKm) return false;
      }

      return true;
    });
  }, [allEntities, selectedCategory, selectedZone, searchQuery, distanceRadiusKm, userLocation]);

  // Request User GPS Location
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setUserLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setUserLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback to central Bandra if denied/offline
        setUserLocation({ lat: 19.055, lng: 72.84 });
        setUserLocating(false);
      }
    );
  };

  // Find suitable shelters for a donation or venue
  const handleOpenShelterMatching = (entity: LiveMapEntity) => {
    const servings = entity.servings || 80;
    const dietary = entity.dietaryType || 'Pure Vegetarian';
    const matches = getNearbyShelterMatches(entity.lat, entity.lng, servings, dietary);
    setMatchingDonation(entity);
    setShelterMatches(matches);
  };

  // Plot route between origin and shelter on map
  const handlePlotRoute = (origin: LiveMapEntity, shelter: any) => {
    const dist = calculateHaversineDistance(origin.lat, origin.lng, shelter.lat, shelter.lng);
    const mins = shelter.estimatedTravelMins || Math.round((dist / 20) * 60 + 8);

    setActiveRoute({
      originName: origin.name,
      originLat: origin.lat,
      originLng: origin.lng,
      destName: shelter.shelterName,
      destLat: shelter.lat,
      destLng: shelter.lng,
      distanceKm: dist,
      estimatedMins: mins,
    });

    setMatchingDonation(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#202823]">
      <Navbar />

      <SubpageHeader
        theme="logistics"
        breadcrumbs={[{ label: 'Rescue Hub', href: '/rescue-hub' }, { label: 'Live Rescue Map' }]}
        eyebrow="Interactive Telemetry & Discovery"
        title="Food Rescue Live Map"
        badge="Live Fleet & Donors"
        description="Explore verified wedding banquet halls, catering surplus batches, recipient orphanages, and active thermal rescue vans across Greater Mumbai."
      />

      <div className="section-shell py-8 lg:py-12 space-y-6">
        {/* ============================================================== */}
        {/* CONTROLS HEADER BAR: SEARCH, CATEGORY, ZONE, GPS */}
        {/* ============================================================== */}
        <div className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-soft space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                placeholder="Search venue names, caterers, orphanages, neighborhoods, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 pl-11 pr-4 py-3 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Zone Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-3 text-xs font-bold text-ink outline-hidden focus:border-moss cursor-pointer"
              >
                <option value="All Zones">All Mumbai Zones</option>
                <option value="Western Suburbs">Western Suburbs (Bandra–Goregaon)</option>
                <option value="South Mumbai">South Mumbai (Colaba–Worli)</option>
                <option value="Central Mumbai">Central Mumbai (Dadar–Kurla)</option>
                <option value="Eastern Suburbs">Eastern Suburbs (Powai–Ghatkopar)</option>
                <option value="Thane & Navi Mumbai">Thane & Navi Mumbai</option>
              </select>

              {/* Distance Radius Filter */}
              <select
                value={distanceRadiusKm}
                onChange={(e) => setDistanceRadiusKm(Number(e.target.value))}
                className="rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-3 text-xs font-bold text-ink outline-hidden focus:border-moss cursor-pointer"
              >
                <option value={0}>Distance: All Mumbai</option>
                <option value={2}>Within 2 km Radius</option>
                <option value={5}>Within 5 km Radius</option>
                <option value={10}>Within 10 km Radius</option>
                <option value={25}>Within 25 km Corridor</option>
              </select>

              {/* GPS Geolocation Button */}
              <button
                type="button"
                onClick={handleRequestLocation}
                disabled={userLocating}
                className="rounded-2xl border border-ink/10 bg-white px-3.5 py-3 text-xs font-bold text-ink hover:bg-cream transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <LocateFixed size={14} className={userLocation ? 'text-moss' : 'text-ink/60'} />
                <span>{userLocation ? 'Near Me (GPS Active)' : 'Locate Me'}</span>
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-ink/5">
            {[
              { id: 'all', label: 'All Pins', icon: Compass, count: allEntities.length },
              { id: 'venue', label: 'Wedding Venues', icon: Building2, count: venuesData.length },
              { id: 'caterer', label: 'Caterers', icon: Utensils, count: caterersData.length },
              { id: 'donation', label: 'Available Surplus', icon: Package, count: foodBoxes.length },
              { id: 'shelter', label: 'Shelters & NGOs', icon: Heart, count: sheltersData.length },
              { id: 'vehicle', label: 'Active Rescue Vans', icon: Truck, count: 2 },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as LiveMapCategory)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-moss text-white shadow-xs'
                      : 'bg-cream/60 text-ink/75 hover:bg-cream hover:text-ink'
                  }`}
                >
                  <Icon size={13} />
                  <span>{cat.label}</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-ink/5 text-ink/50'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE MAP CONTAINER */}
        {/* ============================================================== */}
        <LiveRescueMap
          entities={filteredEntities}
          selectedEntity={selectedEntity}
          onSelectEntity={(ent) => setSelectedEntity(ent)}
          userLocation={userLocation}
          activeRoute={activeRoute}
          onClearRoute={() => setActiveRoute(null)}
          onFindSheltersForEntity={handleOpenShelterMatching}
        />

        {/* ============================================================== */}
        {/* SELECTED ENTITY DETAIL DRAWER / ACTION CARD */}
        {/* ============================================================== */}
        {selectedEntity && (
          <div className="rounded-[32px] border border-moss/30 bg-white p-6 sm:p-8 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Left Column: Image & Core Info */}
              <div className="flex items-start gap-4">
                {selectedEntity.imageUrl ? (
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden shrink-0 border border-ink/10">
                    <img
                      src={selectedEntity.imageUrl}
                      alt={selectedEntity.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-moss/10 text-moss shrink-0">
                    {selectedEntity.category === 'shelter' ? (
                      <Heart size={28} />
                    ) : selectedEntity.category === 'donation' ? (
                      <Package size={28} />
                    ) : selectedEntity.category === 'vehicle' ? (
                      <Truck size={28} />
                    ) : (
                      <Building2 size={28} />
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sage/60 px-2.5 py-0.5 text-[10px] font-black text-moss uppercase">
                      {selectedEntity.categoryLabel}
                    </span>
                    {selectedEntity.status && (
                      <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold text-ink/60">
                        {selectedEntity.status}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-ink">
                    {selectedEntity.name}
                  </h3>
                  <p className="text-xs text-ink/70 flex items-center gap-1">
                    <MapPin size={13} className="text-moss shrink-0" />
                    <span>{selectedEntity.address} ({selectedEntity.zone})</span>
                  </p>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* Find Matching Shelter (For Food Donations or Venues) */}
                {(selectedEntity.category === 'donation' || selectedEntity.category === 'venue') && (
                  <button
                    type="button"
                    onClick={() => handleOpenShelterMatching(selectedEntity)}
                    className="rounded-2xl bg-moss px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#224433] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={14} /> Find Matching Shelters
                  </button>
                )}

                {/* Direct Google Maps Navigation */}
                <a
                  href={selectedEntity.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-xs font-bold text-ink hover:bg-cream transition flex items-center gap-1.5"
                >
                  <Navigation size={13} className="text-moss" /> Get Directions <ExternalLink size={11} />
                </a>

                {/* Open in Google Maps */}
                <a
                  href={selectedEntity.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-xs font-bold text-ink hover:bg-cream transition flex items-center gap-1.5"
                >
                  <span>Google Maps</span> <ExternalLink size={11} />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedEntity(null)}
                  className="rounded-2xl border border-ink/10 p-2.5 text-ink/50 hover:bg-cream transition cursor-pointer"
                  title="Close Details"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Extended Details Grid */}
            <div className="mt-5 pt-4 border-t border-ink/10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              {/* Donation Details */}
              {selectedEntity.servings && (
                <div className="rounded-2xl bg-cream/50 p-3.5 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-ink/40">Surplus Food Quantity</span>
                  <p className="font-black text-moss text-sm">
                    {selectedEntity.servings} Meals ({selectedEntity.estimatedKg} kg)
                  </p>
                  <p className="text-[11px] text-ink/70">{selectedEntity.dietaryType}</p>
                </div>
              )}

              {/* Pickup Time Window */}
              {selectedEntity.pickupTimeWindow && (
                <div className="rounded-2xl bg-cream/50 p-3.5 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-ink/40">Pickup Window</span>
                  <p className="font-bold text-ink">{selectedEntity.pickupTimeWindow}</p>
                  <span className="text-[10px] text-tomato font-bold">⏱️ Handover Tonight</span>
                </div>
              )}

              {/* Shelter Beneficiaries */}
              {selectedEntity.beneficiaryCount && (
                <div className="rounded-2xl bg-cream/50 p-3.5 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-ink/40">Resident Beneficiaries</span>
                  <p className="font-black text-moss text-sm">{selectedEntity.beneficiaryCount} Residents</p>
                  <p className="text-[11px] text-ink/70">Daily requirement: {selectedEntity.dailyRequirement} meals</p>
                </div>
              )}

              {/* Contact Information */}
              {selectedEntity.contactPhone && (
                <div className="rounded-2xl bg-cream/50 p-3.5 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-ink/40">Direct Contact</span>
                  <p className="font-bold text-ink flex items-center gap-1">
                    <Phone size={11} className="text-moss" /> {selectedEntity.contactPhone}
                  </p>
                  {selectedEntity.contactEmail && (
                    <p className="text-[11px] text-ink/60 truncate">{selectedEntity.contactEmail}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* NEARBY SHELTER MATCHING MODAL / DRAWER */}
        {/* ============================================================== */}
        {matchingDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-2xl rounded-[32px] border border-ink/10 bg-white p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 border-b border-ink/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-moss/10 px-3 py-1 text-xs font-bold text-moss">
                    <Sparkles size={13} /> Nearby Shelter Matching Algorithm
                  </div>
                  <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-ink">
                    Top Recipient Shelters for {matchingDonation.name}
                  </h3>
                  <p className="text-xs text-ink/60 mt-0.5">
                    Ranked by Haversine distance, receiving capacity, dietary compatibility, and urgency level.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMatchingDonation(null)}
                  className="rounded-2xl border border-ink/10 p-2 text-ink/50 hover:bg-cream transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Ranked Candidate Shelters List */}
              <div className="space-y-3">
                {shelterMatches.map((match, idx) => (
                  <div
                    key={match.shelterId}
                    className="rounded-2xl border border-ink/10 bg-cream/30 p-4 hover:border-moss/40 hover:bg-cream/60 transition space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                          idx === 0 ? 'bg-moss text-white' : 'bg-ink/10 text-ink/70'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-ink">{match.shelterName}</h4>
                          <span className="text-[10px] text-ink/50">{match.category} · {match.address}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="rounded-full bg-sage/60 px-2.5 py-0.5 text-xs font-black text-moss">
                          {match.matchScore}% Match
                        </span>
                        <span className="text-[10px] text-ink/60 block mt-0.5">
                          {match.distanceKm} km · ~{match.estimatedTravelMins} mins
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-ink/75 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-ink/5">
                      {match.matchExplanation}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2 text-[11px] text-ink/60">
                        <span>Capacity: <strong>{match.beneficiaryCount} beds</strong></span>
                        <span>·</span>
                        <span className="text-tomato font-bold">{match.urgencyLevel}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlotRoute(matchingDonation, match)}
                          className="rounded-xl bg-moss px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#224433] transition flex items-center gap-1 cursor-pointer"
                        >
                          <Route size={12} /> Plot Route on Map
                        </button>
                        <a
                          href={match.directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:bg-cream transition flex items-center gap-1"
                        >
                          <span>Directions</span> <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function LiveMapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center p-12 text-xs font-bold text-ink/50">
          Loading Food Rescue Live Map...
        </div>
      }
    >
      <LiveMapContent />
    </Suspense>
  );
}
