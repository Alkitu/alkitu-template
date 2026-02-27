'use client';

import { use } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  FileText,
  Wrench,
  CheckCircle,
  AlertCircle,
  Loader2,
  ClipboardList,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { RequestStatus } from '@alkitu/shared';
import type { FormSettings } from '@alkitu/shared';
import { trpc } from '@/lib/trpc';
import {
  RequestTimelineMolecule,
  type TimelineEvent,
} from '@/components/molecules/request';
import { FormResponsesPreview } from '@/components/features/form-builder/organisms/FormResponsesPreview';
import { Button } from '@/components/primitives/ui/button';

/**
 * Request Detail Page - CLIENT View
 *
 * Displays detailed information about a specific service request,
 * including service details and the client's form responses.
 *
 * @route /[lang]/client/requests/[requestId]
 */

interface RequestDetailPageProps {
  params: Promise<{
    requestId: string;
    lang: string;
  }>;
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const router = useRouter();
  const { requestId, lang } = use(params);

  const {
    data: request,
    isLoading,
    isError,
    error,
  } = trpc.request.getRequestById.useQuery({ id: requestId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">Error</h3>
              <p className="mt-1 text-sm text-destructive/80">
                {error?.message || 'Solicitud no encontrada'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/${lang}/client/requests`)}
                className="mt-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const executionDate = new Date(request.executionDateTime);
  // @ts-expect-error - TS2589: Prisma/tRPC type instantiation too deep, runtime types are correct
  const templateResponses = (request.templateResponses as Record<string, unknown>) || {};
  const firstTemplate = (request.service as any)?.formTemplates?.[0];
  const formSettings = firstTemplate?.formSettings as FormSettings | undefined;

  // Build timeline events
  const timelineEvents: TimelineEvent[] = [
    {
      status: RequestStatus.PENDING,
      label: 'Pendiente',
      date: new Date(request.createdAt),
      isCompleted:
        request.status !== RequestStatus.PENDING &&
        request.status !== RequestStatus.CANCELLED,
      isActive: request.status === RequestStatus.PENDING,
    },
  ];

  if (
    request.status === RequestStatus.ONGOING ||
    request.status === RequestStatus.COMPLETED
  ) {
    timelineEvents.push({
      status: RequestStatus.ONGOING,
      label: 'En Proceso',
      date: request.updatedAt ? new Date(request.updatedAt) : new Date(),
      isCompleted: request.status === RequestStatus.COMPLETED,
      isActive: request.status === RequestStatus.ONGOING,
    });
  }

  if (request.status === RequestStatus.COMPLETED) {
    timelineEvents.push({
      status: RequestStatus.COMPLETED,
      label: 'Completada',
      date: request.completedAt ? new Date(request.completedAt) : new Date(),
      isCompleted: true,
      isActive: true,
    });
  }

  if (request.status === RequestStatus.CANCELLED) {
    timelineEvents.push({
      status: RequestStatus.CANCELLED,
      label: 'Cancelada',
      date: request.updatedAt ? new Date(request.updatedAt) : new Date(),
      isCompleted: true,
      isActive: true,
    });
  }

  return (
    <div className="space-y-8 p-6 pb-20 max-w-5xl mx-auto">
      {/* Top Header */}
      <div>
        <button
          onClick={() => router.push(`/${lang}/client/requests`)}
          className="group flex items-center gap-2 text-sm font-bold text-primary transition-all pr-4 py-2"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="uppercase tracking-widest text-[10px]">Volver</span>
        </button>
      </div>

      {/* Service Title + ID */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight leading-none">
          {request.service?.name?.toUpperCase() || 'SERVICIO'}
        </h1>
        <p className="text-sm font-bold text-primary tracking-widest">
          #{request.customId || requestId.slice(-8).toUpperCase()}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="space-y-8 lg:col-span-2">
          {/* Service Details Card */}
          <div className="bg-white border border-border shadow-sm rounded-xl p-8 space-y-8">
            <h2 className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              Detalles del Servicio
              <span className="flex-1 h-px bg-border" />
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Location */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">
                    Ubicación
                  </h4>
                  <p className="font-bold text-sm text-foreground">
                    {request.location?.building || request.location?.city || 'Ubicación'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {request.location?.street}
                  </p>
                </div>
              </div>

              {/* Service Type */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">
                    Tipo de Servicio
                  </h4>
                  <p className="font-bold text-sm text-foreground">
                    {request.service?.name || 'Servicio'}
                  </p>
                </div>
              </div>

              {/* Date/Time */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">
                    Fecha y Hora
                  </h4>
                  <p className="font-bold text-sm text-foreground">
                    {executionDate.toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {executionDate.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">
                    Solicitado el
                  </h4>
                  <p className="font-bold text-sm text-foreground">
                    {new Date(request.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {request.note && (
                <div className="flex gap-4 col-span-2">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">
                      Notas
                    </h4>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {typeof request.note === 'string'
                        ? request.note
                        : JSON.stringify(request.note)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Client Form Responses Card */}
          {formSettings && Object.keys(templateResponses).length > 0 && (
            <div className="bg-white border border-border shadow-sm rounded-xl p-8 space-y-6">
              <h2 className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-foreground">
                <ClipboardList className="h-5 w-5 text-primary" />
                Respuestas del Formulario
                <span className="flex-1 h-px bg-border" />
              </h2>

              <FormResponsesPreview
                formSettings={formSettings}
                responses={templateResponses}
                locale={(lang as 'es' | 'en') || 'es'}
              />
            </div>
          )}
        </div>

        {/* Right Column - Timeline & Assigned */}
        <div className="space-y-8">
          {/* Status Timeline */}
          <div className="bg-white border border-border shadow-sm rounded-xl p-6">
            <h2 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-foreground mb-8">
              <CheckCircle className="h-5 w-5 text-primary" />
              Estado de la Solicitud
            </h2>
            <RequestTimelineMolecule events={timelineEvents} />

            {request.assignedTo && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-3">
                  Empleado Asignado
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="font-bold text-green-700 text-xs">
                      {request.assignedTo.firstname[0]}
                      {request.assignedTo.lastname[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {request.assignedTo.firstname} {request.assignedTo.lastname}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.assignedTo.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
