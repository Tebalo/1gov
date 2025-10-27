// lib/server-qr-utils.ts
import QRCode from 'qrcode';

export interface QROptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export class ServerQRGenerator {
  private static defaultOptions: Required<QROptions> = {
    width: 256,
    margin: 2,
    darkColor: '#000000',
    lightColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
  };

  /**
   * Generate QR code as SVG string (recommended for web)
   */
  static async toSVG(text: string, options: QROptions = {}): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };
    
    return await QRCode.toString(text, {
      type: 'svg',
      width: opts.width,
      margin: opts.margin,
      color: {
        dark: opts.darkColor,
        light: opts.lightColor,
      },
      errorCorrectionLevel: opts.errorCorrectionLevel,
    });
  }

  /**
   * Generate QR code as PNG buffer
   */
  static async toPNG(text: string, options: QROptions = {}): Promise<Buffer> {
    const opts = { ...this.defaultOptions, ...options };
    
    return await QRCode.toBuffer(text, {
      type: 'png',
      width: opts.width,
      margin: opts.margin,
      color: {
        dark: opts.darkColor,
        light: opts.lightColor,
      },
      errorCorrectionLevel: opts.errorCorrectionLevel,
    });
  }

  /**
   * Generate QR code as Data URL (base64)
   */
  static async toDataURL(text: string, options: QROptions = {}): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };
    
    return await QRCode.toDataURL(text, {
      type: 'image/png',
      width: opts.width,
      margin: opts.margin,
      color: {
        dark: opts.darkColor,
        light: opts.lightColor,
      },
      errorCorrectionLevel: opts.errorCorrectionLevel,
    });
  }

  /**
   * Generate QR code in multiple formats
   */
  static async toMultipleFormats(text: string, options: QROptions = {}) {
    const [svg, png, dataURL] = await Promise.all([
      this.toSVG(text, options),
      this.toPNG(text, options),
      this.toDataURL(text, options),
    ]);

    return {
      svg,
      png,
      dataURL,
      buffer: png, // Alias for backward compatibility
    };
  }
}

/**
 * Specialized QR code generators for common use cases
 */
export class QRTypes {
  /**
   * Generate WiFi QR code
   */
  static async wifi(
    ssid: string, 
    password: string, 
    security: 'WPA' | 'WEP' | 'nopass' = 'WPA',
    options: QROptions = {}
  ) {
    const wifiString = `WIFI:T:${security};S:${ssid};P:${password};;`;
    // Use high error correction for WiFi codes
    const wifiOptions = { ...options, errorCorrectionLevel: 'H' as const };
    return ServerQRGenerator.toMultipleFormats(wifiString, wifiOptions);
  }

  /**
   * Generate contact vCard QR code
   */
  static async contact(contact: {
    name: string;
    phone?: string;
    email?: string;
    organization?: string;
    url?: string;
  }, options: QROptions = {}) {
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
    vcard += `FN:${contact.name}\n`;
    if (contact.phone) vcard += `TEL:${contact.phone}\n`;
    if (contact.email) vcard += `EMAIL:${contact.email}\n`;
    if (contact.organization) vcard += `ORG:${contact.organization}\n`;
    if (contact.url) vcard += `URL:${contact.url}\n`;
    vcard += 'END:VCARD';

    return ServerQRGenerator.toMultipleFormats(vcard, options);
  }

  /**
   * Generate SMS QR code
   */
  static async sms(phoneNumber: string, message?: string, options: QROptions = {}) {
    const smsString = message 
      ? `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
      : `sms:${phoneNumber}`;
    
    return ServerQRGenerator.toMultipleFormats(smsString, options);
  }

  /**
   * Generate email QR code
   */
  static async email(
    emailAddress: string, 
    subject?: string, 
    body?: string,
    options: QROptions = {}
  ) {
    let emailString = `mailto:${emailAddress}`;
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    if (params.length > 0) emailString += `?${params.join('&')}`;
    
    return ServerQRGenerator.toMultipleFormats(emailString, options);
  }

  /**
   * Generate location QR code
   */
  static async location(
    latitude: number, 
    longitude: number, 
    zoom?: number,
    options: QROptions = {}
  ) {
    const geoString = zoom 
      ? `geo:${latitude},${longitude}?z=${zoom}`
      : `geo:${latitude},${longitude}`;
    
    return ServerQRGenerator.toMultipleFormats(geoString, options);
  }

  /**
   * Generate URL QR code with validation
   */
  static async url(url: string, options: QROptions = {}) {
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL provided');
    }
    
    return ServerQRGenerator.toMultipleFormats(url, options);
  }

  /**
   * Generate WhatsApp QR code
   */
  static async whatsapp(phoneNumber: string, message?: string, options: QROptions = {}) {
    let whatsappString = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}`;
    if (message) {
      whatsappString += `?text=${encodeURIComponent(message)}`;
    }
    
    return ServerQRGenerator.toMultipleFormats(whatsappString, options);
  }

