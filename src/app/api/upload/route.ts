import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

function sanitizeFilename(originalName: string): string {
  // Strip path traversal and weird characters
  const clean = originalName
    .replace(/^.*[\\/]/, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 100);
  return clean || `upload-${Date.now()}.jpg`;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Mandatory Admin Authentication Check
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetFolder = (formData.get('folder') as string) || '/uploads';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    // 2. File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: `File exceeds maximum allowed size of 10MB (Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
        },
        { status: 400 }
      );
    }

    // 3. MIME Type Validation
    const mimeType = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid file type. Allowed formats: JPG, PNG, WEBP, GIF, SVG.',
        },
        { status: 400 }
      );
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey || privateKey.includes('your_private_key')) {
      return NextResponse.json(
        {
          success: false,
          message: 'IMAGEKIT_PRIVATE_KEY is not configured in environment variables.',
        },
        { status: 400 }
      );
    }

    // 4. Sanitize Filename
    const safeFilename = sanitizeFilename(file.name);

    // Convert file to base64 Data URI for ImageKit REST API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${mimeType || 'image/jpeg'};base64,${buffer.toString('base64')}`;

    // Prepare multipart payload for ImageKit Upload API
    const ikFormData = new FormData();
    ikFormData.append('file', base64File);
    ikFormData.append('fileName', safeFilename);
    ikFormData.append('folder', targetFolder);
    ikFormData.append('useUniqueFileName', 'true');

    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: ikFormData,
    });

    const ikData = await ikRes.json();

    if (!ikRes.ok || ikData.error) {
      return NextResponse.json(
        {
          success: false,
          message: ikData.message || ikData.error?.message || 'ImageKit upload failed.',
        },
        { status: ikRes.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: ikData.url, // ImageKit CDN URL
      fileId: ikData.fileId,
      name: ikData.name,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error uploading image to ImageKit';
    console.error('ImageKit upload exception:', error);
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
