# ALI-118: Request Template JSON Schema Design

**Date**: 2025-12-01
**Status**: Design Phase
**Version**: 1.0

---

## Overview

The `requestTemplate` field in the Service model stores a JSON schema that defines the dynamic form fields clients fill out when creating a service request. This schema must be flexible enough to support various field types while remaining simple to implement and validate.

---

## Design Principles

1. **Flexibility**: Support multiple field types (text, textarea, select, checkbox, file upload, etc.)
2. **Validation**: Include validation rules (required, min/max length, patterns, etc.)
3. **User-Friendly**: Clear labels, help text, and placeholders
4. **Extensible**: Easy to add new field types in the future
5. **Type-Safe**: Compatible with Zod validation and TypeScript types

---

## JSON Schema Structure

### Root Structure

```typescript
{
  "version": "1.0",
  "fields": [
    // Array of field definitions
  ]
}
```

### Field Definition

Each field in the `fields` array has the following structure:

```typescript
{
  "id": string,           // Unique identifier for the field (e.g., "issue_description")
  "type": FieldType,      // Type of input field
  "label": string,        // Display label
  "placeholder"?: string, // Placeholder text (optional)
  "helpText"?: string,    // Help text shown below field (optional)
  "required": boolean,    // Whether field is required
  "validation"?: object,  // Additional validation rules (optional)
  "options"?: array,      // For select, radio, checkbox types (optional)
  "defaultValue"?: any    // Default value (optional)
}
```

---

## Supported Field Types

### 1. Text Input (`text`)

Basic single-line text input.

```json
{
  "id": "contact_name",
  "type": "text",
  "label": "Contact Name",
  "placeholder": "Enter full name",
  "required": true,
  "validation": {
    "minLength": 2,
    "maxLength": 100
  }
}
```

**Validation Options**:
- `minLength`: Minimum character length
- `maxLength`: Maximum character length
- `pattern`: Regex pattern (e.g., for phone numbers)

---

### 2. Textarea (`textarea`)

Multi-line text input.

```json
{
  "id": "issue_description",
  "type": "textarea",
  "label": "Describe the Issue",
  "placeholder": "Provide detailed description...",
  "helpText": "Include as much detail as possible to help us understand the issue",
  "required": true,
  "validation": {
    "minLength": 10,
    "maxLength": 1000
  }
}
```

**Validation Options**:
- `minLength`: Minimum character length
- `maxLength`: Maximum character length

---

### 3. Number Input (`number`)

Numeric input with optional min/max values.

```json
{
  "id": "affected_units",
  "type": "number",
  "label": "Number of Affected Units",
  "placeholder": "0",
  "required": false,
  "validation": {
    "min": 0,
    "max": 1000,
    "integer": true
  }
}
```

**Validation Options**:
- `min`: Minimum value
- `max`: Maximum value
- `integer`: Only allow integers (no decimals)

---

### 4. Select Dropdown (`select`)

Dropdown menu with predefined options.

```json
{
  "id": "urgency_level",
  "type": "select",
  "label": "Urgency Level",
  "required": true,
  "options": [
    { "value": "low", "label": "Low - Can wait a few days" },
    { "value": "medium", "label": "Medium - Within 1-2 days" },
    { "value": "high", "label": "High - Within 24 hours" },
    { "value": "urgent", "label": "Urgent - Immediate attention needed" }
  ],
  "defaultValue": "medium"
}
```

**Options Format**:
- `value`: Internal value stored in database
- `label`: Display text shown to user

---

### 5. Radio Buttons (`radio`)

Single selection from multiple options (displayed as radio buttons).

```json
{
  "id": "access_available",
  "type": "radio",
  "label": "Will someone be available to provide access?",
  "required": true,
  "options": [
    { "value": "yes", "label": "Yes, someone will be present" },
    { "value": "no", "label": "No, we'll leave a key" }
  ]
}
```

---

### 6. Checkbox (`checkbox`)

Single boolean checkbox.

```json
{
  "id": "agree_to_terms",
  "type": "checkbox",
  "label": "I agree to the service terms and conditions",
  "required": true
}
```

---

### 7. Multi-Select Checkboxes (`checkboxGroup`)

Multiple selections from a list.

```json
{
  "id": "affected_areas",
  "type": "checkboxGroup",
  "label": "Which areas are affected?",
  "required": true,
  "options": [
    { "value": "kitchen", "label": "Kitchen" },
    { "value": "bathroom", "label": "Bathroom" },
    { "value": "living_room", "label": "Living Room" },
    { "value": "bedroom", "label": "Bedroom" },
    { "value": "hallway", "label": "Hallway" }
  ],
  "validation": {
    "minSelected": 1,
    "maxSelected": 5
  }
}
```

