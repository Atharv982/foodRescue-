'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Building2,
  Utensils,
  Heart,
  Truck,
  Package,
  Navigation,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  ShieldCheck,
  Clock3,
  Phone,
  Mail,
  LocateFixed,
  Route,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { calculateHaversineDistance, ShelterMatchResult, getNearbyShelterMatches } from '@/lib/logistics-client';

export type LiveMapCategory = 'all' | 'venue' | 'caterer' | 'donation' | 'shelter' | 'pickup' | 'vehicle';

export interface LiveMapEntity {
  id: string;
  name: string;
  category: LiveMapCategory;
  categoryLabel: string;
  address: string;
  neighborhood: string;
  zone: string;
  lat: number;
  lng: number;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  imageUrl?: string;
  googleMapsUrl: string;
  directionsUrl: string;
  status?: string;
  badge?: string;
  // Specific fields for donations
  servings?: number;
  estimatedKg?: number;
  dietaryType?: string;
  foodDescription?: string;
  collectionDeadline?: string;
  pickupTimeWindow?: string;
  // Specific fields for vehicles
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  vehicleType?: string;
  speedKmh?: number;
  lastTelemetryTime?: string;
  // Specific fields for shelters
  beneficiaryCount?: number;
  dailyRequirement?: number;
  urgencyLevel?: string;
  // Specific fields for venues
  capacity?: number;
  foodSafetyRating?: string;
  // Route data if active
  destinationShelterName?: string;
  destinationLat?: number;
  destinationLng?: number;
}

interface LiveRescueMapProps {
  entities: LiveMapEntity[];
  selectedEntity: LiveMapEntity | null;
  onSelectEntity: (entity: LiveMapEntity | null) => void;
  userLocation: { lat: number; lng: number } | null;
  activeRoute?: {
    originName: string;
    originLat: number;
    originLng: number;
    destName: string;
    destLat: number;
    destLng: number;
    distanceKm: number;
    estimatedMins: number;
  } | null;
  onClearRoute?: () => void;
  onFindSheltersForEntity?: (entity: LiveMapEntity) => void;
}

