'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Sparkles, Heart, ArrowRight, PhoneCall } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'Food Safety',
      question: 'Is surplus wedding and party food safe and hygienic to distribute?',
      answer:
        'Yes, strictly so. We only collect untouched food that remained in buffet warming dishes or stainless cooking pots in the kitchen, not food left on guest plates. Our trained volunteer brigade conducts temperature checks and organoleptic sensory testing before packing the food in sterile, food-grade thermal carriers.',
    },
    {
      category: 'Pickup Logistics',
      question: 'How quickly does your team arrive after our wedding or party ends?',
      answer:
        'We operate a rapid rescue protocol. Once your event coordinator or banquet manager alerts us that dinner service is concluding (typically around 10:30 PM – 11:30 PM), our nearest volunteer rescue vehicle arrives within 30–45 minutes to pack and transport the food immediately.',
    },
    {
      category: 'Cost & Fees',
      question: 'Does the wedding family or banquet hall have to pay for this pickup?',
      answer:
        'No, absolutely not. FoodRescue is a non-profit humanitarian initiative. Our pickup, packaging, quality inspection, and direct shelter delivery are 100% free of charge for both event hosts and recipient shelter homes.',
    },
    {
      category: 'Eligible Foods',
      question: 'What types of event food can be rescued?',
      answer:
        'We collect cooked curries, paneer, dals, rice varieties, biryanis, unbuttered or packed rotis/naans, dry snacks, bakery bakes, packaged sweets, and fresh cut fruits. Highly perishable items like raw mayonnaise dressings or ice creams with broken cold chains are excluded for safety.',
    },
    {
      category: 'Shelter Onboarding',
      question: 'How can an orphanage, old-age home, or local shelter register for meals?',
      answer:
        'Verified non-profit shelter homes, children orphanages, and night shelter coordinators can claim batches from the "Available Food Batches" marketplace or contact relief@foodrescue.in to be added to our scheduled nightly route.',
    },
    {
      category: 'Event Size',
      question: 'Can small parties, birthdays, or corporate gatherings also donate?',
      answer:
        'Yes! We accept surplus food donations starting from 15 servings up to 3,000+ servings. For small gatherings, volunteer two-wheelers with thermal bags are dispatched, while large weddings are serviced by our dedicated refrigerated rescue vans.',
    },
  ];

  return (
    <section id="faq" className="scroll-mt-24 border-t border-ink/10 bg-white/70 py-20 lg:py-28">
      <div className="section-shell">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow">
            <HelpCircle size={14} /> Frequently Asked Questions
          </div>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Everything you need to know<br />
            <span className="text-moss">about wedding & event food rescue.</span>
          </h2>
          <p className="mt-4 text-base text-ink/65">
            Transparent details regarding our hygiene clearances, volunteer logistics, and shelter delivery networks.
          </p>
        </div>

        {/* Accordion container */}
        <div className="mx-auto mt-14 max-w-3xl space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`overflow-hidden rounded-3xl border transition duration-200 ${
                  isOpen
                    ? 'border-moss/40 bg-white shadow-soft'
                    : 'border-ink/10 bg-cream/50 hover:bg-white hover:border-ink/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left transition sm:p-7 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-sage px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-moss uppercase">
                      {faq.category}
                    </span>
                    <h3 className="font-display text-base font-extrabold text-ink sm:text-lg">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`ml-4 grid h-9 w-9 shrink-0 place-items-center rounded-full transition duration-300 ${
                      isOpen ? 'rotate-180 bg-moss text-white' : 'bg-cream text-ink/60'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="animate-in fade-in duration-200 border-t border-ink/5 px-6 pb-6 pt-2 sm:px-7 sm:pb-7">
                    <p className="text-sm leading-relaxed text-ink/75 sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View full help center CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-ink/10 px-6 py-3.5 text-xs font-bold text-ink shadow-sm hover:bg-cream transition"
          >
            <span>Search Complete Help Center & Guidelines</span>
            <ArrowRight size={14} className="text-moss" />
          </Link>

          <Link
            href="/hotline"
            className="inline-flex items-center gap-2 rounded-2xl bg-tomato/10 border border-tomato/30 px-6 py-3.5 text-xs font-bold text-tomato shadow-sm hover:bg-tomato/20 transition"
          >
            <PhoneCall size={14} className="animate-pulse" />
            <span>24/7 Hotline Support Center</span>
          </Link>
        </div>

        {/* Emergency helpline banner */}
        <div className="mx-auto mt-8 max-w-xl text-center text-xs text-ink/50">
          Have an urgent wedding surplus pickup tonight? Call our 24/7 rescue helpline toll-free at{' '}
          <a href="tel:18003663737" className="font-bold text-tomato underline">
            1800-FOOD-RESCUE (1800-366-3737)
          </a>
          .
        </div>
      </div>
    </section>
  );
}