---

### 8. Date Picker (`date`)

Date selection input.

```json
{
  "id": "preferred_date",
  "type": "date",
  "label": "Preferred Service Date",
  "helpText": "Select your preferred date for service",
  "required": false,
  "validation": {
    "minDate": "today",
    "maxDate": "+30d"
  }
}
```

**Validation Options**:
- `minDate`: Minimum allowed date ("today", "+7d", "2025-01-01")
- `maxDate`: Maximum allowed date ("+30d", "2025-12-31")

---

### 9. Time Picker (`time`)

Time selection input.

```json
{
  "id": "preferred_time",
  "type": "time",
  "label": "Preferred Time Window",
  "required": false,
  "options": [
    { "value": "morning", "label": "Morning (8AM - 12PM)" },
    { "value": "afternoon", "label": "Afternoon (12PM - 5PM)" },
    { "value": "evening", "label": "Evening (5PM - 8PM)" }
  ]
}
```

---

### 10. File Upload (`file`)

File upload input (for photos, documents, etc.).

```json
{
  "id": "issue_photos",
  "type": "file",
  "label": "Upload Photos (Optional)",
  "helpText": "Upload photos showing the issue (max 5 files, 10MB each)",
  "required": false,
  "validation": {
    "maxFiles": 5,
    "maxSizeMB": 10,
    "acceptedTypes": ["image/jpeg", "image/png", "image/webp"]
  }
}
```

**Validation Options**:
- `maxFiles`: Maximum number of files
- `maxSizeMB`: Maximum file size in MB
- `acceptedTypes`: MIME types allowed

---

## Complete Example: Plumbing Service

```json
{
  "version": "1.0",
  "fields": [
    {
      "id": "issue_type",
      "type": "select",
      "label": "Type of Plumbing Issue",
      "required": true,
      "options": [
        { "value": "leak", "label": "Leak / Water Damage" },
        { "value": "clog", "label": "Clogged Drain / Toilet" },
        { "value": "no_water", "label": "No Water / Low Pressure" },
        { "value": "hot_water", "label": "Water Heater Issue" },
        { "value": "other", "label": "Other" }
      ]
    },
    {
      "id": "issue_description",
      "type": "textarea",
      "label": "Describe the Issue",
      "placeholder": "Provide detailed description...",
      "helpText": "Include when the issue started, what you've observed, and any relevant details",
      "required": true,
      "validation": {
        "minLength": 20,
        "maxLength": 1000
      }
    },
    {
      "id": "affected_areas",
      "type": "checkboxGroup",
      "label": "Which areas are affected?",
      "required": true,
      "options": [
        { "value": "kitchen", "label": "Kitchen" },
        { "value": "bathroom", "label": "Bathroom" },
        { "value": "laundry", "label": "Laundry Room" },
        { "value": "other", "label": "Other Area" }
      ]
    },
    {
      "id": "urgency_level",
      "type": "radio",
      "label": "Urgency Level",
      "required": true,
      "options": [
        { "value": "low", "label": "Low - Can wait a few days" },
        { "value": "medium", "label": "Medium - Within 1-2 days" },
        { "value": "high", "label": "High - Within 24 hours" },
        { "value": "emergency", "label": "Emergency - Active flooding/major leak" }
      ]
    },
    {
      "id": "water_shutoff",
      "type": "radio",
      "label": "Have you shut off the water?",
      "required": false,
      "options": [
        { "value": "yes", "label": "Yes" },
        { "value": "no", "label": "No" },
        { "value": "unknown", "label": "I don't know how" }
      ]
    },
    {
      "id": "preferred_date",
      "type": "date",
      "label": "Preferred Service Date",
      "helpText": "Select your preferred date (we'll confirm availability)",
      "required": false,
      "validation": {
        "minDate": "today",
        "maxDate": "+30d"
      }
    },
    {
      "id": "preferred_time",
      "type": "select",
      "label": "Preferred Time Window",
      "required": false,
      "options": [
        { "value": "morning", "label": "Morning (8AM - 12PM)" },
        { "value": "afternoon", "label": "Afternoon (12PM - 5PM)" },
        { "value": "evening", "label": "Evening (5PM - 8PM)" }
      ]
    },
    {
      "id": "access_available",
      "type": "radio",
      "label": "Will someone be available to provide access?",
      "required": true,
      "options": [
        { "value": "yes", "label": "Yes, I'll be present" },
        { "value": "key", "label": "No, I'll leave a key" }
      ]
    },
    {
      "id": "issue_photos",
      "type": "file",
      "label": "Upload Photos (Optional)",
      "helpText": "Upload photos showing the issue (max 5 files, 10MB each)",
      "required": false,
      "validation": {
        "maxFiles": 5,
        "maxSizeMB": 10,
        "acceptedTypes": ["image/jpeg", "image/png", "image/webp"]
      }
    },
    {
      "id": "additional_notes",
      "type": "textarea",
      "label": "Additional Notes (Optional)",
      "placeholder": "Any other information we should know?",
      "required": false,
      "validation": {
        "maxLength": 500
      }
    }
  ]
}
```

