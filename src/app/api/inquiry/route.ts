import { NextRequest, NextResponse } from 'next/server';
import { saveInquiry } from '@/lib/data';
import { checkRateLimit } from '@/lib/auth';

function sanitizeText(str?: string, maxLen = 500): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '') // Strip HTML tags to avoid XSS
    .trim()
    .slice(0, maxLen);
}

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting (max 5 inquiries per 10 minutes per IP)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown-ip';

    const rateCheck = checkRateLimit(`inquiry:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many submissions. Please wait ${rateCheck.retryAfterSec} seconds or reach out to us on WhatsApp.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 2. Anti-spam Honeypot Check (Bots fill out hidden fields)
    if (body.website || body.company_address || body.fax) {
      // Silently accept to avoid alerting bot
      return NextResponse.json({
        success: true,
        message: 'Your quote request has been received.',
      });
    }

    const name = sanitizeText(body.name, 100);
    const contact = sanitizeText(body.contact, 100);
    const location = sanitizeText(body.location, 150);
    const project_type = sanitizeText(body.project_type, 100);
    const details = sanitizeText(body.details, 2000);

    if (!name || !contact || !project_type) {
      return NextResponse.json(
        { success: false, message: 'Name, contact details, and project type are required.' },
        { status: 400 }
      );
    }

    const inquiry = await saveInquiry({
      name,
      contact,
      location,
      project_type,
      details,
    });

    return NextResponse.json({
      success: true,
      message: 'Your quote request has been submitted successfully!',
      inquiry,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to submit quote request';
    return NextResponse.json(
      { success: false, message: errMessage },
      { status: 500 }
    );
  }
}
