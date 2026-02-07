'use client';

import React, { useState } from 'react';
import { RequestStatus } from '@alkitu/shared';
import { ResponsiveModal } from '@/components/primitives/ui/responsive-modal';
import { Button } from '@/components/primitives/ui/button';
import { useTranslations } from '@/context/TranslationsContext';
import { Clock, Play, CheckCircle } from 'lucide-react';

interface QuickStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  currentStatus: RequestStatus;
  onConfirm: (requestId: string, status: RequestStatus) => Promise<void>;
  isLoading?: boolean;
}

export const QuickStatusModal: React.FC<QuickStatusModalProps> = ({
  open,
  onOpenChange,
  requestId,
  currentStatus,
  onConfirm,
  isLoading = false,
}) => {
  const t = useTranslations('requests.status');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(currentStatus);

  const handleConfirm = async () => {
    if (selectedStatus === currentStatus) {
      onOpenChange(false);
      return;
    }
    await onConfirm(requestId, selectedStatus);
    onOpenChange(false);
  };

  const statusOptions = [
    {
      value: RequestStatus.PENDING,
      label: 'Pendiente',
      icon: Clock,
      color: 'bg-warning/10 text-warning border-warning/20',
      activeColor: 'bg-warning text-warning-foreground',
    },
    {
      value: RequestStatus.ONGOING,
      label: 'En Proceso',
      icon: Play,
      color: 'bg-primary/10 text-primary border-primary/20',
      activeColor: 'bg-primary text-primary-foreground',
    },
    {
      value: RequestStatus.COMPLETED,
      label: 'Completada',
      icon: CheckCircle,
      color: 'bg-success/10 text-success border-success/20',
      activeColor: 'bg-success text-success-foreground',
    },
  ];

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('title') || 'Cambiar Estado'}
      description={t('description') || 'Actualiza el estado de esta solicitud.'}
    >
      <div className="space-y-4 py-4">
        <div className="grid gap-3">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedStatus === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border transition-all
                  ${isSelected 
                    ? `${option.activeColor} border-transparent shadow-md` 
                    : 'bg-background hover:bg-muted border-border'
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${isSelected 
                    ? 'bg-white/20' 
                    : option.color
                  }
                `}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-bold text-sm tracking-wide">{option.label}</span>
                
                {isSelected && (
                  <div className="ml-auto">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={selectedStatus === currentStatus || isLoading}
          className="w-full bg-primary text-primary-foreground font-bold mt-4"
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Actualizando...
            </>
          ) : (
            'Confirmar Cambio'
          )}
        </Button>
      </div>
    </ResponsiveModal>
  );
};
