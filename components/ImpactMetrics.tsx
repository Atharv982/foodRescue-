import { Utensils, Heart, Building2, Users, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

export default function ImpactMetrics() {
  const metrics = [
    {
      icon: Users,
      value: '18,400+',
      label: 'Dignified Meals Nourished',
      description: 'Hot, high-nutrition wedding feasts redirected directly to street families, orphanages, and night shelters.',
      highlight: '+22% This Wedding Season',
      badgeColor: 'bg-shelter-light text-shelter border-shelter-border',
      iconBg: 'bg-shelter-light text-shelter group-hover:bg-shelter group-hover:text-white',
    },
    {
      icon: Building2,
      value: '340+',
      label: 'Weddings & Banquets Rescued',
      description: 'Conscious wedding hosts, families, and caterers who alerted our volunteer fleet instead of dumping excess food.',
      highlight: '100% Zero-Landfill Pledge',
      badgeColor: 'bg-sage/70 text-forest border-forest/15',
      iconBg: 'bg-sage/70 text-forest group-hover:bg-forest group-hover:text-white',
    },
    {
      icon: Utensils,
      value: '32,500 kg',
      label: 'Fresh Edible Food Saved',
      description: 'Pristine pots of Shahi paneer, dal, biryani, and desserts saved from rotting in municipal city dumps.',
      highlight: '81.2 Tonnes CO₂ Averted',
      badgeColor: 'bg-coral/10 text-coral border-coral/20',
      iconBg: 'bg-coral/10 text-coral group-hover:bg-coral group-hover:text-white',
    },
    {
      icon: Heart,
      value: '48+',
      label: 'Partner Shelter Homes',
      description: 'Verified orphanages, destitute care homes, and community slum kitchens receiving hot meals daily.',
      highlight: '5 Mumbai Corridors',
      badgeColor: 'bg-impact-light text-impact border-impact-border',
      iconBg: 'bg-impact-light text-impact group-hover:bg-impact group-hover:text-white',
    },
  ];

  return (
    <section className="border-y border-ink/10 bg-white/80 py-12 lg:py-16 backdrop-blur-md relative overflow-hidden">
      <div className="section-shell">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-3xl border border-ink/10 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover hover:border-forest/20"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl transition duration-300 group-hover:scale-105 shadow-2xs ${metric.iconBg}`}>
                      <Icon size={22} />
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${metric.badgeColor}`}>
                      {metric.highlight}
                    </span>
                  </div>

                  <div className="mt-6 font-display text-3xl font-black tracking-tight text-evergreen sm:text-4xl">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-forest">
                    {metric.label}
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-charcoal/70">
                    {metric.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-ink/5 flex items-center justify-between text-[11px] font-bold text-ink/40">
                  <span>Verified Impact 0{idx + 1}</span>
                  <span className="flex items-center gap-1 text-forest font-semibold">
                    <ShieldCheck size={13} /> Active Field Data
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
