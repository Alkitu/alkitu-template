/**
 * StatCard - Type definitions
 * Atomic Design: Molecule
 */

import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  trend?: string;
  isLoading?: boolean;
}
