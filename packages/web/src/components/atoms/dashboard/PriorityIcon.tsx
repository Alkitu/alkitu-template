/**
 * PriorityIcon - Visual indicator for request priority
 * Atomic Design: Atom
 *
 * @example
 * <PriorityIcon priority="HIGH" />
 * <PriorityIcon priority="MEDIUM" className="h-5 w-5" />
 */

import { AlertCircle, Clock } from 'lucide-react';
import { PriorityIconProps, Priority } from './PriorityIcon.types';

export function PriorityIcon({ priority, className = '' }: PriorityIconProps) {
  const configs: Record<Priority, { Icon: typeof AlertCircle; color: string }> = {
    HIGH: { Icon: AlertCircle, color: 'text-red-500' },
    MEDIUM: { Icon: Clock, color: 'text-orange-500' },
    LOW: { Icon: Clock, color: 'text-blue-500' },
  };

  const config = configs[priority] || configs.MEDIUM;
  const { Icon, color } = config;

  return <Icon className={`h-4 w-4 ${color} ${className}`} />;
}
