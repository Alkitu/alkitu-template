'use client';

import { Card } from '@/components/primitives/Card';
import { Button } from '@/components/primitives/Button';
import { CheckCircle2, Home, FileText } from 'lucide-react';
import Link from 'next/link';

/**
 * Request Creation Success Page
 *
 * Shown after successfully creating a service request.
 * Displays confirmation and provides navigation options.
 */
export default function RequestSuccessPage() {
  // TODO: Get request ID from URL params or state
  const requestId = 'REQ-001';

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Card className="p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            ¡Solicitud Creada Exitosamente!
          </h1>

          <p className="text-muted-foreground mb-2">
            Tu solicitud ha sido registrada correctamente.
          </p>

          <p className="text-lg font-medium text-foreground mb-8">
            Número de Solicitud: <span className="text-primary">{requestId}</span>
          </p>

          {/* Information Card */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-3">¿Qué sigue?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Recibirás una notificación cuando tu solicitud sea asignada a un técnico
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Puedes hacer seguimiento del estado de tu solicitud en cualquier momento
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  El equipo te contactará si necesita información adicional
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/client/requests/${requestId}`}>
              <Button variant="default" className="w-full sm:w-auto">
                <FileText className="h-4 w-4 mr-2" />
                Ver Solicitud
              </Button>
            </Link>

            <Link href="/client/dashboard">
              <Button variant="outline" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
