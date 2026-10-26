export type MumbaiZone =
  | 'Western Suburbs'
  | 'South Mumbai'
  | 'Central Mumbai'
  | 'Eastern Suburbs'
  | 'Thane & Navi Mumbai';

export type VenueCategory =
  | 'Wedding Hall'
  | 'Banquet Hall'
  | 'Hotel & Resort'
  | 'Convention Center'
  | 'Lawn & Open Air'
  | 'Community Hall';

export interface Venue {
  id: string;
  slug: string;
  name: string;
  category: VenueCategory;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  zone: MumbaiZone;
  lat: number;
  lng: number;
  capacity: number; // guest capacity
  contactPhone: string;
  contactEmail: string;
  website: string;
  isVerified: boolean;
  partnerSince: string;
  totalMealsDonated: number;
  foodSafetyRating: 'FSSAI 5-Star Hygiene' | 'FSSAI Hygiene Certified' | 'ISO 22000 Partner';
  featuredImage: string;
  images: string[];
  facilities: string[];
  googleMapsUrl: string;
  directionsUrl: string;
  acceptedDonationTypes: string[];
  activeBatchesCount?: number;
}

export interface Caterer {
  id: string;
  slug: string;
  name: string;
  specialties: string[];
  cuisineTypes: string[];
  serviceAreas: string[];
  capacityPerEvent: number; // max guests they can cater
  eventsServedCount: number;
  contactPhone: string;
  contactEmail: string;
  website: string;
  address: string;
  neighborhood: string;
  city: string;
  zone: MumbaiZone;
  lat: number;
  lng: number;
  isVerified: boolean;
  partnerSince: string;
  totalMealsRescued: number;
  surplusManagementCapability: string;
  verifiedVenuesServed: string[];
  featuredImage: string;
  images: string[];
  googleMapsUrl: string;
  directionsUrl: string;
}

export type ShelterCategory =
  | 'Children Orphanage'
  | 'Night Homeless Shelter'
  | 'Destitute Elders Care'
  | 'Community Slum Kitchen'
  | 'Women & Child Relief Home';

export interface Shelter {
  id: string;
  slug: string;
  name: string;
  category: ShelterCategory;
  description: string;
  beneficiaryCount: number;
  dailyRequirementServings: number;
  address: string;
  neighborhood: string;
  city: string;
  zone: MumbaiZone;
  lat: number;
  lng: number;
  contactPerson: string;
  contactPhone: string;
  isVerified: boolean;
  partnerSince: string;
  mealsReceived: number;
  urgencyLevel: 'Immediate Need' | 'Regular Schedule' | 'High Need';
  mealPreferences: string[];
  googleMapsUrl: string;
  directionsUrl: string;
  featuredImage?: string;
  images?: string[];
}

export type StoryCategory =
  | 'Wedding Food Rescue'
  | 'Caterer Partnerships'
  | 'Venue Collaborations'
  | 'NGO and Shelter Impact'
  | 'Volunteer Highlights'
  | 'Community Success Stories'
  | 'Food Waste Reduction'
  | 'Rescue Milestones'
  | 'Wedding Feast'
  | 'Shelter Impact'
  | 'Chef & Caterer'
  | 'Zero Waste Milestone';

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  category: StoryCategory;
  author: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string[];
  metrics: { label: string; value: string }[];
  partnerFeatured: string;
  quote: {
    text: string;
    author: string;
    role: string;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Donors' | 'Caterers' | 'NGOs & Shelters' | 'Food Safety' | 'Logistics';
  tags: string[];
}
