'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Heart,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  ShieldCheck,
  Sparkles,
  Package,
  MapPin,
  Calendar,
  Utensils,
  Phone,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Lock,
  Building2
} from 'lucide-react';
import CustomDropdown, { DropdownOption } from './CustomDropdown';

const eventTypeOptions: DropdownOption[] = [
  { value: 'Wedding', label: 'Wedding Reception 💍', badge: 'High Volume', hint: 'Grand dinner banquet' },
  { value: 'Party / Banquet', label: 'Party / Banquet Hall 🎂', badge: 'Celebrations', hint: 'Birthday / Anniversary' },
  { value: 'Corporate Event', label: 'Corporate Gala / Summit 🏢', badge: 'Summits', hint: 'Conference dinner buffet' },
  { value: 'Caterer', label: 'Caterer Bulk Cooking Pots 🍲', badge: 'Bulk Kitchen', hint: 'Surplus degh pots' },
  { value: 'Bakery & Café', label: 'Bakery & Café Daily Surplus 🥐', badge: 'Deli Bakes', hint: 'Bread & sandwiches' },
  { value: 'Religious Gathering', label: 'Religious Gathering / Langar 🕊️', badge: 'Community', hint: 'Mahotsav & community feasts' },
];

const cityOptions: DropdownOption[] = [
  { value: 'Western Suburbs (Bandra, Andheri, Goregaon, Juhu)', label: 'Western Suburbs (Bandra–Goregaon)', badge: 'Fastest', hint: 'Bandra, Andheri, Goregaon, Juhu' },
  { value: 'South Mumbai (Colaba, Marine Drive, Lower Parel)', label: 'South Mumbai (Colaba–Lower Parel)', badge: 'Town', hint: 'Colaba, Marine Drive, Byculla, Worli' },
  { value: 'Central Mumbai (Dadar, Shivaji Park, Kurla)', label: 'Central Mumbai (Dadar–Kurla)', badge: 'Central', hint: 'Dadar, Shivaji Park, Sion, Kurla' },
  { value: 'Eastern Suburbs (Powai, Ghatkopar, Vikhroli)', label: 'Eastern Suburbs (Powai–Ghatkopar)', badge: 'East', hint: 'Powai, Vikhroli, Ghatkopar, Mulund' },
  { value: 'Thane & Navi Mumbai', label: 'Thane & Navi Mumbai', badge: 'Extended', hint: 'Navi Mumbai & Thane banquet lawns' },
];

const dietaryOptions: DropdownOption[] = [
  { value: 'Pure Vegetarian', label: 'Pure Vegetarian 🌿', badge: 'Veg', hint: '100% pure vegetarian preparation' },
  { value: 'Non-Vegetarian', label: 'Non-Vegetarian 🍗', badge: 'Non-Veg', hint: 'Chicken, mutton & fish curries' },
  { value: 'Mixed Buffet', label: 'Mixed Buffet (Both Veg & Non-Veg) 🍱', badge: 'Mixed', hint: 'Separate containers available' },
];

const packagingOptions: DropdownOption[] = [
  { value: 'Already Packed in Containers', label: 'Already Packed in Host Containers 📦', badge: 'Ready', hint: 'Ready for immediate loading' },
  { value: 'Needs Rescue Team Containers', label: 'Needs Rescue Team Stainless Bins 🍲', badge: 'Team Brings', hint: 'Volunteers pack into thermal pots' },
  { value: 'Mixed', label: 'Mixed (Some packed, some in pots)', badge: 'Partial', hint: 'Assistance needed from team' },
];

const vehicleRequirements: DropdownOption[] = [
  { value: 'Small Volunteer Vehicle (10–50 servings)', label: 'Small Volunteer Vehicle (10–50 servings) 🚗', badge: '10–50', hint: 'Quick response courier car' },
  { value: 'Medium Insulated Van (50–200 servings)', label: 'Medium Insulated Van (50–200 servings) 🚐', badge: '50–200', hint: 'Thermal holding bins on board' },
  { value: 'Heavy Logistics Rescue Truck (200–1,000+ servings)', label: 'Heavy Rescue Truck (200–1,000+ servings) 🚚', badge: '200+', hint: 'Large royal wedding banquet' },
];

