'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import {
  Building2,
  Utensils,
  CheckCircle2,
  Send,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

function PartnerRegisterContent() {
  const searchParams = useSearchParams();
  const defaultType = searchParams?.get('type') || 'venue';

  const [partnerType, setPartnerType] = useState<'venue' | 'caterer'>(
    defaultType === 'caterer' ? 'caterer' : 'venue'
  );

  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: defaultType === 'caterer' ? 'Caterer' : 'Banquet Hall',
    city: 'Mumbai',
    estimatedDailySurplus: 150,
    address: '',
    website: '',
    capacity: 800,
    fssaiLicense: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; inquiryId?: string; message?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: form.businessName,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          businessType: partnerType === 'venue' ? 'Banquet Hall' : 'Caterer',
          city: form.city,
          estimatedDailySurplus: Number(form.estimatedDailySurplus) || 100,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Failed to submit registration');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with registration server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar />

      <SubpageHeader
        breadcrumbs={[{ label: 'Partner Onboarding' }]}
        eyebrow="Zero Food Waste Hospitality Network"
        title={partnerType === 'venue' ? 'List Your Wedding Venue' : 'Register as a Caterer'}
        badge="Zero Partner Fees"
        description="Join Mumbai’s leading network of banquet halls and celebration caterers. Turn inevitable event food surplus into corporate social impact and prevent landfill waste."
      />

      <div className="section-shell py-10 lg:py-14">
        <div className="max-w-3xl mx-auto">
          {result?.success ? (
            <div className="rounded-3xl border border-moss/30 bg-white p-8 sm:p-12 shadow-lg text-center space-y-5 animate-in fade-in">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-sage/40 text-moss mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Partner Registration Application Received!
              </h2>
              <p className="text-sm text-ink/70 max-w-lg mx-auto leading-relaxed">
                Thank you for applying to enroll <strong>{form.businessName}</strong>. Our partnership manager will review your location, conduct an introductory kitchen onboarding, and provide your team with FoodRescue thermal canisters.
              </p>

              <div className="rounded-2xl bg-cream/70 p-4 border border-ink/5 max-w-sm mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40 block">
                  Application Reference ID
                </span>
                <span className="font-mono text-xl font-black text-moss mt-0.5 block">
                  {result.inquiryId ? result.inquiryId.slice(0, 16) : `PRT-MUM-${Math.floor(Math.random() * 90000 + 10000)}`}
                </span>
              </div>

              <div className="rounded-2xl bg-cream/30 p-5 text-left text-xs space-y-2 border border-ink/5 max-w-lg mx-auto">
                <h4 className="font-bold text-ink">Onboarding Process:</h4>
                <p>1. Review of banquet location and vehicle service gate access.</p>
                <p>2. Complimentary staff training on infrared laser food temperature checks.</p>
                <p>3. Delivery of FoodRescue insulated containers and zero-waste certification badge.</p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/venues"
                  className="rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white hover:bg-[#224433] transition"
                >
                  Explore Partner Venues Directory
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-10 shadow-sm space-y-8">
              {/* Type Selector */}
              <div className="flex rounded-2xl border border-ink/10 bg-cream/40 p-1">
                <button
                  type="button"
                  onClick={() => setPartnerType('venue')}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition flex-1 cursor-pointer ${
                    partnerType === 'venue' ? 'bg-moss text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  <Building2 size={16} />
                  <span>List a Wedding / Banquet Venue</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerType('caterer')}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition flex-1 cursor-pointer ${
                    partnerType === 'caterer' ? 'bg-moss text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  <Utensils size={16} />
                  <span>Register as Catering Business</span>
                </button>
              </div>

              {error && (
                <div className="rounded-2xl bg-tomato/10 p-4 text-xs font-bold text-tomato border border-tomato/20 flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">
                      {partnerType === 'venue' ? 'Banquet / Venue Name *' : 'Catering Business Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={partnerType === 'venue' ? 'e.g. Royal Palms Ballroom' : 'e.g. Silver Spoon Caterers'}
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">Primary Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="Manager or Executive Chef"
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">Business Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="events@yourbusiness.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">Direct Mobile / Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 12345"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-ink">Physical Kitchen / Venue Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, neighborhood, Mumbai"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">City *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">
                      {partnerType === 'venue' ? 'Guest Capacity (Max)' : 'Maximum Event Capacity'}
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={10000}
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">Estimated Monthly Surplus Servings</label>
                    <input
                      type="number"
                      min={50}
                      value={form.estimatedDailySurplus}
                      onChange={(e) => setForm({ ...form, estimatedDailySurplus: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">Official Website or Social Profile Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                  />
                </div>

                <div className="pt-4 border-t border-ink/5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="primary-button w-full justify-center py-4 text-xs uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    <Send size={15} />
                    <span>{loading ? 'Submitting Application...' : 'Submit Partnership Application'}</span>
                  </button>
                  <p className="mt-2 text-center text-[11px] text-ink/50">
                    Free partner onboarding with ESG zero-waste certification documentation.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function PartnerRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center p-12 text-xs font-bold text-ink/50">Loading Partner Registration...</div>}>
      <PartnerRegisterContent />
    </Suspense>
  );
}

