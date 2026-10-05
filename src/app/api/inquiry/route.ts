import { NextResponse } from 'next/server';
import { saveInquiry } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, location, project_type, details } = body;

    if (!name || !contact || !project_type) {
      return NextResponse.json(
        { success: false, message: 'Name, contact, and project type are required.' },
        { status: 400 }
      );
    }

    const inquiry = await saveInquiry({
      name,
      contact,
      location: location || '',
      project_type,
      details: details || ''
    });

    return NextResponse.json({
      success: true,
      message: 'Your quote request has been submitted successfully!',
      inquiry
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}
