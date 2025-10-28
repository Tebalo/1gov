'use server';

import QRCode from 'qrcode';

export interface QRGenerationResult {
  success: boolean;
  qrDataUrl?: string;
  qrBuffer?: Buffer;
  error?: string;
}
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return process.env.NEXT_PUBLIC_VERIFICATION_BASE_URL || 'https://verify.trls.bw';
};
export async function generateTeacherLicenseQR(
  teacherId: string,
  options: {
    size?: number;
    darkColor?: string;
    lightColor?: string;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  } = {}
): Promise<QRGenerationResult> {
  try {
    // Generate the verification URL for the license
    // const verificationUrl = `${process.env.NEXT_PUBLIC_VERIFICATION_BASE_URL || 'https://verify.trls.bw'}/license/${teacherId}`;
    const verificationUrl = `${getBaseUrl()}/verify/${teacherId}`;

    const baseQrOptions = {
      width: options.size || 256,
      margin: 2,
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#FFFFFF',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'H', // High error correction for licenses
    };

    const qrOptionsForDataUrl = {
      ...baseQrOptions,
      type: 'image/png' as const,
    };

    const qrOptionsForBuffer = {
      ...baseQrOptions,
      type: 'png' as const,
    };

    // Generate QR code as both data URL and buffer
    const [qrDataUrl, qrBuffer] = await Promise.all([
      QRCode.toDataURL(verificationUrl, qrOptionsForDataUrl),
      QRCode.toBuffer(verificationUrl, qrOptionsForBuffer)
    ]);

    return {
      success: true,
      qrDataUrl,
      qrBuffer,
    };
  } catch (error) {
    console.error('QR generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'QR generation failed'
    };
  }
}