import { NextRequest, NextResponse } from 'next/server';
import { getAllPickupJourneys, createPickupJourney } from '@/lib/logistics-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const zone = searchParams.get('zone');
    const search = searchParams.get('q')?.toLowerCase();

    let list = getAllPickupJourneys();

    if (status && status !== 'all') {
      list = list.filter((j) => j.status === status);
    }

    if (zone && zone !== 'All Zones') {
      list = list.filter((j) => j.pickupZone === zone);
    }

    if (search) {
      list = list.filter(
        (j) =>
          j.id.toLowerCase().includes(search) ||
          j.title.toLowerCase().includes(search) ||
          j.donorName.toLowerCase().includes(search) ||
          (j.destinationShelterName && j.destinationShelterName.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ success: true, count: list.length, pickups: list });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch pickup journeys' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.donorName || !body.pickupAddress) {
      return NextResponse.json(
        { success: false, error: 'Event title, donor name, and pickup address are required.' },
        { status: 400 }
      );
    }

    const journey = createPickupJourney({
      donationId: body.donationId || `DON-${Date.now()}`,
      title: body.title,
      donorName: body.donorName,
      donorCategory: body.donorCategory || 'Wedding Hall',
      donorContactPhone: body.donorContactPhone || '+91 98200 00000',
      pickupAddress: body.pickupAddress,
      pickupNeighborhood: body.pickupNeighborhood || 'Mumbai',
      pickupZone: body.pickupZone || 'Western Suburbs',
      pickupLat: body.pickupLat,
      pickupLng: body.pickupLng,
      servings: Number(body.servings) || 80,
      foodCategory: body.foodCategory || 'Wedding Feasts',
      dietaryType: body.dietaryType || 'Pure Vegetarian',
      foodDescription: body.foodDescription || 'Assorted banquet buffet surplus',
      packagingStatus: body.packagingStatus || 'Stainless Thermal Pots',
      scheduledPickupWindow: body.scheduledPickupWindow || '22:30 - 23:45',
      scheduledDate: body.scheduledDate || 'Tonight',
      destinationShelterId: body.destinationShelterId,
    });

    return NextResponse.json({ success: true, journeyId: journey.id, journey }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create pickup journey' },
      { status: 500 }
    );
  }
}
