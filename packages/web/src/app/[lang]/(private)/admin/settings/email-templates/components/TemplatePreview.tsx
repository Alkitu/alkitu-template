'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Eye, Code, Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import { render } from '@react-email/components';
import { EmailPreviewShell } from './EmailPreviewShell';

interface TemplatePreviewProps {
  subject: string;
  body: string;
}

export function TemplatePreview({ subject, body }: TemplatePreviewProps) {
  const [mode, setMode] = useState<'preview' | 'source'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    const generateHtml = async () => {
      try {
        // Highlight {{variables}} in text content only.
        // We must NOT replace variables inside HTML attributes (e.g. href="{{url}}")
        // because wrapping them in <span> tags would break the attribute value.
        const processedBody = body?.replace(
          /(<[^>]*>)|(\{\{([^}]+)\}\})/g,
          (match, tag, variable, varName) => {
            // If it's an HTML tag, return it unchanged
            if (tag) return tag;
            // Otherwise highlight the variable in text content
            return `<span style="background-color: rgba(6, 182, 212, 0.1); color: #0e7490; padding: 0 4px; border-radius: 4px; font-family: monospace;">{{${varName}}}</span>`;
          }
        ) || '';

        // We wrap the raw HTML body in a div with dangerouslySetInnerHTML
        // so correct HTML structure is preserved when rendering the React component.
        const emailComponent = (
          <EmailPreviewShell title={subject} previewText={subject}>
             <div dangerouslySetInnerHTML={{ __html: processedBody }} />
          </EmailPreviewShell>
        );

        const html = await render(emailComponent);
        setHtmlContent(html);
      } catch (error) {
        console.error('Failed to render email template:', error);
        // Fallback to basic display if render fails
        setHtmlContent(body || '');
      }
    };

    generateHtml();
  }, [body, subject]);

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-4">
           <h3 className="font-semibold text-sm">Preview</h3>
           {mode === 'preview' && (
              <div className="flex items-center bg-background border rounded-md p-0.5 ml-2">
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={() => setViewport('desktop')}
                   className={cn(
                     "h-6 w-6 rounded-sm",
                     viewport === 'desktop' && "bg-secondary text-secondary-foreground shadow-sm"
                   )}
                   title="Desktop view"
                 >
                   <Monitor className="h-3.5 w-3.5" />
                 </Button>
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={() => setViewport('mobile')}
                   className={cn(
                     "h-6 w-6 rounded-sm",
                     viewport === 'mobile' && "bg-secondary text-secondary-foreground shadow-sm"
                   )}
                   title="Mobile view"
                 >
                   <Smartphone className="h-3.5 w-3.5" />
                 </Button>
              </div>
           )}
        </div>

        <div className="flex items-center bg-background border rounded-md p-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode('preview')}
            className={cn(
              "h-7 px-3 text-xs rounded-sm",
              mode === 'preview' && "bg-secondary text-secondary-foreground shadow-sm"
            )}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Visual
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode('source')}
            className={cn(
               "h-7 px-3 text-xs rounded-sm",
               mode === 'source' && "bg-secondary text-secondary-foreground shadow-sm"
            )}
          >
            <Code className="h-3.5 w-3.5 mr-1.5" />
            Code
          </Button>
        </div>
      </div>

      <div className="px-4 py-3 border-b bg-muted/10">
        <span className="text-xs font-semibold text-muted-foreground mr-2 uppercase tracking-wide">Subject:</span>
        <span className="text-sm font-medium">{subject || '(Empty subject)'}</span>
      </div>

      <div className="flex-1 overflow-hidden relative bg-zinc-100/50 flex justify-center">
        {mode === 'preview' ? (
          <div className={cn(
             "transition-all duration-300 ease-in-out h-full w-full",
             viewport === 'mobile' ? "max-w-[375px] border-x border-zinc-200 shadow-xl my-4 rounded-[30px] overflow-hidden bg-black" : "w-full"
          )}>
             <iframe
               srcDoc={htmlContent || '<div style="color: #999; text-align: center; padding: 40px; font-family: sans-serif;">Loading preview...</div>'}
               title="Email Preview"
               className="w-full h-full border-0 block bg-white"
               sandbox="allow-same-origin"
             />
          </div>
        ) : (
          <ScrollArea className="h-full w-full bg-slate-950">
             <pre className="p-4 text-xs font-mono text-slate-50 whitespace-pre-wrap leading-relaxed">
               {body || '(No content)'}
             </pre>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
