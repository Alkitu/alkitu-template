import {
  FormField,
  FormSettings,
  SupportedLocale,
  LocalizedFieldData,
  LocalizedFormMetadata
} from '@/components/features/form-builder/types';

/**
 * Resolves the localized version of a form field.
 * Falls back to the default field values if a translation is missing.
 */
export function getLocalizedField(field: FormField, locale: SupportedLocale): FormField {
  if (!field.i18n || !field.i18n[locale]) {
    return field;
  }

  const translation = field.i18n[locale];

  // Clone the field to avoid mutating the original
  const localizedField = { ...field };

  // 1. Basic properties
  if (translation?.label) localizedField.label = translation.label;
  if (translation?.placeholder) localizedField.placeholder = translation.placeholder;
  if (translation?.description) localizedField.description = translation.description;

  // 2. Options (Select, MultiSelect, Radio)
  // We strictly map the existing option VALUES to their translated LABELS.
  // We do not replace the entire options array to ensure technical integrity (IDs/Values must match).

  if (translation?.options) {
    if (localizedField.selectOptions?.items) {
      localizedField.selectOptions = {
        ...localizedField.selectOptions,
        items: localizedField.selectOptions.items.map(item => ({
          ...item,
          label: translation.options?.[item.id] || item.label
        }))
      };
    }

    if (localizedField.multiSelectOptions?.items) {
      localizedField.multiSelectOptions = {
        ...localizedField.multiSelectOptions,
        items: localizedField.multiSelectOptions.items.map(item => ({
          ...item,
          label: translation.options?.[item.id] || item.label
        }))
      };
    }

    if (localizedField.radioOptions?.items) {
      localizedField.radioOptions = {
        ...localizedField.radioOptions,
        items: localizedField.radioOptions.items.map(item => ({
          ...item,
          label: translation.options?.[item.id] || item.label
        }))
      };
    }
  }

  // 3. Groups
  if (localizedField.type === 'group' && localizedField.groupOptions) {
    if (translation?.groupTitle) localizedField.groupOptions.title = translation.groupTitle;
    if (translation?.groupDescription) localizedField.groupOptions.description = translation.groupDescription;

    // Recursively localize children
    if (localizedField.groupOptions.fields) {
      localizedField.groupOptions.fields = localizedField.groupOptions.fields.map(child =>
        getLocalizedField(child, locale)
      );
    }
  }

  return localizedField;
}

/**
 * Resolves the localized metadata for the entire form (title, description, submit button).
 */
export function getLocalizedFormMetadata(settings: FormSettings, locale: SupportedLocale): LocalizedFormMetadata {
  const defaults: LocalizedFormMetadata = {
    title: settings.title,
    description: settings.description,
    submitButtonText: settings.submitButtonText
  };

  if (!settings.i18n || !settings.i18n[locale]) {
    return defaults;
  }

  const translation = settings.i18n[locale];

  return {
    title: translation?.title || defaults.title,
    description: translation?.description || defaults.description,
    submitButtonText: translation?.submitButtonText || defaults.submitButtonText
  };
}
