/**
 * AdminRecentActivityCard - Type definitions
 * Atomic Design: Organism
 */

export interface AdminRecentActivityCardProps {
  title: string;
  subtitle: string;
  newUsersLabel: string;
  newUsersCount: number;
  totalUsers: number;
  isLoading: boolean;
}
