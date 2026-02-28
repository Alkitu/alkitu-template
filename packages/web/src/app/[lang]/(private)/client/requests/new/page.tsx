'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Briefcase,
  MapPin,
  Calendar,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { useTranslations } from '@/context/TranslationsContext';
import { compressToWebP } from '@/lib/utils/image-compression';
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
import { FormInput } from '@/components/molecules-alianza/FormInput';
import dynamic from 'next/dynamic';
import { Heading } from '@/components/atoms-alianza/Typography';
import { CategorizedServiceSelector } from '@/components/organisms-alianza/CategorizedServiceSelector';

const FormPreview = dynamic(
  () =>
    import('@/components/features/form-builder/organisms/FormPreview').then(
      (mod) => mod.FormPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">Loading form...</p>
      </div>
    ),
  },
);
import type { SelectableService } from '@/components/organisms-alianza/CategorizedServiceSelector';
import { LocationCardMolecule } from '@/components/molecules/location/LocationCardMolecule';
import { LocationFormOrganism } from '@/components/organisms/location/LocationFormOrganism';
import type { FormSettings, WorkLocation } from '@alkitu/shared';

type Step = 1 | 2 | 3 | 4;

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
 * Client Create Request Page - Multi-step wizard
 *
 * Mirrors the admin create request flow but skips the client selection step,
 * since the current user is automatically the client.
 *
 * Step 1: Select Location
 * Step 2: Select Service (categorized + searchable)
 * Step 3: Fill Service Details (dynamic form)
 * Step 4: Select Date/Time
 */
