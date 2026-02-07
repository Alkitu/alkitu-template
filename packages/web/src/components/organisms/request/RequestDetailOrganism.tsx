'use client';

import React, { useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Pencil,
  FileText,
  Wrench,
  Camera,
  Upload,
  UserPlus,
  RefreshCw,
} from 'lucide-react';
import { RequestStatus } from '@alkitu/shared';
import {
  RequestTimelineMolecule,
  RequestClientCardMolecule,
  TimelineEvent,
  QuickAssignModal,
  QuickStatusModal
} from '@/components/molecules/request';
import type { RequestDetailOrganismProps } from './RequestDetailOrganism.types';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/components/primitives/ui/use-toast';
import { RequestChatPanel } from './RequestChatPanel';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

/**
 * RequestDetailOrganism - Organism Component (ALI-119)
 * REDESIGNED to match Alianza Design System with theme colors
 *
 * Features:
 * - Theme-aware layout and components
 * - Vertical Timeline molecule integration
 * - Premium Client Card molecule integration
 * - Evidence section (placeholder for media)
 * - Quick Actions: Assign Employee, Change Status
 */
export const RequestDetailOrganism: React.FC<RequestDetailOrganismProps> = ({
  requestId,
  userRole,
  className = '',
  onUpdate,
  onBack,
  onEdit,
}) => {
  const { toast } = useToast();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch request details using tRPC
  const {
    data: request,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.request.getRequestById.useQuery({ id: requestId });

  // tRPC mutations
  const assignMutation = trpc.request.assignRequest.useMutation();
  const updateStatusMutation = trpc.request.updateRequestStatus.useMutation();

  // Feature flags
  const { isEnabled: chatEnabled } = useFeatureFlag('request-collaboration');

  const handleAssign = async (reqId: string, employeeId: string) => {
    setActionLoading('assign');
    try {
      await assignMutation.mutateAsync({ id: reqId, assignedToId: employeeId });
      toast({
        title: 'Empleado asignado',
        description: 'La solicitud ha sido asignada correctamente.',
      });
      refetch();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo asignar el empleado.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeStatus = async (reqId: string, status: RequestStatus) => {
    setActionLoading('status');
    try {
      await updateStatusMutation.mutateAsync({ id: reqId, status });
      toast({
        title: 'Estado actualizado',
        description: 'El estado de la solicitud ha sido actualizado.',
      });
      refetch();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
          <div className="flex-1">
            <h3 className="font-semibold text-destructive">Error</h3>
            <p className="mt-1 text-sm text-destructive/80">
              {error?.message || 'Request not found'}
            </p>
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const executionDate = new Date(request.executionDateTime);
  const canAssign = userRole !== 'CLIENT' && request.status !== RequestStatus.CANCELLED && request.status !== RequestStatus.COMPLETED;
  const canChangeStatus = userRole !== 'CLIENT' && request.status !== RequestStatus.CANCELLED;

  // Prepare events for the timeline
  const timelineEvents: TimelineEvent[] = [
    {
      status: RequestStatus.PENDING,
      label: 'Pendiente',
      date: new Date(request.createdAt),
      isCompleted: request.status !== RequestStatus.PENDING && request.status !== RequestStatus.CANCELLED,
      isActive: request.status === RequestStatus.PENDING,
    },
  ];

  if (request.status === RequestStatus.ONGOING || request.status === RequestStatus.COMPLETED) {
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
    <div className={`space-y-8 pb-20 ${className}`}>
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-bold text-primary transition-all pr-4 py-2"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="uppercase tracking-widest text-[10px]">Volver</span>
          </button>
        )}
        
        <div className="flex gap-3">
          {canAssign && (
            <Button 
              onClick={() => setIsAssignModalOpen(true)}
              className="bg-primary text-primary-foreground font-bold h-10 !px-6 rounded-lg uppercase tracking-wider text-xs shadow-md shadow-primary/20 hover:shadow-lg transition-all"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {request.assignedToId ? 'Reasignar Empleado' : 'Asignar Empleado'}
            </Button>
          )}
          {canChangeStatus && (
            <Button 
              variant="secondary"
              onClick={() => setIsStatusModalOpen(true)}
              className="font-bold h-10 !px-6 rounded-lg uppercase tracking-wider text-xs"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Cambiar Estado
            </Button>
          )}
          {onEdit && userRole !== 'CLIENT' && (
            <Button
              variant="outline"
              onClick={onEdit}
              className="h-10 !px-6 border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-wider text-xs"
            >
              <Pencil className="mr-2 h-3 w-3" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Main Service Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight leading-none">
          {request.service?.name?.toUpperCase() || 'NOMBRE DEL SERVICIO'}
        </h1>
        <p className="text-sm font-bold text-primary tracking-widest">
          #REQ-{requestId.slice(-8).toUpperCase()}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="space-y-8 lg:col-span-2">
          {/* Client Card */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
              <span className="w-4 h-0.5 bg-primary/20" />
              Información del Cliente
            </h2>
            <RequestClientCardMolecule client={request.user} />
          </div>

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
                  <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">Ubicación</h4>
                  <p className="font-bold text-sm text-foreground">
                    {request.location?.building || 'Casa Principal'}, {request.location?.city || 'Escazú'}
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
                  <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">Tipo de Servicio</h4>
                  <p className="font-bold text-sm text-foreground">
                    {request.service?.name || 'Servicio de Limpieza'}
                  </p>
                </div>
              </div>

              {/* Date/Time */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">Fecha y Hora</h4>
                  <p className="font-bold text-sm text-foreground">
                    {executionDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {executionDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Created By Date */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">Solicitado el</h4>
                  <p className="font-bold text-sm text-foreground">
                     {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Notes or Category */}
              <div className="flex gap-4 col-span-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">Notas</h4>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {typeof request.note === 'string' ? request.note : 'Sin notas adicionales.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline and Evidence */}
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
                       {request.assignedTo.firstname[0]}{request.assignedTo.lastname[0]}
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

          {/* Evidence Card */}
          <div className="bg-white border border-border shadow-sm rounded-xl p-6">
            <h2 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-foreground mb-6">
              <Camera className="h-5 w-5 text-primary" />
              Fotos y Evidencia
            </h2>
            
            <div className="space-y-4">
              <button className="w-full aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/5 transition-colors group">
                <Upload className="h-6 w-6 group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest">Subir fotos</span>
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden relative group">
                    <img 
                      src={`https://picsum.photos/seed/${i + 10}/300/300`} 
                      alt="Placeholder evidence" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Team Chat Panel - Feature Flag Controlled */}
      {chatEnabled && <RequestChatPanel requestId={requestId} />}

      {/* Quick Action Modals */}
      <QuickAssignModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        requestId={requestId}
        onConfirm={handleAssign}
        isLoading={actionLoading === 'assign'}
      />

      <QuickStatusModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        requestId={requestId}
        currentStatus={request.status as RequestStatus}
        onConfirm={handleChangeStatus}
        isLoading={actionLoading === 'status'}
      />
    </div>
  );
};
