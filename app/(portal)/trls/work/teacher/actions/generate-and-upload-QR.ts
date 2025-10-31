// Updated generateAndUploadTeacherLicenseQR - Based on Working UAT Patterns

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

// Use the EXACT same helper function from working component
const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

export async function generateAndUploadTeacherLicenseQR(
  teacherId: string,
  options: {
    size?: number;
    darkColor?: string;
    lightColor?: string;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  } = {}
): Promise<CombinedQRResult> {
  console.log('🚀 Automated QR Generation Started for teacherId:', teacherId);
  console.log('📊 Environment check:');
  console.log('   - baseURL:', baseURL);
  console.log('   - fileUploadUrl:', fileUploadUrl);
  
  try {
    // Step 1: Generate the verification URL (automated - no form field needed)
    const verificationUrl = `${baseURL}/verify/${teacherId}`;
    console.log('🔗 Generated verification URL:', verificationUrl);

    // Step 2: Use EXACT same QR options as working component
    const options_fixed = {
      width: options.size || 256,
      margin: 2,
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#FFFFFF',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M', // ← Changed to 'M' like working component
      type: 'image/png' as const,
    };

    console.log('📱 Starting QR code generation (automated)...');
    
    // Step 3: Generate QR code (same as working component)
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, options_fixed);
    console.log('✅ QR code generated successfully');
    console.log('   - DataURL length:', qrDataUrl.length);

    // Step 4: Use EXACT same file conversion as working component
    console.log('🔄 Converting dataURL to File...');
    const filename = `teacher_license_qr_${teacherId}_${Date.now()}.png`;
    const file = dataURLtoFile(qrDataUrl, filename); // ← Using working component's method
    
    console.log('📄 File created:');
    console.log('   - Filename:', filename);
    console.log('   - File size:', file.size, 'bytes');

    // Step 5: Use EXACT same FormData as working component
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type || 'application/octet-stream'); // ← Same as working component
    formData.append('name', file.name);
    formData.append('description', 'TRLS'); // ← Shorter description like working component

    console.log('📦 FormData prepared, attempting upload...');
    console.log('🌐 Upload URL:', fileUploadUrl);

    const uploadStartTime = Date.now();
    
    // Step 6: Use EXACT same fetch as working component
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

    // Validate response structure (same as working component)
    if (!uploadResponse || !uploadResponse['original-name'] || !uploadResponse.key) {
      console.error('❌ Invalid response structure:', uploadResponse);
      throw new Error('Invalid response from upload server');
    }

    console.log('🎉 Automated QR generation and upload completed successfully!');

    // Step 7: Return combined success result
    return {
      success: true,
      qrDataUrl,
      uploadResponse,
    };

  } catch (error) {
    console.error('❌ Automated QR generation and upload FAILED:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'QR generation and upload failed'
    };
  }
}