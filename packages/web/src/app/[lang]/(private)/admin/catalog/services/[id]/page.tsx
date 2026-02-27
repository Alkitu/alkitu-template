'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { ArrowLeft, ArrowRight, Save, Trash2, Power, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/primitives/Card';
import { Button } from '@/components/molecules-alianza/Button';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { FormSelect } from '@/components/molecules-alianza/FormSelect';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';
import { IconSelector } from '@/components/primitives/ui/icon-selector';
import { Button as PrimitiveButton } from '@/components/primitives/ui/button';
import { MapPin } from 'lucide-react';
import { Icons } from '@/lib/icons';
import { ServiceIcon } from '@/components/atoms-alianza/ServiceIcon';
import type { FormSettings } from '@alkitu/shared';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/primitives/ui/badge';
import { Switch } from '@/components/primitives/ui/switch';
import { Label } from '@/components/primitives/ui/label';

import { LocationColorPicker } from '@/components/molecules/location/LocationColorPicker';
import { getDynamicBackgroundColor } from '@/lib/utils/color';

type Step = 'basic' | 'template';

interface BasicServiceData {
  name: string;
  categoryId: string;
  isActive: boolean;
  thumbnail: string;
  iconColor: string;
  code: string;
}

/** Recursively count actual question fields (not groups) */
function countFields(fields: any[]): number {
  return fields.reduce((count, field) => {
    if (field.type === 'group' && field.groupOptions?.fields) {
      return count + countFields(field.groupOptions.fields);
    }
    return count + 1;
  }, 0);
}

const defaultFormSettings: FormSettings = {
  title: '',
  description: '',
  fields: [],
  submitButtonText: 'Submit',
  showStepNumbers: true,
  supportedLocales: ['en', 'es'],
  defaultLocale: 'en',
};

