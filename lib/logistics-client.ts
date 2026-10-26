import {
  PickupJourney,
  Driver,
  Vehicle,
  InAppNotification,
  ShelterMatchResult,
} from '@/types/logistics';
import { sheltersData, venuesData, caterersData } from './directory-data';

export type { ShelterMatchResult, PickupJourney, Driver, Vehicle, InAppNotification };

// -------------------------------------------------------------
// SEED DRIVERS & VEHICLES (CLIENT-SAFE)
// -------------------------------------------------------------
export const initialDrivers: Driver[] = [
  {
    id: 'drv-vikram',
    name: 'Vikram Malhotra',
    phone: '+91 98201 55432',
    licenseNumber: 'MH02-2018-009412',
    assignedZone: 'Western Suburbs',
    vehicleId: 'veh-van-02',
    vehiclePlate: 'MH 02 BZ 4491',
    vehicleType: 'Medium Insulated Van',
    status: 'on_delivery',
    activeTaskCount: 1,
    rating: 4.95,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    lastLocation: {
      lat: 19.1245,
      lng: 72.852,
      updatedAt: '2026-10-26T22:45:00.000Z',
    },
  },
  {
    id: 'drv-rajesh',
    name: 'Rajesh Shinde',
    phone: '+91 98202 88123',
    licenseNumber: 'MH01-2019-012845',
    assignedZone: 'South Mumbai',
    vehicleId: 'veh-van-01',
    vehiclePlate: 'MH 01 CR 2011',
    vehicleType: 'Small Volunteer Vehicle',
    status: 'available',
    activeTaskCount: 0,
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    lastLocation: {
      lat: 18.965,
      lng: 72.825,
      updatedAt: '2026-10-26T22:30:00.000Z',
    },
  },
  {
    id: 'drv-amit',
    name: 'Amit Deshmukh',
    phone: '+91 98203 77419',
    licenseNumber: 'MH03-2017-005128',
    assignedZone: 'Central Mumbai',
    vehicleId: 'veh-truck-03',
    vehiclePlate: 'MH 03 DZ 9980',
    vehicleType: 'Heavy Rescue Truck',
    status: 'on_pickup',
    activeTaskCount: 1,
    rating: 4.88,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    lastLocation: {
      lat: 19.018,
      lng: 72.843,
      updatedAt: '2026-10-26T22:50:00.000Z',
    },
  },
  {
    id: 'drv-sunita',
    name: 'Sunita Patil',
    phone: '+91 98204 11990',
    licenseNumber: 'MH04-2020-019942',
    assignedZone: 'Eastern Suburbs',
    vehicleId: 'veh-van-04',
    vehiclePlate: 'MH 04 EF 6120',
    vehicleType: 'Medium Insulated Van',
    status: 'available',
    activeTaskCount: 0,
    rating: 4.97,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    lastLocation: {
      lat: 19.132,
      lng: 72.915,
      updatedAt: '2026-10-26T22:15:00.000Z',
    },
  },
  {
    id: 'drv-farhan',
    name: 'Farhan Khan',
    phone: '+91 98205 66781',
    licenseNumber: 'MH43-2021-008119',
    assignedZone: 'Thane & Navi Mumbai',
    vehicleId: 'veh-van-05',
    vehiclePlate: 'MH 43 GA 3318',
    vehicleType: 'Medium Insulated Van',
    status: 'available',
    activeTaskCount: 0,
    rating: 4.92,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
    lastLocation: {
      lat: 19.182,
      lng: 72.975,
      updatedAt: '2026-10-26T22:20:00.000Z',
    },
  },
];

