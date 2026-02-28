'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  User,
  Briefcase,
  MapPin,
  Calendar,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { useTranslations } from '@/context/TranslationsContext';
import { format } from 'date-fns';
import { CalendarAppointment } from '@/components/shadcn-studio/calendar/calendar-appointment';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/primitives/Card';
import { Badge } from '@/components/primitives/ui/badge';
import { Button } from '@/components/molecules-alianza/Button';
import { FormSelect } from '@/components/molecules-alianza/FormSelect';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { Heading } from '@/components/atoms-alianza/Typography';
import { FormPreview } from '@/components/features/form-builder/organisms/FormPreview';
import { CategorizedServiceSelector } from '@/components/organisms-alianza/CategorizedServiceSelector';
import type { SelectableService } from '@/components/organisms-alianza/CategorizedServiceSelector';
import { LocationCardMolecule } from '@/components/molecules/location/LocationCardMolecule';
import { LocationFormOrganism } from '@/components/organisms/location/LocationFormOrganism';
import type { FormSettings, WorkLocation } from '@alkitu/shared';

type Step = 1 | 2 | 3 | 4 | 5;

interface SelectedClient {
  id: string;
  name: string;
  email: string;
}

interface SelectedService {
  id: string;
  name: string;
  description?: string;
  formSettings?: FormSettings;
}

interface SelectedLocation {
  id: string;
  address: string;
}

/**
 * Admin Create Request Page - Multi-step wizard
 *
 * Step 1: Select Client
 * Step 2: Select Location
 * Step 3: Select Service (categorized + searchable)
 * Step 4: Fill Service Details (dynamic form)
 * Step 5: Select Date/Time
 */
