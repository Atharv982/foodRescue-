import { NextResponse } from 'next/server';
import { partnerInquirySchema } from '@/lib/validation';
import { createPartnerInquiry, getAllPartnerInquiries } from '@/lib/storage';

export async function GET() {
  try {
    const inquiries = getAllPartnerInquiries();
    return NextResponse.json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (err) {
    console.error('Error fetching partner inquiries:', err);
    return NextResponse.json(
      { success: false, error: 'Could not load partner inquiries.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = partnerInquirySchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid partner registration data';
      return NextResponse.json(
        { success: false, error: firstError, details: parsed.error.format() },
        { status: 400 }
      );
    }

    const result = await createPartnerInquiry({
      businessName: parsed.data.businessName,
      contactName: parsed.data.contactName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      businessType: parsed.data.businessType,
      city: parsed.data.city,
      estimatedSurplus: parsed.data.estimatedDailySurplus
    });

    return NextResponse.json(
      {
        success: true,
        inquiryId: result.inquiryId,
        message: 'Thank you! Your partner inquiry has been received. Our team will reach out within 24 hours.'
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Partner inquiry error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing inquiry.' },
      { status: 500 }
    );
  }
}
