/**
 * AdminUserDistributionCard - Type definitions
 * Atomic Design: Organism
 */

export interface RoleDistribution {
  label: string;
  count: number;
  color: string;
}

export interface AdminUserDistributionCardProps {
  title: string;
  subtitle: string;
  roles: RoleDistribution[];
  totalUsers: number;
  isLoading: boolean;
}
