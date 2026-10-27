import { NextResponse } from 'next/server';
import { eventDonationSchema } from '@/lib/validation';
import { createEventDonation, getAllEventDonations, updateEventDonation } from '@/lib/storage';

export async function GET() {
  try {
    const donations = getAllEventDonations();
    return NextResponse.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (err) {
    console.error('Error fetching event donations:', err);
    return NextResponse.json(
      { success: false, error: 'Could not load event donations.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = eventDonationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid event donation data';
      return NextResponse.json(
        { success: false, error: firstError, details: parsed.error.format() },
        { status: 400 }
      );
    }


    const result = await createEventDonation({
      eventName: parsed.data.eventName,
      eventType: parsed.data.eventType,
      venueAddress: parsed.data.venueAddress,
      city: parsed.data.city,
      contactPerson: parsed.data.contactPerson,
      phone: parsed.data.phone,
      email: parsed.data.email,
      estimatedServings: parsed.data.estimatedServings,
      cookedTime: parsed.data.cookedTime,
      pickupTimeWindow: parsed.data.pickupTimeWindow,
      dietaryType: parsed.data.dietaryType,
      foodDescription: parsed.data.foodDescription,
      packagingStatus: parsed.data.packagingStatus,
      vehicleNeeded: body.vehicleNeeded,
      emailVerified: true
    });

    return NextResponse.json(
      {
        success: true,
        donationId: result.donationId,
        message: result.message
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Unexpected error in event donation:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while scheduling pickup.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing donation ID' }, { status: 400 });
    }
    const updated = updateEventDonation(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Donation not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, donation: updated });
  } catch (err) {
    console.error('Error updating donation:', err);
    return NextResponse.json({ success: false, error: 'Failed to update donation' }, { status: 500 });
  }
}
