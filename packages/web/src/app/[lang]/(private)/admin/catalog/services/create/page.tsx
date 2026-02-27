'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { ArrowLeft, ArrowRight, Save, Power } from 'lucide-react';
import { useTranslations } from '@/context/TranslationsContext';
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
import { MapPin } from 'lucide-react'; // Default icon
import { Icons } from '@/lib/icons';
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

const defaultFormSettings: FormSettings = {
  title: '',
  description: '',
  fields: [],
  submitButtonText: 'Submit',
  showStepNumbers: true,
  supportedLocales: ['en', 'es'],
  defaultLocale: 'en',
};

export default function CreateServicePage() {
  const router = useRouter();
  const { lang } = useParams();
  const t = useTranslations();
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
  const [isSaving, setIsSaving] = useState(false);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  // tRPC queries and mutations
  const { data: categories, isLoading: loadingCategories } = trpc.category.getAllCategories.useQuery();
  const createFormTemplateMutation = trpc.formTemplate.create.useMutation();
  const createServiceMutation = trpc.service.createService.useMutation();
  const ensureFolderMutation = trpc.service.ensureServiceDriveFolder.useMutation();

  const handleBasicNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicData.name || !basicData.categoryId) {
      toast.error(t('admin.catalog.services.create.validation.requiredFields'));
      return;
    }
    // Set form title from service name if not set
    if (!formSettings.title) {
      setFormSettings((prev) => ({ ...prev, title: basicData.name }));
    }
    setStep('template');
  };

  const handleFinalSubmit = async () => {
    if (formSettings.fields.length === 0) {
      toast.error(t('admin.catalog.services.create.validation.atLeastOneField'));
      return;
    }

    setIsSaving(true);
    try {
      // 1. Create form template
      const template = await createFormTemplateMutation.mutateAsync({
        name: `${basicData.name} - Form`,
        description: formSettings.description || undefined,
        category: 'service',
        formSettings: formSettings as any,
        isActive: true,
        isPublic: false,
      });

      // 2. Create service linked to the form template
      const createdService = await createServiceMutation.mutateAsync({
        name: basicData.name,
        categoryId: basicData.categoryId,
        formTemplateIds: [template.id],
        isActive: basicData.isActive,
        thumbnail: basicData.thumbnail || undefined,
        iconColor: basicData.iconColor || '#000000',
        code: basicData.code || undefined,
      });

      // 3. Fire-and-forget: create Drive folder for new service
      if (createdService?.id && basicData.code) {
        ensureFolderMutation.mutate({ serviceId: createdService.id });
      }

      toast.success(t('admin.catalog.services.create.success'));
      router.push(`/${lang}/admin/catalog/services`);
    } catch (error) {
      handleApiError(error, router);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title={t('admin.catalog.services.create.title')}
        description={t('admin.catalog.services.create.description')}
        backHref={`/${lang}/admin/catalog/services`}
        backLabel={t('admin.catalog.services.create.backToServices')}
      />

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant={step === 'basic' ? 'default' : 'outline'}>1</Badge>
          <span className={step === 'basic' ? 'font-semibold' : 'text-muted-foreground'}>
            {t('admin.catalog.services.create.steps.basicInfo')}
          </span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className="flex items-center gap-2">
          <Badge variant={step === 'template' ? 'default' : 'outline'}>2</Badge>
          <span className={step === 'template' ? 'font-semibold' : 'text-muted-foreground'}>
            {t('admin.catalog.services.create.steps.designForm')}
          </span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 'basic' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.catalog.services.create.basicCard.title')}</CardTitle>
            <CardDescription>
              {t('admin.catalog.services.create.basicCard.description')}
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
                      <Label>{t('admin.catalog.services.create.form.serviceIcon')}</Label>
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
                label={t('admin.catalog.services.create.form.serviceName')}
                id="name"
                value={basicData.name}
                onChange={(e) => setBasicData({ ...basicData, name: e.target.value })}
                placeholder={t('admin.catalog.services.create.form.serviceNamePlaceholder')}
              />

              <FormSelect
                label={t('admin.catalog.services.create.form.category')}
                value={basicData.categoryId}
                onValueChange={(value) => setBasicData({ ...basicData, categoryId: value })}
                options={
                  categories?.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  })) || []
                }
                placeholder={loadingCategories ? t('admin.catalog.services.create.form.categoryLoading') : t('admin.catalog.services.create.form.categoryPlaceholder')}
                disabled={loadingCategories}
              />

              <div>
                <FormInput
                  label={t('admin.catalog.services.create.form.serviceCode') || 'Service Code'}
                  id="code"
                  value={basicData.code}
                  onChange={(e) => setBasicData({ ...basicData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) })}
                  placeholder="LIMP"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('admin.catalog.services.create.form.serviceCodeDescription') || '3-6 uppercase alphanumeric characters. Used for request IDs (e.g., REQ-LIMP-202602-0001)'}
                </p>
              </div>

              {/* Active/Inactive Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Power className={`h-4 w-4 ${basicData.isActive ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <Label htmlFor="isActive" className="text-sm cursor-pointer">
                    {basicData.isActive ? t('admin.catalog.services.create.form.active') : t('admin.catalog.services.create.form.inactive')}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {basicData.isActive
                      ? t('admin.catalog.services.create.form.activeDescription')
                      : t('admin.catalog.services.create.form.inactiveDescription')}
                  </span>
                </div>
                <Switch
                  id="isActive"
                  checked={basicData.isActive}
                  onCheckedChange={(checked) => setBasicData({ ...basicData, isActive: checked })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="active" className="w-full sm:w-auto">
                  {t('admin.catalog.services.create.buttons.next')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto"
                >
                  {t('admin.catalog.services.create.buttons.cancel')}
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
                <h3 className="font-semibold">{t('admin.catalog.services.create.summary.service')}: {basicData.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('admin.catalog.services.create.summary.category')}: {categories?.find((c) => c.id === basicData.categoryId)?.name}
                </p>
              </div>
              <Badge variant={basicData.isActive ? 'default' : 'secondary'}>
                {basicData.isActive ? t('admin.catalog.services.create.form.active') : t('admin.catalog.services.create.form.inactive')}
              </Badge>
            </div>
          </Card>

          {/* New Form Builder */}
          <FormBuilder
            formSettings={formSettings}
            onChange={setFormSettings}
            supportedLocales={['en', 'es']}
            defaultLocale="en"
          />

          {/* Action Bar */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep('basic')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('admin.catalog.services.create.buttons.back')}
              </Button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {formSettings.fields.length} {t('admin.catalog.services.create.fieldsConfigured')}
                </span>
                <Button
                  onClick={handleFinalSubmit}
                  disabled={isSaving || formSettings.fields.length === 0}
                  variant="active"
                >
                  {isSaving ? (
                    t('admin.catalog.services.create.buttons.creating')
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('admin.catalog.services.create.buttons.create')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
