import Link from 'next/link';
import { Star, Quote, CheckCircle2, Heart, ArrowRight } from 'lucide-react';

export default function CommunityStories() {
  const reviews = [
    {
      name: 'Sunil & Ananya Kapoor',
      role: 'Parents of the Bride (Wedding Host)',
      location: 'Royal Palms Ballroom, Goregaon',
      rescuedCount: 85,
      savedAmount: 'Fed 85 Children',
      rating: 5,
      category: 'Wedding Food Rescue',
      badgeClass: 'bg-venue-light text-venue border-venue-border',
      headline: 'The greatest wedding blessing we could have asked for.',
      comment:
        'After my daughter’s wedding dinner ended at 11 PM, we had nearly four giant pots of rich paneer, dal makhani, and jeera rice untouched. Instead of tossing it, FoodRescue’s team arrived in 25 minutes with sterile thermal canisters and delivered hot meals to Sneha Sadan. Our guests were moved to tears.',
      sourcePartner: 'The Royal Palms Grand Ballroom',
      storyId: 'story-1',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Sister Mary Teresa',
      role: 'Shelter Home Director',
      location: 'Sneha Sadan Orphanage Home',
      rescuedCount: 420,
      savedAmount: '400+ Meals/Month',
      rating: 5,
      category: 'NGO & Shelter Impact',
      badgeClass: 'bg-shelter-light text-shelter border-shelter-border',
      headline: 'Seeing our children smile over a warm feast is priceless.',
      comment:
        'Our shelter relies heavily on community donations. When FoodRescue brings fresh banquet and wedding meals—dishes our kids could never afford—the children celebrate like it is a festival night. The food is always piping hot, fresh, and nutritious.',
      sourcePartner: 'Partner Shelter Network',
      storyId: 'story-4',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Chef Rajesh Sawant',
      role: 'Executive Banquet Caterer',
      location: 'Powai Convention Center',
      rescuedCount: 1500,
      savedAmount: '1,500+ Servings Saved',
      rating: 5,
      category: 'Caterer Partnerships',
      badgeClass: 'bg-logistics-light text-logistics border-logistics-border',
      headline: 'Every chef hates seeing good food thrown away. FoodRescue solved this.',
      comment:
        'In the catering industry, preparing 15-20% buffer food is mandatory. Knowing that whatever remains untouched is packaged cleanly and transported to hungry street families makes our entire kitchen staff proud every single night.',
      sourcePartner: 'Grand Lakeside Pavilion, Powai',
      storyId: 'story-2',
      avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section id="stories" className="scroll-mt-24 py-20 lg:py-28 relative">
      <div className="section-shell">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow mb-3">
            <Heart size={14} className="fill-coral text-coral" /> Voices of Compassion & Dignity
          </div>
          <h2 className="font-display text-4xl font-black tracking-tight text-evergreen sm:text-5xl">
            From celebration excess<br />
            <span className="text-forest">to heartfelt gratitude.</span>
          </h2>
          <p className="mt-4 text-base text-charcoal/70 sm:text-lg">
            Hear from wedding families who turned celebration leftovers into community blessings, and shelter directors whose residents were nourished.
          </p>
        </div>

        {/* Stories Visual Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between overflow-hidden rounded-[32px] border border-ink/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover hover:border-forest/20"
            >
              {/* Cover Image Banner */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={review.coverImage}
                  alt={review.headline}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <span className={`absolute top-3 left-3 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${review.badgeClass}`}>
                  {review.category}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={13} className="fill-[#F7C96A] text-[#F7C96A]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-extrabold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    {review.savedAmount}
                  </span>
                </div>
              </div>

              {/* Story Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-black text-evergreen leading-snug">
                    "{review.headline}"
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-charcoal/70">
                    {review.comment}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-cream/70 px-3 py-1 text-[11px] font-semibold text-forest">
                    <span>Venue:</span>
                    <strong className="truncate max-w-[200px]">{review.sourcePartner}</strong>
                  </div>
                </div>

                {/* Author Avatar & Detail Link */}
                <div className="mt-6 flex items-center justify-between border-t border-ink/5 pt-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatarUrl}
                      alt={review.name}
                      className="h-10 w-10 rounded-full border-2 border-forest/20 object-cover shadow-2xs"
                      loading="lazy"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-evergreen">{review.name}</span>
                        <CheckCircle2 size={13} className="text-forest" />
                      </div>
                      <span className="text-[10px] text-ink/50 block truncate max-w-[140px]">{review.role}</span>
                    </div>
                  </div>

                  <Link
                    href={`/stories/${review.storyId}`}
                    className="flex items-center gap-1 text-[11px] font-bold text-forest hover:text-evergreen hover:underline shrink-0"
                  >
                    <span>Read</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Stories CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-ink/10 px-6 py-3.5 text-xs font-bold text-ink shadow-sm hover:bg-cream transition"
          >
            <span>Read All Verified Community Stories & Impact Reports</span>
            <ArrowRight size={14} className="text-moss" />
          </Link>
        </div>
      </div>
    </section>
  );
}
