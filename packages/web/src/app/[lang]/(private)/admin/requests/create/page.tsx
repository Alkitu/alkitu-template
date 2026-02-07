'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

// Alianza Components
import { Heading } from '@/components/atoms-alianza/Typography';
import { Button } from '@/components/molecules-alianza/Button';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { FormSelect } from '@/components/molecules-alianza/FormSelect';
import { FormTextarea } from '@/components/molecules-alianza/FormTextarea';

interface CreateRequestForm {
  userId: string;
  serviceId: string;
  locationId: string;
  executionDateTime: string;
  note: string;
}

interface CreateRequestFormErrors {
  userId?: string;
  serviceId?: string;
  locationId?: string;
  executionDateTime?: string;
}

/**
 * Admin Create Request Page (Alianza Design System)
 *
 * Allows admins to manually create service requests for clients
 */
export default function AdminCreateRequestPage() {
  const router = useRouter();
  const { lang } = useParams();

  const [formData, setFormData] = useState<CreateRequestForm>({
    userId: '',
    serviceId: '',
    locationId: '',
    executionDateTime: '',
    note: '',
  });

  const [errors, setErrors] = useState<CreateRequestFormErrors>({});
  const [services, setServices] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users for selection
  const { data: usersData } = trpc.user.getFilteredUsers.useQuery({
    page: 1,
    limit: 100,
    role: 'CLIENT',
    sortBy: 'firstname',
    sortOrder: 'asc',
  });

  // Fetch services and locations using REST API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [servicesRes, locationsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/locations'),
        ]);

        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData);
        }

        if (locationsRes.ok) {
          const locationsData = await locationsRes.json();
          setLocations(locationsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading form data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const createMutation = trpc.request.createRequest.useMutation({
    onSuccess: () => {
      toast.success('Request created successfully!');
      router.push(`/${lang}/admin/requests`);
    },
    onError: (error) => {
      toast.error(`Failed to create request: ${error.message}`);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: CreateRequestFormErrors = {};

    if (!formData.userId) {
      newErrors.userId = 'Client is required';
    }

    if (!formData.serviceId) {
      newErrors.serviceId = 'Service is required';
    }

    if (!formData.locationId) {
      newErrors.locationId = 'Location is required';
    }

    if (!formData.executionDateTime) {
      newErrors.executionDateTime = 'Execution date is required';
    } else if (new Date(formData.executionDateTime) < new Date()) {
      newErrors.executionDateTime = 'Execution date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreateRequestForm,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof CreateRequestFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        userId: formData.userId,
        serviceId: formData.serviceId,
        locationId: formData.locationId,
        executionDateTime: formData.executionDateTime,
        templateResponses: {},
        note: formData.note || undefined,
      });
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  const handleBack = () => {
    router.push(`/${lang}/admin/requests`);
  };

  // Prepare options for selects
  const userOptions = (usersData?.users || []).map((user) => ({
    value: user.id,
    label: `${user.firstname} ${user.lastname} (${user.email})`,
  }));

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.name,
  }));

  const locationOptions = locations.map((location) => ({
    value: location.id,
    label: `${location.street}, ${location.city}`,
  }));

  return (
    <div className="flex flex-col gap-[36px] p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Volver
        </Button>
        <Heading level={1} className="text-foreground">
          Nueva Solicitud de Servicio
        </Heading>
      </div>

      {/* Form Card */}
      <div className="bg-secondary border border-secondary-foreground rounded-[8px] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Selection */}
            <FormSelect
              label="Cliente *"
              value={formData.userId}
              onValueChange={(value) => handleInputChange('userId', value)}
              options={userOptions}
              error={errors.userId}
              placeholder="Seleccionar cliente"
            />

            {/* Service Selection */}
            <FormSelect
              label="Servicio *"
              value={formData.serviceId}
              onValueChange={(value) => handleInputChange('serviceId', value)}
              options={serviceOptions}
              error={errors.serviceId}
              placeholder="Seleccionar servicio"
            />

            {/* Location Selection */}
            <FormSelect
              label="Ubicación *"
              value={formData.locationId}
              onValueChange={(value) => handleInputChange('locationId', value)}
              options={locationOptions}
              error={errors.locationId}
              placeholder="Seleccionar ubicación"
            />

            {/* Execution Date/Time */}
            <FormInput
              label="Fecha y Hora de Ejecución *"
              id="executionDateTime"
              type="datetime-local"
              value={formData.executionDateTime}
              onChange={(e) => handleInputChange('executionDateTime', e.target.value)}
              error={errors.executionDateTime}
            />
          </div>

          {/* Notes (full width) */}
          <FormTextarea
            label="Notas"
            id="note"
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            placeholder="Notas adicionales (opcional)"
            rows={4}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="active"
              disabled={createMutation.isPending}
              iconLeft={<Save className="h-4 w-4" />}
            >
              {createMutation.isPending ? 'Creando...' : 'Crear Solicitud'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
