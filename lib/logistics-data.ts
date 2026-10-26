import fs from 'fs';
import path from 'path';
import {
  PickupJourney,
  PickupStatus,
  Driver,
  Vehicle,
  JourneyTimelineEvent,
  DeliveryProof,
  InAppNotification,
  ShelterMatchResult,
} from '@/types/logistics';
import { sheltersData } from './directory-data';
import {
  initialDrivers,
  initialVehicles,
  initialPickups,
  initialNotifications,
  calculateHaversineDistance,
  getNearbyShelterMatches,
  ComputedImpact,
  computeImpactMetricsClient,
} from './logistics-client';

export {
  initialDrivers,
  initialVehicles,
  initialPickups,
  initialNotifications,
  calculateHaversineDistance,
  getNearbyShelterMatches,
  type ComputedImpact,
};

// In-memory global caches for serverless environments
declare global {
  // eslint-disable-next-line no-var
  var __foodrescue_pickups: PickupJourney[] | undefined;
  // eslint-disable-next-line no-var
  var __foodrescue_drivers: Driver[] | undefined;
  // eslint-disable-next-line no-var
  var __foodrescue_vehicles: Vehicle[] | undefined;
  // eslint-disable-next-line no-var
  var __foodrescue_notifications: InAppNotification[] | undefined;
}

function getStoragePath(filename: string): string {
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isVercel) {
    return path.join('/tmp', filename);
  }
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      return path.join('/tmp', filename);
    }
  }
  return path.join(dataDir, filename);
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = getStoragePath(filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.warn(`Could not read storage file ${filename}:`, err);
  }
  return defaultValue;
}

function writeJsonFile<T>(filename: string, data: T): void {
  try {
    const filePath = getStoragePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`Could not write to storage file ${filename}:`, err);
  }
}

// -------------------------------------------------------------
// DATA ACCESS & PERSISTENCE
// -------------------------------------------------------------
export function getAllPickupJourneys(): PickupJourney[] {
  if (global.__foodrescue_pickups) {
    return global.__foodrescue_pickups;
  }
  const loaded = readJsonFile<PickupJourney[]>('pickups.json', initialPickups);
  global.__foodrescue_pickups = loaded;
  return loaded;
}

export function savePickupJourneys(journeys: PickupJourney[]): void {
  global.__foodrescue_pickups = journeys;
  writeJsonFile('pickups.json', journeys);
}

export function getPickupJourneyById(id: string): PickupJourney | null {
  const journeys = getAllPickupJourneys();
  return journeys.find((j) => j.id.toLowerCase() === id.toLowerCase()) || null;
}

export function getAllDrivers(): Driver[] {
  if (global.__foodrescue_drivers) {
    return global.__foodrescue_drivers;
  }
  const loaded = readJsonFile<Driver[]>('drivers.json', initialDrivers);
  global.__foodrescue_drivers = loaded;
  return loaded;
}

export function getAllVehicles(): Vehicle[] {
  if (global.__foodrescue_vehicles) {
    return global.__foodrescue_vehicles;
  }
  const loaded = readJsonFile<Vehicle[]>('vehicles.json', initialVehicles);
  global.__foodrescue_vehicles = loaded;
  return loaded;
}

export function getNotifications(): InAppNotification[] {
  if (global.__foodrescue_notifications) {
    return global.__foodrescue_notifications;
  }
  const loaded = readJsonFile<InAppNotification[]>('notifications.json', initialNotifications);
  global.__foodrescue_notifications = loaded;
  return loaded;
}

export function markNotificationRead(id: string): void {
  const list = getNotifications();
  const index = list.findIndex((n) => n.id === id);
  if (index !== -1) {
    list[index].read = true;
    global.__foodrescue_notifications = list;
    writeJsonFile('notifications.json', list);
  }
}

export function addNotification(notification: Omit<InAppNotification, 'id' | 'createdAt' | 'read'>): InAppNotification {
  const list = getNotifications();
  const newItem: InAppNotification = {
    ...notification,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newItem);
  global.__foodrescue_notifications = list;
  writeJsonFile('notifications.json', list);
  return newItem;
}

