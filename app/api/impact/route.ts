import { NextRequest, NextResponse } from 'next/server';
import { computeImpactMetrics } from '@/lib/logistics-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get('period') as any) || '30days';

    const metrics = computeImpactMetrics(period);
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to compute impact metrics' },
      { status: 500 }
    );
  }
}
