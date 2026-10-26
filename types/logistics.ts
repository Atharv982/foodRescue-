import { MumbaiZone } from './directory';

export type PickupStatus =
  | 'donation_submitted'
  | 'donation_reviewed'
  | 'pickup_requested'
  | 'pickup_scheduled'
  | 'driver_assigned'
  | 'en_route_pickup'
  | 'food_collected'
  | 'delivery_en_route'
  | 'delivered_to_shelter'
  | 'delivery_confirmed'
  | 'delayed'
  | 'cancelled'
  | 'rejected';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  assignedZone: MumbaiZone;
  vehicleId: string;
  vehiclePlate: string;
  vehicleType: string;
  status: 'available' | 'on_pickup' | 'on_delivery' | 'off_duty';
  activeTaskCount: number;
  rating: number;
  avatarUrl: string;
  lastLocation: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
}

export interface Vehicle {
  id: string;
  plate: string;
  type: 'Small Volunteer Vehicle' | 'Medium Insulated Van' | 'Heavy Rescue Truck';
  capacityServings: number;
  hasThermalInsulation: boolean;
  assignedDriverId: string;
  status: 'active' | 'in_transit' | 'idle' | 'maintenance';
  lastTelemetry: {
    lat: number;
    lng: number;
    speedKmh: number;
    updatedAt: string;
  };
}

export interface JourneyTimelineEvent {
  id: string;
  status: PickupStatus;
  label: string;
  timestamp: string;
  locationName: string;
  actorName: string;
  actorRole: 'Donor' | 'Coordinator' | 'Lead Driver' | 'Shelter Warden' | 'System';
  notes?: string;
  completed: boolean;
}

export interface DeliveryProof {
  confirmedAt: string;
  recipientName: string;
  recipientPhone?: string;
  recipientDesignation?: string;
  deliveredServings: number;
  temperatureReading: string;
  notes?: string;
  imageUrl?: string;
}

export interface PickupJourney {
  id: string; // e.g. "FR-TRK-8821"
  donationId: string;
  title: string;
  donorName: string;
  donorCategory: string; // "Wedding Hall", "Caterer", "Corporate Gala", etc.
  donorContactPhone: string;
  pickupAddress: string;
  pickupNeighborhood: string;
  pickupZone: MumbaiZone;
  pickupLat: number;
  pickupLng: number;
  destinationShelterId?: string;
  destinationShelterName?: string;
  destinationAddress?: string;
  destinationNeighborhood?: string;
  destinationLat?: number;
  destinationLng?: number;
  servings: number;
  estimatedKg: number;
  foodCategory: string;
  dietaryType: string;
  foodDescription: string;
  packagingStatus: string;
  status: PickupStatus;
  scheduledPickupWindow: string;
  scheduledDate: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  assignedVehicleType?: string;
  timeline: JourneyTimelineEvent[];
  deliveryProof?: DeliveryProof;
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  type: 'donation' | 'pickup' | 'dispatch' | 'delivery' | 'system';
  title: string;
  message: string;
  referenceId: string;
  actionUrl: string;
  read: boolean;
  createdAt: string;
}

export interface ShelterMatchResult {
  shelterId: string;
  shelterName: string;
  category: string;
  distanceKm: number;
  estimatedTravelMins: number;
  beneficiaryCount: number;
  dailyRequirementServings: number;
  urgencyLevel: string;
  dietaryFit: boolean;
  matchScore: number;
  matchExplanation: string;
  address: string;
  lat: number;
  lng: number;
  contactPerson: string;
  contactPhone: string;
  googleMapsUrl: string;
  directionsUrl: string;
}
