import { NextRequest, NextResponse } from 'next/server';
import {
  getPickupJourneyById,
  updatePickupStatus,
  assignDriverAndVehicle,
  confirmDelivery,
} from '@/lib/logistics-data';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const journey = getPickupJourneyById(params.id);
    if (!journey) {
      return NextResponse.json({ success: false, error: 'Pickup journey not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, journey });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch journey' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === 'assign_driver') {
      if (!body.driverId) {
        return NextResponse.json({ success: false, error: 'driverId is required' }, { status: 400 });
      }
      const updated = assignDriverAndVehicle(params.id, body.driverId, body.vehicleId);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Driver or journey not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, journey: updated });
    }

    if (action === 'confirm_delivery') {
      if (!body.proof || !body.proof.recipientName || !body.proof.deliveredServings) {
        return NextResponse.json(
          { success: false, error: 'Recipient name and delivered servings are required for delivery confirmation.' },
          { status: 400 }
        );
      }
      const res = confirmDelivery(params.id, body.proof);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, journey: res.journey });
    }

    if (action === 'update_status') {
      if (!body.status) {
        return NextResponse.json({ success: false, error: 'status is required' }, { status: 400 });
      }
      const actor = body.actor || { name: 'FoodRescue Dispatch Coordinator', role: 'Coordinator' };
      const updated = updatePickupStatus(params.id, body.status, actor, body.notes, body.locationName);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Journey not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, journey: updated });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Supported: assign_driver, confirm_delivery, update_status' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update pickup journey' },
      { status: 500 }
    );
  }
}
