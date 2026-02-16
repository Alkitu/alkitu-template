/**
 * Form Template Types - Advanced Form Builder
 *
 * Migrated from fork-of-block-editor with full feature support:
 * - 20+ field types (text, map, image carousel, multi-select, range, etc.)
 * - Internationalization (i18n) with LocalizedFormMetadata
 * - Advanced validation rules with Zod
 * - Drag & drop support
 * - Image management with carousels
 * - Map fields with Nominatim geocoding
 */

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export type ValidationResult = {
  isValid: boolean;
  errorMessage?: string;
};

export type ValidationOperator =
  | 'contains'
  | 'notContains'
  | 'equals'
  | 'notEquals'
  | 'matches'
  | 'minLength'
  | 'maxLength'
  | 'length'
  | 'isEmail'
  | 'isUrl'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'notBetween'
  | 'isInteger';

export interface ValidationRule {
  operator: ValidationOperator;
  value?: string | number;
  value2?: string | number; // For 'between' operator
  errorMessage?: string;
}

// ============================================================================
// INTERNATIONALIZATION (i18n) TYPES
// ============================================================================

export type SupportedLocale = 'es' | 'en'; // Extensible

export interface LocalizedFieldData {
  label?: string;
  placeholder?: string;
  description?: string;
  // For options (Select, Radio, MultiSelect) - Map value to localized label
  options?: Record<string, string>;
  // For groups
  groupTitle?: string;
  groupDescription?: string;
  // For map field
  searchPlaceholder?: string;
}

export interface LocalizedFormMetadata {
  title?: string;
  description?: string;
  submitButtonText?: string;
}

// ============================================================================
// GEOGRAPHIC / MAP TYPES
// ============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AddressComponents {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  fullAddress: string;
}

export interface MapFieldValue {
  coordinates: Coordinates;
  address?: AddressComponents;
  placeName?: string; // Friendly place name
}

export interface MapFieldOptions {
  // Map settings
  defaultCenter: Coordinates;
  defaultZoom: number;
  mapHeight?: number; // Default: 400px

  // Interaction
  allowDrag?: boolean; // Draggable marker, default: true
  showCoordinates?: boolean; // Display lat/lng, default: true

  // Autocomplete
  enableAutocomplete?: boolean; // Default: true
  searchPlaceholder?: string; // Localizable via i18n

  // Search restrictions
  searchCountries?: string[]; // ISO codes (e.g., ['ES', 'US'])
  searchBounds?: [Coordinates, Coordinates]; // [[minLat,minLng], [maxLat,maxLng]]
}

// ============================================================================
// IMAGE TYPES
// ============================================================================

export interface ImageData {
  id: string; // Unique ID for drag-drop tracking
  url: string; // Primary URL (medium variant)
  thumbnail?: string; // 150px variant for list views
  medium?: string; // 500px variant for grid normal
  large?: string; // 1200px variant for grid large
  metadata?: {
    width: number; // Original width
    height: number; // Original height
    aspectRatio: number; // width / height ratio
  };
}

// ============================================================================
// FIELD OPTION TYPES
// ============================================================================

export interface FormFieldOption {
  id: string; // Unique ID generated with Date.now()
  label: string; // Text shown to user
  value: string; // Value sent in form submission
  disabled?: boolean; // To disable specific options

  // Image carousel support (order = carousel order, [0] = cover)
  images?: ImageData[];

  // LEGACY: kept for backward compatibility with old forms
  imageUrl?: string;
  image?: ImageData;
}

// ============================================================================
// FIELD-SPECIFIC OPTIONS
// ============================================================================

export interface SelectFieldOptions {
  items: FormFieldOption[];
  defaultValue?: string;
  placeholder?: string;
  allowClear?: boolean;
}

export interface MultiSelectFieldOptions {
  items: FormFieldOption[];
  defaultValue?: string[];
  placeholder?: string;
  maxSelections?: number;
  layout?: 'vertical' | 'horizontal';
}

export interface ImageSelectFieldOptions {
  items: FormFieldOption[];
  defaultValue?: string;
  placeholder?: string;
  allowClear?: boolean;
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
}

