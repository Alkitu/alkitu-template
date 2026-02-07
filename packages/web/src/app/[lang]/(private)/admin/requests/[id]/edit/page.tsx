'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { Loader2, ArrowLeft, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';
import { Button } from '@/components/primitives/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/ui/card';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { FormSelect } from '@/components/molecules-alianza/FormSelect';
import { RequestStatusBadgeMolecule } from '@/components/molecules/request';

interface EditRequestForm {
  serviceId: string;
  executionDateTime: string;
  locationId: string;
  // Location fields for new location
  locationBuilding?: string;
  locationTower?: string;
  locationFloor?: string;
  locationUnit?: string;
  locationStreet: string;
  locationCity: string;
  locationState: string;
  locationZip: string;
}

/**
 * Admin Request Edit Page
 *
 * Allows administrators to edit service request details
 * Features:
 * - Edit service selection
 * - Modify execution date/time
 * - Update location details
 * - View read-only metadata (client, status, timeline)
 */
export default function RequestEditPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = use(params);
  const router = useRouter();

  const [formData, setFormData] = useState<EditRequestForm>({
    serviceId: '',
    executionDateTime: '',
    locationId: '',
    locationStreet: '',
    locationCity: '',
    locationState: '',
    locationZip: '',
  });
  const [useNewLocation, setUseNewLocation] = useState(false);

  // Fetch request data
  const {
    data: request,
    isLoading: requestLoading,
    error: requestError,
  } = trpc.request.getRequestById.useQuery({ id });

  // Fetch supporting data
  const { data: services, isLoading: servicesLoading } =
    trpc.service.getAllServices.useQuery();
  const { data: locations, isLoading: locationsLoading } =
    trpc.location.getAllLocations.useQuery();

  const updateMutation = trpc.request.updateRequest.useMutation({
    onSuccess: () => {
      toast.success('Solicitud actualizada exitosamente');
      router.push(`/${lang}/admin/requests/${id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar solicitud');
    },
  });

  // Initialize form data when request loads
  useEffect(() => {
    if (request) {
      // Convert DateTime to local datetime-local format
      const executionDate = new Date(request.executionDateTime);
      const localDateTime = new Date(
        executionDate.getTime() - executionDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      setFormData({
        serviceId: request.serviceId,
        executionDateTime: localDateTime,
        locationId: request.locationId || '',
        locationStreet: request.location?.street || '',
        locationCity: request.location?.city || '',
        locationState: request.location?.state || '',
        locationZip: request.location?.zip || '',
        locationBuilding: request.location?.building || '',
        locationTower: request.location?.tower || '',
        locationFloor: request.location?.floor || '',
        locationUnit: request.location?.unit || '',
      });
    }
  }, [request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare update data
    const updateData: any = {
      id,
      serviceId: formData.serviceId,
      executionDateTime: new Date(formData.executionDateTime).toISOString(),
    };

    // Handle location
    if (useNewLocation || !formData.locationId) {
      updateData.locationData = {
        street: formData.locationStreet,
        city: formData.locationCity,
        state: formData.locationState,
        zip: formData.locationZip,
        building: formData.locationBuilding || undefined,
        tower: formData.locationTower || undefined,
        floor: formData.locationFloor || undefined,
        unit: formData.locationUnit || undefined,
      };
    } else {
      updateData.locationId = formData.locationId;
    }

    await updateMutation.mutateAsync(updateData);
  };

  const handleCancel = () => {
    router.push(`/${lang}/admin/requests/${id}`);
  };

  const handleLocationChange = (value: string) => {
    if (value === 'new') {
      setUseNewLocation(true);
      setFormData((prev) => ({
        ...prev,
        locationId: '',
        locationStreet: '',
        locationCity: '',
        locationState: '',
        locationZip: '',
        locationBuilding: '',
        locationTower: '',
        locationFloor: '',
        locationUnit: '',
      }));
    } else {
      setUseNewLocation(false);
      const selectedLocation = locations?.find((l) => l.id === value);
      if (selectedLocation) {
        setFormData((prev) => ({
          ...prev,
          locationId: value,
          locationStreet: selectedLocation.street,
          locationCity: selectedLocation.city,
          locationState: selectedLocation.state,
          locationZip: selectedLocation.zip,
          locationBuilding: selectedLocation.building || '',
          locationTower: selectedLocation.tower || '',
          locationFloor: selectedLocation.floor || '',
          locationUnit: selectedLocation.unit || '',
        }));
      }
    }
  };

  if (requestLoading || servicesLoading || locationsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (requestError || !request) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-900">
            {requestError?.message || 'Request not found'}
          </p>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Editar Solicitud"
        description={`Modificar detalles de la solicitud #${id.slice(-6)}`}
        backHref={`/${lang}/admin/requests/${id}`}
        backLabel="Volver a Detalles"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Fields */}
          <div className="space-y-6 lg:col-span-2">
            {/* Service Selection Card */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Servicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormSelect
                  label="Servicio"
                  value={formData.serviceId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, serviceId: value })
                  }
                  options={
                    services?.map((s) => ({
                      value: s.id,
                      label: `${s.name} (${s.category.name})`,
                    })) || []
                  }
                  required
                />
                {formData.serviceId && (
                  <div className="text-sm text-muted-foreground">
                    Categoría:{' '}
                    {services?.find((s) => s.id === formData.serviceId)?.category
                      .name || 'N/A'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Execution Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles de Ejecución</CardTitle>
              </CardHeader>
              <CardContent>
                <FormInput
                  label="Fecha y Hora de Ejecución"
                  type="datetime-local"
                  value={formData.executionDateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, executionDateTime: e.target.value })
                  }
                  required
                />
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormSelect
                  label="Ubicación Existente"
                  value={useNewLocation ? 'new' : formData.locationId}
                  onValueChange={handleLocationChange}
                  options={[
                    { value: 'new', label: '+ Nueva Ubicación' },
                    ...(locations?.map((l) => ({
                      value: l.id,
                      label: `${l.street}, ${l.city}`,
                    })) || []),
                  ]}
                  required
                />

                {/* Show location fields if new or editing existing */}
                {(useNewLocation || formData.locationId) && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Edificio"
                        value={formData.locationBuilding || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, locationBuilding: e.target.value })
                        }
                      />
                      <FormInput
                        label="Torre"
                        value={formData.locationTower || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, locationTower: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Piso"
                        value={formData.locationFloor || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, locationFloor: e.target.value })
                        }
                      />
                      <FormInput
                        label="Unidad"
                        value={formData.locationUnit || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, locationUnit: e.target.value })
                        }
                      />
                    </div>
                    <FormInput
                      label="Calle"
                      value={formData.locationStreet}
                      onChange={(e) =>
                        setFormData({ ...formData, locationStreet: e.target.value })
                      }
                      required
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <FormInput
                        label="Ciudad"
                        value={formData.locationCity}
                        onChange={(e) =>
                          setFormData({ ...formData, locationCity: e.target.value })
                        }
                        required
                      />
                      <FormInput
                        label="Estado"
                        value={formData.locationState}
                        onChange={(e) =>
                          setFormData({ ...formData, locationState: e.target.value })
                        }
                        required
                      />
                      <FormInput
                        label="Código Postal"
                        value={formData.locationZip}
                        onChange={(e) =>
                          setFormData({ ...formData, locationZip: e.target.value })
                        }
                        required
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Meta Info (Read-Only) */}
          <div className="space-y-6">
            {/* Client Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {request.user.firstname} {request.user.lastname}
                </p>
                <p className="text-sm text-muted-foreground">{request.user.email}</p>
              </CardContent>
            </Card>

            {/* Status Info */}
            <Card>
              <CardHeader>
                <CardTitle>Estado Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <RequestStatusBadgeMolecule status={request.status} size="md" />
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <p className="text-muted-foreground">Creada:</p>
                  <p>{new Date(request.createdAt).toLocaleString()}</p>
                </div>
                {request.completedAt && (
                  <div>
                    <p className="text-muted-foreground">Completada:</p>
                    <p>{new Date(request.completedAt).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={updateMutation.isPending}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
