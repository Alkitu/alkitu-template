'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import { Button } from '@/components/primitives/ui/button';
import { Textarea } from '@/components/primitives/ui/textarea';
import { XCircle, AlertCircle } from 'lucide-react';
import type { CancelRequestModalProps } from './CancelRequestModal.types';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * CancelRequestModal - Molecule Component
 *
 * Modal for canceling a service request.
 * Requires a reason for cancellation.
 *
 * Features:
 * - Displays request details
 * - Required reason textarea
 * - Loading states during cancellation
 * - Form validation
 * - Internationalization support
 *
 * @example
 * ```tsx
 * <CancelRequestModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   request={selectedRequest}
 *   onConfirm={handleCancel}
 * />
 * ```
 */
export const CancelRequestModal: React.FC<CancelRequestModalProps> = ({
  open,
  onClose,
  request,
  onConfirm,
  isLoading = false,
}) => {
  const t = useTranslations('requests.cancel');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setReason('');
      setError(null);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!request) return;

    // Validate reason
    if (!reason.trim()) {
      setError(t('reasonRequired') || 'Please provide a reason for cancellation');
      return;
    }

    try {
      setError(null);
      await onConfirm(request.id, reason.trim());
      onClose();
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  };

  const canConfirm = !isLoading && reason.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            {t('title') || 'Cancel Request'}
          </DialogTitle>
          <DialogDescription>
            {request && (
              <>
                {t('description') || 'Please provide a reason for canceling this request.'}
                <br />
                <span className="mt-2 inline-block text-sm font-medium text-gray-700">
                  {(request as any).service?.name || 'Service Request'}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Required Reason Field */}
          <div className="space-y-2">
            <label htmlFor="cancellationReason" className="text-sm font-medium">
              {t('reason') || 'Cancellation Reason'}{' '}
              <span className="text-red-600">*</span>
            </label>
            <Textarea
              id="cancellationReason"
              name="cancellationReason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t('reasonPlaceholder') || 'Explain why this request is being canceled...'}
              disabled={isLoading}
              rows={4}
              className="resize-none"
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('back') || 'Back'}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('canceling') || 'Canceling...'}
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                {t('confirm') || 'Cancel Request'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