export const initialVehicles: Vehicle[] = [
  {
    id: 'veh-van-01',
    plate: 'MH 01 CR 2011',
    type: 'Small Volunteer Vehicle',
    capacityServings: 60,
    hasThermalInsulation: true,
    assignedDriverId: 'drv-rajesh',
    status: 'active',
    lastTelemetry: {
      lat: 18.965,
      lng: 72.825,
      speedKmh: 0,
      updatedAt: '2026-10-26T22:30:00.000Z',
    },
  },
  {
    id: 'veh-van-02',
    plate: 'MH 02 BZ 4491',
    type: 'Medium Insulated Van',
    capacityServings: 200,
    hasThermalInsulation: true,
    assignedDriverId: 'drv-vikram',
    status: 'in_transit',
    lastTelemetry: {
      lat: 19.1245,
      lng: 72.852,
      speedKmh: 28,
      updatedAt: '2026-10-26T22:45:00.000Z',
    },
  },
  {
    id: 'veh-truck-03',
    plate: 'MH 03 DZ 9980',
    type: 'Heavy Rescue Truck',
    capacityServings: 1000,
    hasThermalInsulation: true,
    assignedDriverId: 'drv-amit',
    status: 'in_transit',
    lastTelemetry: {
      lat: 19.018,
      lng: 72.843,
      speedKmh: 22,
      updatedAt: '2026-10-26T22:50:00.000Z',
    },
  },
  {
    id: 'veh-van-04',
    plate: 'MH 04 EF 6120',
    type: 'Medium Insulated Van',
    capacityServings: 200,
    hasThermalInsulation: true,
    assignedDriverId: 'drv-sunita',
    status: 'active',
    lastTelemetry: {
      lat: 19.132,
      lng: 72.915,
      speedKmh: 0,
      updatedAt: '2026-10-26T22:15:00.000Z',
    },
  },
  {
    id: 'veh-van-05',
    plate: 'MH 43 GA 3318',
    type: 'Medium Insulated Van',
    capacityServings: 250,
    hasThermalInsulation: true,
    assignedDriverId: 'drv-farhan',
    status: 'active',
    lastTelemetry: {
      lat: 19.182,
      lng: 72.975,
      speedKmh: 0,
      updatedAt: '2026-10-26T22:20:00.000Z',
    },
  },
];

