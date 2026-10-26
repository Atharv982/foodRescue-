import Link from 'next/link';
import { Heart, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white/70 py-16">
      <div className="section-shell">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-moss text-white">
                <Heart size={20} className="fill-white" />
              </span>
              <span className="font-display text-xl font-black text-ink">
                Food<span className="text-moss">Rescue</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-xs leading-relaxed text-ink/65">
              FoodRescue connects wedding venues, banquet halls, caterers, and corporate hosts directly with verified orphanages, night shelters, and hungry communities across Greater Mumbai with rapid temperature-verified transport.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-xs text-ink/60">
              <a href="tel:18003663737" className="flex items-center gap-2 font-bold text-moss hover:underline">
                <Phone size={14} /> 24/7 Dispatch Hotline: 1800-FOOD-RESCUE (1800-366-3737)
              </a>
              <span className="flex items-center gap-2">
                <Mail size={14} /> donations@foodrescue.in / dispatch@foodrescue.in
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> Operating across Mumbai Metropolitan Region
              </span>
            </div>
          </div>

          {/* Directory & Discovery */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-ink uppercase">
              Directory & Discovery
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-ink/70">
              <li>
                <Link href="/venues" className="transition hover:text-moss">
                  Wedding & Banquet Venues
                </Link>
              </li>
              <li>
                <Link href="/caterers" className="transition hover:text-moss">
                  Wedding Caterers Directory
                </Link>
              </li>
              <li>
                <Link href="/shelters" className="transition hover:text-moss">
                  Recipient Shelters & NGOs
                </Link>
              </li>
              <li>
                <Link href="/map" className="transition hover:text-moss font-semibold text-moss">
                  Interactive Discovery Map
                </Link>
              </li>
              <li>
                <Link href="/zones" className="transition hover:text-moss">
                  Mumbai Regional Corridors
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Tools */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-ink uppercase">
              Rescue Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-ink/70">
              <li>
                <Link href="/batches" className="transition hover:text-moss">
                  Available Food Batches
                </Link>
              </li>
              <li>
                <Link href="/schedule-pickup" className="transition hover:text-moss font-semibold text-moss">
                  Schedule Rescue Pickup
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="transition hover:text-moss">
                  Event Surplus Calculator
                </Link>
              </li>
              <li>
                <Link href="/rescue-hub" className="transition hover:text-moss">
                  Rescue Hub Operations
                </Link>
              </li>
              <li>
                <Link href="/stories" className="transition hover:text-moss">
                  Community Impact Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Partners */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-ink uppercase">
              Partners & Help
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-ink/70">
              <li>
                <Link href="/partner-register" className="transition hover:text-moss">
                  List Your Venue / Caterer
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-moss">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link href="/hotline" className="transition hover:text-tomato font-bold text-tomato">
                  24/7 Hotline & Emergency Desk
                </Link>
              </li>
              <li>
                <a href="https://wa.me/919820044555" target="_blank" rel="noopener noreferrer" className="transition hover:text-moss">
                  WhatsApp Dispatch Desk
                </a>
              </li>
              <li>
                <span className="text-moss font-bold">100% Free Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-8 text-center sm:flex-row sm:text-left text-xs text-ink/50">
          <p>
            © {new Date().getFullYear()} FoodRescue Initiative. All surplus celebration food is distributed free of charge to verified shelters and communities in need.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold text-moss">
              <ShieldCheck size={14} /> FSSAI Temperature-Verified Transport Protocols
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