export default function LiveRescueMap({
  entities,
  selectedEntity,
  onSelectEntity,
  userLocation,
  activeRoute,
  onClearRoute,
  onFindSheltersForEntity,
}: LiveRescueMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapType, setMapType] = useState<'street' | 'satellite' | 'logistics'>('street');
  const [hasGoogleMapsApiKey, setHasGoogleMapsApiKey] = useState(false);
  const [googleMapLoaded, setGoogleMapLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);
  const googleMarkers = useRef<any[]>([]);
  const googlePolyline = useRef<any>(null);

  // Check for Google Maps API Key
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (key && key !== 'your_api_key_here' && key.length > 10) {
      setHasGoogleMapsApiKey(true);
      // Load Google Maps script asynchronously if not already loaded
      if (typeof window !== 'undefined' && !(window as any).google?.maps) {
        const scriptId = 'google-maps-script';
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry`;
          script.async = true;
          script.defer = true;
          script.onload = () => setGoogleMapLoaded(true);
          document.head.appendChild(script);
        } else {
          setGoogleMapLoaded(true);
        }
      } else if (typeof window !== 'undefined' && (window as any).google?.maps) {
        setGoogleMapLoaded(true);
      }
    }
  }, []);

  // Initialize real Google Map if available
  useEffect(() => {
    if (!googleMapLoaded || !googleMapRef.current || !(window as any).google?.maps) return;

    try {
      const google = (window as any).google;
      if (!googleMapInstance.current) {
        googleMapInstance.current = new google.maps.Map(googleMapRef.current, {
          center: { lat: 19.076, lng: 72.8777 },
          zoom: 11,
          mapTypeId: mapType === 'satellite' ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });
      }

      // Clear existing markers
      googleMarkers.current.forEach((m) => m.setMap(null));
      googleMarkers.current = [];

      // Render Google Markers
      entities.forEach((ent) => {
        const marker = new google.maps.Marker({
          position: { lat: ent.lat, lng: ent.lng },
          map: googleMapInstance.current,
          title: ent.name,
          icon: {
            url: getMarkerIconUrl(ent.category),
            scaledSize: new google.maps.Size(32, 32),
          },
        });

        marker.addListener('click', () => {
          onSelectEntity(ent);
        });

        googleMarkers.current.push(marker);
      });

      // Render active route polyline on Google Map
      if (googlePolyline.current) {
        googlePolyline.current.setMap(null);
        googlePolyline.current = null;
      }

      if (activeRoute) {
        googlePolyline.current = new google.maps.Polyline({
          path: [
            { lat: activeRoute.originLat, lng: activeRoute.originLng },
            { lat: activeRoute.destLat, lng: activeRoute.destLng },
          ],
          geodesic: true,
          strokeColor: '#2F5D46',
          strokeOpacity: 0.9,
          strokeWeight: 4,
          map: googleMapInstance.current,
        });

        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: activeRoute.originLat, lng: activeRoute.originLng });
        bounds.extend({ lat: activeRoute.destLat, lng: activeRoute.destLng });
        googleMapInstance.current.fitBounds(bounds, 50);
      }
    } catch (e) {
      console.warn('Google Maps initialization fallback to SVG mode:', e);
    }
  }, [googleMapLoaded, entities, activeRoute, mapType, onSelectEntity]);

  function getMarkerIconUrl(category: LiveMapCategory): string {
    switch (category) {
      case 'venue':
      case 'caterer':
        return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      case 'donation':
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'shelter':
        return 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png';
      case 'pickup':
        return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      case 'vehicle':
        return 'https://maps.google.com/mapfiles/ms/icons/cyan-dot.png';
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }
  }

  // -------------------------------------------------------------
  // HIGH-FIDELITY MUMBAI CARTOGRAPHIC PROJECTION (FALLBACK & ENGINE)
  // -------------------------------------------------------------
  // Coordinates bounding box for Greater Mumbai Metropolitan Area
  // Latitude: 18.88 (Colaba South) to 19.24 (Borivali / Mira Road North) -> range ~0.36
  // Longitude: 72.78 (Arabian Sea Coast) to 73.02 (Thane & Navi Mumbai East) -> range ~0.24
  const minLat = 18.90;
  const maxLat = 19.22;
  const minLng = 72.80;
  const maxLng = 73.00;

  const projectToPercent = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Invert Y because latitude increases North, but SVG Y increases downwards
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(4, Math.min(96, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom((prev) => Math.min(2.5, prev + 0.3));
  const zoomOut = () => setZoom((prev) => Math.max(0.8, prev - 0.3));

  // Determine Category Badge & Pin Styles matching FoodRescue Design Spec:
  // Green: Donations | Blue: Venues & Caterers | Purple: NGOs & Shelters | Coral: Urgent Pickups | Cyan/Blue: Vehicles
  const getPinStyle = (cat: LiveMapCategory, isSelected: boolean) => {
    let bg = 'bg-[#285C45] text-white ring-[#285C45]/30';
    let icon = Building2;
    let label = 'Venue';

    switch (cat) {
      case 'venue':
        bg = 'bg-[#2B6CB0] text-white ring-[#2B6CB0]/40';
        icon = Building2;
        label = 'Wedding Hall';
        break;
      case 'caterer':
        bg = 'bg-[#2B6CB0] text-white ring-[#2B6CB0]/40';
        icon = Utensils;
        label = 'Catering Kitchen';
        break;
      case 'donation':
        bg = 'bg-[#285C45] text-white ring-[#285C45]/40 animate-pulse';
        icon = Package;
        label = 'Available Food';
        break;
      case 'shelter':
        bg = 'bg-[#6B46C1] text-white ring-[#6B46C1]/40';
        icon = Heart;
        label = 'NGO / Shelter';
        break;
      case 'vehicle':
        bg = 'bg-[#0284C7] text-white ring-[#0284C7]/40 ring-4';
        icon = Truck;
        label = 'Insulated Van';
        break;
      case 'pickup':
        bg = 'bg-[#F4775B] text-white ring-[#F4775B]/40 animate-pulse';
        icon = Clock3;
        label = 'Urgent Pickup';
        break;
    }

    return { bg, icon, label };
  };

  return (
    <div className="relative w-full h-[620px] rounded-[32px] overflow-hidden border border-ink/10 bg-[#eef1e9] shadow-soft select-none">
      {/* Real Google Map Container (Active when Google Maps key is valid) */}
      {hasGoogleMapsApiKey ? (
        <div ref={googleMapRef} className="w-full h-full" />
      ) : (
        /* High-Fidelity Custom Projected Mumbai Map */
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative w-full h-full overflow-hidden ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            backgroundColor: mapType === 'satellite' ? '#1c2826' : mapType === 'logistics' ? '#182420' : '#f0f3eb',
          }}
        >
          {/* Mumbai Coastal Shoreline & Corridor SVG Canvas */}
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-75 origin-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            <svg
              className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Arabian Sea Water background */}
              <rect x="0" y="0" width="100" height="100" fill={mapType === 'street' ? '#d8e5e1' : '#101c18'} />

              {/* Mumbai Peninsula Landmass approximation */}
              <polygon
                points="
                  18,98 25,92 28,75 32,60 36,45 42,30 46,12 60,8 75,10 82,25 80,45 74,65 68,82 58,95 45,98
                "
                fill={mapType === 'street' ? '#ffffff' : '#223830'}
                stroke={mapType === 'street' ? '#2F5D46' : '#34d399'}
                strokeWidth="0.5"
                strokeOpacity="0.4"
              />

              {/* Major Highway Corridors: Western Express Highway, Eastern Express, Sea Link */}
              {/* Western Express Highway: Dahisar down through Bandra */}
              <path
                d="M 45,15 Q 40,40 34,65 T 30,82"
                fill="none"
                stroke={mapType === 'street' ? '#f59e0b' : '#fbbf24'}
                strokeWidth="0.8"
                strokeDasharray="2,1"
              />
              {/* Eastern Express Highway: Thane through Chembur to South */}
              <path
                d="M 72,18 Q 65,45 58,68 T 46,88"
                fill="none"
                stroke={mapType === 'street' ? '#2F5D46' : '#10b981'}
                strokeWidth="0.8"
              />
              {/* Bandra-Worli Sea Link */}
              <path
                d="M 28,78 Q 24,82 28,87"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1"
              />

              {/* Active Route Polyline if present */}
              {activeRoute && (
                (() => {
                  const p1 = projectToPercent(activeRoute.originLat, activeRoute.originLng);
                  const p2 = projectToPercent(activeRoute.destLat, activeRoute.destLng);
                  return (
                    <g>
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#2F5D46"
                        strokeWidth="1.6"
                        strokeDasharray="2,1"
                      />
                      <circle cx={p1.x} cy={p1.y} r="1.5" fill="#2F5D46" />
                      <circle cx={p2.x} cy={p2.y} r="1.5" fill="#E76F51" />
                    </g>
                  );
                })()
              )}
            </svg>

            {/* Geographical Region Labels on Map */}
            <div className="absolute top-[18%] left-[38%] text-[9px] font-black uppercase tracking-widest text-ink/25 pointer-events-none">
              Western Suburbs (Goregaon / Andheri)
            </div>
            <div className="absolute top-[32%] left-[62%] text-[9px] font-black uppercase tracking-widest text-ink/25 pointer-events-none">
              Eastern Suburbs (Powai / Ghatkopar)
            </div>
            <div className="absolute top-[68%] left-[28%] text-[9px] font-black uppercase tracking-widest text-ink/25 pointer-events-none">
              Bandra & Coastal Sea Link
            </div>
            <div className="absolute top-[86%] left-[34%] text-[9px] font-black uppercase tracking-widest text-ink/25 pointer-events-none">
              South Mumbai (Worli / Colaba)
            </div>

            {/* User GPS Pin (if enabled) */}
            {userLocation && (
              (() => {
                const pos = projectToPercent(userLocation.lat, userLocation.lng);
                return (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    <div className="relative grid h-7 w-7 place-items-center">
                      <span className="absolute h-full w-full rounded-full bg-sky-500/30 animate-ping" />
                      <span className="relative grid h-4 w-4 place-items-center rounded-full bg-sky-600 text-white shadow-md">
                        <LocateFixed size={10} />
                      </span>
                    </div>
                  </div>
                );
              })()
            )}

            {/* Entity Markers */}
            {entities.map((ent) => {
              const pos = projectToPercent(ent.lat, ent.lng);
              const isSelected = selectedEntity?.id === ent.id;
              const { bg, icon: Icon, label } = getPinStyle(ent.category, isSelected);

              return (
                <div
                  key={ent.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEntity(ent);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-full transition-all duration-200 cursor-pointer ${
                    isSelected ? 'z-40 scale-125' : 'z-20 hover:scale-115 hover:z-30'
                  }`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                >
                  <div className="relative group">
                    {/* Pin Badge on top for Servings / Urgency */}
                    {ent.servings && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-ink px-1.5 py-0.2 text-[8px] font-black text-white whitespace-nowrap shadow-xs">
                        {ent.servings} Meals
                      </span>
                    )}

                    {/* Main Marker Bubble */}
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-2xl shadow-md ring-2 transition-all ${bg} ${
                        isSelected ? 'ring-4 ring-offset-2 ring-moss shadow-xl' : ''
                      }`}
                    >
                      <Icon size={14} />
                    </div>

                    {/* Pin Point Pointer */}
                    <div
                      className={`mx-auto -mt-1 h-2 w-2 rotate-45 rounded-xs ${
                        ent.category === 'shelter'
                          ? 'bg-[#E76F51]'
                          : ent.category === 'donation'
                          ? 'bg-[#16A34A]'
                          : ent.category === 'caterer'
                          ? 'bg-[#D97706]'
                          : ent.category === 'vehicle'
                          ? 'bg-[#0284C7]'
                          : 'bg-[#2F5D46]'
                      }`}
                    />

                    {/* Hover Tooltip Preview */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap rounded-xl bg-ink px-3 py-1.5 text-[11px] font-bold text-white shadow-xl">
                      <div className="flex items-center gap-1.5">
                        <span>{ent.name}</span>
                        {ent.badge && (
                          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-extrabold text-sage">
                            {ent.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-white/60 block">{ent.neighborhood} · {label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Left: Map Mode Selector & Live Status Pill */}
      <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-2xl border border-ink/10 bg-white/95 p-1 shadow-sm backdrop-blur-md text-xs font-bold">
          <button
            type="button"
            onClick={() => setMapType('street')}
            className={`px-3 py-1.5 rounded-xl transition ${
              mapType === 'street' ? 'bg-moss text-white shadow-xs' : 'text-ink/70 hover:bg-cream'
            }`}
          >
            Corridors
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 rounded-xl transition ${
              mapType === 'satellite' ? 'bg-moss text-white shadow-xs' : 'text-ink/70 hover:bg-cream'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapType('logistics')}
            className={`px-3 py-1.5 rounded-xl transition ${
              mapType === 'logistics' ? 'bg-moss text-white shadow-xs' : 'text-ink/70 hover:bg-cream'
            }`}
          >
            Night Fleet
          </button>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-ink/10 bg-white/95 px-3 py-1.5 text-xs font-bold text-ink/80 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{entities.length} Active Pins across Greater Mumbai</span>
        </div>
      </div>

      {/* Top Right: Zoom & Reset Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={zoomIn}
          title="Zoom In"
          className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 bg-white/95 text-ink shadow-sm hover:bg-cream transition cursor-pointer"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          title="Zoom Out"
          className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 bg-white/95 text-ink shadow-sm hover:bg-cream transition cursor-pointer"
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          onClick={resetView}
          title="Reset View"
          className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 bg-white/95 text-ink shadow-sm hover:bg-cream transition cursor-pointer"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Active Route Floating Banner */}
      {activeRoute && (
        <div className="absolute top-16 left-4 right-4 sm:right-auto sm:max-w-md z-30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="rounded-2xl border border-moss/30 bg-white p-3.5 shadow-xl flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-black tracking-wider text-moss block">
                Active Transit Corridor
              </span>
              <p className="font-bold text-ink truncate">
                {activeRoute.originName} → {activeRoute.destName}
              </p>
              <span className="text-[11px] text-ink/60">
                {activeRoute.distanceKm} km · ~{activeRoute.estimatedMins} mins via thermal van
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${activeRoute.originLat},${activeRoute.originLng}&destination=${activeRoute.destLat},${activeRoute.destLng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-moss px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#224433] transition flex items-center gap-1"
              >
                <span>Navigate</span> <ExternalLink size={11} />
              </a>
              {onClearRoute && (
                <button
                  type="button"
                  onClick={onClearRoute}
                  className="rounded-xl border border-ink/10 p-1.5 text-ink/60 hover:bg-cream transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-ink/10 bg-white/90 p-2.5 shadow-lg backdrop-blur-md pointer-events-auto text-[11px] font-bold text-ink/80">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-ink/40 font-black">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#285C45]" /> <span>Available Surplus (Green)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#2B6CB0]" /> <span>Venues & Caterers (Blue)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#6B46C1]" /> <span>NGOs & Shelters (Purple)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#F4775B]" /> <span>Urgent Pickups (Coral)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#0284C7]" /> <span>Rescue Vans (Vehicle)</span>
            </div>
          </div>

          <div className="text-[10px] text-ink/50 hidden md:block">
            Click any pin to inspect details or generate route
          </div>
        </div>
      </div>
    </div>
  );
}
