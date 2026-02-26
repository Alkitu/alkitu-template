/**
 * Domain-Specific Molecules
 *
 * This barrel export contains domain-specific business logic components
 * that are NOT part of the generic design system (molecules-alianza).
 *
 * Architecture:
 * - molecules-alianza/ = Generic, reusable design system components
 * - molecules/ = Domain-specific business logic components
 *
 * Components in this directory are tightly coupled to:
 * - Business workflows (requests, locations, email templates)
 * - tRPC APIs
 * - Shared types from @alkitu/shared
 * - Specific use cases in the application
 */

// Location Molecules - Work location CRUD
export { LocationCardMolecule } from './location';
export type { LocationCardMoleculeProps } from './location';

// PlaceholderPalette Molecules - Email template placeholders
export { PlaceholderPaletteMolecule } from './placeholder-palette';
export type { PlaceholderPaletteMoleculeProps } from './placeholder-palette';

// Request Molecules - Request management business logic
export { RequestCardMolecule } from './request';
export { RequestClientCardMolecule } from './request';
export { RequestStatusBadgeMolecule } from './request';
export { RequestTimelineMolecule } from './request';
export { AssignRequestModal } from './request';
export { CancelRequestModal } from './request';
export { CompleteRequestModal } from './request';
export { QuickAssignModal } from './request';
export { QuickStatusModal } from './request';

export type {
  RequestCardMoleculeProps,
  RequestClientCardMoleculeProps,
  RequestStatusBadgeMoleculeProps,
  RequestTimelineMoleculeProps,
  AssignRequestModalProps,
  CancelRequestModalProps,
  CompleteRequestModalProps,
} from './request';
