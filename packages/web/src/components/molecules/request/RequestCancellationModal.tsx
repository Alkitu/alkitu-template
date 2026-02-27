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
import { AlertTriangle, AlertCircle } from 'lucide-react';
import type { RequestCancellationModalProps } from './RequestCancellationModal.types';

/**
 * RequestCancellationModal - Molecule Component
 *
 * Modal for CLIENT to request cancellation (does NOT directly cancel).
 * The request will be flagged for ADMIN/EMPLOYEE approval.
 */
export const RequestCancellationModal: React.FC<RequestCancellationModalProps> = ({
  open,
  onClose,
  requestId,
  serviceName,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setReason('');
      setError(null);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError('Por favor, proporcione un motivo para la cancelación.');
      return;
    }

    try {
      setError(null);
      await onConfirm(requestId, reason.trim());
      onClose();
    } catch (err) {
      console.error('Error requesting cancellation:', err);
    }
  };

  const canConfirm = !isLoading && reason.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Solicitar Cancelación
          </DialogTitle>
          <DialogDescription>
            Su solicitud de cancelación será revisada por el equipo.
            La cancelación no es inmediata y requiere aprobación.
            {serviceName && (
              <>
                <br />
                <span className="mt-2 inline-block text-sm font-medium text-gray-700">
                  {serviceName}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="cancellationReason" className="text-sm font-medium">
              Motivo de cancelación <span className="text-red-600">*</span>
            </label>
            <Textarea
              id="cancellationReason"
              name="cancellationReason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Explique por qué desea cancelar esta solicitud..."
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
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Volver
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enviando...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Solicitar Cancelación
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
