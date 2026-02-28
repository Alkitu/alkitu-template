'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  MapPin,
  Calendar,
  ClipboardCheck,
  Plus,
  CheckCircle2,
  FileText,
  Paperclip,
  Clock,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { useTranslations } from '@/context/TranslationsContext';
import { compressToWebP } from '@/lib/utils/image-compression';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
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
import dynamic from 'next/dynamic';
import { Heading } from '@/components/atoms-alianza/Typography';
import { CategorizedServiceSelector } from '@/components/organisms-alianza/CategorizedServiceSelector';
import { ProgressBar } from '@/components/atoms-alianza/ProgressBar';
import { FormResponsesPreview } from '@/components/features/form-builder/organisms/FormResponsesPreview';

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

type Step = 1 | 2 | 3 | 4 | 5;

type SubmissionPhase = 'idle' | 'creating' | 'uploading' | 'done';

interface SelectedService {
  id: string;
  name: string;
  description?: string;
  formSettings?: FormSettings;
  categoryName?: string;
}

/**
 * Client Create Request Page - Multi-step wizard
 *
 * Step 1: Select Location
 * Step 2: Select Service (categorized + searchable)
 * Step 3: Fill Service Details (dynamic form)
 * Step 4: Select Date/Time
 * Step 5: Summary + Confirm
 */
