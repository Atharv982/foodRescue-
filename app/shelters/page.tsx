'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import InteractiveMap, { MapItem } from '@/components/InteractiveMap';
import { sheltersData } from '@/lib/directory-data';
import type { Shelter } from '@/types/directory';
import {
  Heart,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Phone,
  LayoutGrid,
  Map as MapIcon,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function SheltersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapItem, setSelectedMapItem] = useState<MapItem | null>(null);

  const filteredShelters = useMemo(() => {
    return sheltersData.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchArea = s.neighborhood.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
        if (!matchName && !matchArea) return false;
      }

      if (selectedCategory !== 'All' && s.category !== selectedCategory) {
        return false;
      }

      if (selectedZone !== 'All Zones' && s.zone !== selectedZone) {
        return false;
      }

      if (selectedUrgency !== 'All' && s.urgencyLevel !== selectedUrgency) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedZone, selectedUrgency]);

  const mapItems: MapItem[] = useMemo(() => {
    return filteredShelters.map((s) => ({
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
    }));
  }, [filteredShelters]);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

      <SubpageHeader
        breadcrumbs={[{ label: 'Shelters & NGOs' }]}
        eyebrow="Verified Recipient Centers · Greater Mumbai"
        title="Partner Shelters & Relief Homes"
        badge={`${filteredShelters.length} Verified Shelters`}
        theme="shelter"
        description="Verified orphanages, destitute care homes, night shelters for the homeless, and community kitchens receiving hot wedding and banquet feasts across Mumbai."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-2xl border border-ink/10 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-shelter text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                }`}
              >
                <LayoutGrid size={14} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'map' ? 'bg-shelter text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                }`}
              >
                <MapIcon size={14} /> Map
              </button>
            </div>

            <Link
              href="/batches"
              className="primary-button text-xs py-2.5 px-4"
            >
              <Sparkles size={14} /> View Available Food Batches
            </Link>
          </div>
        }
      />

      <div className="section-shell py-10 lg:py-14">
        {/* Filter Bar */}
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm space-y-4 mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                placeholder="Search shelter or area..."
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
                <option value="All Zones">All Mumbai Zones</option>
                <option value="Western Suburbs">Western Suburbs</option>
                <option value="South Mumbai">South Mumbai</option>
                <option value="Central Mumbai">Central Mumbai</option>
                <option value="Eastern Suburbs">Eastern Suburbs</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="All">All Shelter Categories</option>
                <option value="Children Orphanage">Children Orphanages</option>
                <option value="Night Homeless Shelter">Night Homeless Shelters</option>
                <option value="Destitute Elders Care">Destitute Elders Care</option>
                <option value="Community Slum Kitchen">Community Slum Kitchens</option>
                <option value="Women & Child Relief Home">Women & Child Relief Homes</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
              >
                <option value="All">All Urgency Levels</option>
                <option value="Immediate Need">Immediate Need</option>
                <option value="High Need">High Need</option>
                <option value="Regular Schedule">Regular Schedule</option>
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
              Displaying {mapItems.length} verified shelters on Mumbai map. Red pins indicate verified recipient homes.
            </p>
          </div>
        ) : (
          <div>
            {filteredShelters.length === 0 ? (
              <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center">
                <Heart size={40} className="mx-auto text-ink/30 mb-3" />
                <h3 className="font-display text-lg font-bold text-ink">No Shelters Found</h3>
                <p className="mt-1 text-sm text-ink/60 max-w-md mx-auto">
                  No recipient centers match your current filter settings.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredShelters.map((shelter) => (
                  <div
                    key={shelter.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-[32px] border border-ink/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover hover:border-shelter/30"
                  >
                    <div>
                      {/* Photo Header */}
                      <div className="relative h-48 w-full overflow-hidden bg-cream">
                        {shelter.featuredImage ? (
                          <img
                            src={shelter.featuredImage}
                            alt={shelter.name}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center bg-shelter-light text-shelter">
                            <Heart size={36} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Badges on image */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="rounded-full bg-shelter-light px-2.5 py-0.5 text-[10px] font-black text-shelter border border-shelter-border uppercase backdrop-blur-md">
                            {shelter.category}
                          </span>
                          <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-forest flex items-center gap-1 shadow-2xs">
                            <CheckCircle2 size={11} /> Verified NGO
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-xs font-bold drop-shadow-md flex items-center gap-1">
                            <MapPin size={12} /> {shelter.neighborhood}
                          </span>
                          <span className="text-[11px] font-extrabold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                            {shelter.mealsReceived.toLocaleString('en-IN')} Meals Received
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <h3 className="font-display text-lg font-black text-evergreen leading-snug group-hover:text-shelter transition">
                          {shelter.name}
                        </h3>

                        <p className="mt-2 text-xs leading-relaxed text-charcoal/70 line-clamp-2">
                          {shelter.description}
                        </p>

                        {/* Shelter Metrics */}
                        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-cream/50 p-3 text-xs border border-ink/5">
                          <div>
                            <span className="text-[10px] font-bold text-ink/40 uppercase block">Residents</span>
                            <span className="font-black text-evergreen flex items-center gap-1">
                              <Users size={12} className="text-shelter" /> {shelter.beneficiaryCount} People
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-ink/40 uppercase block">Daily Requirement</span>
                            <span className="font-black text-coral">{shelter.dailyRequirementServings} Servings</span>
                          </div>
                        </div>

                        {/* Food Preferences Chips */}
                        <div className="mt-4">
                          <span className="text-[10px] font-bold text-ink/40 uppercase block mb-1.5">
                            Priority Food Allocations:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {shelter.mealPreferences.map((pref, i) => (
                              <span
                                key={i}
                                className="rounded-lg bg-cream px-2 py-0.5 text-[10px] font-semibold text-ink/75"
                              >
                                {pref}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Address & Contact */}
                        <div className="mt-4 pt-3 border-t border-ink/5 space-y-1 text-xs text-ink/70">
                          <p className="text-[11px] text-ink/60 truncate">
                            📍 {shelter.address}
                          </p>
                          <p className="text-[11px] text-ink/60">
                            👤 {shelter.contactPerson} · <strong>{shelter.contactPhone}</strong>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 pt-0 flex items-center gap-2">
                      <a
                        href={shelter.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-shelter px-4 py-2.5 text-xs font-bold text-white transition hover:bg-shelter-dark flex-1 text-center flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink size={13} /> Open in Google Maps
                      </a>
                      <a
                        href={shelter.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-ink/10 bg-cream/40 p-2.5 text-ink transition hover:bg-cream"
                        title="Get Turn-by-Turn Directions"
                      >
                        <Navigation size={16} className="text-shelter" />
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
