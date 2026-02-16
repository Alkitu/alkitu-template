/// ALI-121: Email Templates & Automation - TypeScript Types (Unified System)

import type { RequestStatus } from './request';

export type TemplateTrigger =
  | 'ON_REQUEST_CREATED'
  | 'ON_STATUS_CHANGED'
  | 'ON_AUTH_EVENT'
  | 'ON_NOTIFICATION'
  | 'ON_MANUAL';

export type TemplateCategory = 'REQUEST' | 'AUTH' | 'NOTIFICATION' | 'MARKETING';

export interface LocalizedEmailContent {
  locale: string;
  subject: string;
  body: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: TemplateTrigger;
  status?: RequestStatus | null;
  active: boolean;
  // Unified system fields
  category: TemplateCategory;
  slug?: string | null;
  description?: string | null;
  localizations: LocalizedEmailContent[];
  defaultLocale: string;
  variables: string[];
  isDefault: boolean;
  defaultBody?: string | null;
  defaultSubject?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmailTemplateDto {
  name: string;
  subject: string;
  body: string;
  trigger: TemplateTrigger;
  status?: RequestStatus | null;
  active?: boolean;
}

export interface UpdateEmailTemplateDto {
  name?: string;
  subject?: string;
  body?: string;
  active?: boolean;
}

export interface PlaceholderData {
  request: {
    id: string;
    status: string;
    executionDateTime: Date | string;
    createdAt: Date | string;
    completedAt?: Date | string | null;
  };
  user: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string | null;
  };
  service: {
    name: string;
    category: string;
  };
  location: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  employee?: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string | null;
  } | null;
  templateResponses?: Record<string, any> | null;
}

export interface EmailTemplateWithPlaceholders extends EmailTemplate {
  placeholders: {
    subject: string[];
    body: string[];
  };
}

export interface SendTestEmailDto {
  templateId: string;
  recipient: string;
  requestId?: string;
  testData?: Partial<PlaceholderData>;
}

export interface EmailPreview {
  subject: string;
  body: string;
  recipient: string;
}

export interface AvailablePlaceholders {
  request: string[];
  user: string[];
  service: string[];
  location: string[];
  employee: string[];
  templateResponses: string[];
}

export const AVAILABLE_PLACEHOLDERS: AvailablePlaceholders = {
  request: [
    '{{request.id}}',
    '{{request.status}}',
    '{{request.executionDateTime}}',
    '{{request.createdAt}}',
    '{{request.completedAt}}',
  ],
  user: [
    '{{user.firstname}}',
    '{{user.lastname}}',
    '{{user.email}}',
    '{{user.phone}}',
  ],
  service: [
    '{{service.name}}',
    '{{service.category}}',
  ],
  location: [
    '{{location.street}}',
    '{{location.city}}',
    '{{location.state}}',
    '{{location.zipCode}}',
  ],
  employee: [
    '{{employee.firstname}}',
    '{{employee.lastname}}',
    '{{employee.email}}',
    '{{employee.phone}}',
  ],
  templateResponses: [
    '{{templateResponses.*}}', // Dynamic based on service template
  ],
};

/** Placeholders available for AUTH category templates */
export const AUTH_PLACEHOLDERS: string[] = [
  '{{user.name}}',
  '{{user.email}}',
  '{{login.url}}',
  '{{verification.url}}',
  '{{reset.url}}',
  '{{support.url}}',
];

/** Placeholders available for NOTIFICATION category templates */
export const NOTIFICATION_PLACEHOLDERS: string[] = [
  '{{user.name}}',
  '{{message}}',
  '{{action.url}}',
  '{{action.text}}',
];

/** Map of category to available placeholders */
export const PLACEHOLDERS_BY_CATEGORY: Record<TemplateCategory, string[]> = {
  REQUEST: [
    ...AVAILABLE_PLACEHOLDERS.request,
    ...AVAILABLE_PLACEHOLDERS.user,
    ...AVAILABLE_PLACEHOLDERS.service,
    ...AVAILABLE_PLACEHOLDERS.location,
    ...AVAILABLE_PLACEHOLDERS.employee,
  ],
  AUTH: AUTH_PLACEHOLDERS,
  NOTIFICATION: NOTIFICATION_PLACEHOLDERS,
  MARKETING: [
    '{{user.name}}',
    '{{user.email}}',
    '{{action.url}}',
    '{{action.text}}',
  ],
};

/** Grouped templates response type */
export interface GroupedEmailTemplates {
  category: TemplateCategory;
  label: string;
  templates: EmailTemplate[];
}
