'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import InteractiveMap, { MapItem } from '@/components/InteractiveMap';
import { venuesData, caterersData, sheltersData } from '@/lib/directory-data';
import {
  MapPin,
  Navigation,
  Search,
  Filter,
  Building2,
  Utensils,
  Heart,
  SlidersHorizontal,
  ExternalLink,
  Compass,
  CheckCircle2,
  AlertCircle,
  LocateFixed,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function GlobalMapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'venue' | 'caterer' | 'shelter'>('all');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

  // Geolocation & Radius
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [locating, setLocating] = useState(false);

  // Combine all items into MapItem unified list
  const allMapItems: MapItem[] = useMemo(() => {
    const list: MapItem[] = [];

    venuesData.forEach((v) => {
      list.push({
        id: v.id,
        name: v.name,
        type: 'venue',
        category: v.category,
        address: v.address,
        neighborhood: v.neighborhood,
        zone: v.zone,
        lat: v.lat,
        lng: v.lng,
        detailUrl: `/venues/${v.id}`,
        googleMapsUrl: v.googleMapsUrl,
        directionsUrl: v.directionsUrl,
        imageUrl: v.featuredImage,
        badge: `${v.capacity} Guests`,
      });
    });

    caterersData.forEach((c) => {
      list.push({
        id: c.id,
        name: c.name,
        type: 'caterer',
        category: c.cuisineTypes.join(', '),
        address: c.address,
        neighborhood: c.neighborhood,
        zone: c.zone,
        lat: c.lat,
        lng: c.lng,
        detailUrl: `/caterers/${c.id}`,
        googleMapsUrl: c.googleMapsUrl,
        directionsUrl: c.directionsUrl,
        imageUrl: c.featuredImage,
        badge: `${c.capacityPerEvent} Guests`,
      });
    });

    sheltersData.forEach((s) => {
      list.push({
        id: s.id,
        name: s.name,
        type: 'shelter',
        category: s.category,
        address: s.address,
        neighborhood: s.neighborhood,
        zone: s.zone,
        lat: s.lat,
        lng: s.lng,
        detailUrl: s.googleMapsUrl,
        googleMapsUrl: s.googleMapsUrl,
        directionsUrl: s.directionsUrl,
        badge: `${s.beneficiaryCount} Residents`,
      });
    });

    return list;
  }, []);

  // Distance helper (Haversine in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return allMapItems.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchArea = item.address.toLowerCase().includes(q) || item.neighborhood.toLowerCase().includes(q);
        if (!matchName && !matchArea) return false;
      }

      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      if (selectedZone !== 'All Zones' && item.zone !== selectedZone) {
        return false;
      }

      // Radius filter if user location is active
      if (userLocation) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng);
        if (dist > radiusKm) return false;
      }

      return true;
    });
  }, [allMapItems, searchQuery, selectedType, selectedZone, userLocation, radiusKm]);

  // Request user location explicitly
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your current browser.');
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location access was denied. You can still browse manually by selecting any Mumbai zone.');
        } else {
          setLocationError('Unable to detect location. Please use the zone dropdown filter.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const clearLocation = () => {
    setUserLocation(null);
    setLocationError(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

      <SubpageHeader
        breadcrumbs={[{ label: 'Discovery Map' }]}
        eyebrow="Interactive Regional Discovery · Greater Mumbai"
        title="Food Rescue Interactive Map"
        badge={`${filteredItems.length} Locations Active`}
        description="Explore verified wedding venues, banquet halls, catering culinary hubs, and recipient relief shelters physically located across Mumbai."
      />

      <div className="section-shell py-8 lg:py-12">
        {/* Banner to Full Live Telemetry Map */}
        <div className="mb-6 rounded-3xl border border-moss/30 bg-moss/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-moss text-white shrink-0">
              <Sparkles size={20} />
            </span>
            <div>
              <h3 className="font-bold text-ink text-sm">Experience the Food Rescue Live Telemetry Map</h3>
              <p className="text-ink/65 text-xs">Explore live food batches, active thermal rescue van positions, and intelligent shelter matching.</p>
            </div>
          </div>
          <Link
            href="/live-map"
            className="rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white hover:bg-[#224433] transition flex items-center justify-center gap-1.5 shrink-0"
          >
            Open Live Rescue Map <ArrowRight size={14} />
          </Link>
        </div>

        {/* Controls & Filter Bar */}
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm space-y-4 mb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                placeholder="Search venue, caterer, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 pl-10 pr-4 py-2.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden focus:border-moss"
              />
            </div>

            {/* Entity Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="all">All Directory Categories</option>
                <option value="venue">Wedding & Banquet Venues</option>
                <option value="caterer">Celebration Caterers</option>
                <option value="shelter">Recipient Shelters & NGOs</option>
              </select>
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

            {/* Location Button */}
            <div>
              {!userLocation ? (
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={locating}
                  className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-moss/30 bg-sage/20 px-3 py-2.5 text-xs font-bold text-moss hover:bg-sage/40 transition cursor-pointer"
                >
                  <LocateFixed size={14} className={locating ? 'animate-spin' : ''} />
                  <span>{locating ? 'Detecting Location...' : 'Use My Location'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="flex-1 rounded-2xl border border-moss/30 bg-sage/20 px-3 py-2.5 text-xs font-bold text-moss outline-hidden"
                  >
                    <option value="3">Within 3 km</option>
                    <option value="5">Within 5 km</option>
                    <option value="10">Within 10 km</option>
                    <option value="25">Within 25 km</option>
                  </select>
                  <button
                    type="button"
                    onClick={clearLocation}
                    className="rounded-2xl border border-ink/10 bg-cream px-3 py-2.5 text-xs font-bold text-ink/70 hover:bg-white"
                    title="Clear location filter"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Location error notice */}
          {locationError && (
            <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
              <AlertCircle size={15} className="shrink-0 text-amber-600" />
              <span>{locationError}</span>
            </div>
          )}
        </div>

        {/* Split View: Interactive Map on Left, Synchronized List on Right */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Map Section (8 Cols) */}
          <div className="lg:col-span-8">
            <InteractiveMap
              items={filteredItems}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              heightClass="h-[620px]"
            />
          </div>

          {/* Synchronized Side List (4 Cols) */}
          <div className="lg:col-span-4 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm space-y-3 h-[620px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-ink/5">
              <span className="text-xs font-bold text-ink">
                Results ({filteredItems.length})
              </span>
              <span className="text-[10px] text-ink/40 uppercase font-bold">
                Click to inspect pin
              </span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-ink/50">
                No matching locations in this area. Try clearing the search or widening the radius.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const typeBadge =
                    item.type === 'venue'
                      ? 'bg-moss/10 text-moss'
                      : item.type === 'caterer'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-tomato/15 text-tomato';

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-3 rounded-2xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-moss bg-sage/20 shadow-xs'
                          : 'border-ink/5 bg-cream/30 hover:bg-cream hover:border-ink/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${typeBadge}`}>
                          {item.type}
                        </span>
                        <span className="text-[10px] font-bold text-ink/50">{item.zone}</span>
                      </div>

                      <h4 className="text-xs font-bold text-ink leading-snug">{item.name}</h4>
                      <p className="text-[11px] text-ink/60 mt-0.5 line-clamp-1 flex items-center gap-1">
                        <MapPin size={11} className="text-tomato shrink-0" />
                        {item.address}
                      </p>

                      <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-ink/5">
                        <a
                          href={item.detailUrl}
                          className="text-[10px] font-bold text-moss hover:underline"
                        >
                          View Details →
                        </a>
                        <a
                          href={item.directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-ink/60 hover:text-ink ml-auto flex items-center gap-1"
                        >
                          <Navigation size={10} /> Directions
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
