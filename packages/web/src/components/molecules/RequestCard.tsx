import { Card, CardContent } from '@/components/primitives/Card';
import { cn } from '@/lib/utils';
import React from 'react';
import { Badge, Button, Typography, Icon } from '../atoms';
import type {
  RequestCardProps,
  RequestStatus,
  RequestPriority,
} from './RequestCard.types';

const statusConfig: Record<
  RequestStatus,
  {
    variant:
      | 'default'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'error'
      | 'outline';
    label: string;
  }
> = {
  pending: { variant: 'warning', label: 'Pending' },
  'in-progress': { variant: 'secondary', label: 'In Progress' },
  completed: { variant: 'success', label: 'Completed' },
  cancelled: { variant: 'outline', label: 'Cancelled' },
  rejected: { variant: 'error', label: 'Rejected' },
};

const priorityConfig: Record<
  RequestPriority,
  {
    variant: 'default' | 'secondary' | 'success' | 'warning' | 'error';
    label: string;
    icon: string;
  }
> = {
  low: { variant: 'secondary', label: 'Low', icon: 'arrow-down' },
  medium: { variant: 'default', label: 'Medium', icon: 'minus' },
  high: { variant: 'warning', label: 'High', icon: 'arrow-up' },
  urgent: { variant: 'error', label: 'Urgent', icon: 'alert-triangle' },
};

export const RequestCard: React.FC<RequestCardProps> = ({
  id,
  title,
  description,
  status,
  requestType,
  priority,
  createdAt,
  dueDate,
  assignee,
  actions,
  onClick,
  className,
  themeOverride,
  ...props
}) => {
  const statusInfo = statusConfig[status];
  const priorityInfo = priority ? priorityConfig[priority] : null;
  const isClickable = !!onClick;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        isClickable && 'cursor-pointer hover:shadow-lg',
        className,
      )}
      style={themeOverride}
      onClick={onClick}
      {...props}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Typography variant="h4" className="line-clamp-1">
                {title}
              </Typography>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {requestType && (
                  <Typography variant="caption" color="muted">
                    {requestType}
                  </Typography>
                )}
                {requestType && priorityInfo && (
                  <span className="text-muted-foreground">•</span>
                )}
                {priorityInfo && (
                  <div className="flex items-center gap-1">
                    <Icon name={priorityInfo.icon} size="sm" />
                    <Typography variant="caption" color="muted">
                      {priorityInfo.label} Priority
                    </Typography>
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <Badge variant={statusInfo.variant} size="sm">
              {statusInfo.label}
            </Badge>
          </div>

          {/* Description */}
          <Typography
            variant="p"
            color="muted"
            className="line-clamp-2 text-sm"
          >
            {description}
          </Typography>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {createdAt && (
              <div className="flex items-center gap-1">
                <Icon name="calendar" size="sm" />
                <Typography variant="caption">
                  Created {formatDate(createdAt)}
                </Typography>
              </div>
            )}

            {dueDate && (
              <div className="flex items-center gap-1">
                <Icon name="clock" size="sm" />
                <Typography variant="caption">
                  Due {formatDate(dueDate)}
                </Typography>
              </div>
            )}

            {assignee && (
              <div className="flex items-center gap-1">
                <Icon name="user" size="sm" />
                <Typography variant="caption">{assignee}</Typography>
              </div>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex justify-end gap-2 pt-2 border-t">
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
