'use client';

import { Card } from '@/components/primitives/Card';
import { Bell, CheckCircle, Info, AlertTriangle, Construction } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/primitives/Button';

/**
 * Employee Notifications Page
 *
 * Placeholder page for employee notifications.
 * Will be fully implemented when notification system is ready.
 */

export default function EmployeeNotificationsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Notificaciones
        </h1>
        <p className="text-muted-foreground">
          Mantente informado sobre actualizaciones y cambios en tus solicitudes
        </p>
      </div>

      {/* Placeholder Content */}
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Construction className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Sistema de Notificaciones en Desarrollo
          </h2>
          <p className="text-muted-foreground mb-8">
            El sistema de notificaciones está actualmente en desarrollo.
            Pronto podrás recibir actualizaciones en tiempo real sobre:
          </p>

          <div className="w-full space-y-4 mb-8">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-left">
                  <p className="font-medium">Asignaciones de Solicitudes</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones cuando se te asigne una nueva solicitud
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="text-left">
                  <p className="font-medium">Cambios de Estado</p>
                  <p className="text-sm text-muted-foreground">
                    Mantente informado sobre cambios en el estado de tus solicitudes
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-orange-500">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="text-left">
                  <p className="font-medium">Solicitudes Urgentes</p>
                  <p className="text-sm text-muted-foreground">
                    Alertas para solicitudes de alta prioridad que requieren atención inmediata
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-purple-500">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="text-left">
                  <p className="font-medium">Mensajes de Clientes</p>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones cuando los clientes envíen mensajes o comentarios
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-4">
            <Link href="/employee/dashboard">
              <Button variant="outline">
                Volver al Dashboard
              </Button>
            </Link>
            <Link href="/employee/requests">
              <Button>
                Ver Mis Solicitudes
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
