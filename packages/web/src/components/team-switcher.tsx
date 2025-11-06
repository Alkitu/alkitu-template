"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, LucideIcon, Palette } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

import type { Team } from "@/types"
import { IconType } from "react-icons"

interface TeamSwitcherProps {
  teams: {
    name: string
    logo: LucideIcon | IconType
    plan: string
    routes: {
      id: string
      icon: string
      path: string
      translations: {
        en: string
        es: string
      }
    }[]
  }[]
  onTeamChange?: (teamName: string) => void
}

export function TeamSwitcher({ teams, onTeamChange }: TeamSwitcherProps) {
  const { isMobile, state } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  const handleTeamChange = (team: typeof teams[0]) => {
    onTeamChange?.(team.name)
  }

  const isCollapsed = state === "collapsed"

  return (
    <>
      <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:size-6">
                {<activeTeam.logo className="size-4 group-data-[collapsible=icon]:size-3" />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleTeamChange(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
      
      {/* Theme Editor Quick Access - Solo visible cuando sidebar está colapsado */}
      {isCollapsed && (
        <div className="mt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/es/admin/settings/themes-3.0">
                  <SidebarMenuButton
                    size="lg"
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200 group-data-[collapsible=icon]:justify-center"
                  >
                    <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white group-data-[collapsible=icon]:size-6">
                      <Palette className="size-3 group-data-[collapsible=icon]:size-3" />
                    </div>
                  </SidebarMenuButton>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={4}>
                <p>Personalizar Tema V3</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  )
}
