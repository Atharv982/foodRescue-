import { NextResponse } from 'next/server';
import { reservationSchema } from '@/lib/validation';
import { createReservation, getAllReservations } from '@/lib/storage';

export async function GET() {
  try {
    const reservations = getAllReservations();
    return NextResponse.json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (err) {
    console.error('Error fetching reservations:', err);
    return NextResponse.json(
      { success: false, error: 'Could not load relief claims.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid reservation data';
      return NextResponse.json(
        { success: false, error: firstError, details: parsed.error.format() },
        { status: 400 }
      );
    }

    const result = await createReservation({
      foodBoxId: parsed.data.foodBoxId,
      customerName: parsed.data.customerName,
      representativeName: parsed.data.representativeName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      quantity: parsed.data.quantity,
      destinationType: parsed.data.destinationType
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to complete reservation.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        reservationId: result.reservationId,
        foodBoxId: parsed.data.foodBoxId,
        source: result.source,
        message: 'Food relief batch reserved successfully! Distribution details have been confirmed.'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected reservation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing relief claim.' },
      { status: 500 }
    );
  }
}
