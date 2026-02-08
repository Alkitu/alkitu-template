import type { HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * Status of an onboarding step
 */
export type StepStatus = 'completed' | 'current' | 'upcoming';

/**
 * Individual step configuration
 */
export interface OnboardingStep {
  /**
   * Unique identifier for the step
   */
  id: number | string;

  /**
   * Step title (pre-translated)
   */
  title: string;

  /**
   * Step description (pre-translated)
   */
  description: string;

  /**
   * Icon component from lucide-react
   */
  icon: LucideIcon;

  /**
   * Current status of the step
   * @default 'upcoming'
   */
  status?: StepStatus;

  /**
   * Navigation href when step is clicked
   */
  href?: string;

  /**
   * Whether the step is completed
   * @default false
   */
  completed?: boolean;
}

/**
 * Progress summary configuration
 */
export interface ProgressConfig {
  /**
   * Progress title (pre-translated)
   * @default "Setup Progress"
   */
  title?: string;

  /**
   * Template for progress text (pre-translated)
   * Use {completed} and {total} as placeholders
   * @example "{completed} of {total} completed"
   */
  progressText?: string;

  /**
   * Show progress bar
   * @default true
   */
  showProgressBar?: boolean;
}

/**
 * Completion card configuration
 */
export interface CompletionConfig {
  /**
   * Show completion card when all steps are done
   * @default true
   */
  show?: boolean;

  /**
   * Completion title (pre-translated)
   */
  title?: string;

  /**
   * Completion description (pre-translated)
   */
  description?: string;

  /**
   * Button text (pre-translated)
   */
  buttonText?: string;

  /**
   * Button href
   */
  buttonHref?: string;
}

/**
 * Props for OnboardingStepsCard organism
 *
 * IMPORTANT: All text props should be **translated strings** passed from page components.
 * This organism does NOT handle translations internally.
 */
export interface OnboardingStepsCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Array of onboarding steps
   */
  steps: OnboardingStep[];

  /**
   * Handler for step click
   */
  onStepClick?: (step: OnboardingStep) => void;

  /**
   * Progress configuration (all text pre-translated)
   */
  progressConfig?: ProgressConfig;

  /**
   * Completion card configuration (all text pre-translated)
   */
  completionConfig?: CompletionConfig;

  /**
   * Text for action button (pre-translated)
   * @default "Start"
   */
  actionButtonText?: string;

  /**
   * Text for completed status (pre-translated)
   * @default "Completed"
   */
  completedText?: string;

  /**
   * Custom className for container
   */
  className?: string;
}
