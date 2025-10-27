// app/api/qr/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const format = searchParams.get('format') || 'png';
    const size = parseInt(searchParams.get('size') || '256');
    const darkColor = searchParams.get('darkColor') || '#000000';
    const lightColor = searchParams.get('lightColor') || '#FFFFFF';
    const errorLevel = searchParams.get('errorLevel') || 'M';
    const download = searchParams.get('download') === 'true';

    if (!text) {
      return NextResponse.json(
        { error: 'Text parameter is required' },
        { status: 400 }
      );
    }

    const options = {
      width: size,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
    };

    const headers: Record<string, string> = {
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    if (download) {
      headers['Content-Disposition'] = `attachment; filename="qrcode.${format}"`;
    }

    if (format === 'svg') {
      const svgString = await QRCode.toString(text, {
        ...options,
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
    const buffer = await QRCode.toBuffer(text, {
      ...options,
      type: 'png',
    });

    return new NextResponse(buffer, {
      headers: {
        ...headers,
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('QR Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      text, 
      options = {},
      returnFormat = 'dataurl' 
    } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const qrOptions = {
      width: options.width || 256,
      margin: options.margin || 2,
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#FFFFFF',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    };

    let result;
    
    switch (returnFormat) {
      case 'buffer':
        result = await QRCode.toBuffer(text, { ...qrOptions, type: 'png' });
        return new NextResponse(result, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000',
          },
        });
        
      case 'svg':
        result = await QRCode.toString(text, { ...qrOptions, type: 'svg' });
        return NextResponse.json({
          success: true,
          format: 'svg',
          data: result,
        });
        
      case 'dataurl':
      default:
        result = await QRCode.toDataURL(text, { ...qrOptions, type: 'image/png' });
        return NextResponse.json({
          success: true,
          format: 'dataurl',
          data: result,
        });
    }
  } catch (error) {
    console.error('QR Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}