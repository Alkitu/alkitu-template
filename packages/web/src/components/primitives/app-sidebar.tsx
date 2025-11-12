'use client';

import * as React from 'react';
import { NavMain } from '@/components/primitives/nav-main';
import { NavUser } from '@/components/primitives/nav-user';
import { TeamSwitcher } from '@/components/primitives/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/primitives/ui/sidebar';
import { LucideIcon } from 'lucide-react';
import type { NavItem, User, Team } from '@/types';
import { IconType } from 'react-icons';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navMain?: NavItem[];
  user?: User;
  teams?: {
    name: string;
    logo: LucideIcon | IconType;
    plan: string;
    routes: {
      id: string;
      icon: string;
      path: string;
      translations: {
        en: string;
        es: string;
      };
    }[];
  }[];
  onTeamChange?: (teamName: string) => void;
}

export function AppSidebar({
  navMain,
  user,
  teams,
  onTeamChange,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {teams && <TeamSwitcher teams={teams} onTeamChange={onTeamChange} />}
      </SidebarHeader>
      <SidebarContent>{navMain && <NavMain items={navMain} />}</SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-2">
          <ThemeToggle />
        </div>
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
