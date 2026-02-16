/**
 * Field Helpers - Form Builder Utilities
 *
 * Utility functions for field management in the form builder:
 * - Field ID generation
 * - Field duplication
 * - Field initialization with defaults
 * - Field type-specific helpers
 *
 * Migrated from fork-of-block-editor/components/form/tabs/disposition-tab.tsx
 */

import type {
  FormField,
  FormFieldType,
  FormFieldOption,
} from '../types';

// ============================================================================
// ID GENERATION UTILITIES
// ============================================================================

/**
 * Generates a unique field ID using timestamp
 * @returns Unique field ID (e.g., "field-1234567890")
 */
export function generateFieldId(): string {
  return `field-${Date.now()}`;
}

/**
 * Generates a unique group ID using timestamp
 * @returns Unique group ID (e.g., "group-initial-1234567890")
 */
export function generateGroupId(suffix?: string): string {
  const base = `group-${suffix || 'new'}`;
  return `${base}-${Date.now()}`;
}

/**
 * Generates a unique option ID using timestamp
 * @param prefix Optional prefix for the ID (default: "opt")
 * @returns Unique option ID (e.g., "opt-1234567890")
 */
export function generateOptionId(prefix: string = 'opt'): string {
  return `${prefix}-${Date.now()}`;
}

/**
 * Generates a unique image ID using timestamp and random string
 * @returns Unique image ID (e.g., "img-1234567890-abc123def")
 */
export function generateImageId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// FIELD INITIALIZATION UTILITIES
// ============================================================================

/**
 * Creates a new field with default values based on field type
 * @param fieldType The type of field to create
 * @param label Optional label for the field (default: "New Field")
 * @returns Initialized FormField object with type-specific defaults
 */
export function createField(
  fieldType: FormFieldType,
  label: string = 'New Field'
): FormField {
  const baseField: FormField = {
    id: generateFieldId(),
    type: fieldType,
    label,
    required: false,
  };

  // Initialize field-specific options
  switch (fieldType) {
    case 'select':
      return {
        ...baseField,
        selectOptions: { items: [] },
      };

    case 'radio':
      return {
        ...baseField,
        radioOptions: { items: [], layout: 'vertical' },
      };

    case 'multiselect':
      return {
        ...baseField,
        multiSelectOptions: { items: [], layout: 'vertical' },
      };

    case 'imageSelect':
      return {
        ...baseField,
        imageSelectOptions: {
          items: [],
          layout: 'grid',
          columns: 3,
          allowClear: false,
        },
      };

    case 'imageSelectMulti':
      return {
        ...baseField,
        imageSelectMultiOptions: {
          items: [],
          layout: 'grid',
          columns: 3,
        },
      };

    case 'toggle':
      return {
        ...baseField,
        toggleOptions: {
          defaultChecked: false,
          style: 'toggle',
          checkedValue: true,
          uncheckedValue: false,
        },
      };

    case 'range':
      return {
        ...baseField,
        rangeOptions: { min: 0, max: 10, step: 1 },
      };

    case 'email':
      return {
        ...baseField,
        emailOptions: { showValidationIcon: true, validateOnBlur: true },
      };

    case 'phone':
      return {
        ...baseField,
        phoneOptions: {
          format: 'national',
          defaultCountry: 'US',
          mask: '(###) ###-####',
        },
      };

    case 'textarea':
      return {
        ...baseField,
        textareaOptions: {
          rows: 3,
          resize: 'vertical',
          showCharacterCount: false,
        },
      };

    case 'datetime':
      return {
        ...baseField,
        dateOptions: {
          mode: 'datetime',
          locale: 'en',
          hourCycle: 24,
        },
      };

    case 'fileUpload':
      return {
        ...baseField,
        fileUploadOptions: {
          accept: [],
          maxSizeMB: 10,
          maxFiles: 1,
          displayStyle: 'dropzone',
          showFileList: true,
        },
      };

    case 'group':
      return {
        ...baseField,
        groupOptions: {
          title: label,
          fields: [],
          showStepIndicator: true,
        },
      };

    default:
      return baseField;
  }
}

// ============================================================================
// FIELD DUPLICATION UTILITIES
// ============================================================================

/**
 * Creates a duplicate of a field with a new ID and modified label
 * @param field The field to duplicate
 * @param labelSuffix Optional suffix to add to the label (default: "(copy)")
 * @returns Duplicated field with new ID
 */
export function duplicateField(
  field: FormField,
  labelSuffix: string = '(copy)'
): FormField {
  return {
    ...field,
    id: generateFieldId(),
    label: `${field.label} ${labelSuffix}`,
  };
}

/**
 * Creates a duplicate option with a new ID
 * @param option The option to duplicate
 * @returns Duplicated option with new ID
 */
export function duplicateOption(option: FormFieldOption): FormFieldOption {
  return {
    ...option,
    id: generateOptionId(),
  };
}

// ============================================================================
// FIELD VALIDATION HELPERS
// ============================================================================

/**
 * Checks if a field type requires options (select, radio, multiselect)
 * @param fieldType The field type to check
 * @returns True if the field type requires options
 */
export function fieldTypeRequiresOptions(fieldType: FormFieldType): boolean {
  return ['select', 'radio', 'multiselect', 'imageSelect', 'imageSelectMulti'].includes(
    fieldType
  );
}

/**
 * Checks if a field has options defined
 * @param field The field to check
 * @returns True if the field has options
 */
