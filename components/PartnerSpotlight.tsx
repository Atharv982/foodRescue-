import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Building2, ArrowRight, ShieldCheck, Heart, Users, ExternalLink, Navigation } from 'lucide-react';
import type { FoodBox } from '@/types/food';

interface PartnerSpotlightProps {
  foodBoxes: FoodBox[];
  onSelectPartner: (partnerName: string) => void;
}

export default function PartnerSpotlight({ foodBoxes, onSelectPartner }: PartnerSpotlightProps) {
  const venues = [
    {
      id: 'venue-royal-palms',
      name: 'The Royal Palms Grand Ballroom',
      category: 'Grand Wedding Venue',
      location: 'Goregaon East',
      capacity: 'Up to 1,200 Guests',
      mealsDonated: '4,200+ Meals',
      description: 'Host of premier Mumbai wedding celebrations. Excess banquet platters sealed and donated to local night shelters.',
      sampleBoxId: '8f7a7d52-0b01-4a5a-8e34-000000000001',
    },
    {
      id: 'venue-renaissance-powai',
      name: 'Grand Lakeside Pavilion (Westin Powai)',
      category: 'Corporate & Banquet Hall',
      location: 'Powai Lake',
      capacity: 'Up to 800 Guests',
      mealsDonated: '3,800+ Meals',
      description: 'Zero-food-waste partner ensuring corporate summit buffets are transferred in thermal carriers within 45 minutes.',
      sampleBoxId: '8f7a7d52-0b01-4a5a-8e34-000000000002',
    },
    {
      id: 'venue-sea-breeze-bandra',
      name: 'Sea Breeze Banquet Hall',
      category: 'Celebration Banquet Ballroom',
      location: 'Bandra West',
      capacity: 'Up to 450 Guests',
      mealsDonated: '2,900+ Meals',
      description: 'Dedicated to hunger relief by donating untouched pots of biryani, dal, and desserts from milestone celebrations.',
      sampleBoxId: '8f7a7d52-0b01-4a5a-8e34-000000000003',
    },
    {
      id: 'venue-grand-orchid-juhu',
      name: 'Grand Orchid Banquets',
      category: 'Luxury Wedding Ballroom',
      location: 'Juhu Tara Road',
      capacity: 'Up to 1,000 Guests',
      mealsDonated: '3,100+ Meals',
      description: 'Partners with FoodRescue for all wedding receptions, redirecting grand feasts to children orphanages in Andheri & Juhu.',
      sampleBoxId: '8f7a7d52-0b01-4a5a-8e34-000000000005',
    },
  ];

  const shelters = [
    {
      name: 'Sneha Sadan Orphanage',
      location: 'Andheri East',
      residents: '85 Children',
      impact: 'Receives hot wedding feasts 3–4 nights/week',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sneha+Sadan+Andheri+East+Mumbai',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Asha Sadan Home for Women & Kids',
      location: 'Umerkhadi / Mumbai Central',
      residents: '120 Women & Children',
      impact: 'High-protein banquet lentils, paneer & fresh fruit relief',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Asha+Sadan+Umerkhadi+Mumbai',
      image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Bandra Night Homeless Shelter',
      location: 'Bandra Station West',
      residents: '90 Destitute Elders',
      impact: 'Warm rotis, sabzi & khichdi served every evening',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bandra+Station+West+Mumbai',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Slum Children Study Center Relief Drive',
      location: 'Dharavi / Kurla',
      residents: '150+ Underprivileged Kids',
      impact: 'Nutritious evening snacks, bakery buns & meals',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dharavi+90+Feet+Road+Mumbai',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <section id="partners" className="scroll-mt-24 border-y border-ink/10 bg-white/70 py-20 lg:py-28">
      <div className="section-shell">
        {/* Venues Heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">
              <Building2 size={14} /> Partner Venues & Banquets
            </div>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Premier wedding venues,<br />
              <span className="text-moss">committed to zero food waste.</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/venues"
              className="rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition inline-flex items-center gap-1.5"
            >
              <Building2 size={14} className="text-moss" />
              <span>Full Venues Directory (12) →</span>
            </Link>
            <Link
              href="/map"
              className="rounded-2xl border border-moss/30 bg-sage/20 px-4 py-2.5 text-xs font-bold text-moss shadow-2xs hover:bg-sage/40 transition inline-flex items-center gap-1.5"
            >
              <Navigation size={14} />
              <span>Interactive Map</span>
            </Link>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {venues.map((venue) => {
            const matchingBox = foodBoxes.find((b) => b.id === venue.sampleBoxId);

            return (
              <div
                key={venue.name}
                className="group flex flex-col justify-between overflow-hidden rounded-[30px] border border-ink/10 bg-white shadow-xs transition duration-300 hover:-translate-y-1.5 hover:shadow-soft"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
                    {matchingBox && (
                      <Image
                        src={matchingBox.imageUrl}
                        alt={`${venue.name} wedding food`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-moss uppercase backdrop-blur-xs">
                      {venue.category}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-moss px-3 py-1 text-xs font-bold text-white shadow-xs">
                      <Heart size={12} className="fill-white" />
                      <span>{venue.mealsDonated}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-ink/50">
                      <MapPin size={13} className="text-moss" />
                      <span>{venue.location}</span>
                    </div>

                    <h3 className="mt-1.5 font-display text-lg font-black text-ink group-hover:text-moss transition">
                      {venue.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-ink/65 line-clamp-2">
                      {venue.description}
                    </p>

                    <div className="mt-4 rounded-xl bg-cream/60 p-2.5 text-[11px] text-ink/70">
                      <span className="font-bold text-ink/80">Capacity: </span>
                      {venue.capacity}
                    </div>
                  </div>
                </div>

                <div className="border-t border-ink/10 p-5 pt-3 flex items-center justify-between gap-2">
                  <Link
                    href={`/venues/${venue.id}`}
                    className="text-xs font-bold text-moss hover:underline"
                  >
                    View Venue Profile →
                  </Link>
                  <button
                    onClick={() => onSelectPartner(venue.name)}
                    className="text-[11px] font-bold text-ink/50 hover:text-ink cursor-pointer"
                  >
                    Filter Batches
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shelters & Beneficiary Homes Section */}
        <div className="mt-20 border-t border-ink/10 pt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="eyebrow bg-sage/50">
                <Heart size={14} className="text-tomato" /> Where Your Wedding Food Goes
              </div>
              <h3 className="mt-3 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
                Verified Recipient Shelters & Orphanages
              </h3>
            </div>
            <Link
              href="/shelters"
              className="text-xs font-bold text-moss hover:underline shrink-0"
            >
              View All Recipient Shelters (6) →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shelters.map((shelter, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-between overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-hover hover:border-shelter/30"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <img
                    src={shelter.image}
                    alt={shelter.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-shelter-light px-2.5 py-0.5 text-[10px] font-black text-shelter border border-shelter-border uppercase backdrop-blur-md">
                    Verified Shelter
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 text-xs font-bold text-white drop-shadow-sm flex items-center gap-1">
                    <MapPin size={12} className="text-white" /> {shelter.location}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-base font-black text-evergreen leading-snug group-hover:text-shelter transition">
                      {shelter.name}
                    </h4>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-extrabold text-shelter">
                      <Users size={13} /> {shelter.residents}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
                      {shelter.impact}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between">
                    <a
                      href={shelter.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-shelter hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> Google Maps
                    </a>
                    <Link
                      href="/shelters"
                      className="text-[11px] font-bold text-ink/50 hover:text-ink"
                    >
                      Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event host CTA banner */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-3xl border border-ink/10 bg-cream/70 p-6 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-moss text-white shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-bold text-ink text-sm">Do you manage a wedding banquet or catering company?</p>
              <p className="text-xs text-ink/60">Partner with our non-profit brigade for free scheduled evening food pickups.</p>
            </div>
          </div>
          <Link
            href="/partner-register"
            className="secondary-button text-xs whitespace-nowrap"
          >
            Register Venue / Caterer for Pickups <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
