'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import InteractiveMap, { MapItem } from '@/components/InteractiveMap';
import { venuesData } from '@/lib/directory-data';
import { foodBoxes } from '@/lib/food-data';
import {
  Building2,
  MapPin,
  Users,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Navigation,
  ArrowLeft,
  Sparkles,
  Utensils,
  Award,
  Clock
} from 'lucide-react';

export default function VenueDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const venue = venuesData.find((v) => v.id === id || v.slug === id);

  if (!venue) {
    return (
      <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
        <Navbar />
        <div className="section-shell py-24 text-center">
          <Building2 size={48} className="mx-auto text-ink/30 mb-4" />
          <h1 className="font-display text-2xl font-bold text-ink">Venue Profile Not Found</h1>
          <p className="mt-2 text-sm text-ink/60">
            The venue you are looking for is not listed in our verified partner directory.
          </p>
          <Link
            href="/venues"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#224433]"
          >
            <ArrowLeft size={14} /> Back to Venues Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Find active batches from this venue
  const activeBatches = foodBoxes.filter(
    (b) =>
      b.partnerName.toLowerCase().includes(venue.name.toLowerCase()) ||
      venue.name.toLowerCase().includes(b.partnerName.toLowerCase()) ||
      (b.venueName && b.venueName.toLowerCase().includes(venue.name.toLowerCase()))
  );

  const venueMapItem: MapItem = {
    id: venue.id,
    name: venue.name,
    type: 'venue',
    category: venue.category,
    address: venue.address,
    neighborhood: venue.neighborhood,
    zone: venue.zone,
    lat: venue.lat,
    lng: venue.lng,
    detailUrl: `/venues/${venue.id}`,
    googleMapsUrl: venue.googleMapsUrl,
    directionsUrl: venue.directionsUrl,
    imageUrl: venue.featuredImage,
    badge: `${venue.capacity} Guests`,
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar selectedZone={venue.zone} />

      <SubpageHeader
        breadcrumbs={[
          { label: 'Venues Directory', href: '/venues' },
          { label: venue.name },
        ]}
        eyebrow={`${venue.category} · ${venue.zone}`}
        title={venue.name}
        badge="Zero-Waste Partner"
        description={venue.description}
        actions={
          <div className="flex items-center gap-2">
            <a
              href={venue.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition flex items-center gap-1.5"
            >
              <Navigation size={13} className="text-moss" />
              <span>Get Directions</span>
            </a>
            <Link
              href={`/schedule-pickup?venue=${encodeURIComponent(venue.name)}`}
              className="primary-button text-xs py-2.5 px-4"
            >
              <Sparkles size={14} /> Schedule Pickup
            </Link>
          </div>
        }
      />

      <div className="section-shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Cover */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-3xl bg-ink/5 shadow-md">
              <img
                src={venue.featuredImage}
                alt={venue.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {venue.category}
                </span>
                <span className="rounded-full bg-moss/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md flex items-center gap-1">
                  <CheckCircle2 size={12} /> Verified FoodRescue Partner
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-ink shadow-sm backdrop-blur-md flex items-center gap-1.5">
                  <Users size={14} className="text-moss" /> Capacity: {venue.capacity.toLocaleString('en-IN')} Guests
                </span>
              </div>
            </div>

            {/* Overview & Food Safety */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="font-display text-xl font-bold text-ink">Venue Facilities & Surplus Protocol</h2>
              <p className="text-sm text-ink/75 leading-relaxed">{venue.description}</p>

              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                {venue.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-ink/80 rounded-xl bg-cream/40 p-3">
                    <CheckCircle2 size={15} className="text-moss shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Batches Donated by This Venue */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                  <Utensils size={18} className="text-moss" /> Live Surplus from This Venue
                </h2>
                <span className="rounded-full bg-sage/60 px-2.5 py-0.5 text-xs font-bold text-moss">
                  {activeBatches.length} Live Batches
                </span>
              </div>

              {activeBatches.length === 0 ? (
                <div className="rounded-2xl bg-cream/40 p-6 text-center text-xs text-ink/60">
                  No surplus batches are actively pending pickup right now. The next collection is scheduled after tonight’s banquet.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBatches.map((b) => (
                    <div
                      key={b.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-ink/5 bg-cream/20 p-4 hover:border-moss/30 transition"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-ink">{b.name}</h4>
                        <p className="text-xs text-ink/60 mt-0.5">
                          {b.servings} Servings · {b.includedItems.join(', ')}
                        </p>
                      </div>
                      <Link
                        href={`/batches/${b.id}`}
                        className="rounded-xl bg-moss px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#224433] text-center shrink-0"
                      >
                        Claim Batch
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location & Embedded Interactive Map */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                    <MapPin size={20} className="text-tomato" /> Physical Location & Maps
                  </h2>
                  <p className="text-xs text-ink/60 mt-0.5">{venue.address}</p>
                </div>
                <a
                  href={venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-ink/10 bg-cream/60 px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-cream flex items-center gap-1.5 shrink-0"
                >
                  <ExternalLink size={13} /> Open in Google Maps
                </a>
              </div>

              {/* Map Canvas */}
              <InteractiveMap
                items={[venueMapItem]}
                selectedItem={venueMapItem}
                heightClass="h-[380px]"
                centerLat={venue.lat}
                centerLng={venue.lng}
              />
            </div>
          </div>

          {/* Right Col: Details Card */}
          <div className="space-y-6">
            <div className="sticky top-24 rounded-3xl border border-ink/10 bg-white p-6 shadow-xl space-y-6">
              {/* Partner Impact Metric */}
              <div className="rounded-2xl bg-sage/20 p-4 border border-moss/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-moss">
                  FoodRescue Impact To Date
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-black text-moss">
                    {venue.totalMealsDonated.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-moss">Meals Rescued</span>
                </div>
                <p className="mt-1 text-[11px] text-ink/60">
                  Partner since {venue.partnerSince}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 rounded-xl bg-cream/40 p-3">
                  <Phone size={15} className="text-moss shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Phone</span>
                    <a href={`tel:${venue.contactPhone.replace(/\s+/g, '')}`} className="font-bold text-ink hover:text-moss">
                      {venue.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-cream/40 p-3">
                  <Mail size={15} className="text-moss shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Inquiries</span>
                    <a href={`mailto:${venue.contactEmail}`} className="font-bold text-ink hover:text-moss">
                      {venue.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-cream/40 p-3">
                  <Globe size={15} className="text-moss shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Website</span>
                    <a href={venue.website} target="_blank" rel="noopener noreferrer" className="font-bold text-ink hover:text-moss truncate block max-w-[200px]">
                      {venue.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="pt-2 space-y-2">
                <Link
                  href={`/schedule-pickup?venue=${encodeURIComponent(venue.name)}`}
                  className="primary-button w-full justify-center py-3 text-xs uppercase tracking-wider"
                >
                  <Sparkles size={15} /> Book Rescue Pickup
                </Link>
                <a
                  href={venue.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-cream/60 py-2.5 text-xs font-bold text-ink hover:bg-cream w-full transition"
                >
                  <Navigation size={13} className="text-moss" /> Directions to Venue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