export function hasOptions(field: FormField): boolean {
  return (
    (field.selectOptions?.items?.length ?? 0) > 0 ||
    (field.radioOptions?.items?.length ?? 0) > 0 ||
    (field.multiSelectOptions?.items?.length ?? 0) > 0 ||
    (field.imageSelectOptions?.items?.length ?? 0) > 0 ||
    (field.imageSelectMultiOptions?.items?.length ?? 0) > 0
  );
}

/**
 * Gets the options array from a field regardless of field type
 * @param field The field to get options from
 * @returns Array of FormFieldOption or empty array
 */
export function getFormFieldOptions(field: FormField): FormFieldOption[] {
  if (field.selectOptions?.items) return field.selectOptions.items;
  if (field.radioOptions?.items) return field.radioOptions.items;
  if (field.multiSelectOptions?.items) return field.multiSelectOptions.items;
  if (field.imageSelectOptions?.items) return field.imageSelectOptions.items;
  if (field.imageSelectMultiOptions?.items) return field.imageSelectMultiOptions.items;
  return [];
}

/**
 * Checks if a field type supports multiple values
 * @param fieldType The field type to check
 * @returns True if the field type supports multiple values
 */
export function isMultiValueField(fieldType: FormFieldType): boolean {
  return ['multiselect', 'imageSelectMulti'].includes(fieldType);
}

/**
 * Checks if a field is a group type
 * @param field The field to check
 * @returns True if the field is a group
 */
export function isGroupField(field: FormField): boolean {
  return field.type === 'group';
}

// ============================================================================
// FIELD LABEL HELPERS
// ============================================================================

/**
 * Gets a display label for a field, with fallback to field type
 * @param field The field to get label from
 * @returns Display label
 */
export function getFieldDisplayLabel(field: FormField): string {
  return field.label || `Untitled ${field.type}`;
}

/**
 * Checks if a field has a valid label
 * @param field The field to check
 * @returns True if field has a non-empty label
 */
export function hasValidLabel(field: FormField): boolean {
  return Boolean(field.label && field.label.trim().length > 0);
}

// ============================================================================
// FIELD ARRAY HELPERS
// ============================================================================

/**
 * Moves a field from one position to another in an array
 * @param fields Array of fields
 * @param fromIndex Source index
 * @param toIndex Destination index
 * @returns New array with field moved
 */
export function moveField(
  fields: FormField[],
  fromIndex: number,
  toIndex: number
): FormField[] {
  const newFields = [...fields];
  const [movedField] = newFields.splice(fromIndex, 1);
  newFields.splice(toIndex, 0, movedField);
  return newFields;
}

/**
 * Inserts a field at a specific position in an array
 * @param fields Array of fields
 * @param field Field to insert
 * @param index Position to insert at
 * @returns New array with field inserted
 */
export function insertFieldAt(
  fields: FormField[],
  field: FormField,
  index: number
): FormField[] {
  const newFields = [...fields];
  newFields.splice(index, 0, field);
  return newFields;
}

/**
 * Removes a field at a specific position in an array
 * @param fields Array of fields
 * @param index Position to remove from
 * @returns New array with field removed
 */
export function removeFieldAt(fields: FormField[], index: number): FormField[] {
  return fields.filter((_, i) => i !== index);
}

/**
 * Replaces a field at a specific position in an array
 * @param fields Array of fields
 * @param field New field
 * @param index Position to replace at
 * @returns New array with field replaced
 */
export function replaceFieldAt(
  fields: FormField[],
  field: FormField,
  index: number
): FormField[] {
  const newFields = [...fields];
  newFields[index] = field;
  return newFields;
}

// ============================================================================
// FIELD SEARCH/FILTER HELPERS
// ============================================================================

/**
 * Finds a field by ID in a flat or nested field structure
 * @param fields Array of fields to search
 * @param fieldId ID of the field to find
 * @returns Found field or undefined
 */
export function findFieldById(
  fields: FormField[],
  fieldId: string
): FormField | undefined {
  for (const field of fields) {
    if (field.id === fieldId) {
      return field;
    }
    // Recursively search in group fields
    if (field.type === 'group' && field.groupOptions?.fields) {
      const found = findFieldById(field.groupOptions.fields, fieldId);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Gets all fields of a specific type from a field array (including nested)
 * @param fields Array of fields
 * @param fieldType Type to filter by
 * @returns Array of fields matching the type
 */
export function getFieldsByType(
  fields: FormField[],
  fieldType: FormFieldType
): FormField[] {
  const result: FormField[] = [];

  for (const field of fields) {
    if (field.type === fieldType) {
      result.push(field);
    }
    // Recursively search in group fields
    if (field.type === 'group' && field.groupOptions?.fields) {
      result.push(...getFieldsByType(field.groupOptions.fields, fieldType));
    }
  }

  return result;
}

/**
 * Checks if a field array contains any group fields
 * @param fields Array of fields to check
 * @returns True if array contains at least one group field
 */
export function hasGroupFields(fields: FormField[]): boolean {
  return fields.some((field) => field.type === 'group');
}

/**
 * Alias for createField - Creates a new field with default values
 * @param fieldType The type of field to create
 * @param label Optional label for the field (default: "New Field")
 * @returns Initialized FormField object with type-specific defaults
 */
export function createDefaultField(
  fieldType: FormFieldType,
  label: string = 'New Field'
): FormField {
  return createField(fieldType, label);
}