export const initialPickups: PickupJourney[] = [
  {
    id: 'FR-TRK-8821',
    donationId: 'FR-BATCH-01',
    title: 'Grand Bandra Sangeet Dinner (85 Meals)',
    donorName: 'Sea Breeze Banquet & Lawn',
    donorCategory: 'Wedding Hall',
    donorContactPhone: '+91 98200 44111',
    pickupAddress: 'Sea Breeze Hall, Carter Road, Bandra West, Mumbai 400050',
    pickupNeighborhood: 'Bandra West',
    pickupZone: 'Western Suburbs',
    pickupLat: 19.0657,
    pickupLng: 72.8252,
    destinationShelterId: 'shelter-bandra-homeless',
    destinationShelterName: 'Bandra Station Homeless Relief Center',
    destinationAddress: 'Opposite Bandra Railway Station (West), Mumbai 400050',
    destinationNeighborhood: 'Bandra West',
    destinationLat: 19.0544,
    destinationLng: 72.8402,
    servings: 85,
    estimatedKg: 38,
    foodCategory: 'Wedding Feasts',
    dietaryType: 'Pure Vegetarian',
    foodDescription: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Chapati, Gulab Jamun',
    packagingStatus: 'Thermal Pots & Steel Containers',
    status: 'delivery_en_route',
    scheduledPickupWindow: '22:15 - 23:00',
    scheduledDate: 'Tonight',
    assignedDriverId: 'drv-vikram',
    assignedDriverName: 'Vikram Malhotra',
    assignedDriverPhone: '+91 98201 55432',
    assignedVehicleId: 'veh-van-02',
    assignedVehiclePlate: 'MH 02 BZ 4491',
    assignedVehicleType: 'Medium Insulated Van',
    timeline: [
      {
        id: 't-1',
        status: 'donation_submitted',
        label: 'Donation Intimated by Host / Venue Manager',
        timestamp: '2026-10-26T18:30:00Z',
        locationName: 'Sea Breeze Banquet Office',
        actorName: 'Pooja Shah',
        actorRole: 'Donor',
        completed: true,
      },
      {
        id: 't-2',
        status: 'donation_reviewed',
        label: 'Quality Review & Hygiene Check Intimation',
        timestamp: '2026-10-26T18:45:00Z',
        locationName: 'FoodRescue Central Operations',
        actorName: 'Kunal Deshmukh',
        actorRole: 'Coordinator',
        completed: true,
      },
      {
        id: 't-3',
        status: 'pickup_requested',
        label: 'Dispatch Ticket Generated',
        timestamp: '2026-10-26T19:00:00Z',
        locationName: 'Operations Control Console',
        actorName: 'Automated Relief Dispatcher',
        actorRole: 'System',
        completed: true,
      },
      {
        id: 't-4',
        status: 'pickup_scheduled',
        label: 'Pickup Window Slot Confirmed (22:15 - 23:00)',
        timestamp: '2026-10-26T19:15:00Z',
        locationName: 'Carter Road Logistics Hub',
        actorName: 'Aditya Mehta',
        actorRole: 'Coordinator',
        completed: true,
      },
      {
        id: 't-5',
        status: 'driver_assigned',
        label: 'Van & Certified Lead Driver Assigned',
        timestamp: '2026-10-26T21:45:00Z',
        locationName: 'Western Suburbs Dispatch Base',
        actorName: 'Vikram Malhotra (MH 02 BZ 4491)',
        actorRole: 'Lead Driver',
        completed: true,
      },
      {
        id: 't-6',
        status: 'en_route_pickup',
        label: 'Rescue Van En Route to Carter Road Banquet',
        timestamp: '2026-10-26T22:10:00Z',
        locationName: 'Linking Road, Bandra',
        actorName: 'Vikram Malhotra',
        actorRole: 'Lead Driver',
        completed: true,
      },
      {
        id: 't-7',
        status: 'food_collected',
        label: 'Laser Probe Test Passed (67.8°C) & Loaded',
        timestamp: '2026-10-26T22:38:00Z',
        locationName: 'Sea Breeze Banquet Kitchen Bay',
        actorName: 'Vikram Malhotra',
        actorRole: 'Lead Driver',
        completed: true,
      },
      {
        id: 't-8',
        status: 'delivered_to_shelter',
        label: 'Arrival at Recipient Shelter Dock',
        timestamp: 'Est. 23:05',
        locationName: 'Bandra Station Homeless Shelter',
        actorName: 'Ramesh Kadam (Night Warden)',
        actorRole: 'Shelter Warden',
        completed: false,
      },
      {
        id: 't-9',
        status: 'delivery_confirmed',
        label: 'Beneficiary Distribution & Digital Proof',
        timestamp: 'Pending Handover',
        locationName: 'Shelter Dining Hall',
        actorName: 'Recipient Authorization Team',
        actorRole: 'Shelter Warden',
        completed: false,
      },
    ],
    createdAt: '2026-10-26T18:30:00.000Z',
    updatedAt: '2026-10-26T22:45:00.000Z',
  },
  {
    id: 'FR-TRK-7712',
    donationId: 'FR-EVENT-NA5V2',
    title: 'Sharma Royal Feast (120 Meals)',
    donorName: 'The Royal Palms Grand Ballroom',
    donorCategory: 'Wedding Hall',
    donorContactPhone: '+91 98201 23456',
    pickupAddress: 'The Royal Palms Grand Ballroom, Hall #2, Goregaon East, Mumbai 400065',
    pickupNeighborhood: 'Goregaon East',
    pickupZone: 'Western Suburbs',
    pickupLat: 19.1601,
    pickupLng: 72.8872,
    destinationShelterId: 'shelter-sneha-sadan',
    destinationShelterName: 'Sneha Sadan Orphanage & Youth Home',
    destinationAddress: 'Holy Family Compound, Chakala, Andheri East, Mumbai 400093',
    destinationNeighborhood: 'Andheri East',
    destinationLat: 19.118,
    destinationLng: 72.865,
    servings: 120,
    estimatedKg: 54,
    foodCategory: 'Wedding Feasts',
    dietaryType: 'Pure Vegetarian',
    foodDescription: 'Shahi Paneer, Dal Makhani, Jeera Rice, Tandoori Rotis, Gulab Jamun',
    packagingStatus: 'Needs Rescue Team Containers',
    status: 'driver_assigned',
    scheduledPickupWindow: '22:30 - 23:45',
    scheduledDate: 'Tonight',
    assignedDriverId: 'drv-vikram',
    assignedDriverName: 'Vikram Malhotra',
    assignedDriverPhone: '+91 98201 55432',
    assignedVehicleId: 'veh-van-02',
    assignedVehiclePlate: 'MH 02 BZ 4491',
    assignedVehicleType: 'Medium Insulated Van',
    timeline: [
      {
        id: 'sh-1',
        status: 'donation_submitted',
        label: 'Donation Registered by Host (Verified via Email OTP)',
        timestamp: '2026-10-26T18:17:36Z',
        locationName: 'Royal Palms Ballroom 2',
        actorName: 'Sunil Sharma',
        actorRole: 'Donor',
        completed: true,
      },
      {
        id: 'sh-2',
        status: 'donation_reviewed',
        label: 'Approved by Relief Ops Coordinator',
        timestamp: '2026-10-26T18:25:00Z',
        locationName: 'Central Control Hub',
        actorName: 'Aditya Mehta',
        actorRole: 'Coordinator',
        completed: true,
      },
      {
        id: 'sh-3',
        status: 'pickup_scheduled',
        label: 'Scheduled for 22:30 - 23:45 Window',
        timestamp: '2026-10-26T18:30:00Z',
        locationName: 'Aarey Milk Colony Gate 3',
        actorName: 'Fleet Coordinator',
        actorRole: 'Coordinator',
        completed: true,
      },
      {
        id: 'sh-4',
        status: 'driver_assigned',
        label: 'Driver Vikram Assigned on Thermal Route',
        timestamp: '2026-10-26T21:30:00Z',
        locationName: 'Goregaon Transit Corridor',
        actorName: 'Vikram Malhotra',
        actorRole: 'Lead Driver',
        completed: true,
      },
    ],
    createdAt: '2026-10-26T18:17:36.000Z',
    updatedAt: '2026-10-26T21:30:00.000Z',
  },
  {
    id: 'FR-TRK-6640',
    donationId: 'FR-BATCH-04',
    title: 'Oberoi Powai Corporate Summit (150 Meals)',
    donorName: 'Grand Lakeside Pavilion (The Westin)',
    donorCategory: 'Hotel & Resort',
    donorContactPhone: '+91 22 6692 7777',
    pickupAddress: 'Chinmayanand Ashram, Powai, Mumbai 400087',
    pickupNeighborhood: 'Powai',
    pickupZone: 'Eastern Suburbs',
    pickupLat: 19.1278,
    pickupLng: 72.9067,
    destinationShelterId: 'shelter-cheshire-home',
    destinationShelterName: 'The Cheshire Home (Disability Care & Elders)',
    destinationAddress: 'Mahakali Caves Road, Andheri East, Mumbai 400093',
    destinationNeighborhood: 'Andheri East',
    destinationLat: 19.122,
    destinationLng: 72.871,
    servings: 150,
    estimatedKg: 68,
    foodCategory: 'Corporate Galas',
    dietaryType: 'Mixed Selection (Separated)',
    foodDescription: 'Continental Pasta, Herb Roasted Potatoes, Paneer Biryani, Veg Pulao',
    packagingStatus: 'Thermal Pots & Steel Containers',
    status: 'food_collected',
    scheduledPickupWindow: '21:00 - 22:00',
    scheduledDate: 'Tonight',
    assignedDriverId: 'drv-sunita',
    assignedDriverName: 'Sunita Patil',
    assignedDriverPhone: '+91 98204 11990',
    assignedVehicleId: 'veh-van-04',
    assignedVehiclePlate: 'MH 04 EF 6120',
    assignedVehicleType: 'Medium Insulated Van',
    timeline: [
      {
        id: 'pw-1',
        status: 'donation_submitted',
        label: 'Executive Chef Registered Gala Surplus',
        timestamp: '2026-10-26T17:00:00Z',
        locationName: 'Westin Powai Banquet Office',
        actorName: 'Chef Rahul',
        actorRole: 'Donor',
        completed: true,
      },
      {
        id: 'pw-2',
        status: 'pickup_scheduled',
        label: 'Pickup Confirmed with Dock Staff',
        timestamp: '2026-10-26T17:45:00Z',
        locationName: 'Service Bay 4',
        actorName: 'Aditya Mehta',
        actorRole: 'Coordinator',
        completed: true,
      },
      {
        id: 'pw-3',
        status: 'driver_assigned',
        label: 'Driver Sunita Assigned with Insulated Van',
        timestamp: '2026-10-26T20:15:00Z',
        locationName: 'Eastern Fleet Depot',
        actorName: 'Sunita Patil',
        actorRole: 'Lead Driver',
        completed: true,
      },
      {
        id: 'pw-4',
        status: 'food_collected',
        label: 'Loaded at Westin Powai Dock (Laser: 69.2°C)',
        timestamp: '2026-10-26T21:40:00Z',
        locationName: 'Westin Service Dock',
        actorName: 'Sunita Patil',
        actorRole: 'Lead Driver',
        completed: true,
      },
    ],
    createdAt: '2026-10-26T17:00:00.000Z',
    updatedAt: '2026-10-26T21:40:00.000Z',
  },
  {
    id: 'FR-TRK-5520',
    donationId: 'FR-HIST-01',
    title: 'Blue Sea Worli Banquet Surplus (110 Meals)',
    donorName: 'Blue Sea Banquets Worli Seaface',
    donorCategory: 'Banquet Hall',
    donorContactPhone: '+91 22 2490 2222',
    pickupAddress: '11/12, Worli Seaface, Next to Rajiv Gandhi Bridge, Mumbai 400018',
    pickupNeighborhood: 'Worli',
    pickupZone: 'South Mumbai',
    pickupLat: 19.0068,
    pickupLng: 72.8153,
    destinationShelterId: 'shelter-cheshire-home',
    destinationShelterName: 'The Cheshire Home (Disability Care & Elders)',
    destinationAddress: 'Mahakali Caves Road, Andheri East, Mumbai 400093',
    destinationNeighborhood: 'Andheri East',
    destinationLat: 19.122,
    destinationLng: 72.871,
    servings: 110,
    estimatedKg: 50,
    foodCategory: 'Wedding Feasts',
    dietaryType: 'Pure Vegetarian',
    foodDescription: 'Paneer Butter Masala, Dal Bukhara, Zafrani Pulao, Baby Naan, Malpua',
    packagingStatus: 'Thermal Pots',
    status: 'delivery_confirmed',
    scheduledPickupWindow: '22:00 - 23:15',
    scheduledDate: '2026-10-24',
    assignedDriverId: 'drv-rajesh',
    assignedDriverName: 'Rajesh Shinde',
    assignedDriverPhone: '+91 98202 88123',
    assignedVehicleId: 'veh-van-01',
    assignedVehiclePlate: 'MH 01 CR 2011',
    assignedVehicleType: 'Small Volunteer Vehicle',
    deliveryProof: {
      confirmedAt: '2026-10-24T23:20:00.000Z',
      recipientName: 'Sister Maria',
      recipientPhone: '+91 22 2832 4531',
      recipientDesignation: 'Resident Care Superintendent',
      deliveredServings: 110,
      temperatureReading: '68.2°C',
      notes: 'Delivered hot to 65 elder residents and night care assistants. Zero food wastage.',
    },
    timeline: [
      {
        id: 'ps-1',
        status: 'donation_submitted',
        label: 'Blue Sea Sangeet Food Registered',
        timestamp: '2026-10-24T18:00:00Z',
        locationName: 'Worli Sea Face Dock',
        actorName: 'Caterer Anand',
        actorRole: 'Donor',
        completed: true,
      },
      {
        id: 'ps-2',
        status: 'delivery_confirmed',
        label: 'Delivered & Confirmed at Cheshire Home',
        timestamp: '2026-10-24T23:20:00Z',
        locationName: 'Andheri East Cheshire Home',
        actorName: 'Sister Maria',
        actorRole: 'Shelter Warden',
        completed: true,
      },
    ],
    createdAt: '2026-10-24T18:00:00.000Z',
    updatedAt: '2026-10-24T23:20:00.000Z',
  },
  {
    id: 'FR-TRK-4419',
    donationId: 'FR-HIST-02',
    title: 'Cooperage Heritage Reception Surplus (180 Meals)',
    donorName: 'Cooperage Grounds & Heritage Banquet Lawns',
    donorCategory: 'Lawn & Open Air',
    donorContactPhone: '+91 22 2284 3912',
    pickupAddress: 'Maharshi Karve Road, Colaba, Mumbai 400021',
    pickupNeighborhood: 'Colaba',
    pickupZone: 'South Mumbai',
    pickupLat: 18.9272,
    pickupLng: 72.8286,
    destinationShelterId: 'shelter-asha-sadan',
    destinationShelterName: 'Asha Sadan Home for Women & Children',
    destinationAddress: 'Asha Sadan Marg, Umerkhadi, Near Mumbai Central',
    destinationNeighborhood: 'Umerkhadi / Byculla',
    destinationLat: 18.961,
    destinationLng: 72.836,
    servings: 180,
    estimatedKg: 81,
    foodCategory: 'Wedding Feasts',
    dietaryType: 'Pure Vegetarian',
    foodDescription: 'Gujarati Wedding Thali Dishes: Undhiyu, Kadhi, Jeera Rice, Puri, Shrikhand',
    packagingStatus: 'Thermal Pots',
    status: 'delivery_confirmed',
    scheduledPickupWindow: '23:00 - 00:15',
    scheduledDate: '2026-10-23',
    assignedDriverId: 'drv-rajesh',
    assignedDriverName: 'Rajesh Shinde',
    assignedDriverPhone: '+91 98202 88123',
    assignedVehicleId: 'veh-van-01',
    assignedVehiclePlate: 'MH 01 CR 2011',
    assignedVehicleType: 'Small Volunteer Vehicle',
    deliveryProof: {
      confirmedAt: '2026-10-24T00:12:00.000Z',
      recipientName: 'Smt. Vandana Shah',
      recipientPhone: '+91 22 2372 6544',
      recipientDesignation: 'Trustee',
      deliveredServings: 180,
      temperatureReading: '66.5°C',
      notes: 'Delivered hot to 120 resident girls and infants, plus night kitchen.',
    },
    timeline: [
      {
        id: 'c-1',
        status: 'donation_submitted',
        label: 'Colaba Wedding Reception Handover',
        timestamp: '2026-10-23T20:00:00Z',
        locationName: 'Cooperage Lawns',
        actorName: 'Caterer Royal Feast',
        actorRole: 'Donor',
        completed: true,
      },
      {
        id: 'c-2',
        status: 'delivery_confirmed',
        label: 'Handover Confirmed at Asha Sadan Home',
        timestamp: '2026-10-24T00:12:00Z',
        locationName: 'Asha Sadan Kitchen',
        actorName: 'Smt. Vandana Shah',
        actorRole: 'Shelter Warden',
        completed: true,
      },
    ],
    createdAt: '2026-10-23T20:00:00.000Z',
    updatedAt: '2026-10-24T00:12:00.000Z',
  },
];

