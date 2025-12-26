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
    if (segment === 'admin') return t('admin.routes.admin');
    if (segment === 'users') return t('admin.routes.users');
    if (segment === 'dashboard') return t('admin.routes.dashboard');
    if (segment === 'create') return t('Common.actions.create');
    if (segment === 'edit') return t('Common.actions.edit');
    if (segment === 'delete') return t('Common.actions.delete');
    if (segment === 'auth') return t('auth.routes.auth');
    if (segment === 'login') return t('auth.login.title');
    if (segment === 'register') return t('auth.register.title');
    if (segment === 'reset-password') return t('auth.routes.resetPassword');
    if (segment === 'new-password') return t('auth.routes.newPassword');
    if (segment === 'new-verification') return t('auth.routes.newVerification');
    if (segment === 'verify-request') return t('auth.routes.verifyRequest');
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
    <Breadcrumb className="[&>*]:text-zinc-800 [&>*]:text-tiny">
      <BreadcrumbList>
        <BreadcrumbItem className="capitalize underline [&>*]:hover:text-zinc-400">
          <BreadcrumbLink href="/">{homeLabel}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {showDropdown && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 capitalize">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">menú desplegable</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="capitalize underline [&>*]:hover:text-zinc-400"
                >
                  {dropdownItems}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem className="hover:underline [&>*]:hover:text-zinc-400 pointer-events-none [&>*]:text-tiny">
          <BreadcrumbPage>
            {getTranslation(pathSegments[pathSegments.length - 1], 'es')}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
