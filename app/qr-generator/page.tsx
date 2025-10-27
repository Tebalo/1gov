// app/qr-upload/page.tsx
'use client';

import { useState } from 'react';
import QRCodeGeneratorWithUpload from '../components/QRCodeGeneratorWithUpload';

export default function QRUploadPage() {
  const [dynamicUrl, setDynamicUrl] = useState('https://example.com/product/123');
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);

  const handleUploadComplete = (response: any) => {
    console.log('QR Code uploaded successfully:', response);
    setUploadHistory(prev => [response, ...prev]);
    
    // You can add additional logic here:
    // - Save to database
    // - Send notifications
    // - Update analytics
    // etc.
  };

  const fileUploadUrl = process.env.NEXT_PUBLIC_FILE_UPLOAD_URL || 'https://your-upload-endpoint.com/upload';

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Dynamic QR Code Generator with Upload
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* URL Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Configure Dynamic URL</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  Dynamic URL for QR Code:
                </label>
                <input
                  type="url"
                  id="url"
                  value={dynamicUrl}
                  onChange={(e) => setDynamicUrl(e.target.value)}
                  placeholder="https://example.com/your-dynamic-url"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Preset URLs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Presets:
                </label>
                <div className="space-y-2">
                  {[
                    'https://example.com/product/123',
                    'https://example.com/order/456',
                    'https://example.com/invoice/789',
                    'https://example.com/ticket/abc123',
                    'https://example.com/profile/user456'
                  ].map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setDynamicUrl(url)}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm transition-colors"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* QR Generator Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Generate & Upload QR Code</h2>
            
            <QRCodeGeneratorWithUpload
              dynamicUrl={dynamicUrl}
              fileUploadUrl={fileUploadUrl}
              size={256}
              darkColor="#000000"
              lightColor="#FFFFFF"
              errorCorrectionLevel="M"
              maxSize={10}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </div>

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Upload History ({uploadHistory.length})
            </h2>
            
            <div className="space-y-3">
              {uploadHistory.map((upload, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-800">{upload['original-name']}</h3>
                      <p className="text-sm text-gray-600">Bucket: {upload.bucket}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono">Key: {upload.key}</p>
                      <p className="text-xs text-gray-500">Extension: {upload.extension}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Info */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Integration Notes:</h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>• Set your upload endpoint URL in environment variables</p>
            <p>• The component generates QR codes from dynamic URLs</p>
            <p>• Automatically uploads generated QR codes to your document repository</p>
            <p>• Returns upload response with file key, bucket, and metadata</p>
            <p>• Includes progress tracking and comprehensive error handling</p>
          </div>
        </div>
      </div>
    </div>
  );
}