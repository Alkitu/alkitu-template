import { Card, CardContent } from '@/components/primitives/Card';
import { cn } from '@/lib/utils';
import React from 'react';
import { Badge, Button, Typography, Avatar } from '../atoms';
import type { ServiceCardProps, ServiceStatus } from './ServiceCard.types';

const statusConfig: Record<
  ServiceStatus,
  {
    variant: 'default' | 'secondary' | 'success' | 'warning' | 'error';
    label: string;
  }
> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'error', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  maintenance: { variant: 'secondary', label: 'Maintenance' },
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  status,
  category,
  pricing,
  image,
  actions,
  onClick,
  className,
  themeOverride,
  ...props
}) => {
  const statusInfo = statusConfig[status];
  const isClickable = !!onClick;

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
        <div className="flex items-start gap-4">
          {/* Service Icon/Image */}
          <div className="shrink-0">
            {image ? (
              <Avatar
                src={image}
                alt={title}
                size="lg"
                variant="rounded"
                fallback={title.substring(0, 2).toUpperCase()}
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                <Typography
                  variant="span"
                  className="font-semibold text-primary"
                >
                  {title.substring(0, 2).toUpperCase()}
                </Typography>
              </div>
            )}
          </div>

          {/* Service Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Typography variant="h4" className="line-clamp-1">
                  {title}
                </Typography>
                {category && (
                  <Typography variant="caption" color="muted" className="mt-1">
                    {category}
                  </Typography>
                )}
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
              className="mt-2 line-clamp-2 text-sm"
            >
              {description}
            </Typography>

            {/* Pricing and Actions */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                {pricing && (
                  <Typography variant="p" className="font-semibold">
                    {pricing}
                  </Typography>
                )}
              </div>

              {/* Default Actions */}
              <div className="flex gap-2">
                {actions ? (
                  actions
                ) : (
                  <>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                    <Button variant="primary" size="sm">
                      Manage
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
