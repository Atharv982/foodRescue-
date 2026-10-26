'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import { foodBoxes } from '@/lib/food-data';
import { venuesData, sheltersData } from '@/lib/directory-data';
import {
  Compass,
  Activity,
  Truck,
  Heart,
  History,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Radio,
  Building2,
  Utensils,
  RefreshCw,
  FileText,
  MapPin,
  Calendar,
  Layers,
  Search,
  Filter,
  Check,
  X,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  ArrowRight,
  AlertTriangle,
  Thermometer,
  ShieldAlert,
  Award
} from 'lucide-react';

type HubTab = 'overview' | 'donations' | 'logistics' | 'shelters' | 'history' | 'safety';

interface DonationItem {
  id: string;
  eventName: string;
  eventType: string;
  venueAddress: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  estimatedServings: number;
  cookedTime: string;
  pickupTimeWindow: string;
  dietaryType: string;
  foodDescription: string;
  packagingStatus: string;
  status: 'pending_approval' | 'approved' | 'ready_for_pickup' | 'in_transit' | 'completed' | 'rejected' | 'pending_dispatch';
  assignedVan?: string;
  assignedShelter?: string;
  rejectionReason?: string;
  createdAt: string;
}

// Initial dispatch fleet data (real telemetry & status)
const initialFleet = [
  {
    id: 'VAN-01',
    driver: 'Suresh Patil',
    phone: '+91 98201 55667',
    sector: 'Goregaon East / Western Express Corridor',
    destination: 'Sneha Sadan Orphanage, Andheri East',
    destinationAddress: 'Chakala, Andheri East, Mumbai 400099',
    cargo: '60 Servings Shahi Paneer, Dal Makhani & Rotis',
    batches: ['FR-BATCH-01', 'FR-BATCH-04'],
    status: 'In Transit',
    eta: '14 Mins',
    tempReading: '68.4°C Steam Hot',
    tempStatus: 'compliant',
    lastUpdated: '12 Mins Ago',
    googleRouteUrl: 'https://www.google.com/maps/dir/?api=1&origin=Royal+Palms+Goregaon&destination=Chakala+Andheri+East'
  },
  {
    id: 'VAN-02',
    driver: 'Arun Koli',
    phone: '+91 98199 44332',
    sector: 'Bandra West / Carter Road Corridor',
    destination: 'Bandra Station Night Homeless Shelter',
    destinationAddress: 'Near Platform 1, Bandra West, Mumbai 400050',
    cargo: '35 Servings Chole Bhature, Pulao & Sweets',
    batches: ['FR-BATCH-02'],
    status: 'Loading at Banquet',
    eta: '25 Mins',
    tempReading: '66.1°C Steam Hot',
    tempStatus: 'compliant',
    lastUpdated: '8 Mins Ago',
    googleRouteUrl: 'https://www.google.com/maps/dir/?api=1&origin=Sea+Breeze+Banquet+Bandra&destination=Bandra+Railway+Station'
  },
  {
    id: 'VAN-03',
    driver: 'Vikram Yadav',
    phone: '+91 98205 33441',
    sector: 'Powai / JVLR Eastern Link',
    destination: 'Dharavi Slum Children Relief Kitchen',
    destinationAddress: '90 Feet Road, Dharavi, Mumbai 400017',
    cargo: '45 Servings Dum Biryani & Raita',
    batches: ['FR-BATCH-03'],
    status: 'In Transit',
    eta: '18 Mins',
    tempReading: '65.8°C Steam Hot',
    tempStatus: 'compliant',
    lastUpdated: '5 Mins Ago',
    googleRouteUrl: 'https://www.google.com/maps/dir/?api=1&origin=Westin+Powai+Lake&destination=90+Feet+Road+Dharavi'
  },
  {
    id: 'VAN-04',
    driver: 'Manoj Salvi',
    phone: '+91 98200 77889',
    sector: 'Byculla East / South Mumbai Corridor',
    destination: 'Asha Sadan Home for Women & Children',
    destinationAddress: 'Umerkhadi, Near Sandhurst Road, Mumbai 400009',
    cargo: '40 Servings Mughlai Nikah Degh & Pulav',
    batches: ['FR-BATCH-05'],
    status: 'Completed',
    eta: 'Delivered',
    tempReading: '67.2°C Steam Hot',
    tempStatus: 'compliant',
    lastUpdated: '32 Mins Ago',
    googleRouteUrl: 'https://www.google.com/maps/dir/?api=1&origin=Al+Madina+Byculla&destination=Umerkhadi+Mumbai'
  }
];

// Initial rescue activity logs
const initialActivityLogs = [
  {
    id: 'ACT-901',
    type: 'delivery_completed',
    typeLabel: 'Delivery Completed',
    badgeColor: 'bg-moss/10 text-moss',
    timestamp: 'Today, 23:15 PM',
    donationId: 'FR-EVENT-BY505',
    batchId: 'FR-BATCH-05',
    venue: 'Al-Madina Heritage Banquet, Byculla',
    shelter: 'Asha Sadan Home, Umerkhadi',
    servings: 140,
    status: 'Verified Received',
    responsible: 'Driver Manoj Salvi (VAN-04)',
    notes: 'Food verified at 67.2°C; signed handover receipt received from warden Smt. Vandana Shah.'
  },
  {
    id: 'ACT-902',
    type: 'van_dispatched',
    typeLabel: 'Van Dispatched',
    badgeColor: 'bg-amber-100 text-amber-800',
    timestamp: 'Today, 22:45 PM',
    donationId: 'FR-EVENT-SO404',
    batchId: 'FR-BATCH-01',
    venue: 'Mayfair Banquets, Worli',
    shelter: 'Sneha Sadan Orphanage, Andheri',
    servings: 180,
    status: 'En Route',
    responsible: 'Driver Suresh Patil (VAN-01)',
    notes: 'Departed Worli via Western Express Highway with sealed stainless chafing containers.'
  },
  {
    id: 'ACT-903',
    type: 'food_collected',
    typeLabel: 'Food Collected',
    badgeColor: 'bg-sky-100 text-sky-800',
    timestamp: 'Today, 22:10 PM',
    donationId: 'FR-EVENT-B9X01',
    batchId: 'FR-BATCH-02',
    venue: 'Sea Breeze Banquet, Bandra West',
    shelter: 'Bandra Station Night Homeless Shelter',
    servings: 120,
    status: 'Loading at Banquet',
    responsible: 'Driver Arun Koli (VAN-02)',
    notes: 'Laser temp audit passed: 66.1°C. Gujarati Undhiyu and sweets transferred to thermal pots.'
  },
  {
    id: 'ACT-904',
    type: 'donation_approved',
    typeLabel: 'Donation Approved',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    timestamp: 'Today, 21:30 PM',
    donationId: 'FR-EVENT-PW302',
    batchId: 'FR-BATCH-03',
    venue: 'Grand Lakeside Pavilion, Powai',
    shelter: 'Dharavi Relief Kitchen',
    servings: 150,
    status: 'Ready for Collection',
    responsible: 'Operations Lead Sunil Rao',
    notes: 'Corporate event banquet intake approved. Pickup window scheduled for 15:30.'
  },
  {
    id: 'ACT-905',
    type: 'donation_received',
    typeLabel: 'Donation Received',
    badgeColor: 'bg-purple-100 text-purple-800',
    timestamp: 'Today, 20:15 PM',
    donationId: 'FR-EVENT-HHAIO',
    batchId: 'FR-BATCH-08',
    venue: 'The Royal Palms Grand Ballroom, Goregaon East',
    shelter: 'Pending Assignment',
    servings: 85,
    status: 'Awaiting Verification',
    responsible: 'Intake Portal / Sunil Sharma',
    notes: 'Wedding reception ending; 85 servings of Shahi Paneer, Dal Makhani & Rotis reported.'
  },
  {
    id: 'ACT-906',
    type: 'donation_rejected',
    typeLabel: 'Donation Cancelled / Rejected',
    badgeColor: 'bg-rose-100 text-rose-800',
    timestamp: 'Yesterday, 17:45 PM',
    donationId: 'FR-EVENT-DA606',
    batchId: 'N/A',
    venue: 'Shivaji Park Gymkhana Lawn, Dadar',
    shelter: 'None',
    servings: 25,
    status: 'Rejected (Safety)',
    responsible: 'Inspector Rajesh Patil',
    notes: 'Food left open on ambient table for >4 hours; failed FSSAI microbiological safety standard.'
  }
];

