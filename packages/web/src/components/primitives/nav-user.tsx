'use client';

import {
  BadgeCheck,
  Bell,
  MessageSquare,
  ChevronsUpDown,
  CreditCard,
  Laptop,
  LogOut,
  Moon,
  Sparkles,
  Sun,
  Globe,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/atoms-alianza/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/molecules-alianza/DropdownMenu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/primitives/ui/sidebar';
import type { User } from '@/types';
import { useTranslations } from '@/context/TranslationsContext';
import { useTheme } from 'next-themes';
import { useThemeEditor } from '@/components/features/theme-editor-3.0/core/context/ThemeEditorContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { useTranslationContext } from '@/context/TranslationsContext';

// import { LanguageSwitcher } from './language-switcher';
import { NotificationBadge } from './notification-badge';
import { useNotificationCount } from '@/hooks/use-notification-count';

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const t = useTranslations('userNav');
  const { setTheme } = useTheme();
  const { setThemeMode } = useThemeEditor();
  const router = useRouter();
  const pathname = usePathname();
  const { setLocale } = useTranslationContext();
  const updatePreferencesMutation = trpc.user.updateMyPreferences.useMutation();
  const { count: unreadCount } = useNotificationCount({
    userId: user.id,
    enabled: !!user.id,
  });

  const handleLanguageChange = (lang: string) => {
    // Persist to DB
    const currentTheme = (localStorage.getItem('theme-mode') as 'light' | 'dark' | 'system') || 'system';
    updatePreferencesMutation.mutate({ theme: currentTheme, language: lang as 'es' | 'en' });

    setLocale(lang as 'es' | 'en');
    const newPath = `/${lang}${pathname.substring(3)}`;
    router.push(newPath);
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setTheme(mode);
    setThemeMode(mode as any);
    // Also update localStorage for consistency
    localStorage.setItem('theme-mode', mode);

    // Persist to DB
    const currentLang = pathname.split('/').filter(Boolean)[0] || 'es';
    updatePreferencesMutation.mutate({ theme: mode, language: currentLang as 'es' | 'en' });
  };

  const handleSignOut = useCallback(async () => {
    try {
      // Usar la misma ruta de logout que se configuró en el web
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/auth/login');
      } else {
        console.warn('Logout endpoint failed, clearing cookies manually');
        // En caso de error de la API, limpiar cookies manualmente
        document.cookie =
          'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie =
          'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error signing out:', error);

      // En caso de error, limpiar las cookies localmente
      document.cookie =
        'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie =
        'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* <LanguageSwitcher /> - Removed to avoid duplication and move to dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg z-[9999]"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                {t('upgradeToPro')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/${user.role || 'admin'}/profile`}>
                  <BadgeCheck />
                  {t('account')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">
                  <CreditCard />
                  {t('billing')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/chat" className="relative">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/notifications" className="relative">
                  <div className="relative">
                    <Bell className="h-4 w-4" />
                    <NotificationBadge count={unreadCount} />
                  </div>
                  {t('notifications')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                <Globe className="mr-2 h-4 w-4" />
                <span>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
                <Globe className="mr-2 h-4 w-4" />
                <span>Español</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
