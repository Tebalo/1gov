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
      type: 'image/png' as const,
    };

    // Step 2: Generate QR code as dataURL only (browser compatible)
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, baseQrOptions);


    // Step 3: Convert dataURL to Blob for upload
    const qrBlob = dataURLtoBlob(qrDataUrl);


    // Step 4: Upload the QR code to repository
    const filename = `teacher_license_qr_${teacherId}_${Date.now()}.png`;
    const file = new File([qrBlob], filename, { type: 'image/png' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image/png');
    formData.append('name', filename);
    formData.append('description', `TRLS Teacher License QR Code for ID: ${teacherId}`);

    const uploadStartTime = Date.now();
    const response = await fetch(fileUploadUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData,
    });

    const uploadDuration = Date.now() - uploadStartTime;


    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload failed:', response.status, errorText);
      throw new Error(`Upload failed (${response.status}): ${errorText}`);
    }
    const uploadResponse = await response.json();


    // Validate response structure
    if (!uploadResponse || !uploadResponse['original-name'] || !uploadResponse.key) {
      console.error('❌ Invalid response structure:', uploadResponse);
      throw new Error('Invalid response from upload server');
    }


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