export default function NewRequestWizardPage() {
  const router = useRouter();
  const { lang } = useParams();
  const t = useTranslations('client.requests.create');
  const [step, setStep] = useState<Step>(1);

  // Form state
  const [selectedLocation, setSelectedLocation] =
    useState<WorkLocation | null>(null);
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

  // Submission state
  const [submissionPhase, setSubmissionPhase] =
    useState<SubmissionPhase>('idle');
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);
  const [createdRequestCustomId, setCreatedRequestCustomId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState('');

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

  const createRequestMutation = (
    trpc.request.createRequest as any
  ).useMutation({
    onError: (error: any) => handleApiError(error, router),
  });

  // Upload files to the request's Drive folder via tRPC
  const uploadFilesMutation = trpc.request.uploadRequestFiles.useMutation();
  const uploadFilesToRequest = async (requestId: string, files: File[]) => {
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

  // Transform services into SelectableService[]
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

  // Collect all pending files for display
  const allPendingFiles = useMemo(
    () => Object.values(pendingFiles).flat(),
    [pendingFiles],
  );

  // Build execution datetime for display
  const executionDateTime = useMemo(() => {
    if (!executionDate || !executionTime) return null;
    const dateStr = format(executionDate, 'yyyy-MM-dd');
    return new Date(`${dateStr}T${executionTime}`);
  }, [executionDate, executionTime]);

  // Step 1: Select Location
  const handleLocationCardSelect = (location: WorkLocation) => {
    setSelectedLocation(location);
  };

  const handleLocationCreated = async (location: WorkLocation) => {
    setShowCreateLocationForm(false);
    toast.success(t('step1.addLocationSuccess'));
    await refetchLocations();
    setSelectedLocation(location);
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
      categoryName: service.categoryName,
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

  // Step 4: Date/Time → go to summary
  const handleStep4Next = () => {
    if (!executionDate || !executionTime) {
      toast.error(t('step4.dateTimeRequired'));
      return;
    }

    const dateStr = format(executionDate, 'yyyy-MM-dd');
    const dt = new Date(`${dateStr}T${executionTime}`);

    if (dt < new Date()) {
      toast.error(t('step4.futureRequired'));
      return;
    }

    setStep(5);
  };

  // Step 5: Confirm and submit
  const handleConfirmSubmit = async () => {
    if (!executionDate || !executionTime) return;

    const executionDateString = format(executionDate, 'yyyy-MM-dd');
    const dt = new Date(`${executionDateString}T${executionTime}`);

    try {
      setSubmissionPhase('creating');

      const data = await createRequestMutation.mutateAsync({
        userId: currentUser!.id,
        serviceId: selectedService!.id,
        locationId: selectedLocation!.id,
        executionDateTime: dt.toISOString(),
        templateResponses,
        note: undefined,
      });

      setCreatedRequestId(data.id);
      setCreatedRequestCustomId(data.customId || data.id);

      // Upload pending files
      const files = Object.values(pendingFiles).flat();
      if (files.length > 0) {
        setSubmissionPhase('uploading');
        setUploadProgress(t('step5.compressingImages'));

        try {
          setUploadProgress(t('step5.uploadingFiles'));
          await uploadFilesToRequest(data.id, files);
        } catch {
          toast.error(t('step5.uploadError'));
        }
      }

      setSubmissionPhase('done');
    } catch {
      // Error handled by mutation onError callback
      setSubmissionPhase('idle');
    }
  };

  const handleBack = () => {
    // Block navigation during submission
    if (submissionPhase !== 'idle') return;

    if (step > 1) {
      const prevStep = (step - 1) as Step;
      if (step === 2) {
        setSelectedService(null);
        setTemplateResponses({});
      }
      if (step === 3) {
        setTemplateResponses({});
      }
      setStep(prevStep);
    } else {
      router.push(`/${lang}/client/requests`);
    }
  };

  // Step indicators
  const steps = [
    { number: 1, label: t('steps.location'), icon: MapPin },
    { number: 2, label: t('steps.service'), icon: Briefcase },
    { number: 3, label: t('steps.details'), icon: Briefcase },
    { number: 4, label: t('steps.dateTime'), icon: Calendar },
    { number: 5, label: t('steps.summary'), icon: ClipboardCheck },
  ];

  const dateLocale = (lang as string) === 'es' ? es : enUS;

  // ── Inline success / progress view ──
  if (submissionPhase !== 'idle') {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-lg w-full">
            <Card className="p-8 text-center">
              {/* Creating phase */}
              {submissionPhase === 'creating' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {t('step5.phaseCreating')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t('step5.phaseCreatingDesc')}
                    </p>
                  </div>
                  <ProgressBar value={40} animated variant="default" />
                </div>
              )}

              {/* Uploading phase */}
              {submissionPhase === 'uploading' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {t('step5.phaseUploading')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {uploadProgress || t('step5.phaseUploadingDesc')}
                    </p>
                  </div>
                  <ProgressBar value={75} animated variant="default" />
                </div>
              )}

              {/* Done phase */}
              {submissionPhase === 'done' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="h-20 w-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {t('step5.successTitle')}
                    </h2>
                    <p className="text-muted-foreground">
                      {t('step5.successDescription')}
                    </p>
                  </div>

                  {createdRequestCustomId && (
                    <p className="text-lg font-medium">
                      {t('step5.requestId')}:{' '}
                      <span className="text-primary">{createdRequestCustomId}</span>
                    </p>
                  )}

                  {/* What's next */}
                  <div className="bg-muted/50 rounded-lg p-5 text-left">
                    <h3 className="font-semibold mb-3">
                      {t('step5.whatsNext')}
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span>{t('step5.nextStep1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span>{t('step5.nextStep2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span>{t('step5.nextStep3')}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    {createdRequestId && (
                      <Button
                        onClick={() =>
                          router.push(
                            `/${lang}/client/requests/${createdRequestId}`,
                          )
                        }
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {t('step5.viewRequest')}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/${lang}/client/requests`)
                      }
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t('step5.backToRequests')}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ── Main wizard view ──
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
                    className={`text-xs hidden sm:block ${isActive ? 'font-semibold' : 'text-muted-foreground'}`}
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
                {selectedLocation
                  ? `${selectedLocation.street}, ${selectedLocation.city}`
                  : ''}
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
                {selectedLocation
                  ? `${selectedLocation.street}, ${selectedLocation.city}`
                  : ''}{' '}
                | <strong>{t('labels.service')}</strong> {selectedService.name}
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

      {/* Step 4: Date/Time */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step4.title')}</CardTitle>
            <CardDescription>{t('step4.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                onClick={handleStep4Next}
                disabled={!executionDate || !executionTime}
              >
                {t('step4.next')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Summary + Confirm */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step5.title')}</CardTitle>
            <CardDescription>{t('step5.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {t('step5.locationSection')}
              </div>
              {selectedLocation && (
                <LocationCardMolecule
                  location={selectedLocation}
                  showEdit={false}
                  showDelete={false}
                />
              )}
            </div>

            <hr className="border-border" />

            {/* Service Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {t('step5.serviceSection')}
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{selectedService?.name}</p>
                {selectedService?.categoryName && (
                  <Badge variant="outline" className="mt-1">
                    {selectedService.categoryName}
                  </Badge>
                )}
              </div>
            </div>

            <hr className="border-border" />

            {/* Form Responses Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <ClipboardCheck className="h-4 w-4" />
                {t('step5.formResponsesSection')}
              </div>
              {selectedService?.formSettings &&
              Object.keys(templateResponses).length > 0 ? (
                <div className="p-3 rounded-lg bg-muted/50">
                  <FormResponsesPreview
                    formSettings={selectedService.formSettings}
                    responses={templateResponses}
                    locale={(lang as 'en' | 'es') || 'es'}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground pl-6">
                  {t('step5.noFormResponses')}
                </p>
              )}
            </div>

            <hr className="border-border" />

            {/* Attachments Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Paperclip className="h-4 w-4" />
                {t('step5.attachments')}
                {allPendingFiles.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {allPendingFiles.length} {t('step5.attachmentsCount')}
                  </Badge>
                )}
              </div>
              {allPendingFiles.length > 0 ? (
                <div className="space-y-1 pl-6">
                  {allPendingFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm"
                    >
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-muted-foreground text-xs shrink-0">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground pl-6">
                  {t('step5.noAttachments')}
                </p>
              )}
            </div>

            <hr className="border-border" />

            {/* Date/Time Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock className="h-4 w-4" />
                {t('step5.dateTimeSection')}
              </div>
              {executionDateTime && (
                <p className="text-sm pl-6">
                  {format(executionDateTime, "d 'de' MMMM 'de' yyyy", {
                    locale: dateLocale,
                  })}{' '}
                  {t('step5.at')}{' '}
                  {format(executionDateTime, 'HH:mm', {
                    locale: dateLocale,
                  })}
                </p>
              )}
            </div>

            <hr className="border-border" />

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>
              <Button variant="active" onClick={handleConfirmSubmit}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {t('step5.confirm')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
