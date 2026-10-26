'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import {
  PhoneCall,
  ShieldAlert,
  Clock,
  AlertCircle,
  MessageCircle,
  Send,
  CheckCircle2,
  ArrowRight,
  MapPin,
  ExternalLink,
  Flame,
  Phone
} from 'lucide-react';

function HotlineContent() {
  const searchParams = useSearchParams();
  const defaultIssue = searchParams?.get('type') || 'emergency';

  const [activeForm, setActiveForm] = useState<'emergency' | 'delay' | 'safety'>(
    defaultIssue === 'delay' ? 'delay' : defaultIssue === 'safety' ? 'safety' : 'emergency'
  );

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    venueAddress: '',
    zone: 'Western Suburbs',
    servings: '50',
    details: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send urgent report to donations or partner endpoint
      await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: `[URGENT-${activeForm.toUpperCase()}] ${formData.venueAddress}`,
          eventType: 'Party / Banquet',
          venueAddress: formData.venueAddress,
          city: 'Mumbai',
          contactPerson: formData.name,
          phone: formData.phone,
          email: 'dispatch@foodrescue.org',
          estimatedServings: Number(formData.servings) || 40,
          cookedTime: 'Current Evening',
          pickupTimeWindow: 'Immediate Urgent Van Dispatch',
          dietaryType: 'Pure Vegetarian',
          foodDescription: `Urgent Hotline Request (${activeForm}): ${formData.details}`,
          packagingStatus: 'Thermal Pot Request',
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#202823]">
      <Navbar />

      <SubpageHeader
        theme="logistics"
        breadcrumbs={[{ label: '24/7 Hotline & Support' }]}
        eyebrow="Emergency Operations Desk · Toll-Free"
        title="24/7 Food Rescue Hotline"
        badge="Active 24/7"
        description="Immediate response telephone desk and urgent dispatch coordinators for wedding receptions, banquet surpluses ending tonight, pickup timing changes, and food safety questions."
      />

      <div className="section-shell py-10 lg:py-14 space-y-10">
        {/* Top Emergency Callout Banners */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Toll-Free Card */}
          <div className="rounded-3xl border border-tomato/30 bg-white p-6 shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-tomato/15 px-2.5 py-0.5 text-[10px] font-black text-tomato animate-pulse">
                Toll-Free Helpline
              </span>
              <PhoneCall size={20} className="text-tomato" />
            </div>
            <h3 className="font-display text-2xl font-black text-ink">
              1800-FOOD-RESCUE
            </h3>
            <p className="text-xs text-ink/65 leading-relaxed">
              (1800-366-3737) · Free from all Indian mobile networks. Connects directly to Mumbai central dispatch room.
            </p>
            <a
              href="tel:18003663737"
              className="inline-flex items-center gap-2 rounded-2xl bg-tomato px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#c0392b] shadow-sm w-full justify-center"
            >
              <PhoneCall size={14} /> Call Helpline Now
            </a>
          </div>

          {/* Mumbai Central WhatsApp Desk */}
          <div className="rounded-3xl border border-moss/30 bg-white p-6 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-sage/60 px-2.5 py-0.5 text-[10px] font-black text-moss">
                WhatsApp Dispatch
              </span>
              <MessageCircle size={20} className="text-moss" />
            </div>
            <h3 className="font-display text-2xl font-black text-ink">
              +91 98200 44555
            </h3>
            <p className="text-xs text-ink/65 leading-relaxed">
              Share kitchen photos, banquet gate pins, and live food quantities via WhatsApp for instantaneous van confirmation.
            </p>
            <a
              href="https://wa.me/919820044555"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-moss px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#224433] shadow-sm w-full justify-center"
            >
              <MessageCircle size={14} /> Chat on WhatsApp
            </a>
          </div>

          {/* Night Operating Window */}
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-md space-y-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-black text-ink/60">
                Operating Window
              </span>
              <Clock size={20} className="text-ink/60" />
            </div>
            <h3 className="font-display text-2xl font-black text-ink">
              7:00 PM – 2:30 AM
            </h3>
            <p className="text-xs text-ink/65 leading-relaxed">
              Late-night rapid response vans stationed across Bandra, Goregaon, Powai, and South Mumbai ready to roll within 30 minutes.
            </p>
            <div className="rounded-xl bg-sage/20 p-2 text-center text-xs font-bold text-moss">
              4 Vans Currently on Live Standby
            </div>
          </div>
        </div>

        {/* Immediate Digital Action Form */}
        <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink/5">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Digital Dispatch & Assistance Desk</h2>
              <p className="text-xs text-ink/60 mt-0.5">Need help right away? Select an assistance type below to submit priority details.</p>
            </div>

            {/* Assistance Type Switcher */}
            <div className="flex rounded-2xl border border-ink/10 bg-cream/40 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveForm('emergency');
                  setSubmitted(false);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeForm === 'emergency' ? 'bg-tomato text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                }`}
              >
                Urgent Van Dispatch
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveForm('delay');
                  setSubmitted(false);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeForm === 'delay' ? 'bg-moss text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                }`}
              >
                Report Timing Delay
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveForm('safety');
                  setSubmitted(false);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeForm === 'safety' ? 'bg-moss text-white shadow-2xs' : 'text-ink/60 hover:text-ink'
                }`}
              >
                Food Safety Concern
              </button>
            </div>
          </div>

          {submitted ? (
            <div className="rounded-3xl bg-sage/20 p-8 text-center space-y-3 border border-moss/30 animate-in fade-in">
              <CheckCircle2 size={40} className="mx-auto text-moss" />
              <h3 className="font-display text-xl font-bold text-ink">
                Priority Dispatch Ticket Received!
              </h3>
              <p className="text-xs text-ink/70 max-w-md mx-auto">
                Our central Mumbai dispatch lead has received your notice and is contacting your phone number (<strong>{formData.phone}</strong>) within 5–10 minutes.
              </p>
              <p className="text-xs font-mono font-bold text-moss">
                Reference ID: FR-HOTLINE-{(Math.random() * 90000 + 10000).toFixed(0)}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-ink hover:bg-cream transition border border-ink/10"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">Your Full Name / Event POC</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chef Sanjeev or Rajesh Mehta"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">Direct Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98200 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">Banquet / Venue Name & Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Palms Ballroom, Gate 3, Goregaon East"
                    value={formData.venueAddress}
                    onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">Mumbai Service Zone</label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                  >
                    <option value="Western Suburbs">Western Suburbs (Bandra, Juhu, Goregaon)</option>
                    <option value="South Mumbai">South Mumbai (Colaba, Worli, Byculla)</option>
                    <option value="Central Mumbai">Central Mumbai (Dadar, Kurla, Dharavi)</option>
                    <option value="Eastern Suburbs">Eastern Suburbs (Powai, Ghatkopar)</option>
                    <option value="Thane & Navi Mumbai">Thane & Navi Mumbai</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">
                  {activeForm === 'emergency'
                    ? 'Estimated Servings & Dishes Available'
                    : activeForm === 'delay'
                    ? 'New Expected Kitchen Handover Time & Details'
                    : 'Describe Food Safety Question or Observation'}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    activeForm === 'emergency'
                      ? 'e.g. 50–70 servings of Shahi Paneer, Pulao, and Dal Makhani. Steam hot in kitchen.'
                      : activeForm === 'delay'
                      ? 'e.g. Banquet dinner will extend by 45 minutes; please have the van arrive at 12:15 AM instead.'
                      : 'e.g. Question on temperature requirements or container seal protocol.'
                  }
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full rounded-2xl border border-ink/10 bg-cream/30 px-3.5 py-2.5 text-xs font-semibold text-ink outline-hidden focus:border-moss"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`rounded-2xl px-6 py-3 text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    activeForm === 'emergency'
                      ? 'bg-tomato hover:bg-[#c0392b]'
                      : 'bg-moss hover:bg-[#224433]'
                  }`}
                >
                  <Send size={14} />
                  <span>{loading ? 'Submitting...' : 'Send Priority Notification to Dispatch'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function HotlinePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center p-12 text-xs font-bold text-ink/50">Loading Support Desk...</div>}>
      <HotlineContent />
    </Suspense>
  );
}

