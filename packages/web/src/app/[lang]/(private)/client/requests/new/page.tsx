'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/primitives/Card';
import { Button } from '@/components/primitives/Button';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  MapPin,
  FileText,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ServiceListItem } from '@alkitu/shared/types/service';
import type { WorkLocation } from '@alkitu/shared/types/location';

/**
 * Request Creation Wizard - CLIENT Role
 *
 * Multi-step wizard for creating service requests:
 * Step 1: Select service
 * Step 2: Fill request form (dynamic fields based on service)
 * Step 3: Select work location
 * Step 4: Review and confirm
 */

type WizardStep = 1 | 2 | 3 | 4;

interface RequestFormData {
  serviceId: string | null;
  serviceName: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  locationId: string | null;
  locationName: string;
}

export default function NewRequestWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<RequestFormData>({
    serviceId: null,
    serviceName: '',
    title: '',
    description: '',
    priority: 'MEDIUM',
    locationId: null,
    locationName: '',
  });

  // API data states
  const [services, setServices] = useState<ServiceListItem[]>([]);
  const [locations, setLocations] = useState<WorkLocation[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      setError(null);
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Error al cargar los servicios. Por favor, recarga la página.');
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch locations when reaching step 3
  useEffect(() => {
    if (currentStep === 3 && locations.length === 0) {
      const fetchLocations = async () => {
        setIsLoadingLocations(true);
        setError(null);
        try {
          const response = await fetch('/api/locations');
          if (!response.ok) throw new Error('Failed to fetch locations');
          const data = await response.json();
          setLocations(data);
        } catch (err) {
          console.error('Error fetching locations:', err);
          setError('Error al cargar las ubicaciones. Por favor, intenta nuevamente.');
        } finally {
          setIsLoadingLocations(false);
        }
      };
      fetchLocations();
    }
  }, [currentStep, locations.length]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Default execution date to tomorrow at 9 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          locationId: formData.locationId,
          executionDateTime: tomorrow.toISOString(),
          templateResponses: {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create request');
      }

      const data = await response.json();
      // Redirect to success page with requestId
      router.push(`/client/requests/new/success?requestId=${data.id}`);
    } catch (err) {
      console.error('Error creating request:', err);
      setError(err instanceof Error ? err.message : 'Error al crear la solicitud. Por favor, intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.serviceId !== null;
      case 2:
        return formData.title.trim() !== '' && formData.description.trim() !== '';
      case 3:
        return formData.locationId !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Servicio', icon: ClipboardList },
      { number: 2, label: 'Detalles', icon: FileText },
      { number: 3, label: 'Ubicación', icon: MapPin },
      { number: 4, label: 'Confirmar', icon: Check },
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  currentStep >= step.number
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <p
                className={`text-sm mt-2 ${
                  currentStep >= step.number
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 transition-colors ${
                  currentStep > step.number ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Selecciona un Servicio</h2>
      <p className="text-muted-foreground mb-6">
        Elige el tipo de servicio que necesitas solicitar
      </p>

      {isLoadingServices ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando servicios...</p>
        </div>
      ) : services.length === 0 ? (
        <Card className="p-12 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay servicios disponibles</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              data-testid="service-card"
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                formData.serviceId === service.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-muted'
              }`}
              onClick={() =>
                setFormData({ ...formData, serviceId: service.id, serviceName: service.name })
              }
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{service.name}</h3>
                  {service.category && (
                    <p className="text-sm text-muted-foreground">
                      {service.category.name}
                    </p>
                  )}
                </div>
                {formData.serviceId === service.id && (
                  <Check className="h-5 w-5 text-primary shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Detalles de la Solicitud</h2>
      <p className="text-muted-foreground mb-6">
        Proporciona los detalles específicos de tu solicitud
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Título de la Solicitud *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Reparación de aire acondicionado"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Descripción Detallada *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe el problema o servicio que necesitas..."
            rows={6}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prioridad</label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as RequestFormData['priority'],
              })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    // Helper to format full address from WorkLocation
    const formatAddress = (loc: WorkLocation) => {
      const parts = [loc.street];
      if (loc.building) parts.push(`Edificio ${loc.building}`);
      if (loc.tower) parts.push(`Torre ${loc.tower}`);
      if (loc.floor) parts.push(`Piso ${loc.floor}`);
      if (loc.unit) parts.push(`Unidad ${loc.unit}`);
      parts.push(`${loc.city}, ${loc.state} ${loc.zip}`);
      return parts.join(', ');
    };

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Ubicación del Servicio</h2>
        <p className="text-muted-foreground mb-6">
          Selecciona dónde se realizará el servicio
        </p>

        {isLoadingLocations ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando ubicaciones...</p>
          </div>
        ) : locations.length === 0 ? (
          <Card className="p-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No tienes ubicaciones registradas</p>
            <Button
              variant="outline"
              onClick={() => router.push('/locations')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Agregar Primera Ubicación
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {locations.map((location) => (
                <Card
                  key={location.id}
                  data-testid="location-card"
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    formData.locationId === location.id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-muted'
                  }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      locationId: location.id,
                      locationName: `${location.street}, ${location.city}`,
                    })
                  }
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{location.street}</h3>
                      <p className="text-sm text-muted-foreground">{formatAddress(location)}</p>
                    </div>
                    {formData.locationId === location.id && (
                      <Check className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/locations')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Agregar Nueva Ubicación
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Confirmar Solicitud</h2>
      <p className="text-muted-foreground mb-6">
        Revisa los detalles antes de enviar tu solicitud
      </p>

      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
            SERVICIO
          </h3>
          <p className="text-lg font-medium">{formData.serviceName}</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
            DETALLES
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Título</p>
              <p className="font-medium">{formData.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Descripción</p>
              <p className="text-sm">{formData.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prioridad</p>
              <p className="font-medium">
                {formData.priority === 'LOW' && 'Baja'}
                {formData.priority === 'MEDIUM' && 'Media'}
                {formData.priority === 'HIGH' && 'Alta'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
            UBICACIÓN
          </h3>
          <p className="font-medium">{formData.locationName}</p>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Nueva Solicitud</h1>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 border-destructive bg-destructive/10">
            <p className="text-destructive text-sm">{error}</p>
          </Card>
        )}

        {/* Step Content */}
        <Card className="p-8 mb-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          {currentStep < 4 ? (
            <Button onClick={handleNext} disabled={!isStepValid() || isSubmitting}>
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStepValid() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Creando solicitud...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
