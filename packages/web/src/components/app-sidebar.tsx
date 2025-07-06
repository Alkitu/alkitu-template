"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import type { NavItem, User, Team } from "@/types";
import { IconType } from "react-icons";

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
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        {teams && <TeamSwitcher teams={teams} onTeamChange={onTeamChange} />}
      </SidebarHeader>
      <SidebarContent>{navMain && <NavMain items={navMain} />}</SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
