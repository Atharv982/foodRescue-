'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Minus,
  Plus,
  ArrowRight,
  Copy,
  Check,
  Heart,
  Users,
  Truck
} from 'lucide-react';
import type { FoodBox } from '@/types/food';
import { formatTime } from '@/lib/food-data';
import { reservationSchema } from '@/lib/validation';
import CustomDropdown, { DropdownOption } from './CustomDropdown';

interface ReservationModalProps {
  box: FoodBox;
  onClose: () => void;
  onSuccess: (foodBoxId: string, quantity: number) => void;
}

const destinationOptions: DropdownOption[] = [
  { value: 'Children Shelter / Orphanage', label: 'Children Shelter / Orphanage 🧒', badge: 'Kids', hint: 'Sneha Sadan, Asha Sadan, etc.' },
  { value: 'Night Shelter for Homeless', label: 'Night Shelter for Homeless ⛺', badge: 'Night Care', hint: 'Railway station & municipal shelters' },
  { value: 'Community Slum Kitchen', label: 'Community Slum Relief Kitchen 🍲', badge: 'Slums', hint: 'Direct community distribution' },
  { value: 'Old Age Home', label: 'Senior Citizens / Old Age Home 👵', badge: 'Elders', hint: 'Ashray Dham, Senior Destitute' },
  { value: 'Needy Family Relief', label: 'Needy Family Targeted Relief 🤝', badge: 'Families', hint: 'Daily wage worker families' },
  { value: 'Individual Volunteer Distribution', label: 'Individual Volunteer Distribution 🚗', badge: 'Volunteer', hint: 'Street-level direct distribution' },
];

const deliveryOptions: DropdownOption[] = [
  { value: 'volunteer-van', label: 'Direct Volunteer Van Delivery 🚐', badge: 'Recommended', hint: 'Our insulated van delivers to your gate' },
  { value: 'self-pickup', label: 'Self-Pickup by Shelter Representative 🚗', badge: 'Fastest', hint: 'Pick up directly from the venue gate' },
  { value: 'express-courier', label: 'Rapid Volunteer Two-Wheeler 🛵', badge: 'Express', hint: 'Ideal for 15–30 servings' },
];

