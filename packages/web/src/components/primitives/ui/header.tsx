import React from 'react';
import TailwindGrid from './TailwindGrid';
import BreadcrumbNavigation from './breadcrumb-navigation';
import { Separator } from './separator';
import { NotificationCenter } from '../../features/notifications/NotificationCenter';

interface HeaderProps {
  type: 'auth' | 'admin' | 'user';
  homeLabel: string;
  dropdownSliceEnd: number;
  separator?: boolean;
}

function Header({ type, homeLabel, dropdownSliceEnd, separator }: HeaderProps) {
  return (
    <TailwindGrid fullSize>
      <header className="h-14 lg:h-[60px] align-middle justify-between content-center gap-0 max-w-full col-start-1 col-end-full flex items-center bg-gray-100/40 dark:bg-gray-800/40 col-span-full">
        {separator && (
          <Separator orientation="vertical" className="mr-2 h-4 " />
        )}
        <div
          className={`flex items-center w-full flex-wrap justify-between ${
            !separator ? 'px-12' : ''
          }`}
        >
          <BreadcrumbNavigation
            type={type}
            homeLabel={homeLabel}
            dropdownSliceEnd={dropdownSliceEnd}
          />
          <NotificationCenter />
        </div>
      </header>
    </TailwindGrid>
  );
}

export default Header;
