'use server';

import { baseURL, fileUploadUrl } from '@/app/lib/store';
import QRCode from 'qrcode';

export interface CombinedQRResult {
  success: boolean;
  qrDataUrl?: string;
  uploadResponse?: {
    bucket: string;
    extension: string;
    'original-name': string;
    key: string;
    [k: string]: unknown;
  };
  error?: string;
}

export async function generateAndUploadTeacherLicenseQR(
  teacherId: string,
  options: {
    size?: number;
    darkColor?: string;
    lightColor?: string;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  } = {}
): Promise<CombinedQRResult> {
  try {
    // Step 1: Generate the verification URL
    const verificationUrl = `${baseURL}/verify/${teacherId}`;

    const baseQrOptions = {
      width: options.size || 256,
      margin: 2,
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#FFFFFF',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'H',
    };

    const qrOptionsForDataUrl = {
      ...baseQrOptions,
      type: 'image/png' as const,
    };

    const qrOptionsForBuffer = {
      ...baseQrOptions,
      type: 'png' as const,
    };

    // Step 2: Generate QR code as both data URL and buffer
    const [qrDataUrl, qrBuffer] = await Promise.all([
      QRCode.toDataURL(verificationUrl, qrOptionsForDataUrl),
      QRCode.toBuffer(verificationUrl, qrOptionsForBuffer)
    ]);

    // Step 3: Upload the QR code to repository
    const filename = `teacher_license_qr_${teacherId}_${Date.now()}.png`;
    const file = new File([qrBuffer], filename, { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image/png');
    formData.append('name', filename);
    formData.append('description', `TRLS Teacher License QR Code for ID: ${teacherId}`);

    const response = await fetch(fileUploadUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed (${response.status}): ${errorText}`);
    }

    const uploadResponse = await response.json();

    // Validate response structure
    if (!uploadResponse || !uploadResponse['original-name'] || !uploadResponse.key) {
      throw new Error('Invalid response from upload server');
    }

    // Step 4: Return combined success result
    return {
      success: true,
      qrDataUrl,
      uploadResponse,
    };

  } catch (error) {
    console.error('QR generation and upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'QR generation and upload failed'
    };
  }
}