import type { FormField, SupportedLocale } from '@/components/features/form-builder/types';

export interface MultiSelectFieldEditorProps {
  field: FormField;
  onChange: (field: FormField) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  supportedLocales?: SupportedLocale[];
  defaultLocale?: SupportedLocale;
  editingLocale?: SupportedLocale;
}
