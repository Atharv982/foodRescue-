'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import { storiesData } from '@/lib/directory-data';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  Building2,
  Quote,
  Sparkles,
  Award
} from 'lucide-react';
import { useState } from 'react';

export default function StoryDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [copied, setCopied] = useState(false);

  const story = storiesData.find((s) => s.id === id || s.slug === id);

  if (!story) {
    return (
      <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
        <Navbar />
        <div className="section-shell py-24 text-center">
          <Heart size={48} className="mx-auto text-ink/30 mb-4" />
          <h1 className="font-display text-2xl font-bold text-ink">Story Not Found</h1>
          <p className="mt-2 text-sm text-ink/60">
            The story you requested is not available.
          </p>
          <Link
            href="/stories"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#224433]"
          >
            <ArrowLeft size={14} /> Back to Stories
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar />

      <SubpageHeader
        breadcrumbs={[
          { label: 'Stories', href: '/stories' },
          { label: story.title },
        ]}
        eyebrow={`Verified Field Story · ${story.category}`}
        title={story.title}
        badge={story.readTime}
        description={story.subtitle}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={13} />
              <span>{copied ? 'Link Copied!' : 'Share Story'}</span>
            </button>
            <Link
              href="/stories"
              className="rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> All Stories
            </Link>
          </div>
        }
      />

      <div className="section-shell py-10 lg:py-14">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Cover Photo */}
          <div className="relative h-80 sm:h-[420px] w-full overflow-hidden rounded-3xl bg-ink/5 shadow-md">
            <img
              src={story.coverImage}
              alt={story.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-moss shadow-sm backdrop-blur-md">
                Featured Partners: {story.partnerFeatured}
              </span>
            </div>
          </div>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-ink/10 text-xs text-ink/60">
            <div className="flex items-center gap-4">
              <span>Author: <strong>{story.author}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {story.date}
              </span>
            </div>
            <span className="rounded-full bg-sage/60 px-3 py-1 text-xs font-bold text-moss">
              {story.category}
            </span>
          </div>

          {/* Key Impact Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {story.metrics.map((m, idx) => (
              <div key={idx} className="rounded-2xl border border-ink/10 bg-white p-4 text-center shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink/40 block">{m.label}</span>
                <span className="font-display text-xl font-black text-moss mt-1 block">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Story Narrative Paragraphs */}
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-10 shadow-sm space-y-5 text-sm sm:text-base text-ink/80 leading-relaxed font-sans">
            {story.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Quote Block */}
          {story.quote && (
            <div className="rounded-3xl border border-moss/20 bg-sage/20 p-6 sm:p-8 space-y-3 relative">
              <Quote size={32} className="text-moss/40 absolute top-6 right-6" />
              <p className="font-display text-base sm:text-lg font-bold text-ink italic leading-snug">
                “{story.quote.text}”
              </p>
              <div className="pt-2 text-xs font-bold text-moss">
                — {story.quote.author}, <span className="text-ink/60 font-medium">{story.quote.role}</span>
              </div>
            </div>
          )}

          {/* Related Stories */}
          <div className="pt-8 border-t border-ink/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-moss">More Community Voices</span>
                <h3 className="font-display text-xl font-bold text-ink">Related Food Rescue Stories</h3>
              </div>
              <Link href="/stories" className="text-xs font-bold text-moss hover:underline">
                View All Stories →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {storiesData
                .filter((s) => s.id !== story.id)
                .slice(0, 3)
                .map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/stories/${rel.id}`}
                    className="group flex flex-col justify-between rounded-2xl border border-ink/10 bg-white p-4 shadow-xs hover:shadow-md transition hover:border-moss/30"
                  >
                    <div className="space-y-2">
                      <div className="relative h-28 w-full overflow-hidden rounded-xl bg-ink/5">
                        <img
                          src={rel.coverImage}
                          alt={rel.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-bold text-white">
                          {rel.category}
                        </span>
                      </div>
                      <h4 className="font-display text-xs font-bold text-ink group-hover:text-moss line-clamp-2">
                        {rel.title}
                      </h4>
                      <p className="text-[10px] text-ink/60 line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-moss flex items-center justify-between">
                      <span>Read Story</span>
                      <span>→</span>
                    </span>
                  </Link>
                ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="rounded-3xl border border-ink/10 bg-white p-8 text-center space-y-4 shadow-sm">
            <Sparkles size={32} className="mx-auto text-moss" />
            <h3 className="font-display text-xl font-bold text-ink">
              Hosting an upcoming wedding or banquet?
            </h3>
            <p className="text-xs text-ink/65 max-w-md mx-auto">
              Ensure untouched celebration food nourishes children and elders across Mumbai with 100% free scheduled volunteer pickup.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/schedule-pickup" className="primary-button text-xs py-2.5 px-5">
                Schedule Food Rescue Pickup
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
