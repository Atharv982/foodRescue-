import { PhoneCall, Truck, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: PhoneCall,
      title: 'Alert Us for Your Event',
      description:
        'Wedding hosts, banquet managers, or caterers notify us via the form or hotline with their venue, estimated leftover quantity, and buffet closing time.',
      badge: 'Zero Effort for Host',
      badgeClass: 'bg-venue-light/20 text-[#FDE68A] border-[#FDE68A]/30',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'Wedding banquet hall concluding dinner service',
    },
    {
      step: '02',
      icon: Truck,
      title: 'Volunteer Brigade Dispatched',
      description:
        'Our dedicated rescue vehicle arrives at the banquet hall or venue with sterile, insulated food-grade containers within 30 minutes of dinner service concluding.',
      badge: 'Rapid Logistics',
      badgeClass: 'bg-logistics-light/20 text-[#BEE3F8] border-[#BEE3F8]/30',
      image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'Volunteer rescue delivery van en route',
    },
    {
      step: '03',
      icon: ShieldCheck,
      title: 'Hygiene & Quality Inspection',
      description:
        'Trained food rescue volunteers test temperature, verify food freshness, and pack untouched surplus dishes into sealed containers.',
      badge: 'Strict Safety Check',
      badgeClass: 'bg-white/20 text-white border-white/30',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'Food inspection and thermal temperature testing',
    },
    {
      step: '04',
      icon: Heart,
      title: 'Served to Hungry People',
      description:
        'Meals are immediately transported to partner orphanages, destitute shelters, and night shelters for dignified, hot dinner distribution within 2 hours.',
      badge: 'Direct Relief',
      badgeClass: 'bg-coral/20 text-[#FFC4B3] border-coral/30',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'Shelter community enjoying warm wedding feast dinner',
    },
  ];

  return (
    <section id="how" className="scroll-mt-24 bg-gradient-to-b from-evergreen via-[#16382B] to-evergreen py-20 text-white lg:py-28 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-forest/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />

      <div className="section-shell relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider text-sage uppercase backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-sage animate-ping" />
              The 4-Step Rescue Workflow
            </div>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              From grand weddings & parties<br />
              <span className="text-sage">directly to plates of the needy.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
            Every minute counts when handling freshly cooked celebration meals. Our rapid response network ensures zero food is wasted and maximum hunger is alleviated.
          </p>
        </div>

        {/* Steps Grid with Visual Cards and Micro-Photos */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-white/15 bg-white/[0.07] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-white/35 hover:bg-white/[0.12] hover:shadow-2xl"
              >
                {/* Step Photo Banner */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16382B] via-transparent to-black/30" />

                  {/* Step Number & Icon Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-display text-2xl font-black text-white drop-shadow-md">
                      {item.step}
                    </span>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-forest shadow-md">
                      <Icon size={18} />
                    </div>
                  </div>

                  <span className={`absolute bottom-3 left-3 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Step Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-black text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/70">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold text-sage">
                    <span>Stage {idx + 1} of 4</span>
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-white transition group-hover:translate-x-1">
                      Explore Flow <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

