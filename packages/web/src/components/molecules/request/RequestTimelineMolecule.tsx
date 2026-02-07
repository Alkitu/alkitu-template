import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { RequestTimelineMoleculeProps } from './RequestTimelineMolecule.types';
import { Button } from '@/components/primitives/ui/button';

export const RequestTimelineMolecule: React.FC<RequestTimelineMoleculeProps> = ({
  events,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {events.map((event, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            {/* Step Icon/Dot */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                event.isCompleted || event.isActive
                  ? 'bg-primary'
                  : 'bg-muted border-2 border-muted-foreground/20'
              }`}
            >
              {event.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-primary-foreground" />
              ) : (
                <Circle
                  className={`h-5 w-5 ${
                    event.isActive ? 'text-primary-foreground fill-primary-foreground' : 'text-muted-foreground'
                  }`}
                />
              )}
            </div>
            
            {/* Connecting Line */}
            {index < events.length - 1 && (
              <div
                className={`w-0.5 h-12 my-1 ${
                  event.isCompleted ? 'bg-primary' : 'bg-muted border-l-2 border-dashed border-muted-foreground/20'
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
      ))}
    </div>
  );
};