---

## Storage: Response Data Structure

When a client fills out the form, their responses are stored in `Request.templateResponses` as:

```json
{
  "issue_type": "leak",
  "issue_description": "Water leaking from under the kitchen sink...",
  "affected_areas": ["kitchen"],
  "urgency_level": "high",
  "water_shutoff": "yes",
  "preferred_date": "2025-12-05",
  "preferred_time": "morning",
  "access_available": "yes",
  "issue_photos": [
    "https://storage.example.com/uploads/abc123.jpg",
    "https://storage.example.com/uploads/def456.jpg"
  ],
  "additional_notes": "The leak started yesterday after running the dishwasher"
}
```

**Key Points**:
- Field IDs are used as keys
- Values match the field type:
  - `text`, `textarea`, `number`, `date`, `time`: string/number
  - `select`, `radio`: selected value
  - `checkbox`: boolean
  - `checkboxGroup`: array of selected values
  - `file`: array of file URLs (after upload)

---

## Validation Strategy

### Backend (NestJS)
- Validate that Service.requestTemplate follows the schema structure
- Validate Request.templateResponses matches the requestTemplate definition
- Check required fields, data types, min/max values, etc.
- Use Zod schemas for validation

### Frontend (Next.js)
- Dynamically render form based on requestTemplate
- Client-side validation before submission
- Show field-level error messages
- File upload handling with progress indicators

---

## TypeScript Types

```typescript
// Field types
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkboxGroup'
  | 'date'
  | 'time'
  | 'file';

// Option for select/radio/checkboxGroup
export interface FieldOption {
  value: string;
  label: string;
}

// Validation rules
export interface FieldValidation {
  // Text/Textarea
  minLength?: number;
  maxLength?: number;
  pattern?: string;

  // Number
  min?: number;
  max?: number;
  integer?: boolean;

  // CheckboxGroup
  minSelected?: number;
  maxSelected?: number;

  // Date
  minDate?: string;
  maxDate?: string;

  // File
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

// Field definition
export interface RequestTemplateField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation?: FieldValidation;
  options?: FieldOption[];
  defaultValue?: any;
}

// Complete template
export interface RequestTemplate {
  version: string;
  fields: RequestTemplateField[];
}

// Response data
export type TemplateResponses = Record<string, any>;
```

---

## Implementation Phases

### Phase 1: Basic Field Types (MVP)
- [x] text
- [x] textarea
- [x] select
- [x] radio
- [x] checkbox

### Phase 2: Advanced Field Types
- [x] number
- [x] checkboxGroup
- [x] date
- [x] time

### Phase 3: File Uploads
- [x] file (with cloud storage integration)

---

## Security Considerations

1. **Template Validation**: Validate requestTemplate structure when creating/updating services
2. **Response Validation**: Validate templateResponses against the template on request creation
3. **File Uploads**:
   - Validate file types and sizes
   - Scan for malware
   - Store in secure cloud storage (AWS S3, Cloudinary, etc.)
   - Generate signed URLs for access
4. **Input Sanitization**: Sanitize all user input to prevent XSS
5. **Max Template Size**: Limit requestTemplate JSON to reasonable size (e.g., 50KB)

---

## Future Enhancements

- **Conditional Fields**: Show/hide fields based on other field values
- **Field Groups**: Group related fields together with headers
- **Custom Validation**: JavaScript-based custom validation functions
- **Multi-language Support**: i18n for labels and help text
- **Field Dependencies**: Fields that depend on previous selections
- **Templates Library**: Pre-built templates for common services

---

## Status

**Current**: ✅ Design Complete
**Next**: Implement database models and backend validation

---

**Document Version**: 1.0
**Last Updated**: 2025-12-01
**Author**: Claude Code