// -------------------------------------------------------------
// JOURNEY STATE TRANSITIONS & ACTIONS
// -------------------------------------------------------------
export function createPickupJourney(params: {
  donationId: string;
  title: string;
  donorName: string;
  donorCategory: string;
  donorContactPhone: string;
  pickupAddress: string;
  pickupNeighborhood: string;
  pickupZone: any;
  pickupLat?: number;
  pickupLng?: number;
  servings: number;
  foodCategory: string;
  dietaryType: string;
  foodDescription: string;
  packagingStatus: string;
  scheduledPickupWindow: string;
  scheduledDate: string;
  destinationShelterId?: string;
}): PickupJourney {
  const journeys = getAllPickupJourneys();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const journeyId = `FR-TRK-${randomSuffix}`;

  // Find destination shelter if specified
  let destinationShelterName: string | undefined;
  let destinationAddress: string | undefined;
  let destinationNeighborhood: string | undefined;
  let destinationLat: number | undefined;
  let destinationLng: number | undefined;

  if (params.destinationShelterId) {
    const shelter = sheltersData.find((s) => s.id === params.destinationShelterId);
    if (shelter) {
      destinationShelterName = shelter.name;
      destinationAddress = shelter.address;
      destinationNeighborhood = shelter.neighborhood;
      destinationLat = shelter.lat;
      destinationLng = shelter.lng;
    }
  }

  const pickupLat = params.pickupLat || 19.12;
  const pickupLng = params.pickupLng || 72.85;
  const nowIso = new Date().toISOString();

  const newJourney: PickupJourney = {
    id: journeyId,
    donationId: params.donationId,
    title: params.title,
    donorName: params.donorName,
    donorCategory: params.donorCategory,
    donorContactPhone: params.donorContactPhone,
    pickupAddress: params.pickupAddress,
    pickupNeighborhood: params.pickupNeighborhood,
    pickupZone: params.pickupZone,
    pickupLat,
    pickupLng,
    destinationShelterId: params.destinationShelterId,
    destinationShelterName,
    destinationAddress,
    destinationNeighborhood,
    destinationLat,
    destinationLng,
    servings: params.servings,
    estimatedKg: Math.round(params.servings * 0.45),
    foodCategory: params.foodCategory || 'Wedding Feasts',
    dietaryType: params.dietaryType || 'Pure Vegetarian',
    foodDescription: params.foodDescription,
    packagingStatus: params.packagingStatus || 'Stainless Thermal Pots',
    status: 'pickup_scheduled',
    scheduledPickupWindow: params.scheduledPickupWindow,
    scheduledDate: params.scheduledDate,
    timeline: [
      {
        id: `t-${Date.now()}-1`,
        status: 'donation_submitted',
        label: 'Donation Intake Form Registered',
        timestamp: nowIso,
        locationName: params.pickupNeighborhood,
        actorName: params.donorName,
        actorRole: 'Donor',
        completed: true,
      },
      {
        id: `t-${Date.now()}-2`,
        status: 'pickup_scheduled',
        label: `Pickup Scheduled for ${params.scheduledPickupWindow}`,
        timestamp: nowIso,
        locationName: params.pickupAddress,
        actorName: 'FoodRescue Dispatch Center',
        actorRole: 'Coordinator',
        completed: true,
      },
      {
        id: `t-${Date.now()}-3`,
        status: 'driver_assigned',
        label: 'Driver & Insulated Van Assignment',
        timestamp: 'Pending assignment',
        locationName: params.pickupZone,
        actorName: 'Regional Lead Coordinator',
        actorRole: 'Coordinator',
        completed: false,
      },
    ],
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  journeys.unshift(newJourney);
  savePickupJourneys(journeys);

  addNotification({
    type: 'pickup',
    title: `Pickup Scheduled: ${params.title}`,
    message: `Scheduled for ${params.scheduledPickupWindow} (${params.servings} meals). Ready for driver dispatch.`,
    referenceId: journeyId,
    actionUrl: `/pickups/${journeyId}`,
  });

  return newJourney;
}

export function updatePickupStatus(
  id: string,
  newStatus: PickupStatus,
  actor: { name: string; role: any },
  notes?: string,
  locationName?: string
): PickupJourney | null {
  const journeys = getAllPickupJourneys();
  const index = journeys.findIndex((j) => j.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const journey = journeys[index];
  const nowIso = new Date().toISOString();

  journey.status = newStatus;
  journey.updatedAt = nowIso;

  const eventLabelMap: Record<PickupStatus, string> = {
    donation_submitted: 'Donation Submitted',
    donation_reviewed: 'Donation Reviewed & Approved',
    pickup_requested: 'Pickup Requested by Donor',
    pickup_scheduled: `Pickup Confirmed (${journey.scheduledPickupWindow})`,
    driver_assigned: `Driver Assigned (${journey.assignedDriverName || 'Volunteer'})`,
    en_route_pickup: 'Driver En Route to Venue',
    food_collected: 'Food Inspected & Collected in Thermal Carriers',
    delivery_en_route: 'Van in Transit to Shelter',
    delivered_to_shelter: `Delivered at ${journey.destinationShelterName || 'Shelter'}`,
    delivery_confirmed: 'Delivery Verified & Confirmed by Recipient',
    delayed: `Pickup Delayed: ${notes || 'Traffic Delay'}`,
    cancelled: `Pickup Cancelled: ${notes || 'Host Request'}`,
    rejected: `Donation Rejected: ${notes || 'Hygiene standard not met'}`,
  };

  const newEvent: JourneyTimelineEvent = {
    id: `tl-${Date.now()}`,
    status: newStatus,
    label: eventLabelMap[newStatus] || newStatus,
    timestamp: nowIso,
    locationName: locationName || journey.pickupNeighborhood,
    actorName: actor.name,
    actorRole: actor.role,
    notes,
    completed: true,
  };

  journey.timeline.push(newEvent);
  journeys[index] = journey;
  savePickupJourneys(journeys);

  addNotification({
    type: newStatus === 'delivery_confirmed' ? 'delivery' : 'dispatch',
    title: `Status Update: ${journey.title}`,
    message: `${newEvent.label}. Current status: ${newStatus.replace(/_/g, ' ')}.`,
    referenceId: journey.id,
    actionUrl: `/pickups/${journey.id}`,
  });

  return journey;
}

export function assignDriverAndVehicle(
  journeyId: string,
  driverId: string,
  vehicleId?: string
): PickupJourney | null {
  const journeys = getAllPickupJourneys();
  const index = journeys.findIndex((j) => j.id.toLowerCase() === journeyId.toLowerCase());
  if (index === -1) return null;

  const drivers = getAllDrivers();
  const driver = drivers.find((d) => d.id === driverId);
  if (!driver) return null;

  const vehicles = getAllVehicles();
  const vehicle = vehicles.find((v) => v.id === (vehicleId || driver.vehicleId));

  const journey = journeys[index];
  journey.assignedDriverId = driver.id;
  journey.assignedDriverName = driver.name;
  journey.assignedDriverPhone = driver.phone;
  journey.assignedVehicleId = vehicle ? vehicle.id : driver.vehicleId;
  journey.assignedVehiclePlate = vehicle ? vehicle.plate : driver.vehiclePlate;
  journey.assignedVehicleType = vehicle ? vehicle.type : driver.vehicleType;
  journey.status = 'driver_assigned';
  journey.updatedAt = new Date().toISOString();

  journey.timeline.push({
    id: `assign-${Date.now()}`,
    status: 'driver_assigned',
    label: `Assigned to ${driver.name} (${vehicle?.plate || driver.vehiclePlate})`,
    timestamp: new Date().toISOString(),
    locationName: journey.pickupZone,
    actorName: 'Coordinator Dispatch Console',
    actorRole: 'Coordinator',
    completed: true,
  });

  journeys[index] = journey;
  savePickupJourneys(journeys);

  addNotification({
    type: 'dispatch',
    title: `Driver Assigned: ${driver.name}`,
    message: `${driver.name} has been assigned to ${journey.title} (${driver.vehiclePlate}).`,
    referenceId: journey.id,
    actionUrl: `/pickups/${journey.id}`,
  });

  return journey;
}

export function confirmDelivery(
  journeyId: string,
  proof: DeliveryProof
): { success: boolean; journey?: PickupJourney; error?: string } {
  const journeys = getAllPickupJourneys();
  const index = journeys.findIndex((j) => j.id.toLowerCase() === journeyId.toLowerCase());
  if (index === -1) return { success: false, error: 'Pickup journey not found.' };

  const journey = journeys[index];

  if (journey.status === 'delivery_confirmed') {
    return { success: false, error: 'This delivery has already been confirmed and impact counted.' };
  }

  const nowIso = new Date().toISOString();
  journey.status = 'delivery_confirmed';
  journey.deliveryProof = {
    ...proof,
    confirmedAt: proof.confirmedAt || nowIso,
  };
  journey.updatedAt = nowIso;

  journey.timeline.push({
    id: `confirm-${Date.now()}`,
    status: 'delivery_confirmed',
    label: `Delivery Verified by ${proof.recipientName}`,
    timestamp: nowIso,
    locationName: journey.destinationAddress || journey.destinationShelterName || 'Shelter Facility',
    actorName: proof.recipientName,
    actorRole: 'Shelter Warden',
    notes: `${proof.deliveredServings} meals accepted. Temp: ${proof.temperatureReading}. ${proof.notes || ''}`.trim(),
    completed: true,
  });

  journeys[index] = journey;
  savePickupJourneys(journeys);

  addNotification({
    type: 'delivery',
    title: `Delivery Confirmed: ${journey.title}`,
    message: `${proof.deliveredServings} meals accepted at ${journey.destinationShelterName || 'recipient shelter'}. FSSAI Temp: ${proof.temperatureReading}.`,
    referenceId: journey.id,
    actionUrl: `/pickups/${journey.id}`,
  });

  return { success: true, journey };
}

export function computeImpactMetrics(
  filterPeriod: 'today' | '7days' | '30days' | 'month' | 'year' | 'all' = '30days'
): ComputedImpact {
  const journeys = getAllPickupJourneys();
  return computeImpactMetricsClient(filterPeriod, journeys);
}
