'use client';

import { Button } from '@/components/primitives/ui/button';
import { Copy, X } from 'lucide-react';
import { useState } from 'react';

interface IntegrationCodeDialogProps {
  onClose: () => void;
}

export function IntegrationCodeDialog({ onClose }: IntegrationCodeDialogProps) {
  const [copied, setCopied] = useState(false);

  const integrationCode = `<!-- Alkitu Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${typeof window !== 'undefined' ? window.location.origin : ''}/chat-widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(integrationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Chat to Your Website</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Copy and paste this code snippet before the closing &lt;/body&gt; tag on your website:
          </p>
          
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm border">
              <code>{integrationCode}</code>
            </pre>
            <Button
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
