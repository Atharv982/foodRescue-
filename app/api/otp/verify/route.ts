import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyEmailOtp } from '@/lib/email-otp';

const requestSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address'),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Verification code must be exactly 6 digits'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid verification request',
        },
        { status: 400 }
      );
    }

    const result = await verifyEmailOtp(parsed.data.email, parsed.data.code);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email address verified successfully!',
      verificationToken: result.verificationToken,
    });
  } catch (err) {
    console.error('Error in /api/otp/verify:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal error occurred while verifying code.',
      },
      { status: 500 }
    );
  }
}
