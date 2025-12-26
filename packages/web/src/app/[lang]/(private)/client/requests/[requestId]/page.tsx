'use client';

import { useState, use } from 'react';
import { Card } from '@/components/primitives/Card';
import { Button } from '@/components/primitives/Button';
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Request Detail Page - CLIENT View
 *
 * Displays detailed information about a specific service request.
 * Allows clients to view status, timeline, and cancel requests if needed.
 */

interface RequestDetailPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const router = useRouter();
  const { requestId } = use(params);

  // Mock data - will be replaced with API call
  const [request] = useState({
    id: requestId,
    title: 'Reparación de aire acondicionado',
    description: 'El aire acondicionado de la sala de juntas no enfría correctamente. Se escucha un ruido extraño al encenderlo.',
    status: 'ONGOING',
    priority: 'HIGH',
    service: {
      name: 'Mantenimiento General',
      category: 'Reparaciones',
    },
    location: {
      name: 'Oficina Central',
      address: 'Av. Principal 123, Torre A, Piso 5',
    },
    assignedTo: {
      name: 'Juan Pérez',
      role: 'Técnico Senior',
    },
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-02T14:30:00Z',
    timeline: [
      {
        date: '2025-12-01T10:00:00Z',
        status: 'PENDING',
        description: 'Solicitud creada',
      },
      {
        date: '2025-12-01T14:00:00Z',
        status: 'ONGOING',
        description: 'Asignada a Juan Pérez',
      },
      {
        date: '2025-12-02T14:30:00Z',
        status: 'ONGOING',
        description: 'Técnico en camino',
      },
    ],
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: {
        icon: Clock,
        text: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      },
      ONGOING: {
        icon: AlertCircle,
        text: 'En Proceso',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      },
      COMPLETED: {
        icon: CheckCircle2,
        text: 'Completada',
        className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      },
      CANCELLED: {
        icon: XCircle,
        text: 'Cancelada',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      },
    };

    const badge = badges[status as keyof typeof badges] || badges.PENDING;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
        <Icon className="h-4 w-4" />
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      LOW: { text: 'Baja', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
      MEDIUM: { text: 'Media', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
      HIGH: { text: 'Alta', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
    };

    const badge = badges[priority as keyof typeof badges] || badges.MEDIUM;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelRequest = () => {
    // TODO: Implement cancel request functionality
    if (confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      console.log('Cancelling request:', requestId);
      // Call API to cancel request
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{request.title}</h1>
              <p className="text-muted-foreground">Solicitud #{request.id}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {getStatusBadge(request.status)}
              {getPriorityBadge(request.priority)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <p className="text-muted-foreground">{request.description}</p>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Historial</h2>
              <div className="space-y-4">
                {request.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <div className="h-3 w-3 bg-primary rounded-full" />
                      </div>
                      {index < request.timeline.length - 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-medium">{event.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Información del Servicio</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Servicio</p>
                  <p className="font-medium">{request.service.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoría</p>
                  <p className="font-medium">{request.service.category}</p>
                </div>
              </div>
            </Card>

            {/* Location Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación
              </h3>
              <div>
                <p className="font-medium">{request.location.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {request.location.address}
                </p>
              </div>
            </Card>

            {/* Assigned Technician */}
            {request.assignedTo && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Técnico Asignado
                </h3>
                <div>
                  <p className="font-medium">{request.assignedTo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.assignedTo.role}
                  </p>
                </div>
              </Card>
            )}

            {/* Dates */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fechas
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Creada</p>
                  <p className="text-sm font-medium">
                    {formatDate(request.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última actualización</p>
                  <p className="text-sm font-medium">
                    {formatDate(request.updatedAt)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Acciones</h3>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancelRequest}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar Solicitud
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
