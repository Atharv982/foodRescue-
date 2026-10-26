'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import { foodBoxes } from '@/lib/food-data';
import { venuesData, caterersData, sheltersData } from '@/lib/directory-data';
import type { MumbaiZone } from '@/types/directory';
import {
  MapPin,
  Building2,
  Utensils,
  Heart,
  Navigation,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Flame,
  Clock,
  Layers
} from 'lucide-react';

interface ZoneMeta {
  name: MumbaiZone;
  headline: string;
  neighborhoods: string[];
  keyCorridors: string;
  populationServed: string;
}

const ZONES_METADATA: ZoneMeta[] = [
  {
    name: 'Western Suburbs',
    headline: 'Highest wedding banquet concentration · Bandra to Borivali corridor',
    neighborhoods: ['Bandra West', 'Juhu Tara Road', 'Andheri East / West', 'Goregaon East', 'Vile Parle'],
    keyCorridors: 'Western Express Highway & SV Road',
    populationServed: 'Over 4.5 Million residents & 80+ banquet venues',
  },
  {
    name: 'South Mumbai',
    headline: 'Heritage ballrooms, elite lawns, and high-density destitute shelters',
    neighborhoods: ['Colaba', 'Worli Sea Face', 'Lower Parel', 'Byculla', 'Gamdevi', 'Grant Road'],
    keyCorridors: 'Marine Drive & Dr Annie Besant Road',
    populationServed: 'Over 3.1 Million residents & historic relief institutions',
  },
  {
    name: 'Central Mumbai',
    headline: 'Dadar cultural weddings, Shivaji Park lawns, and Dharavi community kitchens',
    neighborhoods: ['Dadar West', 'Prabhadevi', 'Shivaji Park', 'Kurla', 'Dharavi', 'Matunga'],
    keyCorridors: 'Senapati Bapat Marg & Central Railway Line',
    populationServed: 'Over 2.8 Million residents with vibrant community drives',
  },
  {
    name: 'Eastern Suburbs',
    headline: 'Corporate convention summits, Powai tech parks, and Ghatkopar banquet halls',
    neighborhoods: ['Powai Lake', 'Ghatkopar East', 'Vikhroli', 'Kanjurmarg', 'Mulund'],
    keyCorridors: 'Eastern Express Highway & JVLR',
    populationServed: 'Over 3.6 Million residents & lakeside convention facilities',
  },
  {
    name: 'Thane & Navi Mumbai',
    headline: 'Rapidly expanding destination wedding lawns and satellite relief hubs',
    neighborhoods: ['Thane West', 'Ghodbunder Road', 'Vashi', 'Nerul', 'Belapur'],
    keyCorridors: 'Thane-Belapur Road & Palm Beach Road',
    populationServed: 'Over 3.2 Million residents & sprawling suburban celebration lawns',
  },
];

