import React, { useState, useEffect } from 'react';
import TailwindGrid from './TailwindGrid';
import BreadcrumbNavigation from './breadcrumb-navigation';
import { Separator } from './separator';
import { NotificationCenter } from '../../features/notifications/NotificationCenter';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Logo } from '../../atoms-alianza/Logo';

interface HeaderProps {
  type: 'auth' | 'admin' | 'user';
  homeLabel: string;
  dropdownSliceEnd: number;
  separator?: boolean;
  userId?: string;
}

function Header({ type, homeLabel, dropdownSliceEnd, separator, userId }: HeaderProps) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  // Check if notifications feature is enabled
  const { isEnabled: notificationsEnabled } = useFeatureFlag('notifications');

  // Hydration mismatch fix: force feature flags to false during SSR/hydration
  const effectiveNotificationsEnabled = hasMounted ? notificationsEnabled : false;

  return (
    <header className="flex w-full items-center justify-between gap-4">
      <div className="hidden md:flex items-center gap-2 z-10">
        {separator && (
          <div className="mr-2 h-4 w-[1px] bg-border" />
        )}
        <BreadcrumbNavigation
          type={type}
          homeLabel={homeLabel}
          dropdownSliceEnd={dropdownSliceEnd}
        />
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
        <Logo className="scale-75 sm:scale-90 md:scale-100 origin-center" />
      </div>

      <div className="flex items-center gap-2 z-10 ml-auto">
        {effectiveNotificationsEnabled !== false && <NotificationCenter userId={userId} />}
      </div>
    </header>
  );
}

export default Header;
