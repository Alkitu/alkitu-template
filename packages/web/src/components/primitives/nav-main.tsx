'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/primitives/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/primitives/ui/sidebar';
import type { NavItem } from '@/types';
import { useCallback, useState } from 'react';

import { LanguageSwitcherNavbar } from './language-switcher-navbar';

export function NavMain({ items }: { items: NavItem[] }) {
  // Estado para tracking de qué menús están abiertos
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Callback para manejar el clic en un elemento desplegable
  const handleCollapsibleClick = useCallback((title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  // Agrupar items por sección
  const groupedItems = items.reduce(
    (acc, item) => {
      const section = (item as any).section || 'general';
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>,
  );

  const sectionLabels = {
    overview: '📊 RESUMEN',
    management: '👥 GESTIÓN',
    communication: '💬 COMUNICACIÓN',
    analytics: '📈 ANALÍTICAS',
    settings: '⚙️ CONFIGURACIÓN',
    general: 'GENERAL',
  };

  return (
    <>
      {Object.entries(groupedItems).map(([sectionKey, sectionItems]) => (
        <SidebarGroup key={sectionKey}>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {sectionLabels[sectionKey as keyof typeof sectionLabels] ||
              sectionKey}
          </SidebarGroupLabel>
          <SidebarMenu>
            {sectionItems.map((item) => {
              // Check if item has subitems to determine if it should be a dropdown
              const hasSubItems = item.items && item.items.length > 0;

              // If it has no subitems, render a direct link
              if (!hasSubItems) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              // Otherwise render a collapsible dropdown
              const isOpen = openItems[item.title] || item.isActive;

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  open={isOpen}
                  onOpenChange={() => handleCollapsibleClick(item.title)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        data-collapsible-trigger="true"
                        className="android-click-fix touch-target"
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="touch-target android-click-fix"
                            >
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
      <SidebarGroup>
        <LanguageSwitcherNavbar />
      </SidebarGroup>
    </>
  );
}
