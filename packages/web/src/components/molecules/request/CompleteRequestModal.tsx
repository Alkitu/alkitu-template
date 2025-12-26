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
import { CheckCircle2 } from 'lucide-react';
import type { CompleteRequestModalProps } from './CompleteRequestModal.types';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * CompleteRequestModal - Molecule Component
 *
 * Modal for marking a service request as completed.
 * Allows employees/admins to add optional completion notes.
 *
 * Features:
 * - Displays request details
 * - Optional notes textarea
 * - Loading states during completion
 * - Internationalization support
 *
 * @example
 * ```tsx
 * <CompleteRequestModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   request={selectedRequest}
 *   onConfirm={handleComplete}
 * />
 * ```
 */
export const CompleteRequestModal: React.FC<CompleteRequestModalProps> = ({
  open,
  onClose,
  request,
  onConfirm,
  isLoading = false,
}) => {
  const t = useTranslations('requests.complete');
  const [notes, setNotes] = useState<string>('');

  // Reset notes when modal closes
  useEffect(() => {
    if (!open) {
      setNotes('');
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!request) return;

    try {
      await onConfirm(request.id, notes || undefined);
      onClose();
    } catch (error) {
      console.error('Error completing request:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            {t('title') || 'Complete Request'}
          </DialogTitle>
          <DialogDescription>
            {request && (
              <>
                {t('description') || 'Mark this request as completed. You can add optional completion notes.'}
                <div className="mt-2 text-sm font-medium text-gray-700">
                  {request.service?.name || 'Service Request'}
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Optional Notes Field */}
          <div className="space-y-2">
            <label htmlFor="completionNotes" className="text-sm font-medium">
              {t('notes') || 'Completion Notes (Optional)'}
            </label>
            <Textarea
              id="completionNotes"
              name="completionNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notesPlaceholder') || 'Add any notes about the completed work...'}
              disabled={isLoading}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('completing') || 'Completing...'}
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('confirm') || 'Mark Complete'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