export default function NewRequestWizardPage() {
  const router = useRouter();
  const { lang } = useParams();
  const t = useTranslations('client.requests.create');
  const [step, setStep] = useState<Step>(1);

  // Form state
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
  const [pendingFiles, setPendingFiles] = useState<Record<string, File[]>>({});

  // Get current user (the client themselves)
  const { data: currentUser } = trpc.user.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  // tRPC queries
  const { data: servicesData, isLoading: loadingServices } =
    trpc.service.getAllServices.useQuery();

  const {
    data: locationsData,
    isLoading: loadingLocations,
    refetch: refetchLocations,
  } = trpc.location.getAllLocations.useQuery(
    { userId: currentUser?.id || '' },
    { enabled: !!currentUser?.id },
  );

  const createRequestMutation = (trpc.request.createRequest as any).useMutation(
    {
      onSuccess: async (data: { id: string }) => {
        toast.success(t('success'));

        // Upload pending files to the request's Drive folder (non-blocking)
        const allFiles = Object.values(pendingFiles).flat();
        if (allFiles.length > 0) {
          toast.info(t('step3.uploadingFiles'));
          uploadFilesToRequest(data.id, allFiles).catch(() => {
            toast.error(t('step3.uploadError'));
          });
        }

        router.push(`/${lang}/client/requests`);
      },
      onError: (error: any) => handleApiError(error, router),
    },
  );

  // Upload files to the request's Drive folder via tRPC (stores metadata in request.attachments)
  const uploadFilesMutation = trpc.request.uploadRequestFiles.useMutation();
  const uploadFilesToRequest = async (requestId: string, files: File[]) => {
    // Compress images to WebP before upload
    const processedFiles = await Promise.all(
      files.map((f) => compressToWebP(f)),
    );

    const filePayloads = await Promise.all(
      processedFiles.map(
        (file) =>
          new Promise<{
            name: string;
            data: string;
            mimeType: string;
            size: number;
          }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              resolve({
                name: file.name,
                data: result.split(',')[1],
                mimeType: file.type || 'application/octet-stream',
                size: file.size,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    );
    await uploadFilesMutation.mutateAsync({ requestId, files: filePayloads });
  };

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

  // Step 1: Select Location
  const handleLocationCardSelect = (location: WorkLocation) => {
    setSelectedLocation({
      id: location.id,
      address: `${location.street}, ${location.city}`,
    });
  };

  const handleLocationCreated = async (location: WorkLocation) => {
    setShowCreateLocationForm(false);
    toast.success(t('step1.addLocationSuccess'));
    await refetchLocations();
    setSelectedLocation({
      id: location.id,
      address: `${location.street}, ${location.city}`,
    });
  };

  const handleStep1Next = () => {
    if (!selectedLocation) {
      toast.error(t('step1.required'));
      return;
    }
    setStep(2);
  };

  // Step 2: Select Service (categorized)
  const handleServiceSelect = (service: SelectableService) => {
    setSelectedService({
      id: service.id,
      name: service.name,
      description: service.description,
      formSettings: service.formSettings,
    });
  };

  const handleStep2Next = () => {
    if (!selectedService) {
      toast.error(t('step2.required'));
      return;
    }
    setStep(3);
  };

  // Step 3: Fill Template
  const handleTemplateSubmit = (data: Record<string, unknown>) => {
    setTemplateResponses(data);
    setStep(4);
  };

  // Step 4: Date/Time and Final Submit
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executionDate || !executionTime) {
      toast.error(t('step4.dateTimeRequired'));
      return;
    }

    const executionDateString = format(executionDate, 'yyyy-MM-dd');
    const executionDateTime = new Date(
      `${executionDateString}T${executionTime}`,
    );

    if (executionDateTime < new Date()) {
      toast.error(t('step4.futureRequired'));
      return;
    }

    try {
      await createRequestMutation.mutateAsync({
        userId: currentUser!.id,
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
      if (step === 2) {
        // Going back from Service to Location — clear service selection
        setSelectedService(null);
        setTemplateResponses({});
      }
      if (step === 3) {
        // Going back from Details to Service — clear template responses
        setTemplateResponses({});
      }
      setStep(prevStep);
    } else {
      router.push(`/${lang}/client/requests`);
    }
  };

  // Step indicators — Location, Service, Details, Date/Time (no Client step)
  const steps = [
    { number: 1, label: t('steps.location'), icon: MapPin },
    { number: 2, label: t('steps.service'), icon: Briefcase },
    { number: 3, label: t('steps.details'), icon: Briefcase },
    { number: 4, label: t('steps.dateTime'), icon: Calendar },
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

      {/* Step 1: Select Location */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step1.title')}</CardTitle>
            <CardDescription>{t('step1.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location cards */}
            {loadingLocations || !currentUser ? (
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
                {locationsData.items.map((loc) => {
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
                  {t('step1.noLocations')}
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
                  userId={currentUser?.id}
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
                {t('step1.addLocation')}
              </Button>
            )}

            <div className="flex justify-end pt-4">
              <Button onClick={handleStep1Next} disabled={!selectedLocation}>
                {t('step1.next')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Service (categorized) */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step2.title')}</CardTitle>
            <CardDescription>{t('step2.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg mb-4">
              <p className="text-sm">
                <strong>{t('labels.location')}</strong>{' '}
                {selectedLocation?.address}
              </p>
            </div>

            <CategorizedServiceSelector
              services={selectableServices}
              selectedServiceId={selectedService?.id || null}
              onServiceSelect={handleServiceSelect}
              isLoading={loadingServices}
              searchPlaceholder={t('step2.searchPlaceholder')}
              noResultsText={t('step2.noResults')}
              emptyText={t('step2.empty')}
            />

            {selectedService && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>{t('step2.selected')}</strong> {selectedService.name}
                </p>
                {selectedService.formSettings && (
                  <Badge variant="outline" className="mt-2">
                    {selectedService.formSettings.fields.length}{' '}
                    {t('step2.fieldsInForm')}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>
              <Button onClick={handleStep2Next} disabled={!selectedService}>
                {t('step2.next')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Fill Template */}
      {step === 3 && selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step3.title')}</CardTitle>
            <CardDescription>
              {t('step3.description')} {selectedService.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg mb-6">
              <p className="text-sm">
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
                submitButtonText={t('step3.submitText')}
                hideHeader
                onFilesChanged={setPendingFiles}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t('step3.noCustomFields')}
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('back')}
                  </Button>
                  <Button onClick={() => setStep(4)}>
                    {t('step3.nextDateTime')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Date/Time and Submit */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step4.title')}</CardTitle>
            <CardDescription>{t('step4.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm mb-2">
                  <strong>{t('step4.summary')}</strong>
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>
                    {t('labels.location')} {selectedLocation?.address}
                  </li>
                  <li>
                    {t('labels.service')} {selectedService?.name}
                  </li>
                  {Object.keys(templateResponses).length > 0 && (
                    <li>
                      {t('step4.fieldsCompleted')}{' '}
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
                    t('step4.creating')
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('step4.submit')}
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
