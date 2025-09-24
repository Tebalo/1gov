import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

export const InfoLink: React.FC<{label:string, paymentUrl:string, className: string}> = ({ label = "Payment Link", paymentUrl, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleExternalClick = () => {
    window.open(paymentUrl, '_blank');
  };

  if (!paymentUrl) {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">{label}</div>
          <div className="text-sm text-gray-500">No payment link available</div>
        </div>
      </div>
    );
  }

  const truncatedUrl = paymentUrl.length > 50 
    ? `${paymentUrl.substring(0, 47)}...` 
    : paymentUrl;

  return (
    <div className={`flex items-center justify-between transition-colors ${className}`}>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 mb-1">{label}</div>
        <div className="text-sm text-blue-600 font-mono truncate" title={paymentUrl}>
          {truncatedUrl}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-3">
        <button
          onClick={handleExternalClick}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-md transition-colors"
          title="Open link"
        >
          <ExternalLink size={16} />
        </button>
        <button
          onClick={handleCopy}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-md transition-colors"
          title={copied ? "Copied!" : "Copy link"}
        >
          {copied ? (
            <Check size={16} className="text-green-600" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

// Example usage
// const PaymentLinkDemo = () => {
//   const samplePaymentUrl = "https://pay.example.com/invoice/abc123def456ghi789jkl012mno345pqr678stu901vwx234yz";
  
//   return (
//     <div className="p-6 space-y-4 max-w-md">
//       <h3 className="text-lg font-semibold mb-4">Payment Link Examples</h3>
      
//       <CopyablePaymentLink 
//         label="Payment Link" 
//         paymentUrl={samplePaymentUrl}
//       />
      
//       <CopyablePaymentLink 
//         label="Invoice Link" 
//         paymentUrl="https://pay.stripe.com/short-link-123"
//       />
      
//       <CopyablePaymentLink 
//         label="Payment Link" 
//         paymentUrl={null} // Shows no link available state
//       />
//     </div>
//   );
// };

// export default PaymentLinkDemo;