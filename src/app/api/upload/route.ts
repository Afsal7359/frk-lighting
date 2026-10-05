import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey || privateKey.includes('your_private_key')) {
      return NextResponse.json(
        {
          success: false,
          message: 'IMAGEKIT_PRIVATE_KEY is not set in .env.local',
        },
        { status: 400 }
      );
    }

    // Convert file to base64 Data URI for ImageKit REST API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;

    // Prepare multipart payload for ImageKit Upload API
    const ikFormData = new FormData();
    ikFormData.append('file', base64File);
    ikFormData.append('fileName', file.name || `blog-${Date.now()}.jpg`);
    ikFormData.append('folder', '/blogs');
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
          message: ikData.message || ikData.error?.message || 'ImageKit upload failed',
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
  } catch (error: any) {
    console.error('ImageKit upload exception:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Server error uploading image to ImageKit',
      },
      { status: 500 }
    );
  }
}