export default function ZonesPage() {
  const [selectedZone, setSelectedZone] = useState<MumbaiZone>('Western Suburbs');
  const [activeTab, setActiveTab] = useState<'batches' | 'venues' | 'caterers' | 'shelters'>('batches');

  const currentZoneMeta = useMemo(() => {
    return ZONES_METADATA.find((z) => z.name === selectedZone) || ZONES_METADATA[0];
  }, [selectedZone]);

  // Regional data counts
  const regionalBatches = useMemo(() => {
    return foodBoxes.filter((b) => b.zone === selectedZone);
  }, [selectedZone]);

  const regionalVenues = useMemo(() => {
    return venuesData.filter((v) => v.zone === selectedZone);
  }, [selectedZone]);

  const regionalCaterers = useMemo(() => {
    return caterersData.filter((c) => c.zone === selectedZone);
  }, [selectedZone]);

  const regionalShelters = useMemo(() => {
    return sheltersData.filter((s) => s.zone === selectedZone);
  }, [selectedZone]);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar selectedZone={selectedZone} onSelectZone={(z) => setSelectedZone(z as MumbaiZone)} />

      <SubpageHeader
        breadcrumbs={[{ label: 'Zones & Regions' }]}
        eyebrow="Regional Food Rescue Corridors"
        title="Mumbai Regional Relief Zones"
        badge={selectedZone}
        description="Select your service region to inspect real-time surplus donations, partner wedding banquets, local catering chefs, and recipient shelter homes."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/map"
              className="rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition flex items-center gap-1.5"
            >
              <Navigation size={14} className="text-moss" />
              <span>Interactive Map</span>
            </Link>
          </div>
        }
      />

      <div className="section-shell py-10 lg:py-14 space-y-10">
        {/* Zone Selector Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ZONES_METADATA.map((z) => {
            const isSelected = selectedZone === z.name;
            const batchCount = foodBoxes.filter((b) => b.zone === z.name).length;
            const venueCount = venuesData.filter((v) => v.zone === z.name).length;

            return (
              <button
                key={z.name}
                type="button"
                onClick={() => setSelectedZone(z.name)}
                className={`p-4 rounded-3xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-moss bg-white shadow-md ring-2 ring-moss/20'
                    : 'border-ink/10 bg-white/70 hover:bg-white hover:border-moss/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <MapPin size={16} className={isSelected ? 'text-moss' : 'text-ink/40'} />
                    {isSelected && (
                      <span className="rounded-full bg-sage/60 px-2 py-0.5 text-[9px] font-black text-moss">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-sm font-bold text-ink">{z.name}</h3>
                  <p className="mt-1 text-[11px] text-ink/60 line-clamp-2">
                    {z.neighborhoods.slice(0, 3).join(', ')}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-ink/5 text-[10px] font-bold">
                  <span className="text-moss">{batchCount} Batches</span>
                  <span className="text-ink/50">{venueCount} Venues</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Zone Overview Banner */}
        <div className="rounded-3xl border border-moss/20 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="eyebrow mb-1">Active Region Overview</div>
              <h2 className="font-display text-2xl font-black text-ink">
                {currentZoneMeta.name}
              </h2>
              <p className="text-sm text-ink/70 mt-1 max-w-2xl">
                {currentZoneMeta.headline}
              </p>
            </div>

            {/* Aggregated Numbers */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-cream/70 p-3 text-center min-w-[90px]">
                <span className="font-display text-xl font-black text-moss block">
                  {regionalBatches.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-ink/50">Surplus Batches</span>
              </div>
              <div className="rounded-2xl bg-cream/70 p-3 text-center min-w-[90px]">
                <span className="font-display text-xl font-black text-ink block">
                  {regionalVenues.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-ink/50">Banquets</span>
              </div>
              <div className="rounded-2xl bg-cream/70 p-3 text-center min-w-[90px]">
                <span className="font-display text-xl font-black text-amber-700 block">
                  {regionalCaterers.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-ink/50">Caterers</span>
              </div>
              <div className="rounded-2xl bg-cream/70 p-3 text-center min-w-[90px]">
                <span className="font-display text-xl font-black text-tomato block">
                  {regionalShelters.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-ink/50">Shelters</span>
              </div>
            </div>
          </div>

          {/* Neighborhood Badges */}
          <div className="pt-3 border-t border-ink/5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-ink/50 uppercase tracking-wider mr-1">
              Covered Neighborhoods:
            </span>
            {currentZoneMeta.neighborhoods.map((n) => (
              <span
                key={n}
                className="rounded-xl bg-sage/20 px-3 py-1 text-xs font-semibold text-moss"
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Directory Sub-tabs for the Selected Zone */}
        <div className="space-y-6">
          <div className="flex border-b border-ink/10 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('batches')}
              className={`pb-3 text-sm font-bold transition border-b-2 cursor-pointer flex items-center gap-2 px-2 ${
                activeTab === 'batches'
                  ? 'border-moss text-moss'
                  : 'border-transparent text-ink/50 hover:text-ink'
              }`}
            >
              <Utensils size={16} />
              <span>Available Batches ({regionalBatches.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('venues')}
              className={`pb-3 text-sm font-bold transition border-b-2 cursor-pointer flex items-center gap-2 px-2 ${
                activeTab === 'venues'
                  ? 'border-moss text-moss'
                  : 'border-transparent text-ink/50 hover:text-ink'
              }`}
            >
              <Building2 size={16} />
              <span>Partner Venues ({regionalVenues.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('caterers')}
              className={`pb-3 text-sm font-bold transition border-b-2 cursor-pointer flex items-center gap-2 px-2 ${
                activeTab === 'caterers'
                  ? 'border-moss text-moss'
                  : 'border-transparent text-ink/50 hover:text-ink'
              }`}
            >
              <Utensils size={16} />
              <span>Caterers ({regionalCaterers.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shelters')}
              className={`pb-3 text-sm font-bold transition border-b-2 cursor-pointer flex items-center gap-2 px-2 ${
                activeTab === 'shelters'
                  ? 'border-moss text-moss'
                  : 'border-transparent text-ink/50 hover:text-ink'
              }`}
            >
              <Heart size={16} />
              <span>Shelters & NGOs ({regionalShelters.length})</span>
            </button>
          </div>

          {/* Tab 1: Regional Batches */}
          {activeTab === 'batches' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regionalBatches.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-ink/10 bg-white p-12 text-center text-xs text-ink/50">
                  No batches currently open in this zone. Check back after evening wedding banquets or view other zones.
                </div>
              ) : (
                regionalBatches.map((box) => (
                  <div
                    key={box.id}
                    className="flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-5 shadow-sm hover:shadow-lg transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-ink/60 mb-2">
                        <span className="font-bold text-moss">{box.partnerName}</span>
                        <span className="font-bold">{box.servings} Servings</span>
                      </div>
                      <h4 className="font-display text-base font-bold text-ink">{box.name}</h4>
                      <p className="mt-1 text-xs text-ink/65 line-clamp-2">{box.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-moss">
                        <Flame size={13} className="text-tomato" />
                        <span>{box.temperatureStatus || 'Steam Hot (>65°C)'}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between">
                      <Link
                        href={`/batches/${box.id}`}
                        className="text-xs font-bold text-moss hover:underline"
                      >
                        Inspect Batch →
                      </Link>
                      <span className="text-[11px] text-ink/50">{box.pickupStart} – {box.pickupEnd}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Regional Venues */}
          {activeTab === 'venues' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regionalVenues.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-ink/10 bg-white p-12 text-center text-xs text-ink/50">
                  No wedding venues listed yet in {selectedZone}.
                </div>
              ) : (
                regionalVenues.map((v) => (
                  <div
                    key={v.id}
                    className="flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-5 shadow-sm hover:shadow-lg transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-ink/60 mb-2">
                        <span className="font-bold text-moss">{v.category}</span>
                        <span>Up to {v.capacity} Guests</span>
                      </div>
                      <h4 className="font-display text-base font-bold text-ink">{v.name}</h4>
                      <p className="mt-1 text-xs text-ink/65 line-clamp-2">{v.address}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between">
                      <Link href={`/venues/${v.id}`} className="text-xs font-bold text-moss hover:underline">
                        View Venue Profile →
                      </Link>
                      <a
                        href={v.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-ink/60 hover:text-ink flex items-center gap-1"
                      >
                        <Navigation size={12} /> Directions
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Regional Caterers */}
          {activeTab === 'caterers' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regionalCaterers.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-ink/10 bg-white p-12 text-center text-xs text-ink/50">
                  No caterers based in {selectedZone} yet.
                </div>
              ) : (
                regionalCaterers.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-5 shadow-sm hover:shadow-lg transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-ink/60 mb-2">
                        <span className="font-bold text-amber-700">{c.cuisineTypes[0]}</span>
                        <span>{c.totalMealsRescued}+ Rescued</span>
                      </div>
                      <h4 className="font-display text-base font-bold text-ink">{c.name}</h4>
                      <p className="mt-1 text-xs text-ink/65 line-clamp-2">{c.address}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between">
                      <Link href={`/caterers/${c.id}`} className="text-xs font-bold text-moss hover:underline">
                        View Caterer Profile →
                      </Link>
                      <a
                        href={c.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-ink/60 hover:text-ink flex items-center gap-1"
                      >
                        <Navigation size={12} /> Directions
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Regional Shelters */}
          {activeTab === 'shelters' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regionalShelters.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-ink/10 bg-white p-12 text-center text-xs text-ink/50">
                  No recipient shelters registered in {selectedZone}.
                </div>
              ) : (
                regionalShelters.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-5 shadow-sm hover:shadow-lg transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-ink/60 mb-2">
                        <span className="font-bold text-tomato">{s.category}</span>
                        <span>{s.beneficiaryCount} Residents</span>
                      </div>
                      <h4 className="font-display text-base font-bold text-ink">{s.name}</h4>
                      <p className="mt-1 text-xs text-ink/65 line-clamp-2">{s.address}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between">
                      <a
                        href={s.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-tomato hover:underline"
                      >
                        Google Maps Link →
                      </a>
                      <span className="text-xs font-bold text-ink/60">Need: {s.dailyRequirementServings} / day</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
