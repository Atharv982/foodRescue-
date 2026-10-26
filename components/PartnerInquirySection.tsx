'use client';

import { useState } from 'react';
import { Store, Send, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { partnerInquirySchema, type PartnerInquiryValues } from '@/lib/validation';

const businessTypes = ['Bakery', 'Café', 'Restaurant', 'Grocery', 'Catering', 'Other'] as const;
type BusinessType = (typeof businessTypes)[number];

const surplusOptions = ['1-5 boxes', '6-15 boxes', '16-30 boxes', '30+ boxes'] as const;
type SurplusOption = (typeof surplusOptions)[number];

interface FormState {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: BusinessType;
  city: string;
  estimatedDailySurplus: SurplusOption;
  message: string;
}

export default function PartnerInquirySection() {
  const [form, setForm] = useState<FormState>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'Bakery',
    city: 'Mumbai',
    estimatedDailySurplus: '6-15 boxes',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [inquiryId, setInquiryId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side Zod validation
    const result = partnerInquirySchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit partner inquiry');
      }

      setInquiryId(data.inquiryId);
      setStatus('success');
    } catch (err) {
      console.error('Partner inquiry submission error:', err);
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to submit your inquiry. Please try again.'
      );
    }
  };

  const handleReset = () => {
    setForm({
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      businessType: 'Bakery',
      city: 'Mumbai',
      estimatedDailySurplus: '6-15 boxes',
      message: '',
    });
    setErrors({});
    setStatus('idle');
    setInquiryId('');
    setErrorMessage('');
  };

  return (
    <section id="partner-form" className="scroll-mt-24 py-20 lg:py-28">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[38px] border border-ink/10 bg-white shadow-soft lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Column: Mission & Pitch */}
          <div className="flex flex-col justify-between bg-ink p-8 text-white sm:p-12 lg:p-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wider text-sage uppercase">
                <Store size={14} /> For Food Businesses
              </div>

              <h2 className="mt-5 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
                Turn your surplus into <span className="text-sage">sustainable revenue.</span>
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
                Join Mumbai’s leading bakeries, cafés, and restaurants that convert end-of-day surplus into customer loyalty, brand recognition, and zero landfill waste.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  {
                    title: 'Recover Inventory Costs',
                    desc: 'Convert what would be written off as waste into reliable daily cash flow.',
                  },
                  {
                    title: 'Attract New Local Customers',
                    desc: '74% of rescuers return during regular hours as paying full-price customers.',
                  },
                  {
                    title: 'Zero Operational Friction',
                    desc: 'Pack your daily surplus in our standard boxes and hand it over during your 60-minute window.',
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
              <span className="font-bold text-sage">No upfront fee: </span>
              Joining FoodRescue is 100% free for partners. We only succeed when your surplus is rescued.
            </div>
          </div>

          {/* Right Column: Working Interactive Form */}
          <div className="p-8 sm:p-12 lg:p-14">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-moss text-white shadow-lg shadow-moss/20">
                  <CheckCircle2 size={32} />
                </div>

                <h3 className="mt-6 font-display text-3xl font-black text-ink">
                  Inquiry Received!
                </h3>

                <p className="mt-2 max-w-md text-sm text-ink/65 leading-relaxed">
                  Thank you for taking a step towards zero waste. Our partner coordinator will review your details and reach out within 24 hours.
                </p>

                <div className="mt-6 w-full max-w-sm rounded-2xl border border-ink/10 bg-cream/70 p-4 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Inquiry Reference Code
                  </span>
                  <p className="mt-1 font-display text-xl font-black text-moss">
                    {inquiryId}
                  </p>
                  <p className="mt-1 text-xs text-ink/60">
                    Saved in project database. We sent a copy to {form.email}.
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="primary-button mt-8 text-xs"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div>
                  <h3 className="font-display text-2xl font-black text-ink">
                    Register Your Eatery
                  </h3>
                  <p className="mt-1 text-xs text-ink/55">
                    Fill out the form below. Our onboard team handles everything from setup to packaging.
                  </p>
                </div>

                {status === 'error' && (
                  <div className="mt-5 flex items-start gap-2 rounded-2xl border border-tomato/30 bg-tomato/10 p-3.5 text-xs text-[#A43D29]">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  {/* Business Name */}
                  <div>
                    <label className="text-xs font-bold text-ink">
                      Business or Eatery Name *
                    </label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      placeholder="e.g., Sourdough & Co."
                      className={`mt-1.5 w-full rounded-2xl border bg-cream/30 px-4 py-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 ${
                        errors.businessName ? 'border-tomato bg-tomato/5' : 'border-ink/10 focus:border-moss focus:bg-white'
                      }`}
                    />
                    {errors.businessName && (
                      <p className="mt-1 text-[11px] font-semibold text-tomato">{errors.businessName}</p>
                    )}
                  </div>

                  {/* Contact Name & Email */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-ink">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        value={form.contactName}
                        onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                        placeholder="Manager / Owner Name"
                        className={`mt-1.5 w-full rounded-2xl border bg-cream/30 px-4 py-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 ${
                          errors.contactName ? 'border-tomato bg-tomato/5' : 'border-ink/10 focus:border-moss focus:bg-white'
                        }`}
                      />
                      {errors.contactName && (
                        <p className="mt-1 text-[11px] font-semibold text-tomato">{errors.contactName}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="owner@eatery.com"
                        className={`mt-1.5 w-full rounded-2xl border bg-cream/30 px-4 py-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 ${
                          errors.email ? 'border-tomato bg-tomato/5' : 'border-ink/10 focus:border-moss focus:bg-white'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-[11px] font-semibold text-tomato">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & City */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-ink">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        placeholder="9876543210"
                        className={`mt-1.5 w-full rounded-2xl border bg-cream/30 px-4 py-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 ${
                          errors.phone ? 'border-tomato bg-tomato/5' : 'border-ink/10 focus:border-moss focus:bg-white'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-[11px] font-semibold text-tomato">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink">
                        City / Locality *
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Mumbai (Bandra)"
                        className={`mt-1.5 w-full rounded-2xl border bg-cream/30 px-4 py-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 ${
                          errors.city ? 'border-tomato bg-tomato/5' : 'border-ink/10 focus:border-moss focus:bg-white'
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-[11px] font-semibold text-tomato">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  {/* Business Type & Estimated Surplus */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-ink">
                        Business Type
                      </label>
                      <select
                        value={form.businessType}
                        onChange={(e) => setForm({ ...form, businessType: e.target.value as (typeof businessTypes)[number] })}
                        className="mt-1.5 w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-3 text-xs font-bold text-ink outline-hidden focus:border-moss focus:bg-white"
                      >
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink">
                        Estimated Daily Surplus
                      </label>
                      <select
                        value={form.estimatedDailySurplus}
                        onChange={(e) => setForm({ ...form, estimatedDailySurplus: e.target.value as (typeof surplusOptions)[number] })}
                        className="mt-1.5 w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-3 text-xs font-bold text-ink outline-hidden focus:border-moss focus:bg-white"
                      >
                        {surplusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-bold text-ink">
                      Optional Notes or Questions
                    </label>
                    <textarea
                      rows={2}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Any details about your current surplus schedule or food types..."
                      className="mt-1.5 w-full rounded-2xl border border-ink/10 bg-cream/30 p-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 focus:border-moss focus:bg-white"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <p className="text-[11px] text-ink/40">
                    Validated with Zod & stored in backend.
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="primary-button text-xs px-6 py-3"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        Submit Inquiry <Send size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
