'use client';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/primitives/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/DropdownMenu';
import { useTranslations } from '@/context/TranslationsContext';
import React from 'react';
import Link from 'next/link';
import {
  RouteTranslation,
  RouteTranslations,
} from '@/types/route-translations';

interface BreadcrumbNavigationProps {
  type: 'auth' | 'admin' | 'user';
  homeLabel?: string;
  dropdownSliceEnd?: number;
}

export default function BreadcrumbNavigation({
  type,
  homeLabel = 'INSIDERS',
  dropdownSliceEnd = -1,
}: BreadcrumbNavigationProps) {
  const pathname = usePathname() ?? '/';
  const pathSegments = pathname.split('/').filter(Boolean);

  const t = useTranslations();

  const getTranslation = (segment: string, locale: string) => {
    const segmentMap: Record<string, string> = {
      // Admin & auth routes
      'admin': 'admin.routes.admin',
      'users': 'admin.routes.users',
      'dashboard': 'admin.routes.dashboard',
      'create': 'Common.actions.create',
      'edit': 'Common.actions.edit',
      'delete': 'Common.actions.delete',
      'auth': 'auth.routes.auth',
      'login': 'auth.login.title',
      'register': 'auth.register.title',
      'reset-password': 'auth.routes.resetPassword',
      'new-password': 'auth.routes.newPassword',
      'new-verification': 'auth.routes.newVerification',
      'verify-request': 'auth.routes.verifyRequest',
      // Shared routes (client, employee, admin)
      'notifications': 'dashboard.nav.notifications',
      'requests': 'dashboard.nav.requests',
      'locations': 'dashboard.nav.locations',
      'profile': 'dashboard.nav.profile',
      'services': 'dashboard.nav.services',
      'categories': 'dashboard.nav.categories',
      'catalog': 'dashboard.nav.catalog',
      'settings': 'dashboard.nav.settings',
      'analytics': 'dashboard.nav.analytics',
      'preferences': 'dashboard.nav.preferences',
      'new': 'dashboard.nav.newRequest',
    };
    const key = segmentMap[segment];
    if (key) return t(key);
    return segment;
  };

  const dropdownItems = pathSegments
    .slice(1, dropdownSliceEnd)
    .map((segment, index) => (
      <DropdownMenuItem key={index} className="capitalize text-tiny">
        <Link href={`/${pathSegments.slice(0, index + 2).join('/')}`}>
          {getTranslation(segment, 'es')}
        </Link>
      </DropdownMenuItem>
    ));

  const showDropdown = pathSegments.length > 3;

  return (
    <Breadcrumb className="[&>*]:text-tiny">
      <BreadcrumbList className="text-foreground/70">
        <BreadcrumbItem className="capitalize underline [&>*]:hover:text-primary">
          <BreadcrumbLink href="/">{homeLabel}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {showDropdown && (
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 capitalize">
                <BreadcrumbEllipsis className="h-4 w-4" />
                <span className="sr-only">menú desplegable</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="capitalize underline [&>*]:hover:text-primary"
              >
                {dropdownItems}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        )}
        {showDropdown && <BreadcrumbSeparator />}
        <BreadcrumbItem className="hover:underline pointer-events-none [&>*]:text-tiny">
          <BreadcrumbPage className="text-foreground font-medium">
            {getTranslation(pathSegments[pathSegments.length - 1], 'es')}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