export interface FoodDonationRegistrationFormProps {
  initialValues?: {
    venue?: string;
    caterer?: string;
    servings?: string;
    type?: string;
  };
  onSuccess?: (donationId: string) => void;
  standalone?: boolean;
  embedded?: boolean;
}

export default function FoodDonationRegistrationForm({
  initialValues,
  onSuccess,
  standalone = false,
  embedded = false,
}: FoodDonationRegistrationFormProps) {
  // Current Wizard Step: 1, 2, 3, 4, 5 (Review)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [form, setForm] = useState({
    eventName: initialValues?.venue ? `${initialValues.venue} Evening Feast` : '',
    eventType: initialValues?.type === 'Corporate' ? 'Corporate Event' : 'Wedding',
    venueAddress: initialValues?.venue ? `${initialValues.venue}, Mumbai` : '',
    city: 'Western Suburbs (Bandra, Andheri, Goregaon, Juhu)',
    contactPerson: '',
    phone: '',
    email: '',
    estimatedServings: Number(initialValues?.servings) || 85,
    cookedTime: '20:00',
    pickupTimeWindow: '22:30 - 23:45',
    dietaryType: 'Pure Vegetarian',
    foodDescription: 'Shahi Paneer, Dal Makhani, Jeera Rice, Tandoori Rotis',
    packagingStatus: 'Needs Rescue Team Containers',
    vehicleNeeded: 'Medium Insulated Van (50–200 servings)',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Email OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [verifiedEmailAddress, setVerifiedEmailAddress] = useState<string | null>(null);

  // Final Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; donationId: string; message: string } | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // When email changes after verification, invalidate verification
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setForm((prev) => ({ ...prev, email: newEmail }));
    if (isEmailVerified && newEmail !== verifiedEmailAddress) {
      setIsEmailVerified(false);
      setVerificationToken(null);
      setVerifiedEmailAddress(null);
      setOtpSent(false);
      setOtpInputs(['', '', '', '', '', '']);
      setOtpMessage({
        text: 'Email changed. Re-verification with a new code will be required.',
        type: 'info',
      });
    }
  };

  // Trigger Send OTP
  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address to receive verification code' }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.email;
      return copy;
    });

    setOtpLoading(true);
    setOtpMessage(null);

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpMessage({ text: data.error || 'Failed to send verification code.', type: 'error' });
        if (data.cooldownSeconds) setCooldown(data.cooldownSeconds);
      } else {
        setOtpSent(true);
        setCooldown(data.cooldownSeconds || 60);
        setOtpMessage({
          text: `Verification code sent to ${form.email}. Please check your inbox or spam folder.`,
          type: 'success',
        });
        // Focus first OTP input
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      }
    } catch (err) {
      setOtpMessage({ text: 'Network error while sending verification code. Please try again.', type: 'error' });
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle individual OTP digit change
  const handleOtpDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    const newInputs = [...otpInputs];

    if (cleaned.length > 1) {
      // User pasted multiple characters
      const pastedDigits = cleaned.slice(0, 6).split('');
      pastedDigits.forEach((d, i) => {
        if (index + i < 6) {
          newInputs[index + i] = d;
        }
      });
      setOtpInputs(newInputs);
      const nextFocus = Math.min(5, index + pastedDigits.length);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    newInputs[index] = cleaned;
    setOtpInputs(newInputs);

    // Auto-advance
    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation in OTP
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste in OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newInputs = ['', '', '', '', '', ''];
    pasted.split('').forEach((digit, i) => {
      newInputs[i] = digit;
    });
    setOtpInputs(newInputs);
    const nextIdx = Math.min(5, pasted.length - 1);
    otpInputRefs.current[nextIdx]?.focus();
  };

  // Verify submitted OTP
  const handleVerifyOtp = async () => {
    const fullCode = otpInputs.join('');
    if (fullCode.length !== 6) {
      setOtpMessage({ text: 'Please enter all 6 digits of the verification code.', type: 'error' });
      return;
    }

    setOtpLoading(true);
    setOtpMessage(null);

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: fullCode }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpMessage({ text: data.error || 'Verification failed. Please check the code and try again.', type: 'error' });
      } else {
        setIsEmailVerified(true);
        setVerificationToken(data.verificationToken);
        setVerifiedEmailAddress(form.email);
        setOtpMessage({ text: 'Email verified successfully! You may now proceed.', type: 'success' });
      }
    } catch (err) {
      setOtpMessage({ text: 'Network error during verification. Please try again.', type: 'error' });
    } finally {
      setOtpLoading(false);
    }
  };

  // Validate individual steps before advancing
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!form.eventName.trim()) newErrors.eventName = 'Please enter an event or wedding title';
      if (!form.venueAddress.trim() || form.venueAddress.trim().length < 5) {
        newErrors.venueAddress = 'Please enter the complete banquet hall or venue address (min 5 characters)';
      }
      if (!form.city.trim()) newErrors.city = 'Please select or enter your city/locality';
    }

    if (stepNumber === 2) {
      if (!form.contactPerson.trim()) newErrors.contactPerson = 'Contact person name is required';
      const phoneClean = form.phone.replace(/\D/g, '');
      if (phoneClean.length !== 10) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.email || !emailRegex.test(form.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (!isEmailVerified) {
        newErrors.email = 'Please verify your email address using the 6-digit OTP code before proceeding';
      }
    }

    if (stepNumber === 3) {
      if (!form.estimatedServings || form.estimatedServings < 10) {
        newErrors.estimatedServings = 'Minimum 10 servings required for vehicle dispatch';
      }
      if (!form.foodDescription.trim() || form.foodDescription.trim().length < 5) {
        newErrors.foodDescription = 'Please list main dishes (e.g. Shahi Paneer, Dal Makhani, Jeera Rice, Rotis)';
      }
    }

    if (stepNumber === 4) {
      if (!form.pickupTimeWindow.trim()) {
        newErrors.pickupTimeWindow = 'Please specify the pickup time window';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: standalone ? 180 : 400, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final checks
    if (!isEmailVerified || !verificationToken) {
      setSubmitError('Email verification is required before submitting. Please complete Step 2 verification.');
      setCurrentStep(2);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          verificationToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit food donation registration.');
      }

      setResult({
        success: true,
        donationId: data.donationId,
        message: data.message,
      });

      if (onSuccess) {
        onSuccess(data.donationId);
      }
    } catch (err: any) {
      console.error('Final donation submission error:', err);
      setSubmitError(err?.message || 'A network error occurred while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setCurrentStep(1);
    setResult(null);
    setSubmitError(null);
    setIsEmailVerified(false);
    setVerificationToken(null);
    setVerifiedEmailAddress(null);
    setOtpSent(false);
    setOtpInputs(['', '', '', '', '', '']);
    setForm({
      eventName: '',
      eventType: 'Wedding',
      venueAddress: '',
      city: 'Western Suburbs (Bandra, Andheri, Goregaon, Juhu)',
      contactPerson: '',
      phone: '',
      email: '',
      estimatedServings: 85,
      cookedTime: '20:00',
      pickupTimeWindow: '22:30 - 23:45',
      dietaryType: 'Pure Vegetarian',
      foodDescription: 'Shahi Paneer, Dal Makhani, Jeera Rice, Tandoori Rotis',
      packagingStatus: 'Needs Rescue Team Containers',
      vehicleNeeded: 'Medium Insulated Van (50–200 servings)',
    });
  };

  // ==============================================================
  // REGISTRATION SUCCESS SCREEN
  // ==============================================================
  if (result?.success) {
    return (
      <div
        className={`text-center space-y-6 animate-in fade-in duration-300 ${
          embedded
            ? 'bg-transparent p-0'
            : 'rounded-[32px] border border-moss/30 bg-white p-6 sm:p-10 shadow-lg'
        }`}
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-sage/40 text-moss shadow-sm">
          <CheckCircle2 size={36} className="animate-in zoom-in" />
        </div>

        <div>
          <span className="rounded-full bg-sage/60 px-3 py-1 text-xs font-black text-moss uppercase tracking-wider">
            Verified & Registered
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-ink">
            Your Food Donation Registration Has Been Submitted
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-ink/70 max-w-lg mx-auto leading-relaxed">
            Thank you for helping prevent banquet waste. Our volunteer dispatch team has been notified and will coordinate pickup right at your venue loading bay.
          </p>
        </div>

        {/* Dossier Card */}
        <div className="max-w-xl mx-auto rounded-2xl border border-ink/10 bg-cream/40 p-5 text-left text-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between border-b border-ink/10 pb-3 gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink/40 block">Registration Reference</span>
              <span className="font-mono text-base font-black text-moss">{result.donationId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-ink/40 block">Verified Donor Email</span>
              <span className="font-bold text-ink flex items-center gap-1 justify-end">
                <Check size={13} className="text-moss" /> {verifiedEmailAddress || form.email}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink/40 block">Event Title</span>
              <span className="font-bold text-ink">{form.eventName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-ink/40 block">Venue & Corridor</span>
              <span className="font-bold text-ink truncate block">{form.venueAddress}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-ink/40 block">Estimated Servings</span>
              <span className="font-black text-moss">{form.estimatedServings} Meals ({form.dietaryType})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-ink/40 block">Pickup Window</span>
              <span className="font-bold text-ink">{form.pickupTimeWindow}</span>
            </div>
          </div>

          <div className="rounded-xl bg-white p-3 border border-ink/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink/40 block">Dishes Registered</span>
            <p className="text-ink/80">{form.foodDescription}</p>
          </div>
        </div>

        {/* 4-Step Next Steps Guide */}
        <div className="max-w-xl mx-auto rounded-2xl bg-cream/30 p-4 border border-ink/5 text-left space-y-2.5">
          <h4 className="font-bold text-xs text-ink flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-moss" /> Next Steps for Food Rescue Dispatch
          </h4>
          <div className="grid gap-2 text-[11px] text-ink/75 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-moss/10 text-moss font-bold text-[10px] shrink-0">1</span>
              <span><strong>Van Assignment:</strong> Volunteer vehicle ({form.vehicleNeeded.split(' ')[0]}) assigned in your corridor.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-moss/10 text-moss font-bold text-[10px] shrink-0">2</span>
              <span><strong>Pre-Arrival Call:</strong> Lead volunteer will call <strong>{form.phone}</strong> 30 mins before closing.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-moss/10 text-moss font-bold text-[10px] shrink-0">3</span>
              <span><strong>Laser Temp Audit:</strong> Dishes verified &gt;65°C steam-hot and packed into stainless pots.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-moss/10 text-moss font-bold text-[10px] shrink-0">4</span>
              <span><strong>Shelter Delivery:</strong> Warm dinner delivered to verified children's orphanage within 90 mins.</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/rescue-hub?tab=donations"
            className="primary-button text-xs py-3 px-5"
          >
            Track in Rescue Hub Dashboard <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            onClick={handleResetForm}
            className="rounded-2xl border border-ink/10 bg-white px-5 py-3 text-xs font-bold text-ink hover:bg-cream transition cursor-pointer"
          >
            Register Another Donation
          </button>
        </div>
      </div>
    );
  }

  // ==============================================================
  // STEP WIZARD FORM
  // ==============================================================
  return (
    <div
      className={`space-y-7 ${
        embedded
          ? 'bg-transparent p-0'
          : 'rounded-[32px] border border-ink/10 bg-white p-6 sm:p-10 shadow-soft'
      }`}
    >
      {/* Header */}
      <div className="space-y-2 border-b border-ink/10 pb-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-moss/10 px-3 py-1 text-xs font-bold text-moss">
          <Sparkles size={13} /> 100% Free Volunteer Pickup Service
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Register Your Food Donation
        </h2>
        <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">
          Help us rescue surplus food from weddings, celebrations, and events and deliver it to people in need.
        </p>
      </div>

      {/* Progress Indicator Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-ink">
          <span className="text-moss">
            Step {currentStep} of 5:{' '}
            {currentStep === 1 && 'Event Details'}
            {currentStep === 2 && 'Contact & Email Verification'}
            {currentStep === 3 && 'Food & Servings'}
            {currentStep === 4 && 'Pickup & Packaging'}
            {currentStep === 5 && 'Review & Final Confirmation'}
          </span>
          <span className="text-[11px] text-ink/50">
            {Math.round(((currentStep - 1) / 4) * 100)}% Completed
          </span>
        </div>

        {/* Step Progress Track */}
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;

            return (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-moss'
                    : isCurrent
                    ? 'bg-moss/70 ring-2 ring-moss/20'
                    : 'bg-ink/10'
                }`}
              />
            );
          })}
        </div>
      </div>

      {submitError && (
        <div className="rounded-2xl border border-tomato/30 bg-tomato/10 p-4 text-xs font-bold text-tomato flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================================== */}
        {/* STEP 1: EVENT DETAILS */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-moss">
              <Calendar size={14} /> Step 1: Celebration & Venue Details
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Event or Wedding Title <span className="text-tomato">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sharma & Verma Wedding Reception, Annual Corporate Gala"
                value={form.eventName}
                onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
              />
              {errors.eventName && <p className="mt-1 text-[11px] font-bold text-tomato">{errors.eventName}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Event Type <span className="text-tomato">*</span>
                </label>
                <CustomDropdown
                  options={eventTypeOptions}
                  value={form.eventType}
                  onChange={(val) => setForm({ ...form, eventType: val })}
                  placeholder="Select Event Type"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  City / Corridor <span className="text-tomato">*</span>
                </label>
                <CustomDropdown
                  options={cityOptions}
                  value={form.city}
                  onChange={(val) => setForm({ ...form, city: val })}
                  placeholder="Select Region"
                />
                {errors.city && <p className="mt-1 text-[11px] font-bold text-tomato">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Banquet Name & Exact Address <span className="text-tomato">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. The Royal Palms Grand Ballroom, Hall #2, Aarey Milk Colony, Goregaon East, Mumbai 400065"
                value={form.venueAddress}
                onChange={(e) => setForm({ ...form, venueAddress: e.target.value })}
                className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
              />
              <span className="text-[10px] text-ink/50 mt-1 block">
                Include gate number or service bay entry instructions for rescue van access.
              </span>
              {errors.venueAddress && <p className="mt-1 text-[11px] font-bold text-tomato">{errors.venueAddress}</p>}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: CONTACT & GMAIL EMAIL OTP VERIFICATION */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-moss">
              <User size={14} /> Step 2: Contact Information & Email Verification
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Host / Chef Name <span className="text-tomato">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    type="text"
                    placeholder="e.g. Sunil Sharma / Chef Vikram"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full rounded-2xl border border-ink/15 bg-cream/30 pl-9 pr-3.5 py-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
                  />
                </div>
                {errors.contactPerson && <p className="mt-1 text-[11px] font-bold text-tomato">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Mobile Number for Van Dispatch <span className="text-tomato">*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    type="tel"
                    placeholder="e.g. 9820123456"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-2xl border border-ink/15 bg-cream/30 pl-9 pr-3.5 py-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
                  />
                </div>
                <span className="text-[10px] text-ink/50 mt-1 block">Lead driver calls 30 minutes before arrival.</span>
                {errors.phone && <p className="mt-1 text-[11px] font-bold text-tomato">{errors.phone}</p>}
              </div>
            </div>

            {/* Email OTP Verification Panel */}
            <div className="rounded-3xl border border-ink/10 bg-cream/30 p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-display text-sm sm:text-base font-bold text-ink flex items-center gap-2">
                    <Mail size={16} className="text-moss" /> Email for Verification & Certificate <span className="text-tomato">*</span>
                  </h4>
                  <p className="text-xs text-ink/65 mt-0.5">
                    We send a secure one-time code to confirm your email and deliver your Tax 80G Food Relief Certificate.
                  </p>
                </div>

                {isEmailVerified && (
                  <span className="rounded-full bg-sage/60 px-3 py-1 text-xs font-black text-moss flex items-center gap-1 shrink-0">
                    <Check size={13} /> Verified
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    type="email"
                    placeholder="Enter your exact email address (e.g. name@gmail.com)"
                    value={form.email}
                    onChange={handleEmailChange}
                    disabled={isEmailVerified}
                    className={`w-full rounded-2xl border bg-white pl-9 pr-3.5 py-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:ring-2 focus:ring-moss/20 ${
                      isEmailVerified
                        ? 'border-moss bg-moss/5 text-moss font-bold cursor-not-allowed'
                        : 'border-ink/15'
                    }`}
                  />
                </div>

                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || cooldown > 0}
                    className="rounded-2xl bg-moss px-5 py-3.5 text-xs font-bold text-white transition hover:bg-[#224433] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {otpLoading ? (
                      <span className="flex items-center gap-1">
                        <RotateCcw size={13} className="animate-spin" /> Sending Code...
                      </span>
                    ) : cooldown > 0 ? (
                      `Resend in ${cooldown}s`
                    ) : otpSent ? (
                      'Resend Code'
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>
                )}

                {isEmailVerified && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmailVerified(false);
                      setVerificationToken(null);
                      setVerifiedEmailAddress(null);
                      setOtpSent(false);
                      setOtpInputs(['', '', '', '', '', '']);
                      setOtpMessage({ text: 'Please enter a new email and verify it.', type: 'info' });
                    }}
                    className="rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-xs font-bold text-ink hover:bg-cream transition shrink-0 cursor-pointer"
                  >
                    Change Email
                  </button>
                )}
              </div>

              {errors.email && <p className="text-[11px] font-bold text-tomato">{errors.email}</p>}

              {otpMessage && (
                <div
                  className={`rounded-xl p-3 text-xs font-bold flex items-start gap-2 ${
                    otpMessage.type === 'success'
                      ? 'bg-sage/40 text-moss'
                      : otpMessage.type === 'error'
                      ? 'bg-tomato/15 text-tomato'
                      : 'bg-cream text-ink/75'
                  }`}
                >
                  {otpMessage.type === 'success' ? (
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  ) : otpMessage.type === 'error' ? (
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  ) : (
                    <HelpCircle size={15} className="shrink-0 mt-0.5" />
                  )}
                  <span>{otpMessage.text}</span>
                </div>
              )}

              {/* Dedicated 6-Digit OTP Input Box (Shown when OTP has been sent and not yet verified) */}
              {otpSent && !isEmailVerified && (
                <div className="rounded-2xl border border-moss/20 bg-white p-5 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-ink flex items-center gap-1.5">
                      <Lock size={14} className="text-moss" /> Enter 6-Digit Verification Code
                    </span>
                    <span className="text-[11px] text-ink/50">
                      Code expires in <strong>10 minutes</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 sm:gap-3 py-1" onPaste={handleOtpPaste}>
                    {otpInputs.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`h-12 w-11 sm:h-14 sm:w-13 rounded-2xl border text-center font-mono text-xl sm:text-2xl font-black text-ink outline-hidden transition focus:border-moss focus:ring-2 focus:ring-moss/20 ${
                          digit ? 'border-moss bg-moss/5 text-moss' : 'border-ink/20 bg-cream/20'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={cooldown > 0 || otpLoading}
                      className="text-xs font-bold text-moss hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                    >
                      {cooldown > 0 ? `Didn't get code? Resend in ${cooldown}s` : 'Resend Verification Code'}
                    </button>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || otpInputs.join('').length !== 6}
                      className="w-full sm:w-auto rounded-xl bg-moss px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#224433] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1"
                    >
                      {otpLoading ? <RotateCcw size={13} className="animate-spin" /> : <Check size={13} />}
                      Verify Email
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: FOOD DETAILS */}
        {/* ============================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-moss">
              <Utensils size={14} /> Step 3: Food Quantity & Dietary Details
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Estimated Servings <span className="text-tomato">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={10}
                    max={3000}
                    placeholder="e.g. 85"
                    value={form.estimatedServings}
                    onChange={(e) => setForm({ ...form, estimatedServings: Math.max(0, Number(e.target.value)) })}
                    className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink/40">Plates</span>
                </div>
                <span className="text-[10px] text-ink/50 mt-1 block">Minimum 10 servings for volunteer vehicle deployment.</span>
                {errors.estimatedServings && <p className="mt-1 text-[11px] font-bold text-tomato">{errors.estimatedServings}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Dietary Classification <span className="text-tomato">*</span>
                </label>
                <CustomDropdown
                  options={dietaryOptions}
                  value={form.dietaryType}
                  onChange={(val) => setForm({ ...form, dietaryType: val })}
                  placeholder="Select Dietary Type"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Dishes Prepared / Food Description <span className="text-tomato">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Shahi Paneer, Dal Makhani, Jeera Rice, Tandoori Rotis, Gulab Jamun"
                value={form.foodDescription}
                onChange={(e) => setForm({ ...form, foodDescription: e.target.value })}
                className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
              />
              <span className="text-[10px] text-ink/50 mt-1 block">
                Helpful example: <strong>Shahi Paneer, Dal Makhani, Jeera Rice, Tandoori Rotis</strong>. Only untouched food is accepted.
              </span>
              {errors.foodDescription && <p className="mt-1 text-[11px] font-bold text-tomato">{errors.foodDescription}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Approximate Cooking / Dinner Closing Time
              </label>
              <input
                type="text"
                placeholder="e.g. Cooked at 19:30, Buffet winds down at 22:30"
                value={form.cookedTime}
                onChange={(e) => setForm({ ...form, cookedTime: e.target.value })}
                className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: PICKUP & PACKAGING */}
        {/* ============================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-moss">
              <Package size={14} /> Step 4: Pickup Window & Insulated Packaging
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Pickup Time Window <span className="text-tomato">*</span>
                </label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    type="text"
                    placeholder="e.g. 22:30 – 23:45 Tonight"
                    value={form.pickupTimeWindow}
                    onChange={(e) => setForm({ ...form, pickupTimeWindow: e.target.value })}
                    className="w-full rounded-2xl border border-ink/15 bg-cream/30 pl-9 pr-3.5 py-3.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden transition focus:border-moss focus:bg-white focus:ring-2 focus:ring-moss/20"
                  />
                </div>
                {errors.pickupTimeWindow && <p className="mt-1 text-[11px] font-bold text-tomato">{errors.pickupTimeWindow}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Packaging & Container Status <span className="text-tomato">*</span>
                </label>
                <CustomDropdown
                  options={packagingOptions}
                  value={form.packagingStatus}
                  onChange={(val) => setForm({ ...form, packagingStatus: val })}
                  placeholder="Select Packaging"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Vehicle Deployment Request
              </label>
              <CustomDropdown
                options={vehicleRequirements}
                value={form.vehicleNeeded}
                onChange={(val) => setForm({ ...form, vehicleNeeded: val })}
                placeholder="Select Vehicle"
              />
            </div>

            {/* FSSAI Safety Notice */}
            <div className="rounded-2xl border border-moss/20 bg-moss/5 p-4 flex items-start gap-3">
              <ShieldCheck size={20} className="text-moss shrink-0 mt-0.5" />
              <div className="text-xs text-ink/75 leading-relaxed">
                <strong className="text-moss">FSSAI Hot-Chain Guarantee:</strong> Our volunteer van arrives with food-grade thermal containers. Hot curries and rice will be temperature-probed (&gt;65°C) and safely delivered to local shelters within 90 minutes.
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 5: REVIEW & SUBMIT */}
        {/* ============================================================== */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-moss">
              <CheckCircle2 size={14} /> Step 5: Review & Confirm Registration
            </div>

            <div className="rounded-3xl border border-ink/10 bg-cream/30 p-5 sm:p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <span className="font-display text-base font-bold text-ink">Review Registration Summary</span>
                <span className="rounded-full bg-sage/60 px-3 py-0.5 text-[10px] font-black text-moss flex items-center gap-1">
                  <Check size={12} /> Email Verified
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Event Title & Venue</span>
                  <p className="font-bold text-ink">{form.eventName}</p>
                  <p className="text-ink/60">{form.venueAddress}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Contact Coordinator</span>
                  <p className="font-bold text-ink">{form.contactPerson}</p>
                  <p className="text-ink/60">{form.phone} · {form.email}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Food & Servings</span>
                  <p className="font-black text-moss text-sm">{form.estimatedServings} Meals ({form.dietaryType})</p>
                  <p className="text-ink/60">{form.foodDescription}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Pickup & Fleet</span>
                  <p className="font-bold text-ink">{form.pickupTimeWindow}</p>
                  <p className="text-ink/60">{form.packagingStatus} · {form.vehicleNeeded}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-cream/50 p-4 border border-ink/5 text-xs text-ink/70">
              By clicking <strong>Submit Food Donation Registration</strong>, you authorize FoodRescue’s certified volunteer van brigade to collect untouched surplus food from your celebration free of charge.
            </div>
          </div>
        )}

        {/* Wizard Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-ink/10 gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="rounded-2xl border border-ink/15 bg-white px-5 py-3 text-xs font-bold text-ink hover:bg-cream transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="rounded-2xl bg-moss px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#224433] transition flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              Continue to Step {currentStep + 1} <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || !isEmailVerified}
              className="rounded-2xl bg-moss px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#224433] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer ml-auto"
            >
              {submitting ? (
                <>
                  <RotateCcw size={15} className="animate-spin" /> Saving Registration...
                </>
              ) : (
                <>
                  <Send size={15} /> Submit Donation Registration
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
