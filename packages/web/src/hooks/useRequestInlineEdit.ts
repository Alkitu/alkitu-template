import { useState, useCallback, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import type { ComboboxOption } from '@/components/molecules-alianza/Combobox/Combobox.types';

export interface EditFormData {
  serviceId: string;
  executionDateTime: string; // datetime-local format
  locationId: string;
  useNewLocation: boolean;
  locationBuilding: string;
  locationTower: string;
  locationFloor: string;
  locationUnit: string;
  locationStreet: string;
  locationCity: string;
  locationState: string;
  locationZip: string;
  note: string;
}

interface UseRequestInlineEditProps {
  requestId: string;
  requestData: any;
  onSuccess: () => void;
}

const initialFormData: EditFormData = {
  serviceId: '',
  executionDateTime: '',
  locationId: '',
  useNewLocation: false,
  locationBuilding: '',
  locationTower: '',
  locationFloor: '',
  locationUnit: '',
  locationStreet: '',
  locationCity: '',
  locationState: '',
  locationZip: '',
  note: '',
};

export function useRequestInlineEdit({
  requestId,
  requestData,
  onSuccess,
}: UseRequestInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EditFormData>(initialFormData);

  // Lazy queries — only fetch when editing
  const { data: services } = trpc.service.getAllServices.useQuery(undefined, {
    enabled: isEditing,
  });
  const { data: locations } = trpc.location.getAllLocations.useQuery(undefined, {
    enabled: isEditing,
  });

  const updateMutation = trpc.request.updateRequest.useMutation();

  const enterEditMode = useCallback(() => {
    if (!requestData) return;

    // Convert DateTime to local datetime-local format
    const executionDate = new Date(requestData.executionDateTime);
    const localDateTime = new Date(
      executionDate.getTime() - executionDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setFormData({
      serviceId: requestData.serviceId,
      executionDateTime: localDateTime,
      locationId: requestData.locationId || '',
      useNewLocation: false,
      locationBuilding: requestData.location?.building || '',
      locationTower: requestData.location?.tower || '',
      locationFloor: requestData.location?.floor || '',
      locationUnit: requestData.location?.unit || '',
      locationStreet: requestData.location?.street || '',
      locationCity: requestData.location?.city || '',
      locationState: requestData.location?.state || '',
      locationZip: requestData.location?.zip || '',
      note: typeof requestData.note === 'string' ? requestData.note : '',
    });
    setIsEditing(true);
  }, [requestData]);

  const cancelEditMode = useCallback(() => {
    setIsEditing(false);
    setFormData(initialFormData);
  }, []);

  const updateField = useCallback(
    <K extends keyof EditFormData>(field: K, value: EditFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleLocationChange = useCallback(
    (value: string) => {
      if (value === 'new') {
        setFormData((prev) => ({
          ...prev,
          locationId: '',
          useNewLocation: true,
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
        const selectedLocation = locations?.items?.find(
          (l: any) => l.id === value
        );
        if (selectedLocation) {
          setFormData((prev) => ({
            ...prev,
            locationId: value,
            useNewLocation: false,
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
    },
    [locations]
  );

  const handleSave = useCallback(async () => {
    const updateData: any = {
      id: requestId,
      serviceId: formData.serviceId,
      executionDateTime: new Date(formData.executionDateTime).toISOString(),
    };

    if (formData.useNewLocation || !formData.locationId) {
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

    if (formData.note) {
      updateData.note = formData.note;
    }

    try {
      await updateMutation.mutateAsync(updateData);
      toast.success('Solicitud actualizada exitosamente');
      setIsEditing(false);
      onSuccess();
    } catch {
      toast.error('No se pudo actualizar la solicitud.');
    }
  }, [requestId, formData, updateMutation, onSuccess]);

  const serviceOptions: ComboboxOption[] = useMemo(
    () =>
      services?.items?.map((s: any) => ({
        id: s.id,
        label: s.name,
        value: s.id,
        description: s.category?.name,
      })) || [],
    [services]
  );

  const locationOptions: Array<{ value: string; label: string }> = useMemo(
    () => [
      { value: 'new', label: '+ Nueva Ubicación' },
      ...(locations?.items?.map((l: any) => ({
        value: l.id,
        label: `${l.street}, ${l.city}`,
      })) || []),
    ],
    [locations]
  );

  // Derive the selected service name for read-only display
  const selectedServiceName = useMemo(() => {
    if (!isEditing) return '';
    const found = services?.items?.find(
      (s: any) => s.id === formData.serviceId
    );
    return found?.name || requestData?.service?.name || '';
  }, [isEditing, services, formData.serviceId, requestData]);

  return {
    isEditing,
    isSaving: updateMutation.isPending,
    formData,
    serviceOptions,
    locationOptions,
    selectedServiceName,
    enterEditMode,
    cancelEditMode,
    updateField,
    handleLocationChange,
    handleSave,
  };
}
