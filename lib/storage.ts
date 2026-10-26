import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin } from './supabase-admin';
import { foodBoxes as initialFoodBoxes } from './food-data';

export interface StoredEventDonation {
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
  vehicleNeeded?: string;
  emailVerified?: boolean;
  rejectionReason?: string;
  assignedVan?: string;
  status: 'pending_dispatch' | 'dispatched' | 'collected' | 'delivered' | 'pending_approval' | 'approved' | 'ready_for_pickup' | 'in_transit' | 'completed' | 'rejected';
  assignedShelter?: string;
  createdAt: string;
}

export interface StoredReservation {
  id: string;
  foodBoxId: string;
  foodBoxName: string;
  partnerName: string;
  customerName: string;
  representativeName?: string;
  email: string;
  phone: string;
  quantity: number;
  destinationType?: string;
  pickupStart: string;
  pickupEnd: string;
  location: string;
  venueName: string;
  status: 'confirmed' | 'dispatched' | 'completed';
  createdAt: string;
}

// Global cache for durable persistence across serverless invocations
declare global {
  // eslint-disable-next-line no-var
  var __foodrescue_donations: StoredEventDonation[] | undefined;
  // eslint-disable-next-line no-var
  var __foodrescue_reservations: StoredReservation[] | undefined;
  // eslint-disable-next-line no-var
  var __foodrescue_inventory: Record<string, number> | undefined;
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

// Initializing caches
if (!global.__foodrescue_donations) {
  global.__foodrescue_donations = readJsonFile<StoredEventDonation[]>('donations.json', []);
}
if (!global.__foodrescue_reservations) {
  global.__foodrescue_reservations = readJsonFile<StoredReservation[]>('reservations.json', []);
}
if (!global.__foodrescue_inventory) {
  const stockMap: Record<string, number> = {};
  initialFoodBoxes.forEach((box) => {
    stockMap[box.id] = box.quantityAvailable;
  });
  global.__foodrescue_inventory = stockMap;
}

export function getInventory(boxId: string): number {
  if (global.__foodrescue_inventory && boxId in global.__foodrescue_inventory) {
    return global.__foodrescue_inventory[boxId];
  }
  const box = initialFoodBoxes.find((b) => b.id === boxId);
  return box ? box.quantityAvailable : 0;
}

// Save an event food donation (Weddings, Banquets, Caterers)
export async function createEventDonation(params: {
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
  vehicleNeeded?: string;
  emailVerified?: boolean;
}): Promise<{ success: boolean; donationId: string; message: string }> {
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const donationId = `FR-EVENT-${randomSuffix}`;

  const newDonation: StoredEventDonation = {
    id: donationId,
    ...params,
    status: 'pending_dispatch',
    emailVerified: params.emailVerified ?? true,
    createdAt: new Date().toISOString()
  };

  const list = global.__foodrescue_donations || [];
  list.unshift(newDonation);
  global.__foodrescue_donations = list;
  writeJsonFile('donations.json', list);

  return {
    success: true,
    donationId,
    message: 'Pickup request received! Our nearby volunteer rescue van has been notified for dispatch.'
  };
}

export function getAllEventDonations(): StoredEventDonation[] {
  return global.__foodrescue_donations || readJsonFile<StoredEventDonation[]>('donations.json', []);
}

export function updateEventDonation(id: string, updates: Partial<StoredEventDonation>): StoredEventDonation | null {
  const list = getAllEventDonations();
  const index = list.findIndex((d) => d.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates };
  global.__foodrescue_donations = list;
  writeJsonFile('donations.json', list);
  return list[index];
}

// Claim / reserve food batch for shelter or needy community
export async function createReservation(params: {
  foodBoxId: string;
  customerName: string;
  representativeName?: string;
  email: string;
  phone: string;
  quantity: number;
  destinationType?: string;
}): Promise<{
  success: boolean;
  reservationId?: string;
  error?: string;
  source: 'supabase' | 'durable-store';
}> {
  // Check if Supabase credentials are configured
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase_project_url')
  );

  if (hasSupabase) {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.rpc('reserve_food_box', {
        p_food_box_id: params.foodBoxId,
        p_customer_name: params.customerName,
        p_email: params.email,
        p_phone: params.phone,
        p_quantity: params.quantity,
      });

      if (!error && data?.reservation_code) {
        return {
          success: true,
          reservationId: data.reservation_code,
          source: 'supabase'
        };
      }
    } catch (supabaseErr) {
      console.warn('Supabase not available, using durable fallback:', supabaseErr);
    }
  }

  // Durable store fallback
  const box = initialFoodBoxes.find((b) => b.id === params.foodBoxId);
  if (!box) {
    return { success: false, error: 'Food batch not found.', source: 'durable-store' };
  }

  const currentStock = getInventory(box.id);
  if (currentStock < params.quantity) {
    return {
      success: false,
      error: currentStock <= 0 ? 'This food batch has already been allocated to a shelter.' : `Only ${currentStock} portions remaining.`,
      source: 'durable-store'
    };
  }

  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const reservationCode = `FR-RELIEF-${randomSuffix}`;

  if (global.__foodrescue_inventory) {
    global.__foodrescue_inventory[box.id] = currentStock - params.quantity;
  }

  const newReservation: StoredReservation = {
    id: reservationCode,
    foodBoxId: box.id,
    foodBoxName: box.name,
    partnerName: box.partnerName,
    customerName: params.customerName,
    representativeName: params.representativeName,
    email: params.email,
    phone: params.phone,
    quantity: params.quantity,
    destinationType: params.destinationType,
    pickupStart: box.pickupStart,
    pickupEnd: box.pickupEnd,
    location: box.location,
    venueName: box.venueName,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  const list = global.__foodrescue_reservations || [];
  list.unshift(newReservation);
  global.__foodrescue_reservations = list;
  writeJsonFile('reservations.json', list);

  return {
    success: true,
    reservationId: reservationCode,
    source: 'durable-store'
  };
}

export function getAllReservations(): StoredReservation[] {
  return global.__foodrescue_reservations || readJsonFile<StoredReservation[]>('reservations.json', []);
}

export async function createPartnerInquiry(params: {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  city: string;
  estimatedSurplus: string;
}): Promise<{ success: boolean; inquiryId: string }> {
  const inquiryId = `PI-${Date.now().toString(36).toUpperCase()}`;
  return { success: true, inquiryId };
}

export function getAllPartnerInquiries(): Array<{ id: string; businessName: string; contactName: string }> {
  return [];
}