export const initialNotifications: InAppNotification[] = [
  {
    id: 'notif-1',
    type: 'dispatch',
    title: 'Van Dispatched for Bandra Sangeet',
    message: 'Van MH 02 BZ 4491 is en route to Sea Breeze Banquet Hall (Carter Road). Lead driver: Vikram Malhotra.',
    referenceId: 'FR-TRK-8821',
    actionUrl: '/pickups/FR-TRK-8821',
    read: false,
    createdAt: '2026-10-26T22:45:00.000Z',
  },
  {
    id: 'notif-2',
    type: 'pickup',
    title: 'Pickup Confirmed: Sharma Royal Feast',
    message: 'Pickup scheduled tonight at Royal Palms Ballroom #2 for 120 verified meals.',
    referenceId: 'FR-TRK-7712',
    actionUrl: '/pickups/FR-TRK-7712',
    read: false,
    createdAt: '2026-10-26T21:30:00.000Z',
  },
  {
    id: 'notif-3',
    type: 'delivery',
    title: 'Delivery Confirmed: Sneha Sadan Orphanage',
    message: '85 hot meals safely delivered to resident children at Sneha Sadan (Andheri East). Temperature: 67.4°C.',
    referenceId: 'FR-TRK-6640',
    actionUrl: '/pickups/FR-TRK-6640',
    read: true,
    createdAt: '2026-10-25T23:48:10.000Z',
  },
  {
    id: 'notif-4',
    type: 'donation',
    title: 'New Donation Registered: 120 Servings',
    message: 'Sharma Royal Feast registered surplus food in Western Suburbs corridor.',
    referenceId: 'FR-EVENT-NA5V2',
    actionUrl: '/pickups',
    read: true,
    createdAt: '2026-10-26T18:17:36.000Z',
  },
];

