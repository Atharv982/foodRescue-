'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Building2,
  Utensils,
  Heart,
  Navigation,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export interface MapItem {
  id: string;
  name: string;
  type: 'venue' | 'caterer' | 'shelter';
  category: string;
  address: string;
  neighborhood: string;
  zone: string;
  lat: number;
  lng: number;
  detailUrl: string;
  googleMapsUrl: string;
  directionsUrl: string;
  imageUrl?: string;
  badge?: string;
}

interface InteractiveMapProps {
  items: MapItem[];
  selectedItem?: MapItem | null;
  onSelectItem?: (item: MapItem | null) => void;
  heightClass?: string;
  centerLat?: number;
  centerLng?: number;
  zoomLevel?: number;
  interactive?: boolean;
}

export default function InteractiveMap({
  items,
  selectedItem = null,
  onSelectItem,
  heightClass = 'h-[500px]',
  centerLat = 19.076,
  centerLng = 72.8777,
  zoomLevel = 11,
  interactive = true,
}: InteractiveMapProps) {
  const [activePin, setActivePin] = useState<MapItem | null>(selectedItem);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasGoogleMapsApiKey, setHasGoogleMapsApiKey] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActivePin(selectedItem);
  }, [selectedItem]);

  // Check if real Google Maps API key is configured
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (key && key !== 'your_api_key_here') {
      setHasGoogleMapsApiKey(true);
      // Load Google Maps script if needed
    }
  }, []);

  // Mumbai Lat/Lng bounding box for SVG projection
  // Lat: 18.89 (South Colaba) to 19.22 (North Goregaon / Borivali) -> span ~ 0.33
  // Lng: 72.78 (West Coast) to 72.98 (East Powai / Ghatkopar) -> span ~ 0.20
  const minLat = 18.91;
  const maxLat = 19.2;
  const minLng = 72.8;
  const maxLng = 72.95;

  const projectToPercent = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Invert Y because latitude goes north (up), while SVG/CSS Y goes down
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
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

  const zoomIn = () => setZoom((z) => Math.min(2.5, z + 0.3));
  const zoomOut = () => setZoom((z) => Math.max(0.8, z - 0.3));

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'venue':
        return {
          bg: 'bg-moss',
          border: 'border-moss',
          text: 'text-moss',
          ring: 'ring-moss/30',
          icon: Building2,
          label: 'Venue',
        };
      case 'caterer':
        return {
          bg: 'bg-amber-600',
          border: 'border-amber-600',
          text: 'text-amber-600',
          ring: 'ring-amber-500/30',
          icon: Utensils,
          label: 'Caterer',
        };
      case 'shelter':
        return {
          bg: 'bg-tomato',
          border: 'border-tomato',
          text: 'text-tomato',
          ring: 'ring-tomato/30',
          icon: Heart,
          label: 'Shelter',
        };
      default:
        return {
          bg: 'bg-ink',
          border: 'border-ink',
          text: 'text-ink',
          ring: 'ring-ink/30',
          icon: MapPin,
          label: 'Partner',
        };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${heightClass} overflow-hidden rounded-3xl border border-ink/10 bg-[#e8ece9] shadow-inner select-none transition-all`}
    >
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-2xl border border-ink/10 bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-md text-xs font-bold text-ink">
          <Navigation size={13} className="text-moss" />
          <span>Greater Mumbai Map</span>
          <span className="rounded-full bg-moss/10 px-2 py-0.5 text-[10px] text-moss font-extrabold">
            {items.length} Locations
          </span>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md text-[11px] font-bold text-ink/70">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-moss" /> Venues
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> Caterers
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-tomato" /> Shelters
          </span>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={zoomIn}
          title="Zoom In"
          className="grid h-8 w-8 place-items-center rounded-xl border border-ink/10 bg-white text-ink shadow-sm hover:bg-cream transition cursor-pointer"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          title="Zoom Out"
          className="grid h-8 w-8 place-items-center rounded-xl border border-ink/10 bg-white text-ink shadow-sm hover:bg-cream transition cursor-pointer"
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          onClick={resetView}
          title="Reset Map View"
          className="grid h-8 w-8 place-items-center rounded-xl border border-ink/10 bg-white text-ink shadow-sm hover:bg-cream transition cursor-pointer"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Map Canvas Background (Styled vector representation of Mumbai Coastline & Arterials) */}
      <div
        className="w-full h-full relative cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          {/* Arabian Sea Coastline Background */}
          <path
            d="M 0,0 L 260,0 C 280,180 320,320 280,450 C 240,550 200,680 180,820 C 170,900 190,980 200,1000 L 0,1000 Z"
            fill="#c5dbe2"
            opacity="0.8"
          />
          {/* Powai Lake */}
          <ellipse cx="680" cy="380" rx="45" ry="30" fill="#a4cbdb" />
          {/* Thane Creek / Harbor Water */}
          <path
            d="M 850,200 C 780,450 740,650 710,1000 L 1000,1000 L 1000,200 Z"
            fill="#c5dbe2"
            opacity="0.6"
          />
          {/* Western Express Highway arterial */}
          <path
            d="M 420,120 Q 380,350 350,560 T 310,850"
            stroke="#ffffff"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Eastern Express Highway arterial */}
          <path
            d="M 640,150 Q 610,400 560,650 T 480,880"
            stroke="#ffffff"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          {/* Bandra-Worli Sea Link */}
          <path
            d="M 270,680 Q 240,730 270,780"
            stroke="#2F5D46"
            strokeWidth="5"
            strokeDasharray="6 3"
            fill="none"
          />
        </svg>

        {/* Region Labels */}
        <div className="absolute top-[18%] left-[36%] text-[11px] font-black tracking-widest uppercase text-ink/30 pointer-events-none">
          Goregaon / Aarey
        </div>
        <div className="absolute top-[35%] right-[28%] text-[11px] font-black tracking-widest uppercase text-ink/30 pointer-events-none">
          Powai Lake
        </div>
        <div className="absolute top-[48%] left-[27%] text-[11px] font-black tracking-widest uppercase text-ink/30 pointer-events-none">
          Bandra West
        </div>
        <div className="absolute top-[52%] left-[45%] text-[11px] font-black tracking-widest uppercase text-ink/30 pointer-events-none">
          BKC / Kurla
        </div>
        <div className="absolute top-[68%] left-[32%] text-[11px] font-black tracking-widest uppercase text-ink/30 pointer-events-none">
          Worli Sea Face
        </div>
        <div className="absolute top-[75%] left-[40%] text-[11px] font-black tracking-widest uppercase text-ink/30 pointer-events-none">
          Dadar / Byculla
        </div>
        <div className="absolute top-[90%] left-[34%] text-[11px] font-black tracking-widest uppercase text-ink/30 pointer-events-none">
          Colaba / Fort
        </div>

        {/* Interactive Location Markers */}
        {items.map((item) => {
          const pos = projectToPercent(item.lat, item.lng);
          const styling = getMarkerColor(item.type);
          const Icon = styling.icon;
          const isSelected = activePin?.id === item.id;

          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-full z-10 transition-transform duration-200"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePin(item);
                  if (onSelectItem) onSelectItem(item);
                }}
                className={`group relative flex items-center justify-center p-1 cursor-pointer transition-all ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
                title={`${item.name} (${styling.label})`}
              >
                {/* Ping animation on selected */}
                {isSelected && (
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${styling.bg}`}
                  />
                )}

                {/* Marker Pin Badge */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg transition border-2 border-white ${
                    styling.bg
                  } ${isSelected ? 'ring-4 ring-white shadow-xl' : ''}`}
                >
                  <Icon size={16} />
                </div>

                {/* Small indicator needle */}
                <div
                  className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] mx-auto -mt-0.5 ${
                    styling.border
                  }`}
                  style={{ borderTopColor: isSelected ? '#1c241f' : undefined }}
                />

                {/* Mini Pin Label */}
                <span
                  className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-0.5 text-[9px] font-bold shadow-md transition pointer-events-none ${
                    isSelected
                      ? 'bg-ink text-white opacity-100 z-40'
                      : 'bg-white/95 text-ink/80 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Marker Active Popup Card */}
      {activePin && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-moss/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-moss mb-1">
                  {activePin.category} · {activePin.zone}
                </span>
                <h4 className="font-display text-sm font-bold text-ink leading-tight">
                  {activePin.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActivePin(null)}
                className="grid h-6 w-6 place-items-center rounded-full bg-ink/5 text-ink/50 hover:bg-ink/10 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="mt-1.5 text-xs text-ink/65 flex items-start gap-1">
              <MapPin size={13} className="shrink-0 text-tomato mt-0.5" />
              <span>{activePin.address}</span>
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-ink/5">
              <a
                href={activePin.detailUrl}
                className="rounded-xl bg-moss px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#224433] inline-flex items-center gap-1"
              >
                View Details
              </a>
              <a
                href={activePin.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-ink/10 bg-cream/60 px-2.5 py-1.5 text-xs font-bold text-ink transition hover:bg-cream inline-flex items-center gap-1"
              >
                <ExternalLink size={12} /> Open in Google Maps
              </a>
              <a
                href={activePin.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-moss/30 bg-sage/20 px-2.5 py-1.5 text-xs font-bold text-moss transition hover:bg-sage/40 inline-flex items-center gap-1"
              >
                <Navigation size={12} /> Directions
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer Info Bar */}
      <div className="absolute bottom-2 left-4 z-10 hidden md:flex items-center gap-2 text-[10px] text-ink/50 bg-white/70 px-2.5 py-1 rounded-full backdrop-blur-xs">
        <Info size={11} className="text-moss" />
        <span>Click any pin to inspect verified location & get turn-by-turn Google Maps directions.</span>
      </div>
    </div>
  );
}
