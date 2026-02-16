'use client';

import { useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface SendAllTestEmailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DialogState = 'input' | 'sending' | 'complete';

interface TemplateResult {
  templateId: string;
  templateName: string;
  category: string;
  success: boolean;
  error?: string;
}

export function SendAllTestEmailsDialog({
  open,
  onOpenChange,
}: SendAllTestEmailsDialogProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<DialogState>('input');
  const [results, setResults] = useState<TemplateResult[]>([]);
  const [totalSent, setTotalSent] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);

  const mutation = trpc.emailTemplate.sendAllTestEmails.useMutation();

  const handleSend = async () => {
    if (!email) return;

    setState('sending');
    try {
      const response = await mutation.mutateAsync({ recipient: email });
      setResults(response.results);
      setTotalSent(response.totalSent);
      setTotalFailed(response.totalFailed);
      setState('complete');

      if (response.totalFailed === 0) {
        toast.success(`All ${response.totalSent} test emails sent successfully`);
      } else {
        toast.warning(
          `${response.totalSent} sent, ${response.totalFailed} failed`,
        );
      }
    } catch {
      toast.error('Failed to send test emails');
      setState('input');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation completes
    setTimeout(() => {
      setState('input');
      setResults([]);
      setTotalSent(0);
      setTotalFailed(0);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send All Test Emails</DialogTitle>
          <DialogDescription>
            Send all active email templates to a test email address. Subjects
            will be prefixed with [TEST].
          </DialogDescription>
        </DialogHeader>

        {state === 'input' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="test-email">Recipient email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && email) handleSend();
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={!email}>
                Send All Test Emails
              </Button>
            </DialogFooter>
          </>
        )}

        {state === 'sending' && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Sending test emails to <strong>{email}</strong>...
            </p>
          </div>
        )}

        {state === 'complete' && (
          <>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{totalSent}</p>
                <p className="text-xs text-muted-foreground">Sent</p>
              </div>
              {totalFailed > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {totalFailed}
                  </p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              )}
            </div>

            <div className="max-h-60 space-y-1 overflow-y-auto">
              {results.map((result) => (
                <div
                  key={result.templateId}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-sm"
                >
                  {result.success ? (
                    <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="size-4 shrink-0 text-red-600" />
                  )}
                  <span className="truncate">{result.templateName}</span>
                  {result.error && (
                    <span className="ml-auto truncate text-xs text-red-500">
                      {result.error}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
