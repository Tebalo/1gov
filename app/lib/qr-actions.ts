// lib/qr-actions.ts
'use server';

import QRCode from 'qrcode';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface QRCodeData {
  id: string;
  text: string;
  createdAt: Date;
  options: {
    size: number;
    darkColor: string;
    lightColor: string;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
}

// In a real app, you'd use a database. For demo, using a simple in-memory store
const qrCodes: QRCodeData[] = [];

export async function generateQRCodeAction(formData: FormData) {
  const text = formData.get('text') as string;
  const size = parseInt(formData.get('size') as string) || 256;
  const darkColor = formData.get('darkColor') as string || '#000000';
  const lightColor = formData.get('lightColor') as string || '#FFFFFF';
  const errorCorrectionLevel = (formData.get('errorCorrectionLevel') as 'L' | 'M' | 'Q' | 'H') || 'M';

  if (!text?.trim()) {
    throw new Error('Text is required');
  }

  const qrData: QRCodeData = {
    id: Math.random().toString(36).substring(2, 15),
    text: text.trim(),
    createdAt: new Date(),
    options: {
      size,
      darkColor,
      lightColor,
      errorCorrectionLevel,
    },
  };

  qrCodes.unshift(qrData);

  revalidatePath('/qr-generator');
  redirect(`/qr-generator?generated=${qrData.id}`);
}

export async function getQRCodeById(id: string): Promise<QRCodeData | null> {
  return qrCodes.find(qr => qr.id === id) || null;
}

export async function getAllQRCodes(): Promise<QRCodeData[]> {
  return qrCodes;
}

export async function deleteQRCodeAction(formData: FormData) {
  const id = formData.get('id') as string;
  const index = qrCodes.findIndex(qr => qr.id === id);
  
  if (index > -1) {
    qrCodes.splice(index, 1);
  }

  revalidatePath('/qr-generator');
}

export async function generateQRCodeBuffer(text: string, options: any = {}) {
  const qrOptions = {
    width: options.size || 256,
    margin: 2,
    color: {
      dark: options.darkColor || '#000000',
      light: options.lightColor || '#FFFFFF',
    },
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
  };

  return await QRCode.toBuffer(text, { ...qrOptions, type: 'png' });
}

export async function generateQRCodeDataURL(text: string, options: any = {}) {
  const qrOptions = {
    width: options.size || 256,
    margin: 2,
    color: {
      dark: options.darkColor || '#000000',
      light: options.lightColor || '#FFFFFF',
    },
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
  };

  return await QRCode.toDataURL(text, { ...qrOptions, type: 'image/png' });
}

// Helper actions for common QR types
export async function generateWiFiQRAction(formData: FormData) {
  const ssid = formData.get('ssid') as string;
  const password = formData.get('password') as string;
  const security = (formData.get('security') as string) || 'WPA';

  if (!ssid?.trim()) {
    throw new Error('WiFi name (SSID) is required');
  }

  const wifiString = `WIFI:T:${security};S:${ssid};P:${password || ''};;`;
  
  const qrData: QRCodeData = {
    id: Math.random().toString(36).substring(2, 15),
    text: wifiString,
    createdAt: new Date(),
    options: {
      size: 256,
      darkColor: '#000000',
      lightColor: '#FFFFFF',
      errorCorrectionLevel: 'H', // High error correction for WiFi codes
    },
  };

  qrCodes.unshift(qrData);
  
  revalidatePath('/qr-generator');
  redirect(`/qr-generator?generated=${qrData.id}`);
}

export async function generateContactQRAction(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const organization = formData.get('organization') as string;

  if (!name?.trim()) {
    throw new Error('Name is required');
  }

  let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
  vcard += `FN:${name}\n`;
  if (phone) vcard += `TEL:${phone}\n`;
  if (email) vcard += `EMAIL:${email}\n`;
  if (organization) vcard += `ORG:${organization}\n`;
  vcard += 'END:VCARD';

  const qrData: QRCodeData = {
    id: Math.random().toString(36).substring(2, 15),
    text: vcard,
    createdAt: new Date(),
    options: {
      size: 256,
      darkColor: '#000000',
      lightColor: '#FFFFFF',
      errorCorrectionLevel: 'M',
    },
  };

  qrCodes.unshift(qrData);
  
  revalidatePath('/qr-generator');
  redirect(`/qr-generator?generated=${qrData.id}`);
}