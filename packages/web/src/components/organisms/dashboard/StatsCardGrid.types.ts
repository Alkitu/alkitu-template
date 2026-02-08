/**
 * StatsCardGrid - Type definitions
 * Atomic Design: Organism
 */

import { LucideIcon } from 'lucide-react';

export interface StatCardData {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  trend?: string;
}

export interface StatsCardGridProps {
  stats: StatCardData[];
  isLoading: boolean;
  columns?: number;
  className?: string;
}
