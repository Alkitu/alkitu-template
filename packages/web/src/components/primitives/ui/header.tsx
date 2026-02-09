import React from 'react';
import TailwindGrid from './TailwindGrid';
import BreadcrumbNavigation from './breadcrumb-navigation';
import { Separator } from './separator';
import { NotificationCenter } from '../../features/notifications/NotificationCenter';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

interface HeaderProps {
  type: 'auth' | 'admin' | 'user';
  homeLabel: string;
  dropdownSliceEnd: number;
  separator?: boolean;
  userId?: string;
}

function Header({ type, homeLabel, dropdownSliceEnd, separator, userId }: HeaderProps) {
  // Check if notifications feature is enabled
  const { isEnabled: notificationsEnabled } = useFeatureFlag('notifications');

  return (
    <header className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {separator && (
          <div className="mr-2 h-4 w-[1px] bg-border" />
        )}
        <BreadcrumbNavigation
          type={type}
          homeLabel={homeLabel}
          dropdownSliceEnd={dropdownSliceEnd}
        />
      </div>
      <div className="flex items-center gap-2">
        {notificationsEnabled !== false && <NotificationCenter userId={userId} />}
      </div>
    </header>
  );
}

export default Header;