export default function AdminCreateRequestPage() {
  const router = useRouter();
  const { lang } = useParams();
  const t = useTranslations('admin.requests.create');
  const [step, setStep] = useState<Step>(1);

  // Form state
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(
    null,
  );
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [selectedService, setSelectedService] =
    useState<SelectedService | null>(null);
  const [templateResponses, setTemplateResponses] = useState<
    Record<string, unknown>
  >({});
  const [executionDate, setExecutionDate] = useState<Date | undefined>(
    undefined,
  );
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [showCreateLocationForm, setShowCreateLocationForm] = useState(false);

  // tRPC queries
  const { data: usersData, isLoading: loadingUsers } =
    trpc.user.getFilteredUsers.useQuery({
      page: 1,
      limit: 100,
      role: 'CLIENT',
      sortBy: 'firstname',
      sortOrder: 'asc',
    });

  const { data: servicesData, isLoading: loadingServices } =
    trpc.service.getAllServices.useQuery();

  const {
    data: locationsData,
    isLoading: loadingLocations,
    refetch: refetchLocations,
  } = trpc.location.getAllLocations.useQuery(
    { userId: selectedClient?.id || '' },
    { enabled: !!selectedClient },
  );

  const createRequestMutation = (trpc.request.createRequest as any).useMutation(
    {
      onSuccess: () => {
        toast.success(t('success'));
        router.push(`/${lang}/admin/requests`);
      },
      onError: (error: any) => handleApiError(error, router),
    },
  );

  // Transform services into SelectableService[] for the CategorizedServiceSelector
  const selectableServices: SelectableService[] = useMemo(() => {
    if (!servicesData?.items) return [];
    return servicesData.items.map((service: any) => {
      const firstTemplate = service.formTemplates?.[0];
      const rawSettings = firstTemplate?.formSettings as unknown as
        | FormSettings
        | undefined;
      const formSettings: FormSettings | undefined =
        rawSettings?.fields && rawSettings.fields.length > 0
          ? rawSettings
          : undefined;

      return {
        id: service.id,
        name: service.name,
        description: service.description,
        thumbnail: service.thumbnail,
        iconColor: service.iconColor,
        categoryId: service.category?.id || 'uncategorized',
        categoryName: service.category?.name || 'Other',
        formSettings,
        fieldCount: service.fieldCount ?? 0,
      };
    });
  }, [servicesData]);

  // Step 1: Select Client
  const handleClientSelect = (clientId: string) => {
    const client = usersData?.users.find((u: any) => u.id === clientId);
    if (client) {
      setSelectedClient({
        id: client.id,
        name: `${client.firstname} ${client.lastname}`,
        email: client.email,
      });
    }
  };

  const handleStep1Next = () => {
    if (!selectedClient) {
      toast.error(t('step1.required'));
      return;
    }
    setStep(2);
  };

  // Step 2: Select Location
  const handleLocationCardSelect = (location: WorkLocation) => {
    setSelectedLocation({
      id: location.id,
      address: `${location.street}, ${location.city}`,
    });
  };

  const handleLocationCreated = async (location: WorkLocation) => {
    setShowCreateLocationForm(false);
    toast.success(t('step2.addLocationSuccess'));
    await refetchLocations();
    setSelectedLocation({
      id: location.id,
      address: `${location.street}, ${location.city}`,
    });
  };

  const handleStep2Next = () => {
    if (!selectedLocation) {
      toast.error(t('step2.required'));
      return;
    }
    setStep(3);
  };

  // Step 3: Select Service (categorized)
  const handleServiceSelect = (service: SelectableService) => {
    setSelectedService({
      id: service.id,
      name: service.name,
      description: service.description,
      formSettings: service.formSettings,
    });
  };

  const handleStep3Next = () => {
    if (!selectedService) {
      toast.error(t('step3.required'));
      return;
    }
    setStep(4);
  };

  // Step 4: Fill Template
  const handleTemplateSubmit = (data: Record<string, unknown>) => {
    setTemplateResponses(data);
    setStep(5);
  };

  // Step 5: Date/Time and Final Submit
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executionDate || !executionTime) {
      toast.error(t('step5.dateTimeRequired'));
      return;
    }

    const executionDateString = format(executionDate, 'yyyy-MM-dd');
    const executionDateTime = new Date(
      `${executionDateString}T${executionTime}`,
    );

    if (executionDateTime < new Date()) {
      toast.error(t('step5.futureRequired'));
      return;
    }

    try {
      await createRequestMutation.mutateAsync({
        userId: selectedClient!.id,
        serviceId: selectedService!.id,
        locationId: selectedLocation!.id,
        executionDateTime: executionDateTime.toISOString(),
        templateResponses,
        note: undefined,
      });
    } catch (error) {
      // Error handled by mutation callbacks
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const prevStep = (step - 1) as Step;
      // Clear dependent state when going back
      if (step === 3) {
        // Going back from Service to Location — clear service selection
        setSelectedService(null);
        setTemplateResponses({});
      }
      if (step === 4) {
        // Going back from Details to Service — clear template responses
        setTemplateResponses({});
      }
      setStep(prevStep);
    } else {
      router.push(`/${lang}/admin/requests`);
    }
  };

  // Step indicators — new order: Client, Location, Service, Details, Date/Time
  const steps = [
    { number: 1, label: t('steps.client'), icon: User },
    { number: 2, label: t('steps.location'), icon: MapPin },
    { number: 3, label: t('steps.service'), icon: Briefcase },
    { number: 4, label: t('steps.details'), icon: Briefcase },
    { number: 5, label: t('steps.dateTime'), icon: Calendar },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          {t('back')}
        </Button>
        <Heading level={1} className="text-foreground">
          {t('title')}
        </Heading>
      </div>

      {/* Step Indicators */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = step === s.number;
            const isCompleted = step > s.number;

            return (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full
                      ${isActive ? 'bg-primary text-primary-foreground' : ''}
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-xs ${isActive ? 'font-semibold' : 'text-muted-foreground'}`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 ${isCompleted ? 'bg-green-500' : 'bg-border'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      {/* Step 1: Select Client */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step1.title')}</CardTitle>
            <CardDescription>{t('step1.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormSelect
              label={t('step1.label')}
              value={selectedClient?.id || ''}
              onValueChange={handleClientSelect}
              options={
                usersData?.users.map((user: any) => ({
                  value: user.id,
                  label: `${user.firstname} ${user.lastname} (${user.email})`,
                })) || []
              }
              placeholder={
                loadingUsers ? t('step1.loading') : t('step1.placeholder')
              }
              disabled={loadingUsers}
            />

            {selectedClient && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>{t('step1.selected')}</strong> {selectedClient.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedClient.email}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button onClick={handleStep1Next} disabled={!selectedClient}>
                {t('step1.next')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Location */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step2.title')}</CardTitle>
            <CardDescription>{t('step2.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg mb-4">
              <p className="text-sm">
                <strong>{t('labels.client')}</strong> {selectedClient?.name}
              </p>
            </div>

            {/* Location cards */}
            {loadingLocations ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : locationsData?.items && locationsData.items.length > 0 ? (
              <div className="space-y-3">
                {locationsData.items.map((loc: any) => {
                  const location = loc as unknown as WorkLocation;
                  return (
                    <div
                      key={location.id}
                      onClick={() => handleLocationCardSelect(location)}
                      className={`cursor-pointer rounded-lg transition-all ${
                        selectedLocation?.id === location.id
                          ? 'ring-2 ring-primary ring-offset-2'
                          : 'hover:ring-1 hover:ring-primary/30'
                      }`}
                    >
                      <LocationCardMolecule
                        location={location}
                        showEdit={false}
                        showDelete={false}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  {t('step2.noLocations')}
                </p>
              </div>
            )}

            {/* Add Location Inline */}
            {showCreateLocationForm ? (
              <div className="rounded-lg border border-dashed border-primary/30 bg-muted/30 p-4">
                <LocationFormOrganism
                  onSuccess={handleLocationCreated}
                  onCancel={() => setShowCreateLocationForm(false)}
                  showCancel
                  userId={selectedClient?.id}
                />
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateLocationForm(true)}
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('step2.addLocation')}
              </Button>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>
              <Button onClick={handleStep2Next} disabled={!selectedLocation}>
                {t('step2.next')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Service (categorized) */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step3.title')}</CardTitle>
            <CardDescription>{t('step3.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg mb-4">
              <p className="text-sm">
                <strong>{t('labels.client')}</strong> {selectedClient?.name} |{' '}
                <strong>{t('labels.location')}</strong>{' '}
                {selectedLocation?.address}
              </p>
            </div>

            <CategorizedServiceSelector
              services={selectableServices}
              selectedServiceId={selectedService?.id || null}
              onServiceSelect={handleServiceSelect}
              isLoading={loadingServices}
              searchPlaceholder={t('step3.searchPlaceholder')}
              noResultsText={t('step3.noResults')}
              emptyText={t('step3.empty')}
            />

            {selectedService && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>{t('step3.selected')}</strong> {selectedService.name}
                </p>
                {selectedService.formSettings && (
                  <Badge variant="outline" className="mt-2">
                    {selectedService.formSettings.fields.length}{' '}
                    {t('step3.fieldsInForm')}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>
              <Button onClick={handleStep3Next} disabled={!selectedService}>
                {t('step3.next')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Fill Template */}
      {step === 4 && selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step4.title')}</CardTitle>
            <CardDescription>
              {t('step4.description')} {selectedService.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg mb-6">
              <p className="text-sm">
                <strong>{t('labels.client')}</strong> {selectedClient?.name} |{' '}
                <strong>{t('labels.location')}</strong>{' '}
                {selectedLocation?.address} |{' '}
                <strong>{t('labels.service')}</strong> {selectedService.name}
              </p>
            </div>

            {selectedService.formSettings ? (
              <FormPreview
                formSettings={selectedService.formSettings}
                onSubmit={handleTemplateSubmit}
                onCancel={handleBack}
                submitButtonText={t('step4.submitText')}
                hideHeader
              />
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t('step4.noCustomFields')}
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('back')}
                  </Button>
                  <Button onClick={() => setStep(5)}>
                    {t('step4.nextDateTime')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Date/Time and Submit */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step5.title')}</CardTitle>
            <CardDescription>{t('step5.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm mb-2">
                  <strong>{t('step5.summary')}</strong>
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>
                    {t('labels.client')} {selectedClient?.name}
                  </li>
                  <li>
                    {t('labels.location')} {selectedLocation?.address}
                  </li>
                  <li>
                    {t('labels.service')} {selectedService?.name}
                  </li>
                  {Object.keys(templateResponses).length > 0 && (
                    <li>
                      {t('step5.fieldsCompleted')}{' '}
                      {Object.keys(templateResponses).length}
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex justify-center py-4">
                <CalendarAppointment
                  date={executionDate}
                  setDate={setExecutionDate}
                  time={executionTime}
                  setTime={setExecutionTime}
                  lang={lang as 'en' | 'es'}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('back')}
                </Button>
                <Button
                  type="submit"
                  variant="active"
                  disabled={
                    createRequestMutation.isPending ||
                    !executionDate ||
                    !executionTime
                  }
                >
                  {createRequestMutation.isPending ? (
                    t('step5.creating')
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('step5.submit')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