  /**
   * Generate calendar event QR code
   */
  static async calendar(event: {
    title: string;
    start: Date;
    end?: Date;
    location?: string;
    description?: string;
  }, options: QROptions = {}) {
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    let vevent = 'BEGIN:VEVENT\n';
    vevent += `SUMMARY:${event.title}\n`;
    vevent += `DTSTART:${formatDate(event.start)}\n`;
    if (event.end) vevent += `DTEND:${formatDate(event.end)}\n`;
    if (event.location) vevent += `LOCATION:${event.location}\n`;
    if (event.description) vevent += `DESCRIPTION:${event.description}\n`;
    vevent += 'END:VEVENT';
    
    return ServerQRGenerator.toMultipleFormats(vevent, options);
  }
}

/**
 * React Server Component helpers
 */
export class QRServerComponents {
  /**
   * Generate inline SVG for React Server Components
   */
  static async InlineSVG(text: string, options: QROptions = {}) {
    const svg = await ServerQRGenerator.toSVG(text, options);
    return { __html: svg };
  }

  /**
   * Generate data URL for img src
   */
  static async ImageSrc(text: string, options: QROptions = {}) {
    return await ServerQRGenerator.toDataURL(text, options);
  }
}

/**
 * Utility functions for file operations
 */
export class QRFileUtils {
  /**
   * Save QR code as file (Node.js environments)
   */
  static async saveToFile(
    text: string, 
    filepath: string, 
    format: 'png' | 'svg' = 'png',
    options: QROptions = {}
  ) {
    const fs = await import('fs/promises');
    
    if (format === 'svg') {
      const svg = await ServerQRGenerator.toSVG(text, options);
      await fs.writeFile(filepath, svg, 'utf8');
    } else {
      const buffer = await ServerQRGenerator.toPNG(text, options);
      await fs.writeFile(filepath, buffer);
    }
  }

  /**
   * Create downloadable blob (for API routes)
   */
  static async createDownloadResponse(
    text: string,
    format: 'png' | 'svg' = 'png',
    filename: string = 'qrcode',
    options: QROptions = {}
  ) {
    const headers: Record<string, string> = {
      'Content-Disposition': `attachment; filename="${filename}.${format}"`,
      'Cache-Control': 'private, max-age=0',
    };

    if (format === 'svg') {
      const svg = await ServerQRGenerator.toSVG(text, options);
      return {
        content: svg,
        headers: {
          ...headers,
          'Content-Type': 'image/svg+xml',
        },
      };
    } else {
      const buffer = await ServerQRGenerator.toPNG(text, options);
      return {
        content: buffer,
        headers: {
          ...headers,
          'Content-Type': 'image/png',
        },
      };
    }
  }
}

// Export convenience functions
export const generateQR = ServerQRGenerator;
export const qrTypes = QRTypes;
export const qrComponents = QRServerComponents;
export const qrFiles = QRFileUtils;

// Example usage in Server Components:
/*
// In a React Server Component
export default async function MyComponent() {
  const qrSvg = await qrComponents.InlineSVG('Hello World');
  const qrImg = await qrComponents.ImageSrc('Hello World');
  
  return (
    <div>
      <div dangerouslySetInnerHTML={qrSvg} />
      <img src={qrImg} alt="QR Code" />
    </div>
  );
}

// In an API route
export async function GET() {
  const { content, headers } = await qrFiles.createDownloadResponse(
    'Hello World', 
    'png', 
    'my-qrcode'
  );
  
  return new NextResponse(content, { headers });
}

// Generate multiple types
const wifiQR = await qrTypes.wifi('MyNetwork', 'password123');
const contactQR = await qrTypes.contact({
  name: 'John Doe',
  phone: '+1234567890',
  email: 'john@example.com'
});
*/