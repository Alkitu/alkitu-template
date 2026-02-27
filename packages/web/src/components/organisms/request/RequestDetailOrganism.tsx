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
  AlertTriangle,
  CheckCircle,
  Pencil,
  FileText,
  Wrench,
  UserPlus,
  RefreshCw,
  Save,
  X,
  XCircle,
  ClipboardList,
} from 'lucide-react';
import { RequestStatus, UserRole } from '@alkitu/shared';
import type { FormSettings } from '@alkitu/shared';
import {
  RequestTimelineMolecule,
  RequestClientCardMolecule,
  RequestStatusBadgeMolecule,
  type TimelineEvent,
  QuickAssignModal,
  QuickStatusModal,
  CancelRequestModal,
  RequestCancellationModal,
} from '@/components/molecules/request';
import { FormResponsesPreview } from '@/components/features/form-builder/organisms/FormResponsesPreview';
import type { DriveAttachment } from '@/components/features/form-builder/organisms/FormResponsesPreview/FormResponsesPreview.types';
import type { RequestDetailOrganismProps } from './RequestDetailOrganism.types';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { RequestChatPanel } from './RequestChatPanel';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useRequestInlineEdit } from '@/hooks/useRequestInlineEdit';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { FormTextarea } from '@/components/molecules-alianza/FormTextarea';
import { Combobox } from '@/components/molecules-alianza/Combobox';
import { FormSelect } from '@/components/molecules-alianza/FormSelect';

/**
 * RequestDetailOrganism - Unified Single-Column Layout
 *
 * Renders identically for CLIENT, EMPLOYEE, and ADMIN roles.
 * Permission differences control which actions are available.
 *
 * Layout: single-column (max-w-3xl mx-auto)
 * Sections: Header → Client Info + Status → Title → Service Details →
 *           Form Responses (with Drive attachments) → Timeline →
 *           Cancellation Banner → Chat Panel
 */
