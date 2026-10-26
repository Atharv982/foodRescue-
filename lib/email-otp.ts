import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export interface StoredOtpRecord {
  email: string;
  hashedOtp: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  resendAvailableAt: number;
  verified: boolean;
  verificationToken?: string;
  tokenExpiresAt?: number;
  consumed?: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __foodrescue_otp_records: Record<string, StoredOtpRecord> | undefined;
}

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;
const TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes for form submission

function getStoragePath(): string {
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isVercel) {
    return path.join('/tmp', 'otp-records.json');
  }
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      return path.join('/tmp', 'otp-records.json');
    }
  }
  return path.join(dataDir, 'otp-records.json');
}

function loadRecords(): Record<string, StoredOtpRecord> {
  if (global.__foodrescue_otp_records) {
    return global.__foodrescue_otp_records;
  }
  try {
    const filePath = getStoragePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      global.__foodrescue_otp_records = JSON.parse(data);
      return global.__foodrescue_otp_records!;
    }
  } catch (err) {
    console.warn('Could not read otp-records.json:', err);
  }
  global.__foodrescue_otp_records = {};
  return global.__foodrescue_otp_records;
}

function saveRecords(records: Record<string, StoredOtpRecord>): void {
  global.__foodrescue_otp_records = records;
  try {
    const filePath = getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write otp-records.json:', err);
  }
}

