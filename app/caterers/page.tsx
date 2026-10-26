'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import InteractiveMap, { MapItem } from '@/components/InteractiveMap';
import { caterersData } from '@/lib/directory-data';
import type { Caterer } from '@/types/directory';
import {
  Utensils,
  MapPin,
  Users,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Navigation,
  ArrowRight,
  Sparkles,
  Phone,
  LayoutGrid,
  Map as MapIcon,
  Award
} from 'lucide-react';

export default function CaterersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapItem, setSelectedMapItem] = useState<MapItem | null>(null);

  const filteredCaterers = useMemo(() => {
    return caterersData.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchSpec = c.specialties.some((s) => s.toLowerCase().includes(q));
        const matchArea = c.serviceAreas.some((a) => a.toLowerCase().includes(q)) || c.neighborhood.toLowerCase().includes(q);
        if (!matchName && !matchSpec && !matchArea) return false;
      }

      if (selectedCuisine !== 'All' && !c.cuisineTypes.includes(selectedCuisine)) {
        return false;
      }

      if (selectedZone !== 'All Zones' && c.zone !== selectedZone) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCuisine, selectedZone]);

  const mapItems: MapItem[] = useMemo(() => {
    return filteredCaterers.map((c) => ({
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
      badge: `${c.capacityPerEvent} Max Guests`,
    }));
  }, [filteredCaterers]);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

      <SubpageHeader
        breadcrumbs={[{ label: 'Caterers Directory' }]}
        eyebrow="Mumbai Celebration & Banquet Chefs"
        title="Wedding Caterers Directory"
        badge={`${filteredCaterers.length} Certified Caterers`}
        theme="food"
        description="Discover professional wedding caterers, banquet chefs, and culinary teams across Mumbai certified for zero-waste surplus management and FoodRescue redistribution."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-2xl border border-ink/10 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-forest text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                }`}
              >
                <LayoutGrid size={14} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'map' ? 'bg-forest text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                }`}
              >
                <MapIcon size={14} /> Map
              </button>
            </div>

            <Link
              href="/partner-register?type=caterer"
              className="primary-button text-xs py-2.5 px-4"
            >
              <Sparkles size={14} /> Register as Caterer
            </Link>
          </div>
        }
      />

      <div className="section-shell py-10 lg:py-14">
        {/* Filters */}
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm space-y-4 mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                placeholder="Search caterer, specialty, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 pl-10 pr-4 py-2.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden focus:border-moss"
              />
            </div>

            {/* Zone */}
            <div>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="All Zones">All Service Regions</option>
                <option value="Western Suburbs">Western Suburbs</option>
                <option value="South Mumbai">South Mumbai</option>
                <option value="Central Mumbai">Central Mumbai</option>
                <option value="Eastern Suburbs">Eastern Suburbs</option>
              </select>
            </div>

            {/* Cuisine */}
            <div>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="All">All Cuisine Specialties</option>
                <option value="North Indian">North Indian & Awadhi</option>
                <option value="Mughlai">Mughlai Dum Biryani</option>
                <option value="Rajasthani">Rajasthani Thali</option>
                <option value="Gujarati">Gujarati Pure Veg</option>
                <option value="Maharashtrian">Maharashtrian Pangat</option>
                <option value="Continental">Continental & Live Counters</option>
              </select>
            </div>
          </div>
        </div>

        {/* View Mode: Map vs Grid */}
        {viewMode === 'map' ? (
          <div className="space-y-6">
            <InteractiveMap
              items={mapItems}
              selectedItem={selectedMapItem}
              onSelectItem={setSelectedMapItem}
              heightClass="h-[600px]"
            />
            <p className="text-xs text-ink/60 text-center">
              Displaying {mapItems.length} verified caterers on Mumbai map. Click any pin to inspect kitchen profile or get directions.
            </p>
          </div>
        ) : (
          <div>
            {filteredCaterers.length === 0 ? (
              <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center">
                <Utensils size={40} className="mx-auto text-ink/30 mb-3" />
                <h3 className="font-display text-lg font-bold text-ink">No Caterers Found</h3>
                <p className="mt-1 text-sm text-ink/60 max-w-md mx-auto">
                  No wedding caterers match your current criteria. Try expanding your search.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCaterers.map((caterer) => (
                  <div
                    key={caterer.id}
                    className="group flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-5 shadow-sm transition hover:shadow-xl hover:border-moss/30"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-ink/5 mb-4">
                        <img
                          src={caterer.featuredImage}
                          alt={caterer.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                            {caterer.cuisineTypes[0]}
                          </span>
                          <span className="rounded-full bg-moss/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md flex items-center gap-1">
                            <CheckCircle2 size={11} /> Certified
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-black text-ink shadow-sm backdrop-blur-md flex items-center gap-1">
                            <Users size={12} className="text-moss" /> Up to {caterer.capacityPerEvent.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between text-xs text-ink/60 mb-1">
                        <span className="font-bold text-moss">{caterer.zone}</span>
                        <span>{caterer.eventsServedCount}+ Events Catered</span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-ink group-hover:text-moss transition leading-snug">
                        {caterer.name}
                      </h3>

                      {/* Specialties Pill List */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {caterer.specialties.slice(0, 3).map((spec, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-cream/80 px-2 py-0.5 text-[10px] font-medium text-ink/80"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 space-y-1.5 text-xs text-ink/70">
                        <div className="flex items-start gap-1.5">
                          <MapPin size={13} className="text-tomato shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{caterer.address}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Award size={13} className="text-moss shrink-0" />
                          <span className="font-semibold text-moss">
                            {caterer.totalMealsRescued.toLocaleString('en-IN')}+ Meals Rescued
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-2 pt-3 border-t border-ink/5">
                      <Link
                        href={`/caterers/${caterer.id}`}
                        className="rounded-2xl bg-[#285C45] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#193D30] flex-1 text-center"
                      >
                        View Details
                      </Link>
                      <a
                        href={caterer.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-ink/10 bg-cream/40 px-3 py-2.5 text-xs font-bold text-[#202823] transition hover:bg-cream flex items-center gap-1.5 shrink-0"
                        title="View on Google Maps"
                      >
                        <Navigation size={13} className="text-[#285C45]" />
                        <span>View on Map</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
