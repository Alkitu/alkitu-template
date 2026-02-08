/**
 * DashboardOverview - Type definitions
 * Atomic Design: Organism
 */

import { LucideIcon } from 'lucide-react';

/**
 * Quick action button data
 */
export interface QuickAction {
  label: string;
  subtitle?: string;
  href: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary';
  iconColor?: string;
}

/**
 * Stats labels for display
 */
export interface StatsLabels {
  pending: string;
  active: string;
  completed: string;
}

/**
 * Stats data
 */
export interface StatsData {
  pending: number | string;
  active: number | string;
  completed: number | string;
}

/**
 * Props for DashboardOverview organism
 *
 * IMPORTANT: All text props should be **translated strings** passed from page components.
 * This organism does NOT handle translations internally.
 */
export interface DashboardOverviewProps {
  /**
   * User's name for welcome message
   */
  userName?: string;

  /**
   * Welcome message text (pre-translated)
   */
  welcomeMessage?: string;

  /**
   * Subtitle text (pre-translated)
   */
  subtitle?: string;

  /**
   * Labels for stats (pre-translated)
   */
  statsLabels: StatsLabels;

  /**
   * Stats data to display
   */
  statsData?: StatsData;

  /**
   * Quick action buttons
   */
  actions?: QuickAction[];

  /**
   * Loading state for stats
   * @default false
   */
  isLoadingStats?: boolean;

  /**
   * Under construction mode
   * @default false
   */
  isUnderConstruction?: boolean;

  /**
   * Construction title (pre-translated)
   */
  constructionTitle?: string;

  /**
   * Construction message (pre-translated)
   */
  constructionMessage?: string;

  /**
   * Construction status text (pre-translated)
   */
  constructionStatus?: string;

  /**
   * Custom className for container
   */
  className?: string;
}