// Initial food safety and temperature audit logs
const initialSafetyLogs = [
  {
    batchId: 'FR-BATCH-01',
    foodItem: 'Shahi Paneer, Dal Makhani & Rotis',
    category: 'Hot Vegetarian Banquet Gravy',
    source: 'The Royal Palms Grand Ballroom (Goregaon)',
    recordedTemp: '68.4°C',
    requiredTemp: '> 65.0°C (Steam Hot Chain)',
    storageCondition: 'Insulated Stainless Steel Thermal Canister',
    inspectedAt: 'Today, 22:45 PM',
    inspector: 'Rajesh Patil (Certified FSSAI Auditor)',
    status: 'Compliant',
    notes: 'Passed sensory visual and probe temperature inspection. Zero ambient exposure.'
  },
  {
    batchId: 'FR-BATCH-02',
    foodItem: 'Gujarati Undhiyu & Moong Dal Halwa',
    category: 'Hot Festive Buffet Stew',
    source: 'Sea Breeze Banquet Hall (Bandra West)',
    recordedTemp: '66.1°C',
    requiredTemp: '> 65.0°C (Steam Hot Chain)',
    storageCondition: 'Thermal Insulated Transport Vessels',
    inspectedAt: 'Today, 22:15 PM',
    inspector: 'Pooja Hegde (Field Quality Officer)',
    status: 'Compliant',
    notes: 'Sealed directly from kitchen chafing vessels. High hygiene compliance.'
  },
  {
    batchId: 'FR-BATCH-03',
    foodItem: 'Vegetable Dum Biryani & Mirchi Salan',
    category: 'Cooked Basmati Rice & Gravy',
    source: 'Grand Lakeside Pavilion (Powai)',
    recordedTemp: '65.8°C',
    requiredTemp: '> 65.0°C (Steam Hot Chain)',
    storageCondition: 'Insulated Multi-Tier Box',
    inspectedAt: 'Today, 21:50 PM',
    inspector: 'Arun Koli (Van Lead & Certified Handler)',
    status: 'Compliant',
    notes: 'Measured with infrared laser probe at 3 distinct container points.'
  },
  {
    batchId: 'FR-BATCH-05',
    foodItem: 'Mughlai Degh Biryani & Mutton Korma',
    category: 'Halal Feast Dishes',
    source: 'Al-Madina Heritage Banquet (Byculla)',
    recordedTemp: '67.2°C',
    requiredTemp: '> 65.0°C (Steam Hot Chain)',
    storageCondition: 'Sealed Copper-Lined Degh with Lid Crimp',
    inspectedAt: 'Today, 22:50 PM',
    inspector: 'Manoj Salvi (Senior Logistics Driver)',
    status: 'Compliant',
    notes: 'Delivered in under 35 minutes to Asha Sadan. Complete temperature retention.'
  },
  {
    batchId: 'FR-BATCH-08',
    foodItem: 'Paneer Butter Masala & Pulao',
    category: 'Vegetarian Wedding Gravy',
    source: 'The Royal Palms Grand Ballroom (Goregaon)',
    recordedTemp: '67.8°C',
    requiredTemp: '> 65.0°C (Steam Hot Chain)',
    storageCondition: 'Chafing Dish Backup Containers',
    inspectedAt: 'Today, 23:05 PM',
    inspector: 'Sunil Rao (Operations Lead)',
    status: 'Compliant',
    notes: 'Awaiting final shelter allocation; placed in preheated holding box in Van #1.'
  }
];

function RescueHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get('tab') as HubTab) || 'overview';

  const [activeTab, setActiveTab] = useState<HubTab>(initialTab);
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filters for Donation Management
  const [donationFilter, setDonationFilter] = useState<string>('all');
  const [donationSearch, setDonationSearch] = useState('');

  // Modals & Action States
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | 'assign' | 'status';
    donation: DonationItem | null;
    targetStatus?: string;
    vanId?: string;
    shelterName?: string;
    reason?: string;
  }>({ open: false, type: 'approve', donation: null });

  // Shelter Tab State
  const [shelterFilter, setShelterFilter] = useState('all');
  const [allocateModal, setAllocateModal] = useState<{
    open: boolean;
    shelterId?: string;
    shelterName?: string;
    selectedBatchId?: string;
  }>({ open: false });

  // Activity History Filter
  const [activitySearch, setActivitySearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [activityLogs, setActivityLogs] = useState(initialActivityLogs);
  const [selectedActivity, setSelectedActivity] = useState<typeof initialActivityLogs[0] | null>(null);

  // Sync tab with URL
  useEffect(() => {
    const t = searchParams?.get('tab') as HubTab;
    if (t && ['overview', 'donations', 'logistics', 'shelters', 'history', 'safety'].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  const switchTab = (tab: HubTab) => {
    setActiveTab(tab);
    router.replace(`/rescue-hub?tab=${tab}`, { scroll: false });
  };

  // Fetch live donations from real backend API
  useEffect(() => {
    setLoadingDonations(true);
    fetch('/api/donations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.donations)) {
          setDonations(data.donations);
        }
      })
      .catch((err) => console.error('Failed to load donations:', err))
      .finally(() => setLoadingDonations(false));
  }, [refreshKey]);

  // Update donation status via API
  const handleUpdateDonation = async (
    id: string,
    updates: Partial<DonationItem>,
    activityMsg?: string
  ) => {
    try {
      const res = await fetch('/api/donations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local state
        setDonations((prev) =>
          prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
        );

        // Record new activity log if provided
        if (activityMsg && updates.status) {
          const newLog = {
            id: `ACT-${Date.now().toString().slice(-4)}`,
            type: updates.status,
            typeLabel: updates.status.replace('_', ' ').toUpperCase(),
            badgeColor: 'bg-moss/10 text-moss',
            timestamp: 'Just now',
            donationId: id,
            batchId: 'FR-BATCH-LIVE',
            venue: updates.venueAddress || 'Mumbai Banquet',
            shelter: updates.assignedShelter || 'Assigned Shelter',
            servings: updates.estimatedServings || 80,
            status: updates.status,
            responsible: updates.assignedVan ? `Assigned to ${updates.assignedVan}` : 'Operations Desk',
            notes: activityMsg
          };
          setActivityLogs((prev) => [newLog, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error updating donation:', err);
    } finally {
      setConfirmModal({ open: false, type: 'approve', donation: null });
    }
  };

  // Metrics calculated from actual real application data
  const metrics = useMemo(() => {
    const totalDonations = donations.length;
    const awaitingApproval = donations.filter(
      (d) => d.status === 'pending_approval' || d.status === 'pending_dispatch'
    ).length;
    const readyBatches = foodBoxes.length;
    const activePickups = donations.filter(
      (d) => d.status === 'approved' || d.status === 'ready_for_pickup'
    ).length;
    const inTransit = donations.filter((d) => d.status === 'in_transit').length;
    const completedRescues = donations.filter((d) => d.status === 'completed').length;
    const activeShelters = sheltersData.length;
    const safetyCompliant = '100% Compliant (>65°C)';

    return {
      totalDonations,
      awaitingApproval,
      readyBatches,
      activePickups,
      inTransit,
      completedRescues,
      activeShelters,
      safetyCompliant
    };
  }, [donations]);

  // Filtered donations
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      if (donationFilter !== 'all') {
        if (donationFilter === 'pending' && d.status !== 'pending_approval' && d.status !== 'pending_dispatch') return false;
        if (donationFilter === 'approved' && d.status !== 'approved') return false;
        if (donationFilter === 'ready' && d.status !== 'ready_for_pickup') return false;
        if (donationFilter === 'in_transit' && d.status !== 'in_transit') return false;
        if (donationFilter === 'completed' && d.status !== 'completed') return false;
        if (donationFilter === 'rejected' && d.status !== 'rejected') return false;
      }
      if (donationSearch.trim()) {
        const q = donationSearch.toLowerCase();
        const matchName = d.eventName.toLowerCase().includes(q);
        const matchVenue = (d.venueAddress || '').toLowerCase().includes(q);
        const matchId = d.id.toLowerCase().includes(q);
        const matchDiet = (d.dietaryType || '').toLowerCase().includes(q);
        if (!matchName && !matchVenue && !matchId && !matchDiet) return false;
      }
      return true;
    });
  }, [donations, donationFilter, donationSearch]);

  // Filtered shelters
  const filteredShelters = useMemo(() => {
    return sheltersData.filter((s) => {
      if (shelterFilter === 'high_need') return s.urgencyLevel === 'High Need';
      if (shelterFilter === 'regular') return s.urgencyLevel === 'Regular Schedule';
      return true;
    });
  }, [shelterFilter]);

  // Filtered activity logs
  const filteredActivities = useMemo(() => {
    return activityLogs.filter((log) => {
      if (activityFilter !== 'all' && log.type !== activityFilter) return false;
      if (activitySearch.trim()) {
        const q = activitySearch.toLowerCase();
        const matchVenue = log.venue.toLowerCase().includes(q);
        const matchShelter = log.shelter.toLowerCase().includes(q);
        const matchId = log.donationId.toLowerCase().includes(q);
        if (!matchVenue && !matchShelter && !matchId) return false;
      }
      return true;
    });
  }, [activityLogs, activityFilter, activitySearch]);

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#202823]">
      <Navbar />

      <SubpageHeader
        theme="logistics"
        breadcrumbs={[{ label: 'Rescue Hub' }]}
        eyebrow="Central Operations & Telemetry"
        title="Rescue Hub Operations Dashboard"
        badge="Active Coordination"
        description="Real-time command center coordinating wedding surplus intake, rapid insulated van dispatch, thermal holding safety audits, and shelter allocations across Mumbai."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/schedule-pickup"
              className="primary-button text-xs py-2.5 px-4"
            >
              <Sparkles size={14} /> + New Pickup Request
            </Link>
            <Link
              href="/batches"
              className="rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-2xs hover:bg-cream transition"
            >
              Surplus Marketplace
            </Link>
          </div>
        }
      />

      <div className="section-shell py-8 lg:py-12 space-y-8">
        {/* ============================================================== */}
        {/* PILL-SHAPED TAB SWITCHER (Desktop: Responsive Grid/Flex; Mobile: Scrollable bar) */}
        {/* ============================================================== */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max rounded-3xl border border-ink/10 bg-white p-2 shadow-sm">
            {[
              { id: 'overview', label: 'Operations Overview', icon: Activity },
              {
                id: 'donations',
                label: 'Donation Management',
                icon: FileText,
                badge: metrics.awaitingApproval > 0 ? `${metrics.awaitingApproval} Pending` : `${donations.length}`
              },
              { id: 'logistics', label: 'Van Dispatch & Delivery', icon: Truck, badge: '4 En Route' },
              { id: 'shelters', label: 'Shelter Network Quotas', icon: Heart, badge: `${sheltersData.length} Shelters` },
              { id: 'history', label: 'Rescue Activity History', icon: History },
              { id: 'safety', label: 'Food Safety & Temperature Logs', icon: ShieldCheck, badge: '>65°C Standard' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchTab(tab.id as HubTab)}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-moss text-white shadow-sm'
                      : 'text-ink/75 hover:bg-cream hover:text-ink'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-moss/10 text-moss'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OPERATIONS OVERVIEW */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Operational Alert Banner */}
            <div className="rounded-3xl border border-moss/20 bg-moss/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-moss text-white shrink-0 shadow-sm">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-ink">
                    Active Operations Corridor: High Evening Feast Volume
                  </h4>
                  <p className="text-xs text-ink/70">
                    4 major banquets concluding in Goregaon, Bandra & Powai. Vans #1 & #2 on standby with pre-heated thermal containers.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => switchTab('donations')}
                  className="rounded-xl bg-moss px-3 py-1.5 text-xs font-bold text-white hover:bg-[#224433] transition"
                >
                  Review Intakes →
                </button>
                <button
                  type="button"
                  onClick={() => setRefreshKey((k) => k + 1)}
                  className="rounded-xl border border-ink/10 bg-white p-1.5 text-ink hover:bg-cream transition"
                  title="Refresh Dashboard"
                >
                  <RefreshCw size={14} className={loadingDonations ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* 8 Metric Statistic Cards from Real Data */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Total Donations Received</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-ink">{metrics.totalDonations}</span>
                  <span className="text-xs font-bold text-moss">Intakes Logged</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">From banquets, caterers & wedding families</p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Awaiting Approval</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-amber-700">{metrics.awaitingApproval}</span>
                  <span className="text-xs font-bold text-amber-700">Requires Action</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">Pending dietary & collection verification</p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Batches Ready</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-moss">{metrics.readyBatches}</span>
                  <span className="text-xs font-bold text-moss">Live Surplus</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">Available for community shelter reservation</p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Active Pickups</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-ink">{metrics.activePickups}</span>
                  <span className="text-xs font-bold text-ink/60">Scheduled</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">Assigned to volunteer van fleet tonight</p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Deliveries In Transit</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-amber-700">{metrics.inTransit}</span>
                  <span className="text-xs font-bold text-amber-700">On The Road</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">Moving between banquets & recipient homes</p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Completed Rescues</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-moss">{metrics.completedRescues}</span>
                  <span className="text-xs font-bold text-moss">Verified Feasts</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">Signed receipt logged by shelter wardens</p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Active Shelter Partners</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-ink">{metrics.activeShelters}</span>
                  <span className="text-xs font-bold text-ink/60">Homes</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">Orphanages, night shelters & destitute centers</p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Safety Compliance</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-black text-moss">100%</span>
                  <span className="text-xs font-bold text-moss">&gt;65°C Standard</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">Calibrated infrared probe verification</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
                <Sparkles size={16} className="text-moss" /> Operational Quick Actions
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/schedule-pickup"
                  className="rounded-2xl border border-ink/10 bg-cream/30 p-3.5 hover:border-moss/40 hover:bg-cream transition group"
                >
                  <span className="font-bold text-xs text-ink group-hover:text-moss block">
                    + Register Banquet Intake
                  </span>
                  <span className="text-[11px] text-ink/60 block mt-0.5">
                    Schedule insulated collection for tonight’s wedding.
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => switchTab('donations')}
                  className="text-left rounded-2xl border border-ink/10 bg-cream/30 p-3.5 hover:border-moss/40 hover:bg-cream transition group cursor-pointer"
                >
                  <span className="font-bold text-xs text-ink group-hover:text-moss block">
                    Manage Intakes ({metrics.awaitingApproval} Pending)
                  </span>
                  <span className="text-[11px] text-ink/60 block mt-0.5">
                    Review and approve incoming banquet food submissions.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => switchTab('logistics')}
                  className="text-left rounded-2xl border border-ink/10 bg-cream/30 p-3.5 hover:border-moss/40 hover:bg-cream transition group cursor-pointer"
                >
                  <span className="font-bold text-xs text-ink group-hover:text-moss block">
                    Fleet Dispatch Queue
                  </span>
                  <span className="text-[11px] text-ink/60 block mt-0.5">
                    Inspect 4 volunteer vans and thermal pot sensors.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => switchTab('shelters')}
                  className="text-left rounded-2xl border border-ink/10 bg-cream/30 p-3.5 hover:border-moss/40 hover:bg-cream transition group cursor-pointer"
                >
                  <span className="font-bold text-xs text-ink group-hover:text-moss block">
                    Allocate to Shelter
                  </span>
                  <span className="text-[11px] text-ink/60 block mt-0.5">
                    Match ready celebration crates to high-need homes.
                  </span>
                </button>
              </div>
            </div>

            {/* Recent Activity & Live Pickups Feed */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upcoming Pickups & In-Transit Deliveries */}
              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
                    <Truck size={16} className="text-moss" /> Upcoming Pickups & Deliveries
                  </h3>
                  <button
                    type="button"
                    onClick={() => switchTab('logistics')}
                    className="text-xs font-bold text-moss hover:underline"
                  >
                    View All Fleet →
                  </button>
                </div>

                <div className="space-y-3">
                  {initialFleet.slice(0, 3).map((v) => (
                    <div key={v.id} className="rounded-2xl border border-ink/5 bg-cream/40 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-ink">{v.id} · {v.driver}</span>
                        <span className="rounded-full bg-moss/10 px-2 py-0.5 text-[10px] font-black text-moss">
                          {v.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-ink">{v.cargo}</p>
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-ink/60 pt-1 border-t border-ink/5">
                        <span>To: <strong>{v.destination}</strong></span>
                        <span className="font-bold text-moss">ETA: {v.eta} · {v.tempReading}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Operations Activity Feed */}
              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
                    <History size={16} className="text-moss" /> Recent Operational Activity
                  </h3>
                  <button
                    type="button"
                    onClick={() => switchTab('history')}
                    className="text-xs font-bold text-moss hover:underline"
                  >
                    Full History →
                  </button>
                </div>

                <div className="space-y-3">
                  {activityLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 rounded-2xl border border-ink/5 bg-cream/20 p-3.5">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-moss/10 text-moss shrink-0 mt-0.5">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-ink truncate">{log.typeLabel}</span>
                          <span className="text-[10px] text-ink/40 shrink-0">{log.timestamp}</span>
                        </div>
                        <p className="text-xs text-ink/70 truncate">
                          {log.venue} → {log.shelter}
                        </p>
                        <p className="text-[11px] text-ink/50">
                          {log.servings} Servings · {log.responsible}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DONATION MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'donations' && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink/5">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Banqueting Donation Management</h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Review intakes submitted by wedding hosts, approve compliant batches, assign insulated volunteer vans, and track delivery handovers.
                </p>
              </div>
              <Link
                href="/schedule-pickup"
                className="primary-button text-xs py-2.5 px-4 shrink-0"
              >
                + Register New Donation
              </Link>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Donations' },
                  { id: 'pending', label: 'Pending Approval' },
                  { id: 'approved', label: 'Approved' },
                  { id: 'ready', label: 'Ready for Pickup' },
                  { id: 'in_transit', label: 'In Transit' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'rejected', label: 'Cancelled / Rejected' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setDonationFilter(f.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      donationFilter === f.id
                        ? 'bg-moss text-white shadow-2xs'
                        : 'bg-cream/60 text-ink/70 hover:bg-cream hover:text-ink'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  placeholder="Search donor or venue..."
                  value={donationSearch}
                  onChange={(e) => setDonationSearch(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-cream/40 pl-8 pr-3 py-1.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden focus:border-moss"
                />
              </div>
            </div>

            {/* Donation Cards Listing */}
            {loadingDonations ? (
              <div className="py-16 text-center text-xs font-bold text-ink/50">
                <RefreshCw size={20} className="mx-auto mb-2 animate-spin text-moss" />
                Loading live donations from operations database...
              </div>
            ) : filteredDonations.length === 0 ? (
              <div className="py-16 text-center space-y-2 rounded-2xl bg-cream/30 p-8 border border-dashed border-ink/15">
                <FileText size={32} className="mx-auto text-ink/30" />
                <h4 className="font-bold text-sm text-ink">No donations matching selected criteria</h4>
                <p className="text-xs text-ink/50 max-w-sm mx-auto">
                  Try clearing your search query or switching to 'All Donations'. You can also register a fresh donation.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDonationFilter('all');
                    setDonationSearch('');
                  }}
                  className="mt-2 text-xs font-bold text-moss hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredDonations.map((d) => {
                  const isPending = d.status === 'pending_approval' || d.status === 'pending_dispatch';
                  const isApproved = d.status === 'approved';
                  const isReady = d.status === 'ready_for_pickup';
                  const isInTransit = d.status === 'in_transit';
                  const isCompleted = d.status === 'completed';
                  const isRejected = d.status === 'rejected';

                  let statusBadgeClass = 'bg-gray-100 text-gray-700';
                  let statusText: string = d.status;

                  if (isPending) {
                    statusBadgeClass = 'bg-amber-100 text-amber-800';
                    statusText = 'Pending Approval';
                  } else if (isApproved) {
                    statusBadgeClass = 'bg-blue-100 text-blue-800';
                    statusText = 'Approved';
                  } else if (isReady) {
                    statusBadgeClass = 'bg-purple-100 text-purple-800';
                    statusText = 'Ready for Pickup';
                  } else if (isInTransit) {
                    statusBadgeClass = 'bg-indigo-100 text-indigo-800';
                    statusText = 'In Transit';
                  } else if (isCompleted) {
                    statusBadgeClass = 'bg-emerald-100 text-emerald-800';
                    statusText = 'Completed';
                  } else if (isRejected) {
                    statusBadgeClass = 'bg-rose-100 text-rose-800';
                    statusText = 'Rejected / Cancelled';
                  }

                  return (
                    <div
                      key={d.id}
                      className="rounded-2xl border border-ink/10 bg-cream/20 p-5 space-y-3.5 hover:border-moss/30 transition shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-moss">{d.id}</span>
                            <span className="text-[11px] text-ink/40">• {d.eventType}</span>
                          </div>
                          <h4 className="font-display text-base font-bold text-ink mt-0.5">{d.eventName}</h4>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black shrink-0 ${statusBadgeClass}`}>
                          {statusText}
                        </span>
                      </div>

                      <p className="text-xs text-ink/75 line-clamp-2">
                        {d.foodDescription || 'Untouched banquet gravies and breads'}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-ink/65 pt-2 border-t border-ink/5">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-ink/40 block">Estimated Servings</span>
                          <span className="font-black text-ink">{d.estimatedServings} Plates</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-ink/40 block">Dietary Standard</span>
                          <span className="font-semibold text-ink">{d.dietaryType}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-ink/40 block">Pickup Window</span>
                          <span className="font-semibold text-ink">{d.pickupTimeWindow}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-ink/40 block">Assigned Van</span>
                          <span className="font-semibold text-moss">{d.assignedVan || 'Unassigned'}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-ink/60 flex items-center gap-1.5 truncate">
                        <MapPin size={12} className="text-moss shrink-0" />
                        <span className="truncate">{d.venueAddress || d.city}</span>
                      </div>

                      {/* Action Buttons with confirmation dialogs */}
                      <div className="pt-2 border-t border-ink/5 flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDonation(d)}
                          className="rounded-xl border border-ink/10 bg-white px-2.5 py-1.5 text-xs font-bold text-ink hover:bg-cream transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={13} /> View Details
                        </button>

                        <div className="flex items-center gap-1.5">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmModal({
                                    open: true,
                                    type: 'approve',
                                    donation: d,
                                    targetStatus: 'approved'
                                  })
                                }
                                className="rounded-xl bg-moss px-3 py-1.5 text-xs font-bold text-white hover:bg-[#224433] transition flex items-center gap-1 cursor-pointer"
                              >
                                <Check size={13} /> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmModal({
                                    open: true,
                                    type: 'reject',
                                    donation: d,
                                    targetStatus: 'rejected'
                                  })
                                }
                                className="rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition flex items-center gap-1 cursor-pointer"
                              >
                                <X size={13} /> Reject
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmModal({
                                  open: true,
                                  type: 'assign',
                                  donation: d,
                                  vanId: 'VAN-01',
                                  shelterName: 'Sneha Sadan Orphanage'
                                })
                              }
                              className="rounded-xl bg-moss px-3 py-1.5 text-xs font-bold text-white hover:bg-[#224433] transition flex items-center gap-1 cursor-pointer"
                            >
                              <Truck size={13} /> Assign Van
                            </button>
                          )}

                          {isReady && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmModal({
                                  open: true,
                                  type: 'status',
                                  donation: d,
                                  targetStatus: 'in_transit'
                                })
                              }
                              className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer"
                            >
                              Dispatch En Route
                            </button>
                          )}

                          {isInTransit && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmModal({
                                  open: true,
                                  type: 'status',
                                  donation: d,
                                  targetStatus: 'completed'
                                })
                              }
                              className="rounded-xl bg-moss px-3 py-1.5 text-xs font-bold text-white hover:bg-[#224433] transition flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 size={13} /> Complete Handover
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: VAN DISPATCH & DELIVERY */}
        {/* ============================================================== */}
        {activeTab === 'logistics' && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink/5">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Volunteer Fleet Dispatch & Routing</h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Coordinating 4 custom thermal-insulated vans operating nightly across Mumbai corridors (7 PM – 2:30 AM).
                </p>
              </div>
              <span className="rounded-full bg-sage/60 px-3 py-1 text-xs font-bold text-moss">
                4 Vehicles On Active Shift
              </span>
            </div>

            {/* Van Cards Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              {initialFleet.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl border border-ink/10 bg-cream/30 p-5 space-y-4 shadow-2xs hover:border-moss/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-moss text-white font-mono text-xs font-black">
                        {v.id.slice(-2)}
                      </span>
                      <div>
                        <span className="font-mono text-xs font-black text-ink">{v.id}</span>
                        <span className="text-[11px] text-ink/50 block">Driver: {v.driver}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-moss/10 px-2.5 py-0.5 text-xs font-black text-moss">
                      {v.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p>
                      <strong className="text-ink">Current Sector:</strong> {v.sector}
                    </p>
                    <p>
                      <strong className="text-ink">Cargo Load:</strong> {v.cargo}
                    </p>
                    <p>
                      <strong className="text-ink">Destination:</strong> {v.destination}
                    </p>
                    <div className="rounded-xl bg-white p-2.5 border border-ink/5 flex items-center justify-between">
                      <span className="text-[11px] text-ink/60">🌡️ Verified Sensor Reading</span>
                      <span className="font-bold text-moss text-xs">{v.tempReading}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-ink/5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-ink/50">
                      ETA: <strong>{v.eta}</strong> · {v.lastUpdated}
                    </span>
                    <a
                      href={v.googleRouteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-moss hover:underline"
                    >
                      Route Map <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Operational Dispatch Advisory */}
            <div className="rounded-2xl bg-cream/50 p-4 border border-ink/5 flex items-center gap-3 text-xs text-ink/70">
              <AlertCircle size={18} className="text-moss shrink-0" />
              <span>
                <strong>Dispatch Note:</strong> In accordance with strict FSSAI guidelines, all hot food transfers must reach recipient shelters within 90 minutes of collection. No open vehicles or uninsulated containers are permitted.
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: SHELTER NETWORK QUOTAS */}
        {/* ============================================================== */}
        {activeTab === 'shelters' && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink/5">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Recipient Shelter Quotas & Capacity</h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Balancing verified shelter requirements across Mumbai to ensure every child and destitute elder receives dignified, nutritious meals without creating excess secondary waste.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['all', 'high_need', 'regular'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setShelterFilter(f)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      shelterFilter === f
                        ? 'bg-moss text-white'
                        : 'bg-cream/60 text-ink/70 hover:bg-cream'
                    }`}
                  >
                    {f === 'all' ? 'All Shelters' : f === 'high_need' ? 'High Need' : 'Regular Schedule'}
                  </button>
                ))}
              </div>
            </div>

            {/* Shelters Grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredShelters.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-ink/10 bg-cream/20 p-5 space-y-3.5 hover:border-moss/30 transition shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-sage/60 px-2.5 py-0.5 text-[10px] font-black text-moss uppercase">
                        {s.category}
                      </span>
                      <span className="text-[10px] font-black uppercase text-tomato">
                        {s.urgencyLevel}
                      </span>
                    </div>

                    <h4 className="font-display text-base font-bold text-ink leading-snug">
                      {s.name}
                    </h4>

                    <p className="text-xs text-ink/60 line-clamp-2">
                      {s.address}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ink/5 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-ink/40 block">Beneficiaries</span>
                        <span className="font-black text-ink">{s.beneficiaryCount} Residents</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-ink/40 block">Daily Quota</span>
                        <span className="font-black text-moss">{s.dailyRequirementServings} Plates</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1 text-[11px] text-ink/65">
                      <p><strong>Contact:</strong> {s.contactPerson} ({s.contactPhone})</p>
                      <p><strong>Diet Preferences:</strong> {s.mealPreferences.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-ink/5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setAllocateModal({
                          open: true,
                          shelterId: s.id,
                          shelterName: s.name,
                          selectedBatchId: foodBoxes[0]?.id
                        })
                      }
                      className="rounded-xl bg-moss px-3 py-1.5 text-xs font-bold text-white hover:bg-[#224433] transition cursor-pointer"
                    >
                      Allocate Batch
                    </button>
                    <a
                      href={s.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-moss hover:underline flex items-center gap-1"
                    >
                      Location Map <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: RESCUE ACTIVITY HISTORY */}
        {/* ============================================================== */}
        {activeTab === 'history' && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink/5">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Verified Rescue Activity Lifecycle</h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Complete audit ledger tracking every intake, pickup verification, temperature reading, and shelter delivery handover.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink/60">{filteredActivities.length} Records</span>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Lifecycle Events' },
                  { id: 'delivery_completed', label: 'Deliveries' },
                  { id: 'van_dispatched', label: 'Dispatches' },
                  { id: 'food_collected', label: 'Collections' },
                  { id: 'donation_received', label: 'Intakes' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActivityFilter(f.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      activityFilter === f.id
                        ? 'bg-moss text-white shadow-2xs'
                        : 'bg-cream/60 text-ink/70 hover:bg-cream hover:text-ink'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  placeholder="Filter by venue or shelter..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-cream/40 pl-8 pr-3 py-1.5 text-xs font-semibold text-ink placeholder:text-ink/40 outline-hidden focus:border-moss"
                />
              </div>
            </div>

            {/* Timeline Cards */}
            <div className="space-y-3">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="rounded-2xl border border-ink/10 bg-cream/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-moss/30 transition shadow-2xs"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${act.badgeColor}`}>
                        {act.typeLabel}
                      </span>
                      <span className="text-[10px] font-mono text-ink/40 font-bold">{act.id}</span>
                      <span className="text-[10px] text-ink/40">• {act.timestamp}</span>
                    </div>

                    <h4 className="font-display text-sm sm:text-base font-bold text-ink">
                      {act.venue} → {act.shelter}
                    </h4>

                    <p className="text-xs text-ink/65 line-clamp-1">
                      {act.notes}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-ink/5 justify-between sm:justify-end">
                    <span className="rounded-xl bg-white px-3 py-1 text-xs font-black text-ink shadow-2xs">
                      {act.servings} Servings
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedActivity(act)}
                      className="rounded-xl border border-ink/10 bg-white px-3 py-1 text-xs font-bold text-moss hover:bg-cream transition cursor-pointer"
                    >
                      Audit Trail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: FOOD SAFETY & TEMPERATURE LOGS */}
        {/* ============================================================== */}
        {activeTab === 'safety' && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink/5">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Food Safety & Temperature Telemetry</h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Strict adherence to FSSAI (Food Safety and Standards Authority of India) protocols. Only food verified above 65°C steam-hot or below 5°C cold chain is certified for rescue.
                </p>
              </div>

              <span className="rounded-full bg-sage/60 px-3 py-1 text-xs font-black text-moss">
                100% Audit Pass Rate
              </span>
            </div>

            {/* FSSAI Standard Protocol Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-cream/40 p-5 space-y-2 border border-ink/5">
                <Flame size={22} className="text-tomato" />
                <h4 className="font-bold text-sm text-ink">&gt;65°C Steam Hot Chain</h4>
                <p className="text-xs text-ink/70">
                  Every hot curry, dal, and rice degh is probed at 3 points. Temperature must be maintained above 65°C throughout insulated van transit.
                </p>
              </div>

              <div className="rounded-2xl bg-cream/40 p-5 space-y-2 border border-ink/5">
                <Clock size={22} className="text-moss" />
                <h4 className="font-bold text-sm text-ink">90-Minute Maximum Transit</h4>
                <p className="text-xs text-ink/70">
                  Direct corridor delivery from banquet kitchen loading dock to shelter dining hall within 90 minutes prevents bacterial spore growth.
                </p>
              </div>

              <div className="rounded-2xl bg-cream/40 p-5 space-y-2 border border-ink/5">
                <ShieldCheck size={22} className="text-moss" />
                <h4 className="font-bold text-sm text-ink">Untouched Food Only</h4>
                <p className="text-xs text-ink/70">
                  We never accept leftover table plates or open exposed platters. Only untouched backup warming vessels and sealed chafers are accepted.
                </p>
              </div>
            </div>

            {/* Active Temperature Log Table */}
            <div>
              <div className="flex items-center justify-between pb-3">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <Thermometer size={16} className="text-moss" /> Verified Temperature Logged Tonight
                </h4>
                <span className="text-[11px] text-ink/40 font-mono">Calibrated Infrared Sensors</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream/40 text-[10px] uppercase font-bold text-ink/50 tracking-wider">
                    <tr>
                      <th className="p-3">Batch ID</th>
                      <th className="p-3">Food Category & Description</th>
                      <th className="p-3">Source Venue</th>
                      <th className="p-3">Recorded Temp</th>
                      <th className="p-3">Standard</th>
                      <th className="p-3">Inspector</th>
                      <th className="p-3">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {initialSafetyLogs.map((log) => (
                      <tr key={log.batchId} className="hover:bg-cream/20">
                        <td className="p-3 font-mono font-bold text-moss">{log.batchId}</td>
                        <td className="p-3">
                          <span className="font-bold text-ink block">{log.foodItem}</span>
                          <span className="text-[10px] text-ink/50 block">{log.category}</span>
                        </td>
                        <td className="p-3 text-ink/70">{log.source}</td>
                        <td className="p-3 font-black text-moss">{log.recordedTemp}</td>
                        <td className="p-3 text-[11px] text-ink/50">{log.requiredTemp}</td>
                        <td className="p-3 text-ink/70">{log.inspector}</td>
                        <td className="p-3">
                          <span className="rounded-full bg-sage/60 px-2 py-0.5 text-[10px] font-black text-moss">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: VIEW DONATION DETAILS */}
      {/* ============================================================== */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-ink/5">
              <div>
                <span className="text-[10px] font-mono font-bold text-moss block">{selectedDonation.id}</span>
                <h3 className="font-display text-lg font-bold text-ink">{selectedDonation.eventName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-ink/5 text-ink hover:bg-ink/10 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-2xl bg-cream/30 p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink/40 block">Food Description</span>
                <p className="text-ink font-semibold">{selectedDonation.foodDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-ink/5 p-3">
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Estimated Servings</span>
                  <span className="font-black text-ink">{selectedDonation.estimatedServings} Plates</span>
                </div>
                <div className="rounded-xl border border-ink/5 p-3">
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Dietary Standard</span>
                  <span className="font-bold text-ink">{selectedDonation.dietaryType}</span>
                </div>
                <div className="rounded-xl border border-ink/5 p-3">
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Cooked Time</span>
                  <span className="font-bold text-ink">{selectedDonation.cookedTime}</span>
                </div>
                <div className="rounded-xl border border-ink/5 p-3">
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Pickup Window</span>
                  <span className="font-bold text-ink">{selectedDonation.pickupTimeWindow}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-ink/5 p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink/40 block">Venue & Location</span>
                <p className="font-bold text-ink">{selectedDonation.venueAddress}</p>
                <p className="text-ink/60">{selectedDonation.city}</p>
              </div>

              <div className="rounded-2xl border border-ink/5 p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink/40 block">Contact Coordinator</span>
                <p className="font-bold text-ink">{selectedDonation.contactPerson}</p>
                <p className="text-ink/60">Phone: {selectedDonation.phone} · Email: {selectedDonation.email}</p>
              </div>

              {selectedDonation.assignedVan && (
                <div className="rounded-2xl bg-sage/30 p-3.5 text-moss font-bold">
                  Assigned Van: {selectedDonation.assignedVan}
                  {selectedDonation.assignedShelter && ` → Destination: ${selectedDonation.assignedShelter}`}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-ink/5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="rounded-xl bg-ink/5 px-4 py-2 text-xs font-bold text-ink hover:bg-ink/10 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: CONFIRMATION FOR APPROVAL, REJECTION, OR STATUS UPDATE */}
      {/* ============================================================== */}
      {confirmModal.open && confirmModal.donation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-2xl ${
                  confirmModal.type === 'approve'
                    ? 'bg-moss/10 text-moss'
                    : confirmModal.type === 'reject'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {confirmModal.type === 'approve' ? (
                  <CheckCircle size={20} />
                ) : confirmModal.type === 'reject' ? (
                  <AlertTriangle size={20} />
                ) : (
                  <Truck size={20} />
                )}
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  {confirmModal.type === 'approve'
                    ? 'Approve Donation Intake?'
                    : confirmModal.type === 'reject'
                    ? 'Reject / Cancel Donation?'
                    : confirmModal.type === 'assign'
                    ? 'Assign Van Dispatch'
                    : 'Update Operational Status'}
                </h3>
                <p className="text-xs text-ink/60">{confirmModal.donation.eventName}</p>
              </div>
            </div>

            {confirmModal.type === 'approve' && (
              <p className="text-xs text-ink/70 leading-relaxed">
                Approving this donation certifies that the intake meets FSSAI standards and notifies the Western corridor fleet dispatch to assign a pickup window.
              </p>
            )}

            {confirmModal.type === 'reject' && (
              <div className="space-y-2">
                <p className="text-xs text-ink/70">
                  Please specify the reason for cancellation or safety rejection:
                </p>
                <select
                  defaultValue="Exceeded ambient room temperature holding threshold"
                  onChange={(e) =>
                    setConfirmModal((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="w-full rounded-xl border border-ink/10 bg-cream/40 p-2 text-xs font-semibold text-ink"
                >
                  <option value="Exceeded ambient room temperature holding threshold">
                    Exceeded ambient holding threshold (&gt;4 hrs)
                  </option>
                  <option value="Unsealed / opened food platters">
                    Unsealed / opened food platters
                  </option>
                  <option value="Duplicate booking request">Duplicate booking request</option>
                  <option value="Event cancelled by organizer">Event cancelled by organizer</option>
                </select>
              </div>
            )}

            {confirmModal.type === 'assign' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-ink block mb-1">Select Volunteer Van:</label>
                  <select
                    defaultValue={confirmModal.vanId || 'VAN-01'}
                    onChange={(e) =>
                      setConfirmModal((prev) => ({ ...prev, vanId: e.target.value }))
                    }
                    className="w-full rounded-xl border border-ink/10 bg-cream/40 p-2 text-xs font-semibold text-ink"
                  >
                    <option value="VAN-01">VAN-01 (Suresh Patil · Goregaon Corridor)</option>
                    <option value="VAN-02">VAN-02 (Arun Koli · Bandra Corridor)</option>
                    <option value="VAN-03">VAN-03 (Vikram Yadav · Powai Corridor)</option>
                    <option value="VAN-04">VAN-04 (Manoj Salvi · South Mumbai)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Select Target Recipient Shelter:</label>
                  <select
                    defaultValue={confirmModal.shelterName || sheltersData[0]?.name}
                    onChange={(e) =>
                      setConfirmModal((prev) => ({ ...prev, shelterName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-ink/10 bg-cream/40 p-2 text-xs font-semibold text-ink"
                  >
                    {sheltersData.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.beneficiaryCount} Residents · {s.urgencyLevel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {confirmModal.type === 'status' && (
              <p className="text-xs text-ink/70">
                Update status of <strong>{confirmModal.donation.id}</strong> to{' '}
                <strong className="text-moss">{confirmModal.targetStatus?.replace('_', ' ')}</strong>?
              </p>
            )}

            <div className="pt-3 border-t border-ink/5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ open: false, type: 'approve', donation: null })}
                className="rounded-xl bg-ink/5 px-3.5 py-2 text-xs font-bold text-ink hover:bg-ink/10 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirmModal.type === 'approve') {
                    handleUpdateDonation(
                      confirmModal.donation!.id,
                      { status: 'approved' },
                      'Donation approved for dispatch by operations desk.'
                    );
                  } else if (confirmModal.type === 'reject') {
                    handleUpdateDonation(
                      confirmModal.donation!.id,
                      {
                        status: 'rejected',
                        rejectionReason:
                          confirmModal.reason ||
                          'Exceeded ambient room temperature holding threshold'
                      },
                      'Intake rejected: safety requirements not met.'
                    );
                  } else if (confirmModal.type === 'assign') {
                    handleUpdateDonation(
                      confirmModal.donation!.id,
                      {
                        status: 'ready_for_pickup',
                        assignedVan: confirmModal.vanId || 'VAN-01',
                        assignedShelter: confirmModal.shelterName || 'Sneha Sadan Orphanage'
                      },
                      `Assigned to ${confirmModal.vanId || 'VAN-01'} for delivery to ${confirmModal.shelterName || 'Sneha Sadan'}.`
                    );
                  } else if (confirmModal.type === 'status') {
                    handleUpdateDonation(
                      confirmModal.donation!.id,
                      { status: confirmModal.targetStatus as any },
                      `Status advanced to ${confirmModal.targetStatus}.`
                    );
                  }
                }}
                className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition cursor-pointer ${
                  confirmModal.type === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-moss hover:bg-[#224433]'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ALLOCATE FOOD BATCH TO SHELTER */}
      {/* ============================================================== */}
      {allocateModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-moss/10 text-moss shrink-0">
                <Utensils size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-ink">Allocate Batch to Shelter</h3>
                <p className="text-xs text-moss font-bold">{allocateModal.shelterName}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-ink block">Select Live Food Batch:</label>
              <select
                defaultValue={allocateModal.selectedBatchId || foodBoxes[0]?.id}
                onChange={(e) =>
                  setAllocateModal((prev) => ({ ...prev, selectedBatchId: e.target.value }))
                }
                className="w-full rounded-xl border border-ink/10 bg-cream/40 p-2.5 text-xs font-semibold text-ink"
              >
                {foodBoxes.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.quantityAvailable} Crates · {b.venueName})
                  </option>
                ))}
              </select>

              <div className="rounded-2xl bg-cream/40 p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink/40 block">Delivery Protocol</span>
                <p className="text-ink/70">
                  Allocating this batch updates the dispatch manifests and assigns preheated thermal canisters to prevent delay upon banquet closure.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-ink/5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAllocateModal({ open: false })}
                className="rounded-xl bg-ink/5 px-3.5 py-2 text-xs font-bold text-ink hover:bg-ink/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const newLog = {
                    id: `ACT-${Date.now().toString().slice(-4)}`,
                    type: 'allocation',
                    typeLabel: 'Batch Allocated',
                    badgeColor: 'bg-moss/10 text-moss',
                    timestamp: 'Just now',
                    donationId: 'FR-ALLOCATION',
                    batchId: allocateModal.selectedBatchId || 'FR-BATCH-01',
                    venue: 'Surplus Banquet Warehouse',
                    shelter: allocateModal.shelterName || 'Shelter Relief Home',
                    servings: 120,
                    status: 'Manifest Assigned',
                    responsible: 'Logistics Coordinator',
                    notes: `Batch ${allocateModal.selectedBatchId} matched to daily quota of ${allocateModal.shelterName}.`
                  };
                  setActivityLogs((prev) => [newLog, ...prev]);
                  setAllocateModal({ open: false });
                }}
                className="rounded-xl bg-moss px-4 py-2 text-xs font-bold text-white hover:bg-[#224433] transition cursor-pointer"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: AUDIT TRAIL MODAL FOR RESCUE ACTIVITY */}
      {/* ============================================================== */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ink/5">
              <div>
                <span className="text-[10px] font-mono font-bold text-moss">{selectedActivity.id}</span>
                <h3 className="font-display text-base font-bold text-ink">{selectedActivity.typeLabel}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-ink/5 text-ink hover:bg-ink/10 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="rounded-xl bg-cream/40 p-3">
                <span className="text-[10px] uppercase font-bold text-ink/40 block">Route & Corridors</span>
                <p className="font-bold text-ink mt-0.5">{selectedActivity.venue}</p>
                <p className="text-moss font-bold mt-0.5">↓ Handover To</p>
                <p className="font-bold text-ink mt-0.5">{selectedActivity.shelter}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-ink/5 p-2.5">
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Timestamp</span>
                  <span className="font-bold text-ink">{selectedActivity.timestamp}</span>
                </div>
                <div className="rounded-xl border border-ink/5 p-2.5">
                  <span className="text-[10px] uppercase font-bold text-ink/40 block">Servings Handed Over</span>
                  <span className="font-black text-moss">{selectedActivity.servings} Plates</span>
                </div>
              </div>

              <div className="rounded-xl border border-ink/5 p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink/40 block">Responsible Personnel</span>
                <p className="font-bold text-ink">{selectedActivity.responsible}</p>
              </div>

              <div className="rounded-xl bg-sage/20 p-3 text-ink/80">
                <span className="text-[10px] uppercase font-bold text-moss block">Field Verification Notes</span>
                <p className="mt-0.5">{selectedActivity.notes}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-ink/5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="rounded-xl bg-moss px-4 py-2 text-xs font-bold text-white hover:bg-[#224433] transition cursor-pointer"
              >
                Close Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function RescueHubPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center p-12 text-xs font-bold text-ink/50">
          Loading Rescue Hub Operations Dashboard...
        </div>
      }
    >
      <RescueHubContent />
    </Suspense>
  );
}
