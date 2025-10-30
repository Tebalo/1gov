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
  console.log('🚀 QR Generation Started for teacherId:', teacherId);
  console.log('📊 Environment check:');
  console.log('   - baseURL:', baseURL);
  console.log('   - fileUploadUrl:', fileUploadUrl);
  console.log('   - options:', JSON.stringify(options));

  try {
    // Step 1: Generate the verification URL
    const verificationUrl = `${baseURL}/verify/${teacherId}`;
    console.log('🔗 Generated verification URL:', verificationUrl);

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

    console.log('⚙️ QR options configured:', JSON.stringify(baseQrOptions));

    // Step 2: Generate QR code as both data URL and buffer
    console.log('📱 Starting QR code generation...');
    const [qrDataUrl, qrBuffer] = await Promise.all([
      QRCode.toDataURL(verificationUrl, qrOptionsForDataUrl),
      QRCode.toBuffer(verificationUrl, qrOptionsForBuffer)
    ]);
    
    console.log('✅ QR code generated successfully');
    console.log('   - DataURL length:', qrDataUrl.length);
    console.log('   - Buffer length:', qrBuffer.length);

    // Step 3: Upload the QR code to repository
    console.log('📁 Preparing file for upload...');
    const filename = `teacher_license_qr_${teacherId}_${Date.now()}.png`;
    const uint8Array = new Uint8Array(qrBuffer);
    const file = new File([uint8Array], filename, { type: 'image/png' });
    
    console.log('📄 File created:');
    console.log('   - Filename:', filename);
    console.log('   - File size:', file.size, 'bytes');
    console.log('   - File type:', file.type);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image/png');
    formData.append('name', filename);
    formData.append('description', `TRLS Teacher License QR Code for ID: ${teacherId}`);

    console.log('📦 FormData prepared, attempting upload...');
    console.log('🌐 Upload URL:', fileUploadUrl);

    const uploadStartTime = Date.now();
    const response = await fetch(fileUploadUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData,
    });

    const uploadDuration = Date.now() - uploadStartTime;
    console.log('📡 Upload response received:');
    console.log('   - Status:', response.status);
    console.log('   - Status Text:', response.statusText);
    console.log('   - Duration:', uploadDuration + 'ms');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload failed:');
      console.error('   - Status:', response.status);
      console.error('   - Error text:', errorText);
      throw new Error(`Upload failed (${response.status}): ${errorText}`);
    }

    console.log('📊 Parsing upload response...');
    const uploadResponse = await response.json();
    console.log('✅ Upload response parsed:');
    console.log('   - Response keys:', Object.keys(uploadResponse));
    console.log('   - Original name:', uploadResponse['original-name']);
    console.log('   - Key:', uploadResponse.key);
    console.log('   - Full response:', JSON.stringify(uploadResponse));

    // Validate response structure
    if (!uploadResponse || !uploadResponse['original-name'] || !uploadResponse.key) {
      console.error('❌ Invalid response structure:', uploadResponse);
      throw new Error('Invalid response from upload server');
    }

    console.log('🎉 QR generation and upload completed successfully!');

    // Step 4: Return combined success result
    return {
      success: true,
      qrDataUrl,
      uploadResponse,
    };

  } catch (error) {
    console.error('❌ QR generation and upload FAILED:');
    console.error('   - Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('   - Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('   - Full error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'QR generation and upload failed'
    };
  }
}