'use client';

import { Heart } from 'lucide-react';
import FoodDonationRegistrationForm from './FoodDonationRegistrationForm';

export default function EventDonationSection() {
  return (
    <section id="donate-form" className="scroll-mt-24 py-20 lg:py-28">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[38px] border border-ink/10 bg-white shadow-soft lg:grid lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left Column: Mission & Host Assurance */}
          <div className="flex flex-col justify-between bg-ink p-8 text-white sm:p-12 lg:p-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wider text-sage uppercase">
                <Heart size={14} className="fill-tomato text-tomato" /> Free Event Food Rescue
              </div>

              <h2 className="mt-5 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
                Turn your wedding leftovers into <span className="text-sage">smiles for the hungry.</span>
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
                Don’t dump huge pots of untouched wedding or party food into the trash. Our volunteer brigade arrives with insulated carriers, collects the surplus respectfully, and delivers hot meals directly to children and night shelters.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  {
                    title: '100% Free Service',
                    desc: 'We never charge event hosts, families, or recipient shelters. It is a completely free community initiative.',
                  },
                  {
                    title: 'Rapid 30-Minute Dispatch',
                    desc: 'Our volunteer vehicle reaches your banquet hall right when dinner concludes.',
                  },
                  {
                    title: 'Dignified & Hygienic Packaging',
                    desc: 'We bring sanitized food-grade stainless carriers and thermal bins to maintain freshness.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-moss text-xs font-bold text-white shrink-0">
                      ✓
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.title}</h4>
                      <p className="mt-0.5 text-xs text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <span className="font-bold text-sage">Last-minute or emergency tonight? </span>
              Call our 24/7 hotline at <strong className="text-white">1800-FOOD-RESCUE</strong> for priority dispatch.
            </div>
          </div>

          {/* Right Column: Premium Interactive 5-Step Registration Form with Email OTP */}
          <div className="p-6 sm:p-10 lg:p-12">
            <FoodDonationRegistrationForm embedded={true} />
          </div>
        </div>
      </div>
    </section>
  );
}