// -------------------------------------------------------------
// HAVERSINE DISTANCE & SHELTER MATCHING (CLIENT-SAFE)
// -------------------------------------------------------------
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

export function getNearbyShelterMatches(
  pickupLat: number,
  pickupLng: number,
  servings: number = 80,
  dietaryType: string = 'Pure Vegetarian'
): ShelterMatchResult[] {
  const results: ShelterMatchResult[] = [];

  sheltersData.forEach((shelter) => {
    const distanceKm = calculateHaversineDistance(pickupLat, pickupLng, shelter.lat, shelter.lng);
    const estimatedTravelMins = Math.max(15, Math.round((distanceKm / 20) * 60 + 8));

    const isPureVegDonation = dietaryType.toLowerCase().includes('pure') || dietaryType.toLowerCase().includes('veg');
    const acceptsDietary = isPureVegDonation || shelter.mealPreferences.some((p) => p.toLowerCase().includes('non-veg') || p.toLowerCase().includes('any'));

    let matchScore = 100;
    if (distanceKm > 3) {
      matchScore -= Math.min(35, (distanceKm - 3) * 3);
    }
    if (shelter.urgencyLevel === 'Immediate Need') {
      matchScore += 15;
    } else if (shelter.urgencyLevel === 'High Need') {
      matchScore += 8;
    }

    const capacityRatio = servings / shelter.beneficiaryCount;
    if (capacityRatio >= 0.5 && capacityRatio <= 1.5) {
      matchScore += 10;
    }
    if (!acceptsDietary) {
      matchScore -= 20;
    }

    matchScore = Math.max(30, Math.min(99, Math.round(matchScore)));

    let matchExplanation = '';
    if (distanceKm <= 3.5 && shelter.urgencyLevel === 'Immediate Need') {
      matchExplanation = `🌟 Prime Match: Under ${distanceKm} km with Immediate Need. Can absorb ${servings} meals for ${shelter.beneficiaryCount} resident beneficiaries tonight.`;
    } else if (distanceKm <= 6) {
      matchExplanation = `Close Corridor: ${distanceKm} km away (~${estimatedTravelMins} mins travel). Matches dietary and container capacity.`;
    } else {
      matchExplanation = `Extended Corridor: ${distanceKm} km away. Feasible via express van corridor.`;
    }

    results.push({
      shelterId: shelter.id,
      shelterName: shelter.name,
      category: shelter.category,
      distanceKm,
      estimatedTravelMins,
      beneficiaryCount: shelter.beneficiaryCount,
      dailyRequirementServings: shelter.dailyRequirementServings,
      urgencyLevel: shelter.urgencyLevel,
      dietaryFit: acceptsDietary,
      matchScore,
      matchExplanation,
      address: shelter.address,
      lat: shelter.lat,
      lng: shelter.lng,
      contactPerson: shelter.contactPerson,
      contactPhone: shelter.contactPhone,
      googleMapsUrl: shelter.googleMapsUrl,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${shelter.lat},${shelter.lng}`,
    });
  });

  return results.sort((a, b) => b.matchScore - a.matchScore || a.distanceKm - b.distanceKm);
}

// -------------------------------------------------------------
// IMPACT METRICS CALCULATION (CLIENT-SAFE PURE LOGIC)
// -------------------------------------------------------------
export interface ComputedImpact {
  timeframe: string;
  totalKgRescued: number;
  totalMealsDelivered: number;
  totalPickupsCompleted: number;
  totalDeliveriesCompleted: number;
  pickupSuccessRate: number;
  deliverySuccessRate: number;
  activeDonorPartners: number;
  sheltersServedCount: number;
  co2AvoidedKg: number;
  waterSavedLiters: number;
  landfillDivertedKg: number;
  economicValueInr: number;
  categoryBreakdown: { category: string; kg: number; meals: number; percentage: number }[];
  zoneBreakdown: { zone: string; kg: number; meals: number; count: number }[];
  topContributingPartners: { name: string; category: string; meals: number; kg: number; count: number; profileUrl: string }[];
  shelterDistribution: { shelterName: string; category: string; mealsReceived: number; kgReceived: number; deliveriesCount: number }[];
  dailyTrend: { date: string; displayDate: string; kg: number; meals: number; pickups: number }[];
}

export function computeImpactMetricsClient(
  filterPeriod: 'today' | '7days' | '30days' | 'month' | 'year' | 'all' = '30days',
  journeys: PickupJourney[] = initialPickups
): ComputedImpact {
  const confirmedJourneys = journeys.filter((j) => j.status === 'delivery_confirmed');

  const baseCompletedMeals = confirmedJourneys.reduce((sum, j) => sum + j.servings, 0);
  const baseCompletedKg = confirmedJourneys.reduce((sum, j) => sum + j.estimatedKg, 0);

  const historicalMeals = 28450;
  const historicalKg = 12800;

  let totalMeals = baseCompletedMeals + historicalMeals;
  let totalKg = baseCompletedKg + historicalKg;
  let multiplier = 1;

  if (filterPeriod === 'today') {
    totalMeals = Math.round(baseCompletedMeals + 320);
    totalKg = Math.round(baseCompletedKg + 144);
    multiplier = 0.04;
  } else if (filterPeriod === '7days') {
    totalMeals = Math.round(baseCompletedMeals + 2450);
    totalKg = Math.round(baseCompletedKg + 1100);
    multiplier = 0.2;
  } else if (filterPeriod === '30days' || filterPeriod === 'month') {
    totalMeals = Math.round(baseCompletedMeals + 8900);
    totalKg = Math.round(baseCompletedKg + 4005);
    multiplier = 0.65;
  }

  const pickupsCompleted = Math.max(3, Math.round(journeys.filter((j) => j.status !== 'cancelled' && j.status !== 'rejected').length * (multiplier * 4) + 42));
  const deliveriesCompleted = Math.max(3, Math.round(confirmedJourneys.length * (multiplier * 4) + 38));
  const pickupSuccessRate = 98.4;
  const deliverySuccessRate = 99.1;

  const activeDonorPartners = Math.min(venuesData.length + caterersData.length, Math.round(18 * multiplier) + 4);
  const sheltersServedCount = sheltersData.length;

  const co2AvoidedKg = Math.round(totalKg * 2.5);
  const waterSavedLiters = Math.round(totalMeals * 420);
  const landfillDivertedKg = totalKg;
  const economicValueInr = Math.round(totalMeals * 140);

  const categoryBreakdown = [
    { category: 'Wedding Banquets', kg: Math.round(totalKg * 0.52), meals: Math.round(totalMeals * 0.52), percentage: 52 },
    { category: 'Caterer Bulk Kitchens', kg: Math.round(totalKg * 0.24), meals: Math.round(totalMeals * 0.24), percentage: 24 },
    { category: 'Corporate Galas & Summits', kg: Math.round(totalKg * 0.15), meals: Math.round(totalMeals * 0.15), percentage: 15 },
    { category: 'Community & Religious Langars', kg: Math.round(totalKg * 0.09), meals: Math.round(totalMeals * 0.09), percentage: 9 },
  ];

  const zoneBreakdown = [
    { zone: 'Western Suburbs', kg: Math.round(totalKg * 0.42), meals: Math.round(totalMeals * 0.42), count: 24 },
    { zone: 'South Mumbai', kg: Math.round(totalKg * 0.26), meals: Math.round(totalMeals * 0.26), count: 14 },
    { zone: 'Eastern Suburbs', kg: Math.round(totalKg * 0.18), meals: Math.round(totalMeals * 0.18), count: 10 },
    { zone: 'Central Mumbai', kg: Math.round(totalKg * 0.10), meals: Math.round(totalMeals * 0.10), count: 6 },
    { zone: 'Thane & Navi Mumbai', kg: Math.round(totalKg * 0.04), meals: Math.round(totalMeals * 0.04), count: 3 },
  ];

  const topContributingPartners = [
    {
      name: 'The Royal Palms Grand Ballroom',
      category: 'Wedding Venue',
      meals: 4200,
      kg: 1890,
      count: 14,
      profileUrl: '/venues/venue-royal-palms',
    },
    {
      name: 'Cooperage Heritage Banquet Lawns',
      category: 'Lawn & Open Air',
      meals: 4900,
      kg: 2205,
      count: 12,
      profileUrl: '/venues/venue-cooperage-colaba',
    },
    {
      name: 'Grand Lakeside Pavilion (Westin Powai)',
      category: 'Hotel & Resort',
      meals: 3800,
      kg: 1710,
      count: 11,
      profileUrl: '/venues/venue-renaissance-powai',
    },
    {
      name: 'Blue Sea Banquets Worli',
      category: 'Banquet Hall',
      meals: 3200,
      kg: 1440,
      count: 9,
      profileUrl: '/venues/venue-blue-sea-worli',
    },
    {
      name: 'Maharaja Royal Caterers',
      category: 'Catering Kitchen',
      meals: 3600,
      kg: 1620,
      count: 15,
      profileUrl: '/caterers/caterer-maharaja-chembur',
    },
  ];

  const shelterDistribution = sheltersData.map((shelter, idx) => ({
    shelterName: shelter.name,
    category: shelter.category,
    mealsReceived: shelter.mealsReceived + (idx === 0 ? baseCompletedMeals : 0),
    kgReceived: Math.round((shelter.mealsReceived + (idx === 0 ? baseCompletedMeals : 0)) * 0.45),
    deliveriesCount: Math.round(shelter.mealsReceived / 85),
  }));

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyTrend = days.map((day, i) => {
    const factor = [0.8, 0.9, 1.1, 1.0, 1.6, 2.2, 1.9][i];
    const dayKg = Math.round((totalKg / 14) * factor);
    const dayMeals = Math.round(dayKg * 2.22);
    return {
      date: `2026-10-${20 + i}`,
      displayDate: `${day}, Oct ${20 + i}`,
      kg: dayKg,
      meals: dayMeals,
      pickups: Math.round(dayKg / 45) || 1,
    };
  });

  return {
    timeframe: filterPeriod,
    totalKgRescued: totalKg,
    totalMealsDelivered: totalMeals,
    totalPickupsCompleted: pickupsCompleted,
    totalDeliveriesCompleted: deliveriesCompleted,
    pickupSuccessRate,
    deliverySuccessRate,
    activeDonorPartners,
    sheltersServedCount,
    co2AvoidedKg,
    waterSavedLiters,
    landfillDivertedKg,
    economicValueInr,
    categoryBreakdown,
    zoneBreakdown,
    topContributingPartners,
    shelterDistribution,
    dailyTrend,
  };
}
