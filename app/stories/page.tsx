'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import { storiesData } from '@/lib/directory-data';
import type { Story } from '@/types/directory';
import {
  MessageSquare,
  Clock,
  Calendar,
  ArrowRight,
  Heart,
  Award,
  Sparkles,
  Search
} from 'lucide-react';

export default function StoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStories = useMemo(() => {
    return storiesData.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchExcerpt = s.excerpt.toLowerCase().includes(q);
        const matchPartner = s.partnerFeatured.toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt && !matchPartner) return false;
      }

      if (selectedCategory !== 'All' && s.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar />

      <SubpageHeader
        breadcrumbs={[{ label: 'Stories' }]}
        eyebrow="Community & Field Highlights"
        title="Food Rescue Impact Stories"
        badge={`${filteredStories.length} Published Stories`}
        theme="editorial"
        description="Inspiring real-world accounts of wedding banquets, master chefs, volunteer van drivers, and recipient shelter communities transforming surplus food into dignified nourishment."
      />

      <div className="section-shell py-10 lg:py-14 space-y-8">
        {/* Category Filter Pills & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-3xl border border-ink/10 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {[
              'All',
              'Wedding Food Rescue',
              'Caterer Partnerships',
              'Venue Collaborations',
              'NGO and Shelter Impact',
              'Volunteer Highlights',
              'Community Success Stories',
              'Food Waste Reduction',
              'Rescue Milestones',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-moss text-white shadow-2xs'
                    : 'bg-cream/60 text-ink/70 hover:bg-cream hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              placeholder="Search stories & banquets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-cream/40 pl-9 pr-3.5 py-2 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden focus:border-moss"
            />
          </div>
        </div>

        {/* Featured Hero Story (Only shown when browsing All and no active search query) */}
        {selectedCategory === 'All' && !searchQuery.trim() && filteredStories.length > 0 && (
          <div className="relative rounded-3xl border border-ink/10 bg-white overflow-hidden shadow-md hover:shadow-xl transition">
            <div className="grid lg:grid-cols-12 items-stretch">
              <div className="relative h-72 sm:h-96 lg:h-auto lg:col-span-7 overflow-hidden bg-ink/5">
                <img
                  src={filteredStories[0].coverImage}
                  alt={filteredStories[0].title}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded-full bg-moss px-3 py-1 text-xs font-black text-white shadow-sm">
                    Featured Hero Story
                  </span>
                  <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    {filteredStories[0].category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-ink/50">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {filteredStories[0].date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {filteredStories[0].readTime}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
                    {filteredStories[0].title}
                  </h2>

                  <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">
                    {filteredStories[0].excerpt}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {filteredStories[0].metrics.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="rounded-2xl bg-cream/50 p-3 text-center border border-ink/5">
                        <span className="text-[10px] uppercase font-bold text-ink/40 block">{m.label}</span>
                        <span className="font-display text-base font-black text-moss">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/stories/${filteredStories[0].id}`}
                    className="inline-flex items-center justify-between w-full rounded-2xl bg-moss px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#224433] transition"
                  >
                    <span>Read Full Featured Story</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(selectedCategory === 'All' && !searchQuery.trim() ? filteredStories.slice(1) : filteredStories).map((story) => (
            <article
              key={story.id}
              className="group flex flex-col justify-between rounded-3xl border border-ink/10 bg-white overflow-hidden shadow-sm hover:shadow-xl transition hover:border-moss/30"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-56 w-full overflow-hidden bg-ink/5">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                      {story.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-moss shadow-sm backdrop-blur-md truncate block">
                      {story.partnerFeatured}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-[11px] text-ink/50">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {story.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {story.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-moss transition leading-snug line-clamp-2">
                    {story.title}
                  </h3>

                  <p className="text-xs text-ink/70 leading-relaxed line-clamp-2">
                    {story.excerpt}
                  </p>

                  {/* Impact Metric Chips */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ink/5">
                    {story.metrics.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="rounded-xl bg-cream/40 p-2 text-center">
                        <span className="text-[9px] uppercase font-bold text-ink/40 block truncate">{m.label}</span>
                        <span className="font-display text-xs font-black text-moss truncate block">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                <Link
                  href={`/stories/${story.id}`}
                  className="flex items-center justify-between rounded-xl border border-ink/10 bg-cream/40 p-2.5 text-xs font-bold text-ink hover:bg-moss hover:text-white hover:border-moss transition"
                >
                  <span>Read Story</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
