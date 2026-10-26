'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import { faqsData } from '@/lib/directory-data';
import type { FaqItem } from '@/types/directory';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShieldCheck,
  Truck,
  Heart,
  MessageCircle,
  PhoneCall,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(faqsData[0]?.id || null);

  const filteredFaqs = useMemo(() => {
    return faqsData.filter((f) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQ = f.question.toLowerCase().includes(q);
        const matchA = f.answer.toLowerCase().includes(q);
        const matchTags = f.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchQ && !matchA && !matchTags) return false;
      }

      if (selectedCategory !== 'All' && f.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar />

      <SubpageHeader
        breadcrumbs={[{ label: 'Help Center & FAQs' }]}
        eyebrow="Knowledge Base & Protocols"
        title="Frequently Asked Questions"
        badge={`${filteredFaqs.length} Answers`}
        description="Clear, verified answers covering food safety compliance, banquet pickup scheduling, temperature verification, eligibility criteria, and volunteer coordination."
      />

      <div className="section-shell py-10 lg:py-14 space-y-8">
        {/* Search & Categories */}
        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm space-y-5">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or question (e.g. temperature, costs, late night)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-cream/40 pl-12 pr-4 py-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden focus:border-moss"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ink/5">
            {['All', 'Food Safety', 'Donors', 'Caterers', 'NGOs & Shelters', 'Logistics'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-moss text-white shadow-2xs'
                    : 'bg-cream/60 text-ink/70 hover:bg-cream hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="grid gap-4 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 rounded-3xl border border-ink/10 bg-white overflow-hidden shadow-sm divide-y divide-ink/5">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center text-xs text-ink/50">
                No matching questions found. Try searching with different keywords or contact our support team.
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedId === faq.id;

                return (
                  <div key={faq.id} className="transition">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between p-5 sm:p-6 text-left cursor-pointer hover:bg-cream/30"
                    >
                      <div className="pr-4">
                        <span className="rounded-full bg-sage/60 px-2.5 py-0.5 text-[9px] font-black text-moss uppercase tracking-wider block mb-1 w-max">
                          {faq.category}
                        </span>
                        <h3 className="font-display text-sm sm:text-base font-bold text-ink">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-ink/40 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-moss' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="bg-cream/20 px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-ink/75 leading-relaxed space-y-3 animate-in fade-in duration-150">
                        <p>{faq.answer}</p>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-lg bg-ink/5 px-2 py-0.5 text-[10px] font-medium text-ink/60"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Col: Need Help Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm space-y-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-tomato/10 text-tomato">
                <PhoneCall size={22} className="animate-pulse" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">Still have questions?</h3>
              <p className="text-xs text-ink/65 leading-relaxed">
                Our Mumbai rescue coordination team is available on toll-free telephone for urgent banquet pickups, temperature inquiries, and shelter onboarding.
              </p>

              <div className="pt-2 space-y-2">
                <a
                  href="tel:18003663737"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-tomato py-3 text-xs font-bold text-white shadow-sm hover:bg-[#c0392b] transition"
                >
                  <PhoneCall size={14} /> Call 1800-FOOD-RESCUE
                </a>
                <Link
                  href="/hotline"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-cream/60 py-2.5 text-xs font-bold text-ink hover:bg-cream transition"
                >
                  <MessageCircle size={14} /> Open 24/7 Support Desk
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-moss/20 bg-sage/20 p-6 space-y-3">
              <span className="text-[10px] uppercase font-bold text-moss tracking-wider block">
                Zero Cost Guarantee
              </span>
              <h4 className="font-display text-sm font-bold text-ink">
                100% Free Food Rescue for All Banquets
              </h4>
              <p className="text-xs text-ink/70">
                We never charge event hosts, caterers, or wedding venues for van collection, thermal crates, or distribution.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
