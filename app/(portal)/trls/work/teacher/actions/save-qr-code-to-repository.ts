import { fileUploadUrl } from "@/app/lib/store";

export interface DocumentUploadResult {
  success: boolean;
  uploadResponse?: {
    bucket: string;
    extension: string;
    'original-name': string;
    key: string;
    [k: string]: unknown;
  };
  error?: string;
}


export async function saveQRCodeToRepository(
  qrBuffer: Buffer,
  teacherId: string
): Promise<DocumentUploadResult> {
  try {
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

    return {
      success: true,
      uploadResponse,
    };
  } catch (error) {
    console.error('QR upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'QR upload failed'
    };
  }
}