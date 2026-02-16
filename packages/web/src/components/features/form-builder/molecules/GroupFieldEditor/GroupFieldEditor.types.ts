import type { FormField, SupportedLocale } from '../../types';

export interface GroupFieldEditorProps {
  field: FormField;
  onChange: (field: FormField) => void;
  onDelete?: () => void;
  supportedLocales?: SupportedLocale[];
  defaultLocale?: SupportedLocale;
  editingLocale?: SupportedLocale;
  onLocaleChange?: (locale: SupportedLocale) => void;
}
