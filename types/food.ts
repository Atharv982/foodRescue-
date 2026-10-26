export type FoodSourceType = 'Wedding' | 'Party / Banquet' | 'Corporate Event' | 'Caterer' | 'Bakery & Café';

export type FoodBox = {
  id: string;
  name: string;
  partnerName: string;
  category: FoodSourceType;
  description: string;
  servings: number;
  originalValue: number;
  distributionCost: number;
  quantityAvailable: number;
  cookedTime: string;
  pickupStart: string;
  pickupEnd: string;
  location: string;
  venueName: string;
  zone: 'Western Suburbs' | 'South Mumbai' | 'Central Mumbai' | 'Eastern Suburbs';
  cuisineType: 'North Indian Feast' | 'Biryani & Rice Bowls' | 'Desserts & Mithai' | 'Bakery & Snacks' | 'Comfort Dal & Khichdi' | 'Fresh Fruits';
  temperatureVerified: string;
  urgencyLevel: 'Immediate (<60 Mins)' | 'Evening (9–11 PM)' | 'Late Night (11 PM–1 AM)';
  imageUrl: string;
  tags: string[];
  includedItems: string[];
  beneficiaryTarget: string;
  dietaryType?: 'Pure Vegetarian' | 'Non-Vegetarian' | 'Jain Friendly' | 'Halal Certified' | 'Vegan';
  temperatureStatus?: 'Steam Hot (>65°C)' | 'Chill Fresh (<5°C)' | 'Room Temp Ambient';
  beneficiaryCategory?: 'Children Orphanages' | 'Night Homeless Shelters' | 'Elderly Care' | 'Slum Community Relief';
  distanceKm?: number;
  packagingType?: 'Stainless Thermal Pots' | 'Eco Biodegradable Boxes' | 'Sealed Bakery Trays' | 'Chilled Cold-Bags';
};

export type EventDonationRequest = {
  eventName: string;
  eventType: FoodSourceType;
  venueAddress: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  estimatedServings: number;
  eventDate: string;
  pickupTime: string;
  foodDescription: string;
  dietaryType: 'Pure Vegetarian' | 'Non-Vegetarian' | 'Mixed';
};

export type ClaimRequest = {
  foodBoxId: string;
  organizationName: string;
  representativeName: string;
  email: string;
  phone: string;
  servingsRequested: number;
  deliveryType: 'Pickup by Volunteer' | 'Direct Delivery to Shelter';
  notes?: string;
};
