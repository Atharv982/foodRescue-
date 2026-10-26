import { z } from 'zod';

export const reservationSchema = z.object({
  foodBoxId: z.string().min(1, 'Food batch selection is required'),
  customerName: z.string().trim().min(2, 'Please enter organization, shelter or recipient name').max(100),
  representativeName: z.string().trim().min(2, 'Please enter coordinator or contact name').optional(),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  quantity: z.coerce.number().int('Portions must be a whole number').min(1, 'At least 1 batch portion is required').max(20, 'Maximum 20 batch units at a time'),
  destinationType: z.enum([
    'Children Shelter / Orphanage',
    'Night Shelter for Homeless',
    'Community Slum Kitchen',
    'Old Age Home',
    'Needy Family Relief',
    'Individual Volunteer Distribution'
  ], {
    errorMap: () => ({ message: 'Please select where this food will be served' })
  }).optional(),
  pickupSlot: z.string().optional(),
  notes: z.string().max(250, 'Notes cannot exceed 250 characters').optional()
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;

export const eventDonationSchema = z.object({
  eventName: z.string().trim().min(2, 'Please enter the event or host name (e.g., Sharma Wedding Reception)').max(120),
  eventType: z.enum(['Wedding', 'Party / Banquet', 'Corporate Event', 'Caterer', 'Bakery & Café', 'Religious Gathering'], {
    errorMap: () => ({ message: 'Please select the event type' })
  }),
  venueAddress: z.string().trim().min(5, 'Please provide the complete banquet hall or venue address').max(200),
  city: z.string().trim().min(2, 'City/Locality is required (e.g., Bandra West, Mumbai)').max(60),
  contactPerson: z.string().trim().min(2, 'Contact person name is required').max(80),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number for immediate dispatch'),
  email: z.string().trim().email('Please enter a valid email address'),
  estimatedServings: z.coerce.number().int('Servings must be a whole number').min(10, 'Minimum 10 servings for volunteer vehicle dispatch').max(3000, 'Maximum 3,000 servings per single vehicle'),
  cookedTime: z.string().min(1, 'Approximate cooking time is required for food safety verification'),
  pickupTimeWindow: z.string().min(1, 'Please specify when the event finishes or food is ready for pickup'),
  dietaryType: z.enum(['Pure Vegetarian', 'Non-Vegetarian', 'Mixed Buffet'], {
    errorMap: () => ({ message: 'Please select food dietary classification' })
  }),
  foodDescription: z.string().trim().min(5, 'List main dishes (e.g., Paneer gravy, dal, rice, breads, desserts)').max(350),
  packagingStatus: z.enum(['Already Packed in Containers', 'Needs Rescue Team Containers', 'Mixed'], {
    errorMap: () => ({ message: 'Select current food storage packaging' })
  })
});

export type EventDonationValues = z.infer<typeof eventDonationSchema>;

export const partnerInquirySchema = z.object({
  businessName: z.string().trim().min(2, 'Please enter venue or catering name').max(100),
  contactName: z.string().trim().min(2, 'Contact person name is required').max(80),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit contact number'),
  businessType: z.string().min(1, 'Please select venue type'),
  city: z.string().trim().min(2, 'City is required').max(60),
  estimatedDailySurplus: z.string().min(1, 'Select estimated surplus volume'),
  message: z.string().max(300).optional()
});

export type PartnerInquiryValues = z.infer<typeof partnerInquirySchema>;
