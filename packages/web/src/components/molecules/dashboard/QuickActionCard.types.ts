/**
 * QuickActionCard - Type definitions
 * Atomic Design: Molecule
 */

import { LucideIcon } from 'lucide-react';

export interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  href: string;
  variant?: 'primary' | 'default';
  iconColor?: string;
}
