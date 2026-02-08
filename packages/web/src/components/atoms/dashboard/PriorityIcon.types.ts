/**
 * PriorityIcon - Type definitions
 * Atomic Design: Atom
 */

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface PriorityIconProps {
  priority: Priority;
  className?: string;
}
