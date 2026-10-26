import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markNotificationRead } from '@/lib/logistics-data';

export async function GET() {
  try {
    const list = getNotifications();
    const unreadCount = list.filter((n) => !n.read).length;
    return NextResponse.json({ success: true, count: list.length, unreadCount, notifications: list });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Notification id is required' }, { status: 400 });
    }
    markNotificationRead(body.id);
    return NextResponse.json({ success: true, message: 'Notification marked as read' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update notification' },
      { status: 500 }
    );
  }
}
