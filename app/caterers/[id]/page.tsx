'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import InteractiveMap, { MapItem } from '@/components/InteractiveMap';
import { caterersData } from '@/lib/directory-data';
import {
  Utensils,
  MapPin,
  Users,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  ExternalLink,
  Navigation,
  ArrowLeft,
  Sparkles,
  Building2,
  Award,
  ShieldCheck
} from 'lucide-react';

export default function CatererDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const caterer = caterersData.find((c) => c.id === id || c.slug === id);

  if (!caterer) {
    return (
      <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
        <Navbar />
        <div className="section-shell py-24 text-center">
          <Utensils size={48} className="mx-auto text-ink/30 mb-4" />
          <h1 className="font-display text-2xl font-bold text-ink">Caterer Profile Not Found</h1>
          <p className="mt-2 text-sm text-ink/60">
            The catering business you are looking for is not listed in our verified directory.
          </p>
          <Link
            href="/caterers"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#224433]"
          >
            <ArrowLeft size={14} /> Back to Caterers Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const catererMapItem: MapItem = {
    id: caterer.id,
    name: caterer.name,
    type: 'caterer',
    category: caterer.cuisineTypes.join(', '),
    address: caterer.address,
    neighborhood: caterer.neighborhood,
    zone: caterer.zone,
    lat: caterer.lat,
    lng: caterer.lng,
    detailUrl: `/caterers/${caterer.id}`,
    googleMapsUrl: caterer.googleMapsUrl,
    directionsUrl: caterer.directionsUrl,
    imageUrl: caterer.featuredImage,
    badge: `${caterer.capacityPerEvent} Max Guests`,
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar selectedZone={caterer.zone} />

      <SubpageHeader
        breadcrumbs={[
          { label: 'Caterers Directory', href: '/caterers' },
          { label: caterer.name },
        ]}
        eyebrow={`${caterer.cuisineTypes.join(' & ')} · ${caterer.zone}`}
        title={caterer.name}
        badge="Zero-Waste Caterer"
        description={`Premier wedding & celebration caterer serving up to ${caterer.capacityPerEvent.toLocaleString('en-IN')} guests across Mumbai. Equipped with certified FoodRescue thermal packing protocols.`}
        actions={
          <div className="flex items-center gap-2">
            <a
              href={caterer.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition flex items-center gap-1.5"
            >
              <Navigation size={13} className="text-moss" />
              <span>Get Directions</span>
            </a>
            <Link
              href={`/schedule-pickup?caterer=${encodeURIComponent(caterer.name)}`}
              className="primary-button text-xs py-2.5 px-4"
            >
              <Sparkles size={14} /> Schedule Event Pickup
            </Link>
          </div>
        }
      />

      <div className="section-shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover Image */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-3xl bg-ink/5 shadow-md">
              <img
                src={caterer.featuredImage}
                alt={caterer.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {caterer.cuisineTypes.join(' · ')}
                </span>
                <span className="rounded-full bg-moss/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md flex items-center gap-1">
                  <CheckCircle2 size={12} /> Certified Partner
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-ink shadow-sm backdrop-blur-md flex items-center gap-1.5">
                  <Users size={14} className="text-moss" /> Capacity: {caterer.capacityPerEvent.toLocaleString('en-IN')} Guests / Event
                </span>
              </div>
            </div>

            {/* Specialties & Cuisines */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="font-display text-xl font-bold text-ink">Catering Specialties & Feasts</h2>
              <div className="flex flex-wrap gap-2">
                {caterer.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl bg-cream px-3.5 py-1.5 text-xs font-bold text-ink/80 border border-ink/5"
                  >
                    ✦ {spec}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-ink/5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink/50 mb-2">
                  Key Service Areas in Mumbai:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {caterer.serviceAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-sage/30 px-2.5 py-1 text-xs font-semibold text-moss"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Surplus Management Capability */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                <ShieldCheck size={20} className="text-moss" /> Surplus Food Management Protocol
              </h2>
              <p className="text-sm text-ink/75 leading-relaxed">
                {caterer.surplusManagementCapability}
              </p>
              <div className="rounded-2xl bg-cream/40 p-4 border border-ink/5 text-xs text-ink/70 mt-2">
                <span className="font-bold text-moss">Zero-Waste Standard: </span>
                All excess banquet dishes are sealed in stainless thermal canisters at closing, verified with an infrared thermometer (&gt;65°C), and transferred to waiting FoodRescue vehicles within 30 minutes.
              </div>
            </div>

            {/* Verified Venues Served */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                <Building2 size={20} className="text-moss" /> Verified Venues Frequently Served
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 pt-1">
                {caterer.verifiedVenuesServed.map((venueName, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-2xl border border-ink/5 bg-cream/30 p-3 text-xs font-bold text-ink"
                  >
                    <Building2 size={15} className="text-moss shrink-0" />
                    <span>{venueName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Embedded Map */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                    <MapPin size={20} className="text-tomato" /> Kitchen Base & Logistics Hub
                  </h2>
                  <p className="text-xs text-ink/60 mt-0.5">{caterer.address}</p>
                </div>
                <a
                  href={caterer.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-ink/10 bg-cream/60 px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-cream flex items-center gap-1.5 shrink-0"
                >
                  <ExternalLink size={13} /> Open in Google Maps
                </a>
              </div>

              <InteractiveMap
                items={[catererMapItem]}
                selectedItem={catererMapItem}
                heightClass="h-[380px]"
                centerLat={caterer.lat}
                centerLng={caterer.lng}
              />
            </div>
          </div>

          {/* Right Col: Details Card */}
          <div className="space-y-6">
            <div className="sticky top-24 rounded-3xl border border-ink/10 bg-white p-6 shadow-xl space-y-6">
              {/* Partner Impact Metric */}
              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Total Rescued Celebration Meals
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-black text-amber-900">
                    {caterer.totalMealsRescued.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-amber-800">Meals Diverted</span>
                </div>
                <p className="mt-1 text-[11px] text-amber-950/70">
                  {caterer.eventsServedCount}+ events served · Partner since {caterer.partnerSince}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 rounded-xl bg-cream/40 p-3">
                  <Phone size={15} className="text-moss shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Phone</span>
                    <a href={`tel:${caterer.contactPhone.replace(/\s+/g, '')}`} className="font-bold text-ink hover:text-moss">
                      {caterer.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-cream/40 p-3">
                  <Mail size={15} className="text-moss shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Email</span>
                    <a href={`mailto:${caterer.contactEmail}`} className="font-bold text-ink hover:text-moss">
                      {caterer.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-cream/40 p-3">
                  <Globe size={15} className="text-moss shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Website</span>
                    <a href={caterer.website} target="_blank" rel="noopener noreferrer" className="font-bold text-ink hover:text-moss truncate block max-w-[200px]">
                      {caterer.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="pt-2 space-y-2">
                <Link
                  href={`/schedule-pickup?caterer=${encodeURIComponent(caterer.name)}`}
                  className="primary-button w-full justify-center py-3 text-xs uppercase tracking-wider"
                >
                  <Sparkles size={15} /> Book Event Pickup
                </Link>
                <a
                  href={caterer.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-cream/60 py-2.5 text-xs font-bold text-ink hover:bg-cream w-full transition"
                >
                  <Navigation size={13} className="text-moss" /> Directions to Kitchen
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