export const RequestDetailOrganism: React.FC<RequestDetailOrganismProps> = ({
  requestId,
  userRole,
  lang = 'es',
  className = '',
  onUpdate,
  onBack,
}) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancellationRequestModalOpen, setIsCancellationRequestModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch request details
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
  const cancelMutation = trpc.request.cancelRequest.useMutation();
  const requestCancellationMutation = trpc.request.requestCancellation.useMutation();

  // Feature flags
  const { isEnabled: chatEnabled } = useFeatureFlag('request-collaboration');

  // Inline editing (ADMIN only)
  const editHook = useRequestInlineEdit({
    requestId,
    requestData: request,
    onSuccess: () => {
      refetch();
      if (onUpdate) onUpdate();
    },
  });

  // --- Permission helpers ---
  const isAdmin = userRole === UserRole.ADMIN;
  const isEmployee = userRole === UserRole.EMPLOYEE;
  const isClient = userRole === UserRole.CLIENT;
  const isNotCancelled = request?.status !== RequestStatus.CANCELLED;
  const isNotCompleted = request?.status !== RequestStatus.COMPLETED;
  const isActive = isNotCancelled && isNotCompleted;

  const canAssign = isAdmin && isActive;
  const canChangeStatus = (isAdmin || isEmployee) && isNotCancelled;
  const canEdit = isAdmin && isActive;
  const canDirectCancel = (isAdmin || isEmployee) && isActive;
  const canRequestCancellation = isClient && isActive;

  // --- Handlers ---
  const handleAssign = async (reqId: string, employeeId: string) => {
    setActionLoading('assign');
    try {
      await assignMutation.mutateAsync({ id: reqId, assignedToId: employeeId });
      toast.success('La solicitud ha sido asignada correctamente.');
      refetch();
      if (onUpdate) onUpdate();
    } catch {
      toast.error('No se pudo asignar el empleado.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeStatus = async (reqId: string, status: RequestStatus) => {
    setActionLoading('status');
    try {
      await updateStatusMutation.mutateAsync({ id: reqId, status });
      toast.success('El estado de la solicitud ha sido actualizado.');
      refetch();
      if (onUpdate) onUpdate();
    } catch {
      toast.error('No se pudo actualizar el estado.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDirectCancel = async (reqId: string, reason: string) => {
    setActionLoading('cancel');
    try {
      await cancelMutation.mutateAsync({ id: reqId, reason });
      toast.success('La solicitud ha sido cancelada.');
      refetch();
      if (onUpdate) onUpdate();
    } catch {
      toast.error('No se pudo cancelar la solicitud.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestCancellation = async (reqId: string, reason: string) => {
    setActionLoading('requestCancellation');
    try {
      await requestCancellationMutation.mutateAsync({ id: reqId, reason });
      toast.success('Su solicitud de cancelación ha sido enviada.');
      refetch();
      if (onUpdate) onUpdate();
    } catch {
      toast.error('No se pudo enviar la solicitud de cancelación.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveCancellation = async () => {
    if (!request) return;
    setActionLoading('approveCancellation');
    try {
      await cancelMutation.mutateAsync({ id: request.id, reason: 'Aprobada por el equipo' });
      toast.success('La cancelación ha sido aprobada.');
      refetch();
      if (onUpdate) onUpdate();
    } catch {
      toast.error('No se pudo aprobar la cancelación.');
    } finally {
      setActionLoading(null);
    }
  };

  // --- Loading / Error states ---
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
              {error?.message || 'Solicitud no encontrada'}
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

  // --- Derived data ---
  const executionDate = new Date(request.executionDateTime);
  // @ts-expect-error - TS2589: Prisma/tRPC type instantiation too deep, runtime types are correct
  const requestNote: string = typeof request.note === 'string' ? request.note : (request.note ? JSON.stringify(request.note) : '');

  const templateResponses = (request.templateResponses as Record<string, unknown>) || {};
  const firstTemplate = (request.service as any)?.formTemplates?.[0];
  const formSettings = firstTemplate?.formSettings as FormSettings | undefined;
  const driveAttachments = (Array.isArray((request as any).attachments)
    ? (request as any).attachments
    : []) as DriveAttachment[];

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
    <div className={`max-w-3xl mx-auto space-y-8 pb-20 ${className}`}>
      {/* ── Header: Back + Action Buttons ── */}
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-bold text-primary transition-all pr-4 py-2"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="uppercase tracking-widest text-[10px]">Volver</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex gap-3 flex-wrap justify-end">
          {editHook.isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={editHook.cancelEditMode}
                disabled={editHook.isSaving}
                className="h-10 !px-6 font-bold uppercase tracking-wider text-xs"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={editHook.handleSave}
                disabled={editHook.isSaving}
                className="bg-primary text-primary-foreground font-bold h-10 !px-6 rounded-lg uppercase tracking-wider text-xs shadow-md shadow-primary/20 hover:shadow-lg transition-all"
              >
                {editHook.isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              {canAssign && (
                <Button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="bg-primary text-primary-foreground font-bold h-10 !px-6 rounded-lg uppercase tracking-wider text-xs shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {request.assignedToId ? 'Reasignar' : 'Asignar'}
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
              {canEdit && (
                <Button
                  variant="outline"
                  onClick={editHook.enterEditMode}
                  className="h-10 !px-6 border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-wider text-xs"
                >
                  <Pencil className="mr-2 h-3 w-3" />
                  Editar
                </Button>
              )}
              {canDirectCancel && (
                <Button
                  variant="outline"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="h-10 !px-6 border-red-300 text-red-600 hover:bg-red-50 font-bold uppercase tracking-wider text-xs"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar Solicitud
                </Button>
              )}
              {canRequestCancellation && (
                <Button
                  variant="outline"
                  onClick={() => setIsCancellationRequestModalOpen(true)}
                  className="h-10 !px-6 border-amber-300 text-amber-600 hover:bg-amber-50 font-bold uppercase tracking-wider text-xs"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Solicitar Cancelación
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Client Info + Status Badge ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 mb-4">
            <span className="w-4 h-0.5 bg-primary/20" />
            Información del Cliente
          </h2>
          <RequestClientCardMolecule client={request.user} />
        </div>
        <RequestStatusBadgeMolecule
          status={request.status as RequestStatus}
          size="lg"
        />
      </div>

      {/* ── Service Title + ID ── */}
      <div className="space-y-1">
        {editHook.isEditing ? (
          <div className="max-w-md">
            <Combobox
              options={editHook.serviceOptions}
              value={editHook.formData.serviceId}
              onChange={(value) => editHook.updateField('serviceId', value as string)}
              placeholder="Seleccionar servicio..."
              searchPlaceholder="Buscar servicio..."
              emptyMessage="No se encontraron servicios."
              className="w-full"
            />
          </div>
        ) : (
          <h1 className="text-3xl font-black text-foreground tracking-tight leading-none">
            {request.service?.name?.toUpperCase() || 'SERVICIO'}
          </h1>
        )}
        <p className="text-sm font-bold text-primary tracking-widest">
          #{(request as any).customId || requestId.slice(-8).toUpperCase()}
        </p>
      </div>

      {/* ── Service Details Card ── */}
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
            <div className="flex-1">
              <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">
                Ubicación
              </h4>
              {editHook.isEditing ? (
                <div className="space-y-3">
                  <FormSelect
                    label="Ubicación"
                    value={editHook.formData.useNewLocation ? 'new' : editHook.formData.locationId}
                    onValueChange={editHook.handleLocationChange}
                    options={editHook.locationOptions}
                  />
                  {(editHook.formData.useNewLocation || editHook.formData.locationId) && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput
                          label="Edificio"
                          value={editHook.formData.locationBuilding}
                          onChange={(e) => editHook.updateField('locationBuilding', e.target.value)}
                        />
                        <FormInput
                          label="Torre"
                          value={editHook.formData.locationTower}
                          onChange={(e) => editHook.updateField('locationTower', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput
                          label="Piso"
                          value={editHook.formData.locationFloor}
                          onChange={(e) => editHook.updateField('locationFloor', e.target.value)}
                        />
                        <FormInput
                          label="Unidad"
                          value={editHook.formData.locationUnit}
                          onChange={(e) => editHook.updateField('locationUnit', e.target.value)}
                        />
                      </div>
                      <FormInput
                        label="Calle"
                        value={editHook.formData.locationStreet}
                        onChange={(e) => editHook.updateField('locationStreet', e.target.value)}
                        required
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <FormInput
                          label="Ciudad"
                          value={editHook.formData.locationCity}
                          onChange={(e) => editHook.updateField('locationCity', e.target.value)}
                          required
                        />
                        <FormInput
                          label="Estado"
                          value={editHook.formData.locationState}
                          onChange={(e) => editHook.updateField('locationState', e.target.value)}
                          required
                        />
                        <FormInput
                          label="C.P."
                          value={editHook.formData.locationZip}
                          onChange={(e) => editHook.updateField('locationZip', e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <p className="font-bold text-sm text-foreground">
                    {request.location?.building || request.location?.city || 'Ubicación'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {request.location?.street}
                  </p>
                </>
              )}
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
                {editHook.isEditing
                  ? editHook.selectedServiceName || 'Seleccione un servicio'
                  : request.service?.name || 'Servicio'}
              </p>
            </div>
          </div>

          {/* Date/Time */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">
                Fecha y Hora
              </h4>
              {editHook.isEditing ? (
                <FormInput
                  label=""
                  type="datetime-local"
                  value={editHook.formData.executionDateTime}
                  onChange={(e) => editHook.updateField('executionDateTime', e.target.value)}
                  required
                />
              ) : (
                <>
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
                </>
              )}
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
          {(editHook.isEditing || requestNote) && (
            <div className="flex gap-4 col-span-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">
                  Notas
                </h4>
                {editHook.isEditing ? (
                  <FormTextarea
                    label=""
                    value={editHook.formData.note}
                    onChange={(e) => editHook.updateField('note', e.target.value)}
                    rows={3}
                    placeholder="Agregar notas..."
                  />
                ) : (
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {requestNote || 'Sin notas adicionales.'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Form Responses Card (with Drive attachments) ── */}
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
            attachments={driveAttachments}
            locale={(lang as 'es' | 'en') || 'es'}
          />
        </div>
      )}

      {/* ── Status Timeline Card ── */}
      <div className="bg-white border border-border shadow-sm rounded-xl p-8">
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

      {/* ── Cancellation Requested Banner ── */}
      {(request as any).cancellationRequested &&
        request.status !== RequestStatus.CANCELLED && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-800">
                  Cancelación Solicitada
                </h3>
                <p className="mt-1 text-sm text-amber-700">
                  El cliente ha solicitado la cancelación de esta solicitud.
                  {(request as any).cancellationRequestedAt && (
                    <span className="ml-1 text-amber-600">
                      ({new Date((request as any).cancellationRequestedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })})
                    </span>
                  )}
                </p>
                {(isAdmin || isEmployee) && (
                  <Button
                    onClick={handleApproveCancellation}
                    disabled={actionLoading === 'approveCancellation'}
                    className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider text-xs"
                    size="sm"
                  >
                    {actionLoading === 'approveCancellation' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Aprobar Cancelación
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

      {/* ── Chat Panel (feature-flagged) ── */}
      {chatEnabled && <RequestChatPanel requestId={requestId} />}

      {/* ── Modals ── */}
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

      <CancelRequestModal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        request={request as any}
        onConfirm={handleDirectCancel}
        isLoading={actionLoading === 'cancel'}
      />

      <RequestCancellationModal
        open={isCancellationRequestModalOpen}
        onClose={() => setIsCancellationRequestModalOpen(false)}
        requestId={requestId}
        serviceName={request.service?.name}
        onConfirm={handleRequestCancellation}
        isLoading={actionLoading === 'requestCancellation'}
      />
    </div>
  );
};