export interface ImageSelectMultiFieldOptions {
  items: FormFieldOption[];
  defaultValue?: string[];
  placeholder?: string;
  maxSelections?: number;
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
}

export interface RadioFieldOptions {
  items: FormFieldOption[];
  defaultValue?: string;
  layout?: 'vertical' | 'horizontal';
}

export interface ToggleFieldOptions {
  checkedValue?: string | boolean; // Value when checked
  uncheckedValue?: string | boolean; // Value when unchecked
  defaultChecked?: boolean;
  style?: 'toggle' | 'checkbox'; // Display style
}

export interface RangeFieldOptions {
  min: number;
  max: number;
  step: number;
  showDescription?: boolean;
}

export interface NumberFieldOptions {
  step?: number;
  // Display type
  displayType?: 'number' | 'currency' | 'percentage';
  // Currency settings
  currencyCode?: string;
  // Formatting
  decimals?: number;
  prefix?: string;
  suffix?: string;
  thousandsSeparator?: boolean;
  // Validation
  allowNegative?: boolean;
}

/**
 * @deprecated Use DateFieldOptions with mode='time' instead
 */
export interface TimeFieldOptions {
  format24?: boolean;
  includeSeconds?: boolean;
  showDescription?: boolean;
  minTime?: string;
  maxTime?: string;
  interval?: number;
  businessHours?: {
    enabled?: boolean;
    start?: string;
    end?: string;
  };
}

export interface DateFieldOptions {
  // Mode and Locale
  mode?: 'date' | 'time' | 'datetime'; // Default: 'date'
  locale?: 'en' | 'es'; // Default: 'en'

  // Time Format
  hourCycle?: 12 | 24; // For AM/PM vs 24h, default: 24
  includeSeconds?: boolean; // Show seconds picker

  // Date Restrictions
  minDate?: Date | string; // ISO string for JSON serialization
  maxDate?: Date | string;
  disableWeekends?: boolean; // Block Saturdays and Sundays
  disabledDates?: (Date | string)[]; // Specific dates to block

  // Time Restrictions
  minTime?: string; // Format: 'HH:mm'
  maxTime?: string;
  businessHours?: {
    // Business hours restriction
    enabled?: boolean;
    start?: string; // Format: 'HH:mm'
    end?: string;
    daysOfWeek?: number[]; // [1,2,3,4,5] = Mon-Fri (0 = Sunday, 6 = Saturday)
  };

  // Display
  placeholder?: string;
  showDescription?: boolean;
}

export interface EmailFieldOptions {
  showValidationIcon?: boolean; // Show checkmark/cross while typing
  allowMultiple?: boolean; // Allow multiple emails separated by comma
  validateOnBlur?: boolean; // Validate when user leaves field
}

export interface PhoneFieldOptions {
  format?: 'national' | 'international' | 'custom';
  mask?: string; // Custom mask like "(###) ###-####"
  defaultCountry?: string; // "ES", "US", "MX"
  showCountryCode?: boolean; // Show country code prefix
}

export interface TextareaFieldOptions {
  rows?: number; // Initial height in lines
  minRows?: number; // Minimum height
  maxRows?: number; // Maximum height (with auto-grow)
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  showCharacterCount?: boolean; // Show "150 / 500" counter
  autoGrow?: boolean; // Grow automatically with content
}

export interface FileUploadFieldOptions {
  accept?: string[]; // MIME types or extensions (e.g., ['image/*', '.pdf'])
  maxSizeMB?: number; // Max file size in MB
  maxFiles?: number; // Max number of files (1 = single file)
  displayStyle?: 'dropzone' | 'button'; // Upload UI style
  showFileList?: boolean; // Show uploaded files list
  placeholder?: string; // Placeholder text
}

export interface GroupFieldOptions {
  title?: string;
  description?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  showStepIndicator?: boolean;
  navigation?: 'buttons' | 'none';
  fields: FormField[];
  conditionalRules?: any[];
}

// ============================================================================
// FORM FIELD TYPE
// ============================================================================

export type FormFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'toggle'
  | 'radio'
  | 'textarea'
  | 'range'
  | 'group'
  | 'imageSelect'
  | 'imageSelectMulti'
  | 'fileUpload'
  | 'map';

