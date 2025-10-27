// components/ServerQRCode.tsx
import QRCode from 'qrcode';

interface ServerQRCodeProps {
  text: string;
  size?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  format?: 'png' | 'svg';
  className?: string;
  alt?: string;
}

export default async function ServerQRCode({
  text,
  size = 256,
  darkColor = '#000000',
  lightColor = '#FFFFFF',
  errorCorrectionLevel = 'M',
  format = 'svg',
  className = '',
  alt = 'QR Code'
}: ServerQRCodeProps) {
  const options = {
    width: size,
    margin: 2,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel,
  };

  try {
    if (format === 'svg') {
      const svgString = await QRCode.toString(text, {
        ...options,
        type: 'svg',
      });

      return (
        <div 
          className={className}
          dangerouslySetInnerHTML={{ __html: svgString }}
          title={alt}
        />
      );
    } else {
      // PNG format - return as base64 data URL
      const dataUrl = await QRCode.toDataURL(text, {
        ...options,
        type: 'image/png',
      });

      return (
        <img
          src={dataUrl}
          alt={alt}
          width={size}
          height={size}
          className={className}
        />
      );
    }
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return (
      <div className={`${className} flex items-center justify-center bg-gray-200 text-gray-500`}>
        <span>QR Code Error</span>
      </div>
    );
  }
}