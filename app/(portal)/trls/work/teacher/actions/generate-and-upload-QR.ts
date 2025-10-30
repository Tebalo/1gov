"use client"
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

// Helper function to convert dataURL to Blob (browser compatible)
function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
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
  console.log('🚀 Client-side QR Generation Started for teacherId:', teacherId);
  console.log('📊 Environment check:');
  console.log('   - baseURL:', baseURL);
  console.log('   - fileUploadUrl:', fileUploadUrl);
  
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
      type: 'image/png' as const,
    };

    console.log('📱 Starting QR code generation (client-side)...');
    
    // Step 2: Generate QR code as dataURL only (browser compatible)
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, baseQrOptions);
    console.log('✅ QR code generated successfully');
    console.log('   - DataURL length:', qrDataUrl.length);

    // Step 3: Convert dataURL to Blob for upload
    console.log('🔄 Converting dataURL to Blob...');
    const qrBlob = dataURLtoBlob(qrDataUrl);
    console.log('✅ Blob created:', qrBlob.size, 'bytes');

    // Step 4: Upload the QR code to repository
    console.log('📁 Preparing file for upload...');
    const filename = `teacher_license_qr_${teacherId}_${Date.now()}.png`;
    const file = new File([qrBlob], filename, { type: 'image/png' });
    
    console.log('📄 File created:');
    console.log('   - Filename:', filename);
    console.log('   - File size:', file.size, 'bytes');

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
    console.log('   - Duration:', uploadDuration + 'ms');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload failed:', response.status, errorText);
      throw new Error(`Upload failed (${response.status}): ${errorText}`);
    }

    console.log('📊 Parsing upload response...');
    const uploadResponse = await response.json();
    console.log('✅ Upload successful:', uploadResponse);

    // Validate response structure
    if (!uploadResponse || !uploadResponse['original-name'] || !uploadResponse.key) {
      console.error('❌ Invalid response structure:', uploadResponse);
      throw new Error('Invalid response from upload server');
    }

    console.log('🎉 Client-side QR generation and upload completed successfully!');

    // Step 5: Return combined success result
    return {
      success: true,
      qrDataUrl,
      uploadResponse,
    };

  } catch (error) {
    console.error('❌ Client-side QR generation and upload FAILED:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'QR generation and upload failed'
    };
  }
}