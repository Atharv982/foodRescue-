'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Clock, MapPin, ArrowRight, ShieldCheck, Tag, Users, Heart, Building2, ExternalLink } from 'lucide-react';
import type { FoodBox } from '@/types/food';
import { formatTime } from '@/lib/food-data';

interface FoodBoxDetailModalProps {
  box: FoodBox;
  onClose: () => void;
  onReserve: (box: FoodBox) => void;
}

export default function FoodBoxDetailModal({ box, onClose, onReserve }: FoodBoxDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-food-box-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[36px] bg-[#f7f4ec] shadow-2xl border border-white/40">
        <div className="grid md:grid-cols-2">
          {/* Left: Image & Category */}
          <div className="relative min-h-[280px] md:min-h-[500px] bg-ink">
            <Image
              src={box.imageUrl}
              alt={box.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink backdrop-blur-xs">
                {box.category} Surplus
              </span>
              <span className="rounded-full bg-moss px-3 py-1 text-xs font-black text-white flex items-center gap-1">
                <Users size={12} /> Feeds {box.servings} People
              </span>
            </div>
          </div>

          {/* Right: Details & Action */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div>
              <div className="flex items-center justify-between gap-1.5 text-xs font-bold text-moss">
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 size={14} />
                  <span>{box.venueName} · {box.location}</span>
                </div>
                <Link
                  href={`/batches/${box.id}`}
                  className="rounded-lg bg-cream px-2 py-0.5 text-[10px] font-bold text-ink/70 hover:text-moss hover:bg-white transition shrink-0 flex items-center gap-1"
                >
                  <ExternalLink size={10} /> Full Page
                </Link>
              </div>

              <h2
                id="modal-food-box-title"
                className="mt-2 font-display text-2xl font-black tracking-tight text-ink sm:text-3xl"
              >
                {box.name}
              </h2>

              <p className="mt-3 text-xs leading-relaxed text-ink/70">
                {box.description}
              </p>

              {/* Servings Highlight */}
              <div className="mt-6 flex items-baseline justify-between rounded-2xl border border-ink/10 bg-white p-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Total Portion Capacity
                  </span>
                  <div className="font-display text-2xl font-black text-moss flex items-center gap-1.5">
                    <Users size={20} /> {box.servings} Hot Meals
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-sage px-3 py-1 text-xs font-black text-moss">
                    100% Free Relief
                  </span>
                </div>
              </div>

              {/* Logistics & Timing */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-ink/5 bg-white/70 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40 flex items-center gap-1">
                    <Clock size={11} /> Cooked Time
                  </span>
                  <p className="mt-1 font-bold text-ink">
                    Prepared at {box.cookedTime}
                  </p>
                </div>

                <div className="rounded-xl border border-ink/5 bg-white/70 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40 flex items-center gap-1">
                    <Clock size={11} /> Dispatch Window
                  </span>
                  <p className="mt-1 font-bold text-ink">
                    {formatTime(box.pickupStart)} – {formatTime(box.pickupEnd)}
                  </p>
                </div>
              </div>

              {/* Target Beneficiaries */}
              <div className="mt-4 rounded-xl border border-ink/5 bg-sage/40 p-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-moss flex items-center gap-1">
                  <Heart size={11} className="fill-moss" /> Recommended Beneficiary Route
                </span>
                <p className="mt-0.5 font-bold text-ink">
                  {box.beneficiaryTarget}
                </p>
              </div>

              {/* Included Menu Items */}
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40 flex items-center gap-1">
                  <Tag size={11} /> Freshly Cooked Dishes in Batch
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {box.includedItems.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-ink/10 bg-white px-3 py-1 text-[11px] font-semibold text-ink/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-4 border-t border-ink/10 flex items-center gap-2">
              <button
                onClick={() => onReserve(box)}
                disabled={box.quantityAvailable <= 0}
                className="primary-button flex-1 py-3.5 text-sm cursor-pointer"
              >
                {box.quantityAvailable <= 0 ? 'Allocated to Shelter' : (
                  <>
                    Claim Batch for Shelter / Relief <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
