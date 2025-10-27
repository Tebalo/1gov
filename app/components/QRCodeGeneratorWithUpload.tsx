'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { fileUploadUrl } from '../lib/store';

interface UploadResponse {
  bucket: string;
  extension: string;
  'original-name': string;
  key: string;
  [k: string]: unknown;
}

interface QRCodeGeneratorWithUploadProps {
  dynamicUrl: string;
  size?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  maxSize?: number; // in MB
  className?: string;
  onUploadComplete?: (response: UploadResponse) => void;
}

export default function QRCodeGeneratorWithUpload({
  dynamicUrl,
  size = 256,
  darkColor = '#000000',
  lightColor = '#FFFFFF',
  errorCorrectionLevel = 'M',
  maxSize = 10,
  className = '',
  onUploadComplete
}: QRCodeGeneratorWithUploadProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const uploadControllerRef = useRef<AbortController | null>(null);

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

  const generateAndUploadQR = async () => {
    if (!dynamicUrl.trim()) {
      setUploadError('Dynamic URL is required to generate QR code');
      return;
    }

    setGenerating(true);
    setUploading(true);
    setUploadProgress(0);
    setUploadError('');
    setUploadResponse(null);

    // Create abort controller for this upload
    uploadControllerRef.current = new AbortController();

    try {
      // Step 1: Generate QR Code
      const options = {
        width: size,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel,
        type: 'image/png' as const,
      };

      const dataUrl = await QRCode.toDataURL(dynamicUrl, options);
      setQrDataUrl(dataUrl);
      setGenerating(false);

      // Step 2: Convert to File and Upload
      const filename = `qr_${Date.now()}.png`;
      const file = dataURLtoFile(dataUrl, filename);

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        throw new Error(`File too large. Maximum size is ${maxSize}MB`);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type || 'application/octet-stream');
      formData.append('name', file.name);
      formData.append('description', 'TRLS');

      // Start progress simulation (more conservative)
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 80) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            return 80;
          }
          return prev + Math.random() * 15 + 5; // More realistic progress increments
        });
      }, 300);

      // Upload file with timeout and abort signal
      const timeoutId = setTimeout(() => {
        if (uploadControllerRef.current) {
          uploadControllerRef.current.abort();
        }
      }, 30000); // 30 second timeout

      const response = await fetch(fileUploadUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData,
        signal: uploadControllerRef.current.signal
      });

      clearTimeout(timeoutId);

      // Clear progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      setUploadProgress(100);

      if (!response.ok) {
        let errorMessage = `Upload failed (${response.status})`;
        
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += `: ${errorText}`;
          }
        } catch {
          // If we can't read the error text, use status-based message
          switch (response.status) {
            case 413:
              errorMessage = `File too large. Maximum size is ${maxSize}MB`;
              break;
            case 415:
              errorMessage = `File type not supported by server`;
              break;
            case 500:
              errorMessage = 'Server error occurred during upload';
              break;
            case 503:
              errorMessage = 'Upload service temporarily unavailable';
              break;
            default:
              errorMessage = `Upload failed with error ${response.status}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      const result: UploadResponse = await response.json();

      // Validate response structure
      if (!result || !result['original-name'] || !result.key) {
        throw new Error('Invalid response from upload server');
      }

      setUploadResponse(result);
      onUploadComplete?.(result);

      // Reset progress after a brief delay
      setTimeout(() => setUploadProgress(0), 1500);
      
    } catch (error) {
      // Clear progress interval on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      let errorMessage = 'Upload failed';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Upload was cancelled or timed out';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error occurred during upload';
        } else {
          errorMessage = error.message;
        }
      }
      
      setUploadError(errorMessage);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setGenerating(false);
      uploadControllerRef.current = null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* URL Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-1">QR Code URL:</h3>
        <p className="text-sm text-gray-600 font-mono break-all">{dynamicUrl}</p>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateAndUploadQR}
        disabled={generating || uploading || !dynamicUrl.trim()}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {generating ? 'Generating QR Code...' : uploading ? 'Uploading...' : 'Generate QR Code & Upload'}
      </button>

      {/* QR Code Display */}
      {qrDataUrl && (
        <div className="flex justify-center">
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <img 
              src={qrDataUrl} 
              alt="Generated QR Code" 
              width={size} 
              height={size}
              className="rounded"
            />
            <p className="text-xs text-gray-500 mt-2 text-center max-w-[200px] truncate">
              {dynamicUrl}
            </p>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            {uploadProgress < 100 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Complete!'}
          </p>
        </div>
      )}

      {/* Upload Response */}
      {uploadResponse && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            ✅ QR Code Generated and Uploaded Successfully!
          </h3>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-gray-700">File Name:</span>
              <span className="text-gray-600">{uploadResponse['original-name']}</span>
              
              <span className="font-medium text-gray-700">File Key:</span>
              <span className="text-gray-600 font-mono text-xs break-all">{uploadResponse.key}</span>
              
              <span className="font-medium text-gray-700">Bucket:</span>
              <span className="text-gray-600">{uploadResponse.bucket}</span>
              
              <span className="font-medium text-gray-700">Extension:</span>
              <span className="text-gray-600">{uploadResponse.extension}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ❌ Error
          </h3>
          <p className="text-red-600 text-sm">{uploadError}</p>
          <button
            onClick={() => setUploadError('')}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-2">QR Code Settings:</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p>• Size: {size}px</p>
          <p>• Colors: {darkColor} on {lightColor}</p>
          <p>• Error Correction: {errorCorrectionLevel}</p>
          <p>• Max File Size: {maxSize}MB</p>
          <p>• Upload URL: {fileUploadUrl}</p>
        </div>
      </div>
    </div>
  );
}