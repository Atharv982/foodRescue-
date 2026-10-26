'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import InteractiveMap, { MapItem } from '@/components/InteractiveMap';
import { venuesData } from '@/lib/directory-data';
import type { Venue, VenueCategory, MumbaiZone } from '@/types/directory';
import {
  Building2,
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
  ShieldCheck,
  LayoutGrid,
  Map as MapIcon
} from 'lucide-react';

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapItem, setSelectedMapItem] = useState<MapItem | null>(null);

  const filteredVenues = useMemo(() => {
    return venuesData.filter((v) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchArea = v.neighborhood.toLowerCase().includes(q) || v.address.toLowerCase().includes(q);
        if (!matchName && !matchArea) return false;
      }

      if (selectedCategory !== 'All' && v.category !== selectedCategory) {
        return false;
      }

      if (selectedZone !== 'All Zones' && v.zone !== selectedZone) {
        return false;
      }

      if (minCapacity > 0 && v.capacity < minCapacity) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedZone, minCapacity]);

  // Transform venues into MapItems
  const mapItems: MapItem[] = useMemo(() => {
    return filteredVenues.map((v) => ({
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
    }));
  }, [filteredVenues]);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

      <SubpageHeader
        breadcrumbs={[{ label: 'Venues Directory' }]}
        eyebrow="Mumbai Wedding & Celebration Venues"
        title="Wedding Halls & Banquet Directory"
        badge={`${filteredVenues.length} Verified Partners`}
        theme="venue"
        description="Discover premier wedding halls, luxury banquet ballrooms, and hotel lawns across Greater Mumbai committed to zero-waste event surplus rescue."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-2xl border border-ink/10 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-venue text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                }`}
              >
                <LayoutGrid size={14} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'map' ? 'bg-venue text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                }`}
              >
                <MapIcon size={14} /> Map
              </button>
            </div>

            <Link
              href="/partner-register?type=venue"
              className="primary-button text-xs py-2.5 px-4"
            >
              <Sparkles size={14} /> List Your Venue
            </Link>
          </div>
        }
      />

      <div className="section-shell py-10 lg:py-14">
        {/* Filters Panel */}
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm space-y-4 mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                placeholder="Search venue or neighborhood..."
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

            {/* Venue Type */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="All">All Venue Types</option>
                <option value="Wedding Hall">Wedding Halls</option>
                <option value="Banquet Hall">Banquet Halls</option>
                <option value="Hotel & Resort">Hotels & Resorts</option>
                <option value="Lawn & Open Air">Lawns & Open Air</option>
                <option value="Convention Center">Convention Centers</option>
              </select>
            </div>

            {/* Capacity Filter */}
            <div>
              <select
                value={minCapacity}
                onChange={(e) => setMinCapacity(Number(e.target.value))}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="0">Any Guest Capacity</option>
                <option value="500">500+ Guests</option>
                <option value="800">800+ Guests</option>
                <option value="1200">1,200+ Guests</option>
                <option value="1500">1,500+ Guests</option>
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
              Displaying {mapItems.length} verified venues on Mumbai map. Click any pin to inspect details or get Google Maps directions.
            </p>
          </div>
        ) : (
          <div>
            {filteredVenues.length === 0 ? (
              <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center">
                <Building2 size={40} className="mx-auto text-ink/30 mb-3" />
                <h3 className="font-display text-lg font-bold text-ink">No Venues Found</h3>
                <p className="mt-1 text-sm text-ink/60 max-w-md mx-auto">
                  No wedding venues match your current filters. Try expanding your capacity range or zone.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVenues.map((venue) => (
                  <div
                    key={venue.id}
                    className="group flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-5 shadow-sm transition hover:shadow-xl hover:border-moss/30"
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-ink/5 mb-4">
                        <img
                          src={venue.featuredImage}
                          alt={venue.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                            {venue.category}
                          </span>
                          <span className="rounded-full bg-moss/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md flex items-center gap-1">
                            <CheckCircle2 size={11} /> Verified Partner
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-black text-ink shadow-sm backdrop-blur-md flex items-center gap-1">
                            <Users size={12} className="text-moss" /> Up to {venue.capacity}
                          </span>
                        </div>
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between text-xs text-ink/60 mb-1">
                        <span className="font-bold text-moss">{venue.zone}</span>
                        <span>{venue.totalMealsDonated.toLocaleString('en-IN')}+ Meals Donated</span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-ink group-hover:text-moss transition leading-snug">
                        {venue.name}
                      </h3>

                      <p className="mt-2 text-xs text-ink/65 line-clamp-2">
                        {venue.description}
                      </p>

                      <div className="mt-4 space-y-1.5 text-xs text-ink/70">
                        <div className="flex items-start gap-1.5">
                          <MapPin size={13} className="text-tomato shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{venue.address}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-moss shrink-0" />
                          <span className="font-semibold text-moss">{venue.foodSafetyRating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-2 pt-3 border-t border-ink/5">
                      <Link
                        href={`/venues/${venue.id}`}
                        className="rounded-2xl bg-[#285C45] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#193D30] flex-1 text-center"
                      >
                        View Details
                      </Link>
                      <a
                        href={venue.googleMapsUrl}
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