export default function EditServicePage() {
  const router = useRouter();
  const { lang, id } = useParams();
  const serviceId = id as string;

  const [step, setStep] = useState<Step>('basic');
  const [basicData, setBasicData] = useState<BasicServiceData>({
    name: '',
    categoryId: '',
    isActive: true,
    thumbnail: '',
    iconColor: '#000000',
    code: '',
  });
  const [formSettings, setFormSettings] = useState<FormSettings>(defaultFormSettings);
  const [formTemplateId, setFormTemplateId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialBasicData, setInitialBasicData] = useState<BasicServiceData | null>(null);
  const [initialFormSettingsJson, setInitialFormSettingsJson] = useState<string>('');
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [serviceDriveFolderId, setServiceDriveFolderId] = useState<string | null>(null);

  // tRPC queries
  const { data: service, isLoading: loadingService } = trpc.service.getServiceById.useQuery(
    { id: serviceId },
    { enabled: !!serviceId }
  );
  const { data: categories, isLoading: loadingCategories } = trpc.category.getAllCategories.useQuery();

  // tRPC mutations
  const updateServiceMutation = trpc.service.updateService.useMutation();
  const updateFormTemplateMutation = trpc.formTemplate.update.useMutation();
  const createFormTemplateMutation = trpc.formTemplate.create.useMutation();
  const deleteServiceMutation = trpc.service.deleteService.useMutation();
  const ensureFolderMutation = trpc.service.ensureServiceDriveFolder.useMutation();

  // Lazy-create Drive folder for this service
  useEffect(() => {
    if (!service || !(service as any).code) return;

    // If service already has a driveFolderId, use it directly
    if ((service as any).driveFolderId) {
      setServiceDriveFolderId((service as any).driveFolderId);
      return;
    }

    // Otherwise, create one via the API
    ensureFolderMutation.mutate(
      { serviceId },
      {
        onSuccess: (data) => setServiceDriveFolderId(data.folderId),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, serviceId]);

  // Initialize form data when BOTH service and categories are loaded
  useEffect(() => {
    if (service && categories && !isInitialized) {
      const initial: BasicServiceData = {
        name: service.name,
        categoryId: service.categoryId,
        isActive: !service.deletedAt,
        thumbnail: (service as any).thumbnail || '',
        iconColor: (service as any).iconColor || '#000000',
        code: (service as any).code || '',
      };
      setBasicData(initial);
      setInitialBasicData(initial);

      // Load form template if the service has one
      let loadedFormSettings = defaultFormSettings;
      const templates = (service as any).formTemplates;
      if (templates && templates.length > 0) {
        const template = templates[0];
        setFormTemplateId(template.id);
        if (template.formSettings) {
          loadedFormSettings = template.formSettings as FormSettings;
          setFormSettings(loadedFormSettings);
        }
      }
      setInitialFormSettingsJson(JSON.stringify(loadedFormSettings));

      setIsInitialized(true);
    }
  }, [service, categories, isInitialized]);

  // Detect if basic data has changed from initial values
  const hasBasicChanges = useMemo(() => {
    if (!initialBasicData) return false;
    return (
      basicData.name !== initialBasicData.name ||
      basicData.categoryId !== initialBasicData.categoryId ||
      basicData.isActive !== initialBasicData.isActive ||
      basicData.thumbnail !== initialBasicData.thumbnail ||
      basicData.iconColor !== initialBasicData.iconColor ||
      basicData.code !== initialBasicData.code
    );
  }, [basicData, initialBasicData]);

  // Detect if form template has changed from initial values
  const hasFormChanges = useMemo(() => {
    if (!initialFormSettingsJson) return false;
    return JSON.stringify(formSettings) !== initialFormSettingsJson;
  }, [formSettings, initialFormSettingsJson]);

  const hasChanges = hasBasicChanges || hasFormChanges;

  // Recursive field count
  const totalFieldCount = useMemo(() => countFields(formSettings.fields), [formSettings.fields]);

  const handleSaveAll = async () => {
    if (!basicData.name || !basicData.categoryId) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }
    setIsSaving(true);
    try {
      // 1. Save form template if it has changes
      let templateId = formTemplateId;

      if (hasFormChanges && formSettings.fields.length > 0) {
        if (templateId) {
          await updateFormTemplateMutation.mutateAsync({
            id: templateId,
            name: `${basicData.name} - Form`,
            formSettings: formSettings as any,
          });
        } else {
          const template = await createFormTemplateMutation.mutateAsync({
            name: `${basicData.name} - Form`,
            description: formSettings.description || undefined,
            category: 'service',
            formSettings: formSettings as any,
            isActive: true,
            isPublic: false,
          });
          templateId = template.id;
          setFormTemplateId(templateId);
        }
      }

      // 2. Update service
      await updateServiceMutation.mutateAsync({
        id: serviceId,
        name: basicData.name,
        categoryId: basicData.categoryId,
        isActive: basicData.isActive,
        thumbnail: basicData.thumbnail || null,
        iconColor: basicData.iconColor || '#000000',
        code: basicData.code || null,
        ...(templateId && { formTemplateIds: [templateId] }),
      });

      // 3. Update initial snapshots
      setInitialBasicData({ ...basicData });
      setInitialFormSettingsJson(JSON.stringify(formSettings));

      toast.success('Servicio actualizado correctamente');
    } catch (error) {
      handleApiError(error, router);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBasicNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicData.name || !basicData.categoryId) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }
    if (!formSettings.title) {
      setFormSettings((prev) => ({ ...prev, title: basicData.name }));
    }
    setStep('template');
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro? Si el servicio tiene solicitudes asociadas, será desactivado en lugar de eliminado.')) return;

    setIsDeleting(true);
    try {
      const result = await deleteServiceMutation.mutateAsync({ id: serviceId });
      if (result?.action === 'deleted') {
        toast.success('Servicio eliminado permanentemente');
      } else {
        toast.info('Servicio desactivado. Tiene solicitudes asociadas y no puede eliminarse permanentemente.');
      }
      router.push(`/${lang}/admin/catalog/services`);
    } catch (error) {
      handleApiError(error, router);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadingService || loadingCategories || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Cargando servicio...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-destructive">Servicio no encontrado</p>
        <Button variant="outline" onClick={() => router.push(`/${lang}/admin/catalog/services`)}>
          Volver a Servicios
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        icon={
          <ServiceIcon
            category={categories?.find((c) => c.id === basicData.categoryId)?.name || ''}
            thumbnail={basicData.thumbnail}
            className="h-6 w-6 text-primary"
          />
        }
        title={`Editar Servicio: ${basicData.name || service.name}`}
        description="Modifica los detalles del servicio y su formulario."
        backHref={`/${lang}/admin/catalog/services`}
        backLabel="Volver a Servicios"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="active"
              onClick={handleSaveAll}
              disabled={isSaving || !hasChanges}
              iconLeft={<Save className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </span>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              iconLeft={<Trash2 className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">
                {isDeleting ? 'Procesando...' : 'Eliminar Servicio'}
              </span>
            </Button>
          </div>
        }
      />

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant={step === 'basic' ? 'default' : 'outline'}>1</Badge>
          <span className={step === 'basic' ? 'font-semibold' : 'text-muted-foreground'}>
            Información Básica
          </span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className="flex items-center gap-2">
          <Badge variant={step === 'template' ? 'default' : 'outline'}>2</Badge>
          <span className={step === 'template' ? 'font-semibold' : 'text-muted-foreground'}>
            Formulario
          </span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 'basic' && (
        <Card>
          <CardHeader>
            <CardTitle>Información del Servicio</CardTitle>
            <CardDescription>
              Detalles básicos del servicio que aparece en el catálogo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBasicNext} className="space-y-4 max-w-2xl">
              {/* Icon & Color Selection - Location UI Style */}
              <div className="flex items-center gap-4">
                {/* Large Preview */}
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-colors shrink-0"
                  style={{ backgroundColor: getDynamicBackgroundColor(basicData.iconColor || '#000000') }}
                >
                    {(() => {
                      const iconValue = basicData.thumbnail;
                      const iconColor = basicData.iconColor || '#000000';
                      const iconStyle = { color: iconColor };
                      
                      if (!iconValue) return <MapPin className="h-6 w-6" style={iconStyle} />;

                      // Check if it's a URL (basic check)
                      if (iconValue.startsWith('http')) {
                          return <img src={iconValue} alt="Icon" className="h-6 w-6 object-contain" />;
                      }

                      // Check for Emoji
                      const isEmoji = /\p{Extended_Pictographic}/u.test(iconValue);
                      if (isEmoji) {
                          return <span className="text-2xl leading-none">{iconValue}</span>;
                      }

                      // Lucide Icon
                      const IconComponent = (Icons as any)[iconValue];
                      if (IconComponent) {
                        return <IconComponent className="h-6 w-6" style={iconStyle} />;
                      }
                      
                      // Fallback
                      return <MapPin className="h-6 w-6" style={iconStyle} />;
                    })()}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex gap-4">
                    {/* Icon Selector Button */}
                    <div className="flex-1">
                      <Label>Icono del Servicio</Label>
                      <div className="mt-2">
                        <PrimitiveButton 
                            type="button" 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal"
                            onClick={() => setIsIconSelectorOpen(true)}
                        >
                            {basicData.thumbnail ? (
                                <span className="truncate">{basicData.thumbnail}</span>
                            ) : (
                                "Seleccionar Icono"
                            )}
                        </PrimitiveButton>
                      </div>
                    </div>

                    {/* Color Picker */}
                    <div className="flex-1">
                      <LocationColorPicker
                        color={basicData.iconColor || '#000000'}
                        onChange={(color) => setBasicData({ ...basicData, iconColor: color })}
                        label="Color del Icono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <IconSelector
                open={isIconSelectorOpen}
                onClose={() => setIsIconSelectorOpen(false)}
                onSelect={(value) => setBasicData({ ...basicData, thumbnail: value })}
              />

              <FormInput
                label="Nombre del Servicio *"
                id="name"
                value={basicData.name}
                onChange={(e) => setBasicData({ ...basicData, name: e.target.value })}
                placeholder="Ej. Limpieza de Oficina"
              />

              <FormSelect
                label="Categoría *"
                value={basicData.categoryId}
                onValueChange={(value) => setBasicData({ ...basicData, categoryId: value })}
                options={
                  categories?.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  })) || []
                }
                placeholder={loadingCategories ? 'Cargando...' : 'Seleccionar categoría'}
                disabled={loadingCategories}
              />

              <div>
                <FormInput
                  label="Código del Servicio"
                  id="code"
                  value={basicData.code}
                  onChange={(e) => setBasicData({ ...basicData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) })}
                  placeholder="LIMP"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  3-6 caracteres alfanuméricos en mayúsculas. Se usa para generar IDs de solicitudes (ej: REQ-LIMP-202602-0001)
                </p>
              </div>

              {/* Active/Inactive Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Power className={`h-4 w-4 ${basicData.isActive ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <Label htmlFor="isActive" className="text-sm cursor-pointer">
                    {basicData.isActive ? 'Activo' : 'Inactivo'}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {basicData.isActive
                      ? 'El servicio es visible en el catálogo'
                      : 'El servicio está oculto del catálogo'}
                  </span>
                </div>
                <Switch
                  id="isActive"
                  checked={basicData.isActive}
                  onCheckedChange={(checked) => setBasicData({ ...basicData, isActive: checked })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="outline" className="w-full sm:w-auto">
                  Siguiente: Formulario
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${lang}/admin/catalog/services`)}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Form Builder */}
      {step === 'template' && (
        <div className="space-y-4">
          {/* Service Info Summary */}
          <Card className="p-6 bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold">Servicio: {basicData.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Categoría: {categories?.find((c) => c.id === basicData.categoryId)?.name}
                </p>
              </div>
              <Badge variant={basicData.isActive ? 'default' : 'secondary'}>
                {basicData.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </Card>

          {/* Form Builder */}
          <FormBuilder
            formSettings={formSettings}
            onChange={setFormSettings}
            supportedLocales={['en', 'es']}
            defaultLocale="en"
            driveFolderId={serviceDriveFolderId ?? undefined}
          />

          {/* Action Bar */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep('basic')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Información Básica
              </Button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {totalFieldCount} campo{totalFieldCount !== 1 ? 's' : ''} configurado{totalFieldCount !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${lang}/admin/catalog/services`)}
                  iconLeft={<X className="h-4 w-4" />}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
