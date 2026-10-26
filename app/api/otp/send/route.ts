import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmailOtp } from '@/lib/email-otp';

const requestSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid email address',
        },
        { status: 400 }
      );
    }

    const result = await sendEmailOtp(parsed.data.email);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          cooldownSeconds: result.cooldownSeconds,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      cooldownSeconds: result.cooldownSeconds ?? 60,
      simulated: result.simulated,
    });
  } catch (err) {
    console.error('Error in /api/otp/send:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal error occurred while generating verification code.',
      },
      { status: 500 }
    );
  }
}
