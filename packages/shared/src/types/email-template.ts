/// ALI-121: Email Templates & Automation - TypeScript Types

import type { RequestStatus } from './request';

export type TemplateTrigger = 'ON_REQUEST_CREATED' | 'ON_STATUS_CHANGED';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: TemplateTrigger;
  status?: RequestStatus | null;
  active: boolean;
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
