import Link from 'next/link';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SubpageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  theme?: 'default' | 'logistics' | 'shelter' | 'venue' | 'impact' | 'food' | 'editorial';
}

export default function SubpageHeader({
  breadcrumbs,
  eyebrow,
  title,
  description,
  badge,
  actions,
  theme = 'default',
}: SubpageHeaderProps) {
  // Topic-specific ambient background and badge styles
  const themeStyles = {
    default: {
      bg: 'border-ink/10 bg-white/75',
      badge: 'bg-sage/70 text-moss border border-moss/15',
      eyebrow: 'border-moss/20 bg-white/80 text-moss',
      gradient: 'from-forest/5 via-transparent to-transparent',
    },
    logistics: {
      bg: 'border-logistics-border/40 bg-gradient-to-r from-logistics-light/70 via-white/80 to-white/60',
      badge: 'bg-logistics-light text-logistics border border-logistics-border',
      eyebrow: 'border-logistics-border bg-white text-logistics',
      gradient: 'from-logistics/10 via-transparent to-transparent',
    },
    shelter: {
      bg: 'border-shelter-border/40 bg-gradient-to-r from-shelter-light/70 via-white/80 to-white/60',
      badge: 'bg-shelter-light text-shelter border border-shelter-border',
      eyebrow: 'border-shelter-border bg-white text-shelter',
      gradient: 'from-shelter/10 via-transparent to-transparent',
    },
    venue: {
      bg: 'border-venue-border/40 bg-gradient-to-r from-venue-light/70 via-white/80 to-white/60',
      badge: 'bg-venue-light text-venue border border-venue-border',
      eyebrow: 'border-venue-border bg-white text-venue',
      gradient: 'from-venue/10 via-transparent to-transparent',
    },
    impact: {
      bg: 'border-impact-border/40 bg-gradient-to-r from-impact-light/70 via-white/80 to-white/60',
      badge: 'bg-impact-light text-impact border border-impact-border',
      eyebrow: 'border-impact-border bg-white text-impact',
      gradient: 'from-impact/10 via-transparent to-transparent',
    },
    food: {
      bg: 'border-coral/20 bg-gradient-to-r from-coral/5 via-white/80 to-white/60',
      badge: 'bg-coral/10 text-coral border border-coral/20',
      eyebrow: 'border-coral/20 bg-white text-coral',
      gradient: 'from-coral/10 via-transparent to-transparent',
    },
    editorial: {
      bg: 'border-ink/10 bg-gradient-to-r from-cream via-white to-white',
      badge: 'bg-evergreen text-white border border-evergreen',
      eyebrow: 'border-ink/10 bg-white text-ink/70',
      gradient: 'from-moss/5 via-transparent to-transparent',
    },
  }[theme];

  return (
    <div className={`relative overflow-hidden border-b py-8 lg:py-12 backdrop-blur-md ${themeStyles.bg}`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${themeStyles.gradient}`} />
      
      <div className="section-shell relative z-10">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-ink/50">
          <Link
            href="/"
            className="flex items-center gap-1 transition hover:text-moss"
            aria-label="Back to Homepage"
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <ChevronRight size={12} className="text-ink/30" />
              {crumb.href ? (
                <Link href={crumb.href} className="transition hover:text-moss">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-bold text-ink" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        {/* Header Content */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow && (
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] mb-3 shadow-2xs ${themeStyles.eyebrow}`}>
                {eyebrow}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-black tracking-tight text-evergreen sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              {badge && (
                <span className={`rounded-full px-3 py-1 text-xs font-bold shadow-2xs ${themeStyles.badge}`}>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-3 text-sm text-ink/75 sm:text-base leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
