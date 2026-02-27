'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/ui/select';
import { Button } from '@/components/primitives/ui/button';
import { Globe, RefreshCw, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { FormFileDropZone } from '../../molecules/FormFileDropZone';
import { GOOGLE_DRIVE_ALL_TYPES, FORM_UPLOAD_MAX_TOTAL_MB } from '@/lib/utils/file-types';
import type { FormPreviewProps } from './FormPreview.types';
import type { SupportedLocale } from '../../types';
import { useForm, Controller } from 'react-hook-form';
import { Label } from '@/components/primitives/ui/label';
import { Input } from '@/components/primitives/ui/input';
import { Textarea } from '@/components/primitives/ui/textarea';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import { Switch } from '@/components/primitives/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/primitives/ui/radio-group';
import { cn } from '@/lib/utils';

/**
 * FormPreview Organism Component
 *
 * Live preview of form as end-user would see it.
 * When the form uses groups, renders as a multi-step wizard with
 * step indicators, navigation buttons, and optional response summary.
 */
export function FormPreview({
  formSettings,
  supportedLocales = ['en'],
  defaultLocale = 'en',
  onSubmit,
  onCancel,
  submitButtonText: submitButtonTextProp,
  hideHeader = false,
  onFilesChanged,
}: FormPreviewProps) {
  const [previewLocale, setPreviewLocale] = React.useState<SupportedLocale>(defaultLocale);
  const [key, setKey] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);

  const isInteractive = !!onSubmit;

  // File upload state: maps fieldId → File[]
  const [filesByField, setFilesByField] = React.useState<Record<string, File[]>>({});

  // Notify parent of file changes after state settles (avoids setState-during-render)
  const filesByFieldRef = React.useRef(filesByField);
  React.useEffect(() => {
    if (filesByFieldRef.current !== filesByField) {
      filesByFieldRef.current = filesByField;
      onFilesChanged?.(filesByField);
    }
  }, [filesByField, onFilesChanged]);

  const { register, control, watch, getValues, handleSubmit } = useForm({
    mode: 'onChange',
  });

  // Determine if form is multi-step (all top-level fields are groups)
  const hasGroups = formSettings.fields.some((f) => f.type === 'group');
  const isMultiStep = hasGroups && formSettings.fields.every((f) => f.type === 'group');
  const groupFields = isMultiStep ? formSettings.fields : [];
  const showResponseSummary = formSettings.showResponseSummary ?? false;

  // Total steps = groups + (optional summary step)
  const totalSteps = isMultiStep
    ? groupFields.length + (showResponseSummary ? 1 : 0)
    : 0;

  // Reset step when fields change
  React.useEffect(() => {
    if (isMultiStep && currentStep >= totalSteps) {
      setCurrentStep(0);
    }
  }, [formSettings.fields.length, totalSteps]);

  // Get localized value for form-level metadata
  const getLocalizedValue = (
    defaultValue: string,
    i18nKey: string,
    locale: SupportedLocale
  ): string => {
    if (locale === defaultLocale) {
      return defaultValue;
    }
    // Use type assertion since i18nKey is a dynamic key
    const localeData = formSettings.i18n?.[locale] as Record<string, string> | undefined;
    return localeData?.[i18nKey] || defaultValue;
  };

  // Get localized field value
  const getLocalizedFieldValue = (
    field: any,
    fieldKey: string,
    locale: SupportedLocale
  ): string => {
    if (locale === defaultLocale) {
      return field[fieldKey] || '';
    }
    return field.i18n?.[locale]?.[fieldKey] || field[fieldKey] || '';
  };

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
    setCurrentStep(0);
  };

  // ============================================================================
  // FIELD RENDERING
  // ============================================================================

  const renderField = (field: any) => {
    const label = getLocalizedFieldValue(field, 'label', previewLocale);
    const placeholder = getLocalizedFieldValue(field, 'placeholder', previewLocale);
    const description = getLocalizedFieldValue(field, 'description', previewLocale);
    const isRequired = field.validation?.required;

    return (
      <div key={field.id} className="space-y-2">
        {field.showTitle !== false && field.type !== 'toggle' && (
          <Label htmlFor={field.id}>
            {label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}

        {field.showDescription && description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {renderFieldByType(field, placeholder, label, isRequired)}
      </div>
    );
  };

  const renderFieldByType = (
    field: any,
    placeholder: string,
    label: string,
    isRequired: boolean
  ) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            id={field.id}
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            placeholder={placeholder}
            {...register(field.id)}
          />
        );

      case 'number':
        return (
          <Input
            id={field.id}
            type="number"
            placeholder={placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            step={field.numberOptions?.step || 1}
            {...register(field.id)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={placeholder}
            rows={field.textareaOptions?.rows || 3}
            maxLength={field.validation?.maxLength}
            {...register(field.id)}
          />
        );

      case 'select': {
        const items = field.selectOptions?.items || [];
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <Select onValueChange={controllerField.onChange} value={controllerField.value}>
                <SelectTrigger>
                  <SelectValue placeholder={field.selectOptions?.placeholder || placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item: any) => (
                    <SelectItem key={item.id} value={item.value}>
                      {getLocalizedFieldValue(item, 'label', previewLocale)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );
      }

      case 'multiselect': {
        const items = field.multiSelectOptions?.items || [];
        return (
          <Controller
            name={field.id}
            control={control}
            defaultValue={[]}
            render={({ field: controllerField }) => (
              <div className={field.multiSelectOptions?.layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'}>
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.id}-${item.id}`}
                      checked={controllerField.value?.includes(item.value)}
                      onCheckedChange={(checked) => {
                        const currentValue = controllerField.value || [];
                        const newValue = checked
                          ? [...currentValue, item.value]
                          : currentValue.filter((v: string) => v !== item.value);
                        controllerField.onChange(newValue);
                      }}
                    />
                    <Label htmlFor={`${field.id}-${item.id}`}>
                      {getLocalizedFieldValue(item, 'label', previewLocale)}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          />
        );
      }

      case 'radio': {
        const items = field.radioOptions?.items || [];
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <RadioGroup
                onValueChange={controllerField.onChange}
                value={controllerField.value}
                className={field.radioOptions?.layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'}
              >
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.value} id={`${field.id}-${item.id}`} />
                    <Label htmlFor={`${field.id}-${item.id}`}>
                      {getLocalizedFieldValue(item, 'label', previewLocale)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        );
      }

      case 'toggle':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField }) => {
              const isCheckboxStyle = field.toggleOptions?.style === 'checkbox';

              if (isCheckboxStyle) {
                return (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={controllerField.value === (field.toggleOptions?.checkedValue ?? true)}
                      onCheckedChange={(checked) => {
                        const checkedVal = field.toggleOptions?.checkedValue ?? true;
                        const uncheckedVal = field.toggleOptions?.uncheckedValue ?? false;
                        controllerField.onChange(checked ? checkedVal : uncheckedVal);
                      }}
                    />
                    <Label htmlFor={field.id} className="cursor-pointer">
                      {label}
                      {isRequired && <span className="text-destructive ml-1">*</span>}
                    </Label>
                  </div>
                );
              }

              return (
                <div className="flex items-center justify-between space-x-4 py-2 px-3 border rounded-lg">
                  <div className="flex-1 space-y-0.5">
                    <Label htmlFor={field.id} className="text-sm font-medium cursor-pointer">
                      {label}
                      {isRequired && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {field.showDescription && getLocalizedFieldValue(field, 'description', previewLocale) && (
                      <p className="text-xs text-muted-foreground">
                        {getLocalizedFieldValue(field, 'description', previewLocale)}
                      </p>
                    )}
                  </div>
                  <Switch
                    id={field.id}
                    checked={controllerField.value === (field.toggleOptions?.checkedValue ?? true)}
                    onCheckedChange={(checked) => {
                      const checkedVal = field.toggleOptions?.checkedValue ?? true;
                      const uncheckedVal = field.toggleOptions?.uncheckedValue ?? false;
                      controllerField.onChange(checked ? checkedVal : uncheckedVal);
                    }}
                  />
                </div>
              );
            }}
          />
        );

      case 'date':
      case 'time':
      case 'datetime':
        return (
          <Input
            id={field.id}
            type={field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : 'datetime-local'}
            placeholder={placeholder}
            {...register(field.id)}
          />
        );

      case 'group':
        // For non-multi-step forms that have a mix of groups and non-groups
        return (
          <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
            {field.groupOptions?.title && field.groupOptions?.showTitle !== false && (
              <h4 className="font-medium text-lg">
                {getLocalizedFieldValue(field.groupOptions, 'title', previewLocale)}
              </h4>
            )}
            {field.groupOptions?.description && field.groupOptions?.showDescription && (
              <p className="text-sm text-muted-foreground">
                {getLocalizedFieldValue(field.groupOptions, 'description', previewLocale)}
              </p>
            )}
            <div className="space-y-4">
              {field.groupOptions?.fields?.map((groupField: any) => renderField(groupField))}
            </div>
          </div>
        );

      case 'imageSelect': {
        const imgItems = field.imageSelectOptions?.items || [];
        const imgColumns = field.imageSelectOptions?.columns || 3;
        const imgLayout = field.imageSelectOptions?.layout || 'grid';
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <div
                className={
                  imgLayout === 'grid'
                    ? cn('grid gap-3', imgColumns === 2 && 'grid-cols-2', imgColumns === 3 && 'grid-cols-3', imgColumns === 4 && 'grid-cols-4')
                    : 'space-y-2'
                }
              >
                {imgItems.map((item: any) => {
                  const isSelected = controllerField.value === item.value;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => controllerField.onChange(isSelected && field.imageSelectOptions?.allowClear ? '' : item.value)}
                      className={cn(
                        'border rounded-lg p-2 text-left transition-colors cursor-pointer',
                        isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'hover:border-muted-foreground/50'
                      )}
                    >
                      <div className="aspect-video bg-muted rounded flex items-center justify-center overflow-hidden mb-2">
                        {item.images?.[0]?.url ? (
                          <img src={item.images[0].url} alt={item.label} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {getLocalizedFieldValue(item, 'label', previewLocale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        );
      }

      case 'imageSelectMulti': {
        const imgMultiItems = field.imageSelectMultiOptions?.items || [];
        const imgMultiColumns = field.imageSelectMultiOptions?.columns || 3;
        const imgMultiLayout = field.imageSelectMultiOptions?.layout || 'grid';
        return (
          <Controller
            name={field.id}
            control={control}
            defaultValue={[]}
            render={({ field: controllerField }) => (
              <div
                className={
                  imgMultiLayout === 'grid'
                    ? cn('grid gap-3', imgMultiColumns === 2 && 'grid-cols-2', imgMultiColumns === 3 && 'grid-cols-3', imgMultiColumns === 4 && 'grid-cols-4')
                    : 'space-y-2'
                }
              >
                {imgMultiItems.map((item: any) => {
                  const currentValues = controllerField.value || [];
                  const isSelected = currentValues.includes(item.value);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        const newValues = isSelected
                          ? currentValues.filter((v: string) => v !== item.value)
                          : [...currentValues, item.value];
                        controllerField.onChange(newValues);
                      }}
                      className={cn(
                        'border rounded-lg p-2 text-left transition-colors cursor-pointer relative',
                        isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'hover:border-muted-foreground/50'
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs">&#10003;</span>
                        </div>
                      )}
                      <div className="aspect-video bg-muted rounded flex items-center justify-center overflow-hidden mb-2">
                        {item.images?.[0]?.url ? (
                          <img src={item.images[0].url} alt={item.label} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {getLocalizedFieldValue(item, 'label', previewLocale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        );
      }

      case 'fileUpload': {
        const fileOpts = field.fileUploadOptions || {};
        const fieldId: string = field.id;
        const selectedFiles = filesByField[fieldId] || [];
        return (
          <FormFileDropZone
            fieldId={fieldId}
            files={selectedFiles}
            onFilesChanged={(newFiles) => {
              setFilesByField((prev) => {
                const next = { ...prev, [fieldId]: newFiles };
                if (!next[fieldId].length) delete next[fieldId];
                return next;
              });
            }}
            maxFiles={fileOpts.maxFiles || 10}
            maxSizeMB={fileOpts.maxSizeMB}
            maxTotalMB={FORM_UPLOAD_MAX_TOTAL_MB}
            accept={fileOpts.accept?.length ? fileOpts.accept : GOOGLE_DRIVE_ALL_TYPES}
            displayStyle={fileOpts.displayStyle || 'dropzone'}
            placeholder={placeholder}
            disabled={!isInteractive}
          />
        );
      }

      default:
        return (
          <div className="p-3 text-sm text-muted-foreground bg-muted rounded-md">
            Preview not available for field type: {field.type}
          </div>
        );
    }
  };

  // ============================================================================
  // MULTI-STEP RENDERING
  // ============================================================================

  const renderStepIndicator = () => {
    if (!isMultiStep || !formSettings.showStepNumbers) return null;

    const stepLabel = previewLocale === 'es'
      ? `PASO ${currentStep + 1} DE ${totalSteps}`
      : `STEP ${currentStep + 1} OF ${totalSteps}`;

    return (
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-foreground text-background">
          {stepLabel}
        </span>
      </div>
    );
  };

  const renderStepContent = () => {
    if (!isMultiStep) return null;

    const isSummaryStep = showResponseSummary && currentStep === groupFields.length;

    if (isSummaryStep) {
      return renderResponseSummary();
    }

    const group = groupFields[currentStep];
    if (!group) return null;

    const groupTitle = getLocalizedFieldValue(
      group.groupOptions || group,
      'title',
      previewLocale
    ) || getLocalizedFieldValue(group, 'label', previewLocale);

    const groupDescription = getLocalizedFieldValue(
      group.groupOptions || group,
      'description',
      previewLocale
    );

    const groupFieldsList = group.groupOptions?.fields || [];

    return (
      <div className="space-y-6">
        {/* Step Title & Description */}
        {group.groupOptions?.showTitle !== false && groupTitle && (
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold">{groupTitle}</h3>
            {group.groupOptions?.showDescription && groupDescription && (
              <p className="text-sm text-muted-foreground">{groupDescription}</p>
            )}
          </div>
        )}

        {/* Step Fields */}
        <div className="space-y-5">
          {groupFieldsList.map((field: any) => renderField(field))}
        </div>
      </div>
    );
  };

  const renderResponseSummary = () => {
    const summaryTitle = previewLocale === 'es' ? 'Resumen de respuestas' : 'Response Summary';
    const summaryDesc = previewLocale === 'es'
      ? 'Revise sus respuestas antes de enviar el formulario.'
      : 'Review your answers before submitting the form.';

    return (
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold">{summaryTitle}</h3>
          <p className="text-sm text-muted-foreground">{summaryDesc}</p>
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          {groupFields.map((group) => {
            const groupTitle = getLocalizedFieldValue(
              group.groupOptions || group,
              'title',
              previewLocale
            ) || getLocalizedFieldValue(group, 'label', previewLocale);

            const groupFieldsList = group.groupOptions?.fields || [];

            return (
              <div key={group.id} className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {groupTitle}
                </h4>
                {groupFieldsList.map((field: any) => {
                  const fieldLabel = getLocalizedFieldValue(field, 'label', previewLocale);
                  let displayValue: string;
                  if (field.type === 'fileUpload') {
                    const files = filesByField[field.id] || [];
                    displayValue = files.length > 0 ? files.map(f => f.name).join(', ') : '-';
                  } else {
                    const fieldValue = getValues(field.id);
                    displayValue = Array.isArray(fieldValue)
                      ? fieldValue.join(', ')
                      : fieldValue || '-';
                  }

                  return (
                    <div key={field.id} className="flex justify-between py-1 border-b border-dashed last:border-0">
                      <span className="text-sm text-muted-foreground">{fieldLabel}</span>
                      <span className="text-sm font-medium text-right max-w-[60%] truncate">
                        {String(displayValue)}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStepNavigation = () => {
    if (!isMultiStep) return null;

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;
    const isSummaryStep = showResponseSummary && currentStep === groupFields.length;

    const prevLabel = previewLocale === 'es' ? 'Anterior' : 'Previous';
    const nextLabel = previewLocale === 'es' ? 'Siguiente' : 'Next';

    return (
      <div className="flex items-center justify-between pt-6">
        {!isFirstStep ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((s) => s - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {prevLabel}
          </Button>
        ) : onCancel && isInteractive ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {prevLabel}
          </Button>
        ) : (
          <div />
        )}

        {isLastStep ? (
          <Button type={isInteractive ? 'submit' : 'button'} disabled={!isInteractive}>
            {submitButtonText}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setCurrentStep((s) => s + 1)}
          >
            {nextLabel}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const title = getLocalizedValue(
    formSettings.title || 'Form Preview',
    'title',
    previewLocale
  );
  const description = getLocalizedValue(
    formSettings.description || '',
    'description',
    previewLocale
  );
  const submitButtonText = submitButtonTextProp || getLocalizedValue(
    formSettings.submitButtonText || 'Submit',
    'submitButtonText',
    previewLocale
  );

  const formContent = (
    <form
      className="space-y-6"
      onSubmit={isInteractive ? handleSubmit((data) => {
        // Include file metadata in the form data
        const filesMeta: Record<string, Array<{ name: string; size: number; type: string }>> = {};
        for (const [fieldId, files] of Object.entries(filesByField)) {
          if (files.length > 0) {
            filesMeta[fieldId] = files.map(f => ({ name: f.name, size: f.size, type: f.type }));
          }
        }
        if (Object.keys(filesMeta).length > 0) {
          data.__filesMeta__ = filesMeta;
        }
        onSubmit!(data);
      }) : (e) => e.preventDefault()}
    >
      {/* Empty State */}
      {formSettings.fields.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            No fields added yet. Add fields to see the preview.
          </p>
        </div>
      )}

      {/* Multi-Step Mode */}
      {isMultiStep && formSettings.fields.length > 0 && (
        <>
          {renderStepIndicator()}
          {renderStepContent()}
          {renderStepNavigation()}
        </>
      )}

      {/* Non-Step Mode (flat fields or mixed) */}
      {!isMultiStep && formSettings.fields.length > 0 && (
        <>
          {formSettings.fields.map((field) => renderField(field))}

          {/* Submit / Cancel Buttons */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              {onCancel && isInteractive && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {previewLocale === 'es' ? 'Cancelar' : 'Cancel'}
                </Button>
              )}
              <Button
                type={isInteractive ? 'submit' : 'button'}
                disabled={!isInteractive}
                className="w-full sm:w-auto"
              >
                {submitButtonText}
              </Button>
            </div>
            {!isInteractive && (
              <p className="text-xs text-muted-foreground mt-2">
                This is a preview only. Form submission is disabled.
              </p>
            )}
          </div>
        </>
      )}

      {/* Multi-step disclaimer (preview mode only) */}
      {!isInteractive && isMultiStep && formSettings.fields.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          This is a preview only. Form submission is disabled.
        </p>
      )}
    </form>
  );

  if (hideHeader) {
    return <div key={key}>{formContent}</div>;
  }

  return (
    <Card key={key} className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>

          <div className="flex items-center gap-2">
            {supportedLocales.length > 1 && (
              <Select value={previewLocale} onValueChange={(v) => setPreviewLocale(v as SupportedLocale)}>
                <SelectTrigger className="w-[140px] h-9">
                  <Globe className="h-3 w-3 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLocales.map((locale) => (
                    <SelectItem key={locale} value={locale}>
                      {locale === 'en' ? 'English' : 'Español'}
                      {locale === defaultLocale ? ' (Default)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-9 w-9"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}
