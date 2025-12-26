import { cn } from '@/lib/utils';
import React from 'react';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AdminPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string | React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function AdminPageHeader({
  title,
  description,
  actions,
  backHref,
  backLabel = "Back",
  className,
  children,
  ...props
}: AdminPageHeaderProps) {
  return (
    <div className={cn("space-y-4 mb-8", className)} {...props}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          {backHref && (
            <Link 
              href={backHref}
              className="group flex items-center text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {backLabel}
            </Link>
          )}
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            {title}
          </h1>
          {description && (
            <div className="text-sm text-muted-foreground md:text-base">
              {description}
            </div>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
