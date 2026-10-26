'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import { PickupJourney, PickupStatus, Driver, Vehicle } from '@/types/logistics';
import { initialDrivers, initialVehicles } from '@/lib/logistics-client';
import {
  Truck,
  Package,
  Clock3,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  Navigation,
  ShieldCheck,
  User,
  Phone,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Building2,
  Heart,
  Thermometer,
  FileCheck
} from 'lucide-react';

function PickupDetailContent() {
  const params = useParams();
  const router = useRouter();
  const journeyId = params.id as string;

  const [journey, setJourney] = useState<PickupJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Coordinator Driver Assignment State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Delivery Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [proofForm, setProofForm] = useState({
    recipientName: '',
    deliveredServings: 0,
    temperatureReading: '67.5°C',
    recipientDesignation: 'Shelter Director / Head Warden',
    notes: 'All food received in hot condition and accepted for dinner distribution.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
  });

  const fetchJourney = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pickups/${journeyId}`);
      const data = await res.json();
      if (data.success) {
        setJourney(data.journey);
        setProofForm((prev) => ({
          ...prev,
          deliveredServings: data.journey.servings,
          recipientName: data.journey.destinationShelterName ? `Warden (${data.journey.destinationShelterName})` : '',
        }));
      } else {
        setError(data.error || 'Failed to load journey');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error fetching tracking dossier');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (journeyId) fetchJourney();
  }, [journeyId]);

  // Handle Driver Assignment
  const handleAssignDriver = async () => {
    if (!selectedDriverId) return;
    setAssigning(true);
    setActionSuccessMessage(null);

    try {
      const res = await fetch(`/api/pickups/${journeyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign_driver',
          driverId: selectedDriverId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setJourney(data.journey);
        setShowAssignModal(false);
        setActionSuccessMessage('Driver and insulated vehicle successfully assigned to this rescue mission.');
      } else {
        alert(data.error || 'Failed to assign driver');
      }
    } catch (err) {
      alert('Error updating assignment');
    } finally {
      setAssigning(false);
    }
  };

  // Handle Delivery Confirmation
  const handleConfirmDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirming(true);
    setActionSuccessMessage(null);

    try {
      const res = await fetch(`/api/pickups/${journeyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm_delivery',
          proof: {
            ...proofForm,
            confirmedAt: new Date().toISOString(),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setJourney(data.journey);
        setShowConfirmModal(false);
        setActionSuccessMessage('Delivery confirmed! Impact metrics have been updated in the Social Impact Ledger.');
      } else {
        alert(data.error || 'Failed to confirm delivery');
      }
    } catch (err) {
      alert('Network error confirming delivery');
    } finally {
      setConfirming(false);
    }
  };

  // Standard ordered stages for the timeline
  const orderedStages: { key: PickupStatus; title: string; desc: string }[] = [
    { key: 'donation_submitted', title: 'Donation Intake Submitted', desc: 'Surplus registered by banquet host' },
    { key: 'donation_reviewed', title: 'FSSAI Intake Approved', desc: 'Verified suitable for safe hot recovery' },
    { key: 'pickup_scheduled', title: 'Pickup Time Confirmed', desc: 'Scheduled during banquet closing window' },
    { key: 'driver_assigned', title: 'Thermal Van Assigned', desc: 'Dedicated driver assigned in corridor' },
    { key: 'en_route_pickup', title: 'Van En Route to Venue', desc: 'Volunteer vehicle navigating to service gate' },
    { key: 'food_collected', title: 'Food Collected & Temperature Audited', desc: 'Probed >65°C and sealed into thermal bins' },
    { key: 'delivery_en_route', title: 'Express Transit to Shelter', desc: 'Direct 90-minute hot chain delivery' },
    { key: 'delivered_to_shelter', title: 'Arrived at Recipient Shelter', desc: 'Arrived at shelter loading dock' },
    { key: 'delivery_confirmed', title: 'Recipient Confirmed & Served', desc: 'Handover complete with digital receipt' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
        <Navbar />
        <div className="section-shell py-24 text-center">
          <RotateCcw size={28} className="animate-spin mx-auto text-moss mb-3" />
          <p className="text-xs font-bold text-ink/60">Loading live tracking telemetry for {journeyId}...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
        <Navbar />
        <div className="section-shell py-24 text-center space-y-4">
          <AlertCircle size={36} className="mx-auto text-tomato" />
          <h2 className="font-display text-2xl font-black text-ink">Journey Not Found</h2>
          <p className="text-xs text-ink/65 max-w-md mx-auto">
            {error || `No tracking journey was found matching reference ${journeyId}.`}
          </p>
          <Link href="/pickups" className="primary-button text-xs py-2.5 px-5 inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Pickups Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Find index of current status in orderedStages
  const currentStageIndex = orderedStages.findIndex((s) => s.key === journey.status);
  const isDelivered = journey.status === 'delivery_confirmed';

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar />

      <SubpageHeader
        theme="logistics"
        breadcrumbs={[
          { label: 'Rescue Hub', href: '/rescue-hub' },
          { label: 'Pickups', href: '/pickups' },
          { label: journey.id },
        ]}
        eyebrow="Certified Hot-Chain Food Recovery"
        title={journey.title}
        badge={journey.id}
        description={`Live logistics journey for ${journey.servings} meals (${journey.dietaryType}) from ${journey.donorName} to ${journey.destinationShelterName || 'Recipient Shelter'}.`}
      />

      <div className="section-shell py-8 lg:py-12 space-y-7">
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/pickups"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-moss hover:underline"
          >
            <ArrowLeft size={14} /> Back to All Tracking Journeys
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fetchJourney}
              className="rounded-2xl border border-ink/10 bg-white px-3.5 py-2 text-xs font-bold text-ink hover:bg-cream transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw size={13} /> Refresh Status
            </button>

            {/* Coordinator Controls */}
            {!isDelivered && (
              <>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(true)}
                  className="rounded-2xl border border-moss/30 bg-white px-4 py-2 text-xs font-bold text-moss hover:bg-moss/5 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <User size={13} /> {journey.assignedDriverName ? 'Reassign Driver' : 'Assign Driver'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="rounded-2xl bg-moss px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#224433] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={14} /> Record Delivery Handover
                </button>
              </>
            )}
          </div>
        </div>

        {actionSuccessMessage && (
          <div className="rounded-2xl border border-moss/30 bg-sage/40 p-4 text-xs font-bold text-moss flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2-COLUMN MAIN LAYOUT: TIMELINE & DETAILS */}
        {/* ============================================================== */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* LEFT: INTERACTIVE MULTI-STAGE TRACKING TIMELINE */}
          <div className="rounded-[32px] border border-ink/10 bg-white p-6 sm:p-10 shadow-soft space-y-7">
            <div className="flex items-center justify-between border-b border-ink/10 pb-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink/40 tracking-wider block">
                  Journey State Machine
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-ink">
                  Live Dispatch Timeline
                </h3>
              </div>

              <span className="rounded-full bg-sage/60 px-3 py-1 text-xs font-black text-moss flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {journey.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            {/* Vertical Interactive Step Timeline */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-ink/10">
              {orderedStages.map((stage, idx) => {
                const isPassed = currentStageIndex > idx || isDelivered;
                const isCurrent = currentStageIndex === idx && !isDelivered;

                // Find matching event from timeline log
                const matchingEvent = journey.timeline.find((e) => e.status === stage.key);

                return (
                  <div key={stage.key} className="relative group">
                    {/* Circle Node Indicator */}
                    <div
                      className={`absolute -left-[27px] top-0 grid h-6 w-6 place-items-center rounded-full transition-all ${
                        isPassed
                          ? 'bg-[#193D30] text-white shadow-xs'
                          : isCurrent
                          ? 'bg-blue-600 ring-4 ring-blue-100 text-white animate-pulse'
                          : 'bg-[#E7E8E3] border-2 border-slate-300 text-charcoal/40'
                      }`}
                    >
                      {isPassed ? <Check size={12} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent ? 'text-blue-700 font-black' : isPassed ? 'text-[#193D30]' : 'text-ink/40'
                          }`}
                        >
                          {stage.title}
                        </h4>

                        {matchingEvent && (
                          <span className="text-[10px] text-ink/50 font-semibold">
                            {new Date(matchingEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <p className={`text-xs ${isCurrent ? 'text-ink/80' : isPassed ? 'text-ink/65' : 'text-ink/40'}`}>
                        {stage.desc}
                      </p>

                      {matchingEvent && (
                        <div className="text-[11px] text-ink/60 bg-cream/30 p-2.5 rounded-xl border border-ink/5 space-y-0.5 mt-2">
                          <p>
                            <strong>Action:</strong> {matchingEvent.actorName} ({matchingEvent.actorRole})
                          </p>
                          {matchingEvent.notes && (
                            <p className="text-forest font-medium">📝 {matchingEvent.notes}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Proof Card (if verified) */}
            {journey.deliveryProof && (
              <div className="mt-8 rounded-3xl border border-forest/30 bg-forest/5 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-base font-bold text-forest flex items-center gap-2">
                    <ShieldCheck size={18} /> Verified Handover Proof
                  </h4>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black text-forest border border-forest/20">
                    Audit Certified
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Recipient Signatory</span>
                    <p className="font-bold text-ink">{journey.deliveryProof.recipientName}</p>
                    <p className="text-ink/60">{journey.deliveryProof.recipientDesignation}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Handover Temperature</span>
                    <p className="font-black text-forest flex items-center gap-1">
                      <Thermometer size={14} /> {journey.deliveryProof.temperatureReading}
                    </p>
                    <p className="text-ink/60">FSSAI Hot-Chain Compliant</p>
                  </div>
                </div>

                {journey.deliveryProof.notes && (
                  <p className="text-xs text-ink/75 bg-white/70 p-3 rounded-2xl border border-ink/5">
                    <strong>Handover Notes:</strong> {journey.deliveryProof.notes}
                  </p>
                )}

                {journey.deliveryProof.imageUrl && (
                  <div className="relative mt-2 overflow-hidden rounded-2xl border border-forest/20 group">
                    <img
                      src={journey.deliveryProof.imageUrl}
                      alt="Delivery handover proof"
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1.5">
                      <Camera size={11} /> Photo Verification Timestamp: {new Date(journey.deliveryProof.confirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: DRIVER, FLEET & ROUTING CARDS */}
          <div className="space-y-6">
            {/* 1. Driver & Vehicle Telemetry Card */}
            <div className="rounded-[32px] border border-ink/10 bg-white p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <h4 className="font-display text-base font-bold text-ink flex items-center gap-2">
                  <Truck size={17} className="text-moss" /> Assigned Logistics Team
                </h4>
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold text-ink/60">
                  {journey.assignedVehicleType || 'Insulated Van'}
                </span>
              </div>

              {journey.assignedDriverName ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-moss/10 text-moss font-bold text-lg shrink-0">
                      <User size={22} />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-ink">{journey.assignedDriverName}</h5>
                      <span className="text-xs text-ink/60 flex items-center gap-1">
                        <Phone size={11} className="text-moss" /> {journey.assignedDriverPhone}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-cream/40 p-3.5 border border-ink/5 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-ink/50">Vehicle Plate:</span>
                      <strong className="font-mono text-ink">{journey.assignedVehiclePlate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/50">Insulation:</span>
                      <strong className="text-moss">Food-Grade Double Walled</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/50">Corridor:</span>
                      <strong>{journey.pickupZone}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 space-y-2 text-xs">
                  <p className="text-ink/60">No driver assigned yet for this pickup window.</p>
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(true)}
                    className="rounded-xl bg-moss px-4 py-2 text-xs font-bold text-white hover:bg-[#224433] transition"
                  >
                    Assign Driver Now
                  </button>
                </div>
              )}
            </div>

            {/* 2. Origin & Destination Routing Card */}
            <div className="rounded-[32px] border border-ink/10 bg-white p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <h4 className="font-display text-base font-bold text-ink flex items-center gap-2">
                  <Navigation size={17} className="text-moss" /> Delivery Route
                </h4>
                <Link
                  href="/live-map"
                  className="text-[11px] font-bold text-moss hover:underline flex items-center gap-1"
                >
                  <span>View on Live Map</span> <ExternalLink size={10} />
                </Link>
              </div>

              <div className="space-y-4 text-xs">
                {/* Origin */}
                <div className="flex items-start gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-xl bg-moss/10 text-moss shrink-0 font-bold text-[10px]">
                    A
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Origin Pickup</span>
                    <p className="font-bold text-ink">{journey.donorName}</p>
                    <p className="text-ink/65 text-[11px]">{journey.pickupAddress}</p>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex items-start gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-xl bg-tomato/10 text-tomato shrink-0 font-bold text-[10px]">
                    B
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink/40 block">Destination Shelter</span>
                    <p className="font-bold text-ink">{journey.destinationShelterName || 'Pending Assignment'}</p>
                    <p className="text-ink/65 text-[11px]">{journey.destinationAddress || 'Mumbai Region'}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${journey.pickupLat},${journey.pickupLng}&destination=${journey.destinationLat || 19.118},${journey.destinationLng || 72.865}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-2xl bg-cream/70 p-3 text-center text-xs font-bold text-ink hover:bg-cream transition flex items-center justify-center gap-1.5"
                  >
                    <Navigation size={13} className="text-moss" /> Open Google Maps Driving Route <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Food Spec Sheet Card */}
            <div className="rounded-[32px] border border-ink/10 bg-white p-6 shadow-soft space-y-4 text-xs">
              <h4 className="font-display text-base font-bold text-ink flex items-center gap-2 border-b border-ink/10 pb-3">
                <Package size={17} className="text-moss" /> Food Cargo Specification
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink/50">Servings Count:</span>
                  <strong className="text-moss text-sm">{journey.servings} Meals</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/50">Estimated Weight:</span>
                  <strong>{journey.estimatedKg} kg</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/50">Classification:</span>
                  <strong>{journey.dietaryType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/50">Packaging:</span>
                  <strong>{journey.packagingStatus}</strong>
                </div>
              </div>

              <div className="bg-cream/40 p-3 rounded-2xl border border-ink/5">
                <span className="text-[10px] uppercase font-bold text-ink/40 block">Dishes Included</span>
                <p className="text-ink/80 mt-0.5">{journey.foodDescription}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODAL 1: ASSIGN DRIVER (COORDINATOR DISPATCH) */}
        {/* ============================================================== */}
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md rounded-[32px] border border-ink/10 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
              <div>
                <h3 className="font-display text-xl font-black text-ink">
                  Assign Lead Driver & Van
                </h3>
                <p className="text-xs text-ink/60 mt-1">
                  Assign an available volunteer driver and insulated vehicle to {journey.id}.
                </p>
              </div>

              <div className="space-y-3">
                {initialDrivers.map((d) => (
                  <label
                    key={d.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      selectedDriverId === d.id
                        ? 'border-moss bg-moss/5 text-moss'
                        : 'border-ink/10 bg-cream/20 hover:bg-cream/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="driver"
                        checked={selectedDriverId === d.id}
                        onChange={() => setSelectedDriverId(d.id)}
                        className="text-moss focus:ring-moss"
                      />
                      <div>
                        <span className="text-xs font-bold text-ink block">{d.name}</span>
                        <span className="text-[11px] text-ink/50 block">
                          {d.vehiclePlate} · {d.assignedZone}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-moss bg-sage/60 px-2 py-0.5 rounded-full">
                      {d.status.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="rounded-2xl border border-ink/10 px-4 py-2.5 text-xs font-bold text-ink hover:bg-cream transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignDriver}
                  disabled={!selectedDriverId || assigning}
                  className="rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white hover:bg-[#224433] transition disabled:opacity-50 cursor-pointer"
                >
                  {assigning ? 'Dispatching...' : 'Confirm Assignment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: CONFIRM DELIVERY (RECIPIENT HANDOVER) */}
        {/* ============================================================== */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg rounded-[32px] border border-ink/10 bg-white p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div>
                <span className="text-[10px] uppercase font-bold text-moss tracking-wider">
                  Handover Verification
                </span>
                <h3 className="font-display text-xl font-black text-ink mt-0.5">
                  Confirm Food Delivery to Shelter
                </h3>
                <p className="text-xs text-ink/60 mt-1">
                  Record digital handover verification to mark delivery complete and count towards verified social impact metrics.
                </p>
              </div>

              <form onSubmit={handleConfirmDelivery} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    Recipient Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fr. Noel Pinto / Smt. Vandana Shah"
                    value={proofForm.recipientName}
                    onChange={(e) => setProofForm({ ...proofForm, recipientName: e.target.value })}
                    className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-ink mb-1">
                      Servings Accepted *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={proofForm.deliveredServings}
                      onChange={(e) => setProofForm({ ...proofForm, deliveredServings: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink mb-1">
                      Laser Temperature Probe *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 67.5°C Steam Hot"
                      value={proofForm.temperatureReading}
                      onChange={(e) => setProofForm({ ...proofForm, temperatureReading: e.target.value })}
                      className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">
                    Handover Notes & Observations
                  </label>
                  <textarea
                    rows={2}
                    value={proofForm.notes}
                    onChange={(e) => setProofForm({ ...proofForm, notes: e.target.value })}
                    className="w-full rounded-2xl border border-ink/15 bg-cream/30 p-3 font-semibold text-ink outline-hidden focus:border-moss"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="rounded-2xl border border-ink/10 px-4 py-2.5 text-xs font-bold text-ink hover:bg-cream transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={confirming}
                    className="rounded-2xl bg-moss px-5 py-2.5 text-xs font-bold text-white hover:bg-[#224433] transition disabled:opacity-50 cursor-pointer"
                  >
                    {confirming ? 'Recording Handover...' : 'Certify & Complete Delivery'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function PickupDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center p-12 text-xs font-bold text-ink/50">
          Loading Pickup Tracking Dossier...
        </div>
      }
    >
      <PickupDetailContent />
    </Suspense>
  );
}
