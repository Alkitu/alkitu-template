import React from 'react';
import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { RequestStatus } from '@alkitu/shared';
import { RequestTimelineMoleculeProps } from './RequestTimelineMolecule.types';
import { Button } from '@/components/primitives/ui/button';

/** Semaphore-style color map per status */
const statusColors: Record<string, { bg: string; line: string; icon: string }> = {
  [RequestStatus.PENDING]:   { bg: 'bg-red-500',    line: 'bg-red-500',    icon: 'text-white' },
  [RequestStatus.ONGOING]:   { bg: 'bg-blue-500',   line: 'bg-blue-500',   icon: 'text-white' },
  [RequestStatus.COMPLETED]: { bg: 'bg-green-500',  line: 'bg-green-500',  icon: 'text-white' },
  [RequestStatus.CANCELLED]: { bg: 'bg-gray-400',   line: 'bg-gray-400',   icon: 'text-white' },
};

const defaultColors = { bg: 'bg-muted border-2 border-muted-foreground/20', line: 'bg-muted-foreground/20', icon: 'text-muted-foreground' };

export const RequestTimelineMolecule: React.FC<RequestTimelineMoleculeProps> = ({
  events,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {events.map((event, index) => {
        const isVisible = event.isCompleted || event.isActive;
        const colors = isVisible ? (statusColors[event.status] || defaultColors) : defaultColors;

        return (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              {/* Step Icon/Dot */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isVisible ? colors.bg : defaultColors.bg
                }`}
              >
                {event.status === RequestStatus.CANCELLED && isVisible ? (
                  <XCircle className={`h-5 w-5 ${colors.icon}`} />
                ) : event.isCompleted ? (
                  <CheckCircle className={`h-5 w-5 ${colors.icon}`} />
                ) : (
                  <Circle
                    className={`h-5 w-5 ${
                      isVisible ? `${colors.icon} fill-white/30` : 'text-muted-foreground'
                    }`}
                  />
                )}
              </div>

              {/* Connecting Line */}
              {index < events.length - 1 && (
                <div
                  className={`w-0.5 h-12 my-1 ${
                    event.isCompleted ? colors.line : 'bg-muted border-l-2 border-dashed border-muted-foreground/20'
                  }`}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold ${event.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {event.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {event.date.toLocaleDateString('es-ES')}
                {', '}
                {event.date.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>

              {event.isActive && event.actionButton && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 h-8 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                  onClick={event.actionButton.onClick}
                >
                  {event.actionButton.label}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
