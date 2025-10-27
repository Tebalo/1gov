// app/api/qr/download/[id]/route.ts
import { generateQRCodeBuffer, getQRCodeById } from '@/app/lib/qr-actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'png';
    const filename = searchParams.get('filename') || 'qrcode';

    // Get QR code data from our store
    const qrData = await getQRCodeById(params.id);
    
    if (!qrData) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    const headers: Record<string, string> = {
      'Content-Disposition': `attachment; filename="${filename}.${format}"`,
      'Cache-Control': 'private, max-age=0',
    };

    if (format === 'svg') {
      const QRCode = (await import('qrcode')).default;
      const svgString = await QRCode.toString(qrData.text, {
        width: qrData.options.size,
        margin: 2,
        color: {
          dark: qrData.options.darkColor,
          light: qrData.options.lightColor,
        },
        errorCorrectionLevel: qrData.options.errorCorrectionLevel,
        type: 'svg',
      });

      return new NextResponse(svgString, {
        headers: {
          ...headers,
          'Content-Type': 'image/svg+xml',
        },
      });
    }

    // Default to PNG
    const buffer = await generateQRCodeBuffer(qrData.text, qrData.options);

    return new NextResponse(buffer, {
      headers: {
        ...headers,
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download QR code' },
      { status: 500 }
    );
  }
}