// ============================================================================
// MAIN FORM FIELD INTERFACE
// ============================================================================

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  showTitle?: boolean;
  showDescription?: boolean;

  validation?: {
    required?: boolean;
    rules?: ValidationRule[];
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    errorMessage?: string;
  };

  // Type-specific options (only one will be present based on field type)
  selectOptions?: SelectFieldOptions;
  multiSelectOptions?: MultiSelectFieldOptions;
  radioOptions?: RadioFieldOptions;
  toggleOptions?: ToggleFieldOptions;
  rangeOptions?: RangeFieldOptions;
  numberOptions?: NumberFieldOptions;
  timeOptions?: TimeFieldOptions;
  dateOptions?: DateFieldOptions;
  emailOptions?: EmailFieldOptions;
  phoneOptions?: PhoneFieldOptions;
  textareaOptions?: TextareaFieldOptions;
  groupOptions?: GroupFieldOptions;
  imageSelectOptions?: ImageSelectFieldOptions;
  imageSelectMultiOptions?: ImageSelectMultiFieldOptions;
  fileUploadOptions?: FileUploadFieldOptions;
  mapOptions?: MapFieldOptions;

  // Internationalization
  i18n?: {
    [key in SupportedLocale]?: LocalizedFieldData;
  };

  // DEPRECATED - kept for backward compatibility
  options?: string[];
  checkboxLabel?: string;
  checkboxOptions?: ToggleFieldOptions; // Old name for backward compatibility
}

// ============================================================================
// FORM SETTINGS INTERFACE
// ============================================================================

export interface FormSettings {
  title: string;
  description?: string;
  fields: FormField[];
  submitButtonText: string;
  showStepNumbers?: boolean;
  showResponseSummary?: boolean;
  deviceVisibility?: {
    desktop?: boolean;
    tabletVertical?: boolean;
    mobileVertical?: boolean;
  };

  // Internationalization settings
  supportedLocales?: SupportedLocale[];
  defaultLocale?: SupportedLocale;
  i18n?: {
    [key in SupportedLocale]?: LocalizedFormMetadata;
  };
}

// FormPreviewProps is the same as FormSettings
export type FormPreviewProps = FormSettings;

// ============================================================================
// FORM TEMPLATE DATABASE MODEL TYPES
// ============================================================================

/**
 * FormTemplate - Database entity for reusable form templates
 * This replaces the embedded Service.requestTemplate with a standalone model
 */
export interface FormTemplate {
  id: string;

  // Metadata
  name: string; // "Customer Intake Form", "Equipment Inspection Form"
  description?: string;
  version: string; // Semantic versioning (e.g., "1.0.0")
  category?: string; // "intake", "service", "survey", "inspection"

  // Form configuration (JSON containing FormSettings)
  formSettings: FormSettings;

  // Status
  isActive: boolean; // Enable/disable without deleting
  isPublic: boolean; // Public templates can be shared/reused

  // Relations
  serviceIds: string[]; // Many-to-Many with Service

  // Versioning
  parentId?: string; // Parent template for version tracking

  // Soft delete
  deletedAt?: Date;

  // Audit
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FORM TEMPLATE DTO TYPES (for API requests/responses)
// ============================================================================

export interface CreateFormTemplateDto {
  name: string;
  description?: string;
  category?: string;
  formSettings: FormSettings;
  isActive?: boolean;
  isPublic?: boolean;
  serviceIds?: string[];
}

export interface UpdateFormTemplateDto {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  formSettings?: FormSettings;
  isActive?: boolean;
  isPublic?: boolean;
  serviceIds?: string[];
}

export interface FormTemplateListItemDto {
  id: string;
  name: string;
  description?: string;
  category?: string;
  version: string;
  isActive: boolean;
  isPublic: boolean;
  serviceCount: number; // Number of services using this template
  fieldCount: number; // Number of fields in the form
  createdAt: Date;
  updatedAt: Date;
}

export interface FormTemplateVersionDto {
  id: string;
  version: string;
  createdAt: Date;
  createdBy?: string;
  changes?: string; // Summary of changes
}