function hashOtp(email: string, otp: string): string {
  const secretSalt = process.env.OTP_SALT || 'foodrescue-secret-salt-mumbai-2026';
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase().trim()}:${otp.trim()}:${secretSalt}`)
    .digest('hex');
}

function createTransporter() {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  // Fallback to standard SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return null;
}

/**
 * Send a 6-digit OTP to the specified email address
 */
export async function sendEmailOtp(
  rawEmail: string
): Promise<{ success: boolean; message?: string; cooldownSeconds?: number; error?: string; simulated?: boolean }> {
  const email = rawEmail.toLowerCase().trim();
  const now = Date.now();
  const records = loadRecords();
  const existing = records[email];

  // Check resend cooldown
  if (existing && now < existing.resendAvailableAt) {
    const remainingSeconds = Math.ceil((existing.resendAvailableAt - now) / 1000);
    return {
      success: false,
      error: `Please wait ${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'} before requesting another verification code.`,
      cooldownSeconds: remainingSeconds,
    };
  }

  // Generate cryptographically secure 6-digit random code
  const otpNumber = crypto.randomInt(100000, 1000000);
  const otpCode = otpNumber.toString();
  const hashedOtp = hashOtp(email, otpCode);

  // Store record
  records[email] = {
    email,
    hashedOtp,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    resendAvailableAt: now + RESEND_COOLDOWN_MS,
    verified: false,
    consumed: false,
  };
  saveRecords(records);

  const transporter = createTransporter();

  // If real Gmail / SMTP credentials are configured, deliver via email
  if (transporter) {
    try {
      const fromSender = process.env.GMAIL_USER || 'FoodRescue Mumbai <no-reply@foodrescue.org>';

      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f4ec; margin: 0; padding: 24px; color: #1c241f; }
    .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid rgba(28, 36, 31, 0.08); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background-color: #2F5D46; padding: 28px 32px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 12px; opacity: 0.85; font-weight: 500; }
    .body { padding: 32px; font-size: 14px; line-height: 1.6; }
    .otp-box { background: #f7f4ec; border: 2px dashed #2F5D46; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #2F5D46; font-family: monospace; }
    .expiry { font-size: 12px; color: #e76f51; font-weight: 700; margin-top: 8px; }
    .footer { padding: 20px 32px; background: #faf8f3; border-top: 1px solid rgba(28, 36, 31, 0.05); font-size: 11px; color: rgba(28, 36, 31, 0.5); text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>FoodRescue</h1>
      <p>Wedding & Celebration Surplus Relief · Mumbai</p>
    </div>
    <div class="body">
      <p>Hello,</p>
      <p>You requested to verify your email address (<strong>${email}</strong>) for your food donation registration on FoodRescue.</p>
      
      <div class="otp-box">
        <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: rgba(28, 36, 31, 0.6); margin-bottom: 6px;">Your One-Time Verification Code</div>
        <div class="otp-code">${otpCode}</div>
        <div class="expiry">⏱️ This code expires in 10 minutes</div>
      </div>

      <p style="font-size: 12px; color: rgba(28, 36, 31, 0.6);">
        If you did not request this code, you can safely ignore this email. No changes will be made to your registration without this code.
      </p>
      <p>
        Thank you for helping us rescue surplus food and support our community.<br>
        <strong>The FoodRescue Team</strong>
      </p>
    </div>
    <div class="footer">
      FoodRescue Mumbai · 100% Free Food Recovery Network for Weddings, Banquets & Caterers
    </div>
  </div>
</body>
</html>
      `;

      const emailText = `Hello,

You requested to verify your email address for FoodRescue.

Your verification code is: ${otpCode}

This code expires in 10 minutes. If you did not request this code, you can ignore this email.

Thank you for helping us rescue surplus food and support our community.

The FoodRescue Team`;

      await transporter.sendMail({
        from: fromSender,
        to: email,
        subject: 'Your FoodRescue Verification Code',
        text: emailText,
        html: emailHtml,
      });

      return {
        success: true,
        message: `A 6-digit verification code has been sent to ${email}.`,
        cooldownSeconds: 60,
      };
    } catch (mailErr: any) {
      console.error('Failed to send email through Gmail SMTP:', mailErr);
      return {
        success: false,
        error: 'Unable to deliver verification email. Please verify your Gmail configuration or try again in a moment.',
      };
    }
  }

  // Development mode fallback when GMAIL_USER / GMAIL_APP_PASSWORD are not set in environment
  console.log(`\n============================================================`);
  console.log(`[FoodRescue Email Delivery - Dev Simulation]`);
  console.log(`Destination: ${email}`);
  console.log(`Subject: Your FoodRescue Verification Code`);
  console.log(`Code: [${otpCode}] (Valid for 10 minutes)`);
  console.log(`Note: To send real Gmail emails, set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local`);
  console.log(`============================================================\n`);

  return {
    success: true,
    message: `Verification code generated and sent to ${email}. Check your inbox or spam folder.`,
    cooldownSeconds: 60,
    simulated: true,
  };
}

/**
 * Verify a user's submitted 6-digit OTP
 */
export async function verifyEmailOtp(
  rawEmail: string,
  enteredOtp: string
): Promise<{ success: boolean; verificationToken?: string; error?: string }> {
  const email = rawEmail.toLowerCase().trim();
  const trimmedCode = enteredOtp.trim();
  const records = loadRecords();
  const record = records[email];

  if (!record) {
    return {
      success: false,
      error: 'No active verification code found for this email. Please request a new code.',
    };
  }

  const now = Date.now();

  // Check expiration
  if (now > record.expiresAt) {
    delete records[email];
    saveRecords(records);
    return {
      success: false,
      error: 'This verification code has expired (10-minute limit). Please request a fresh code.',
    };
  }

  // Check attempt limit
  if (record.attempts >= MAX_ATTEMPTS) {
    delete records[email];
    saveRecords(records);
    return {
      success: false,
      error: 'Maximum verification attempts exceeded. For your security, this code has been invalidated. Please request a new code.',
    };
  }

  // Increment attempt counter
  record.attempts += 1;

  // Compare hashes
  const computedHash = hashOtp(email, trimmedCode);
  if (computedHash !== record.hashedOtp) {
    saveRecords(records);
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      success: false,
      error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // OTP is correct! Issue a secure single-use verification token
  const token = crypto.randomBytes(32).toString('hex');
  record.verified = true;
  record.verificationToken = token;
  record.tokenExpiresAt = now + TOKEN_EXPIRY_MS;
  record.consumed = false;
  saveRecords(records);

  return {
    success: true,
    verificationToken: token,
  };
}

/**
 * Validate that an email has been verified and consume the token for final donation registration
 */
export function validateAndConsumeEmailToken(rawEmail: string, token: string): boolean {
  if (!rawEmail || !token) return false;
  const email = rawEmail.toLowerCase().trim();
  const records = loadRecords();
  const record = records[email];

  if (!record) return false;
  if (!record.verified) return false;
  if (record.consumed) return false;
  if (record.verificationToken !== token) return false;

  const now = Date.now();
  if (!record.tokenExpiresAt || now > record.tokenExpiresAt) return false;

  // Mark token as consumed so it cannot be reused
  record.consumed = true;
  saveRecords(records);
  return true;
}