export default function ReservationModal({ box, onClose, onSuccess }: ReservationModalProps) {
  const [form, setForm] = useState({
    customerName: '',
    representativeName: '',
    email: '',
    phone: '',
    destinationType: 'Children Shelter / Orphanage',
    deliveryMethod: 'volunteer-van',
    pickupSlot: 'standard',
    notes: '',
  });

  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reservationId, setReservationId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const totalServings = box.servings * quantity;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationResult = reservationSchema.safeParse({
      foodBoxId: box.id,
      customerName: form.customerName,
      representativeName: form.representativeName,
      email: form.email,
      phone: form.phone,
      quantity,
      destinationType: form.destinationType,
      pickupSlot: form.pickupSlot,
      notes: form.notes,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
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
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationResult.data),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to confirm food relief claim');
      }

      setReservationId(data.reservationId);
      setStatus('success');
      onSuccess(box.id, quantity);
    } catch (err) {
      console.error('Reservation error:', err);
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'We could not complete your claim. Please call our hotline directly.'
      );
    }
  };

  const handleCopyCode = () => {
    if (reservationId) {
      navigator.clipboard.writeText(reservationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-[36px] bg-white shadow-2xl border border-ink/10 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 p-6 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-moss">
              Free Food Relief Allocation
            </span>
            <h2 className="font-display text-xl font-black text-ink">
              Claim Surplus Batch for Shelter
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-ink/10 text-ink/60 transition hover:bg-cream hover:text-ink cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-moss text-white shadow-lg shadow-moss/20">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="mt-5 font-display text-2xl font-black text-ink">
              Food Batch Successfully Claimed!
            </h3>
            <p className="mt-2 text-xs text-ink/60 leading-relaxed max-w-sm mx-auto">
              This surplus celebration batch has been allocated for your shelter. Our volunteer driver will deliver <strong>{totalServings} warm meals</strong> safely to your door.
            </p>

            <div className="mt-6 rounded-2xl border border-ink/10 bg-cream/60 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                Rescue Claim Passcode
              </span>
              <div className="mt-1 flex items-center justify-center gap-3">
                <span className="font-mono text-xl font-black tracking-widest text-moss">
                  {reservationId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-xs font-bold text-ink shadow-2xs hover:bg-cream cursor-pointer"
                >
                  {copied ? <Check size={13} className="text-moss" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="primary-button w-full py-3.5 text-xs cursor-pointer"
              >
                Close & Return to Batches
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 pt-4" noValidate>
            {/* Batch summary card */}
            <div className="flex items-center justify-between rounded-2xl bg-cream/50 p-3.5 border border-ink/5">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold text-moss uppercase tracking-wider block">
                  {box.category} · {box.partnerName}
                </span>
                <span className="font-display text-sm font-black text-ink truncate block">
                  {box.name}
                </span>
                <span className="text-[11px] text-ink/60 flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-moss shrink-0" /> {box.venueName}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-display text-base font-black text-moss">{box.servings} Meals</span>
                <span className="block text-[10px] text-ink/40">per batch unit</span>
              </div>
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-tomato/30 bg-tomato/10 p-3.5 text-xs text-[#A43D29]">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="mt-5 space-y-4">
              {/* Organization or Shelter Name */}
              <div>
                <label className="text-xs font-bold text-ink">
                  Organization, Shelter or Community Name *
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="e.g., Sneha Sadan Orphanage Home"
                  className={`mt-1.5 w-full rounded-2xl border bg-white px-4 py-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 ${
                    errors.customerName ? 'border-tomato bg-tomato/5' : 'border-ink/10 focus:border-moss'
                  }`}
                />
                {errors.customerName && (
                  <p className="mt-1 text-[11px] font-semibold text-tomato">{errors.customerName}</p>
                )}
              </div>

              {/* Interactive Dropdown 1: Destination Type */}
              <CustomDropdown
                label="Where will this food be distributed? *"
                value={form.destinationType}
                options={destinationOptions}
                onChange={(val) => setForm({ ...form, destinationType: val })}
              />

              {/* Interactive Dropdown 2: Delivery Logistics */}
              <CustomDropdown
                label="Delivery Logistics Method *"
                value={form.deliveryMethod}
                options={deliveryOptions}
                onChange={(val) => setForm({ ...form, deliveryMethod: val })}
              />

              {/* Coordinator Contact & Phone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-ink">Coordinator Name *</label>
                  <input
                    type="text"
                    value={form.representativeName}
                    onChange={(e) => setForm({ ...form, representativeName: e.target.value })}
                    placeholder="Warden / Volunteer Name"
                    className="mt-1.5 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 focus:border-moss"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink">Mobile Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                    }
                    placeholder="9876543210"
                    className={`mt-1.5 w-full rounded-2xl border bg-white px-4 py-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 ${
                      errors.phone ? 'border-tomato bg-tomato/5' : 'border-ink/10 focus:border-moss'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] font-semibold text-tomato">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-ink">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="coordinator@shelter.org"
                  className={`mt-1.5 w-full rounded-2xl border bg-white px-4 py-3 text-xs font-medium text-ink outline-hidden transition placeholder:text-ink/30 ${
                    errors.email ? 'border-tomato bg-tomato/5' : 'border-ink/10 focus:border-moss'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] font-semibold text-tomato">{errors.email}</p>
                )}
              </div>

              {/* Quantity Units Stepper */}
              <div>
                <label className="text-xs font-bold text-ink">Portion Units to Claim</label>
                <div className="mt-1.5 flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-cream/70 text-ink transition hover:bg-cream disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <div className="text-center">
                    <span className="font-display text-lg font-black text-ink">{quantity} unit{quantity > 1 ? 's' : ''}</span>
                    <span className="text-[11px] text-moss ml-2 font-bold">({totalServings} Meals)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(box.quantityAvailable, q + 1))}
                    disabled={quantity >= box.quantityAvailable}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-cream/70 text-ink transition hover:bg-cream disabled:opacity-30 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-ink/50">
                  <span>Max {box.quantityAvailable} units available</span>
                  <span className="font-bold text-moss">Nourishes {totalServings} people</span>
                </div>
              </div>

              {/* Delivery / Distribution Notes */}
              <div>
                <label className="text-xs font-bold text-ink">Special Instructions or Delivery Gate (Optional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Please enter from Gate 2 near the playground"
                  className="mt-1.5 w-full rounded-2xl border border-ink/10 bg-white px-3.5 py-3 text-xs text-ink outline-hidden focus:border-moss"
                />
              </div>
            </div>

            {/* 100% Free Notice */}
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-sage/40 p-3.5 border border-moss/20">
              <span className="text-xs font-bold text-moss flex items-center gap-1.5">
                <Heart size={14} className="fill-moss" /> 100% Free Non-Profit Food Relief:
              </span>
              <span className="font-display text-sm font-black text-moss">₹0 (Zero Charge)</span>
            </div>

            {/* Submit buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={status === 'loading'}
                className="secondary-button flex-1 py-3 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="primary-button flex-1 py-3 text-xs cursor-pointer"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Allocating Batch...
                  </span>
                ) : (
                  <>
                    Confirm Food Claim <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
