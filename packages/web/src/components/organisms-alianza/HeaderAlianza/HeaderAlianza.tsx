'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import {
  useTranslations,
  useTranslationContext,
} from '@/context/TranslationsContext';
import { Button } from '@/components/molecules-alianza/Button';
import { Logo } from '@/components/atoms-alianza/Logo';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/primitives/ui/sheet';
import { Menu, Globe, LogOut, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/ui/dropdown-menu';
import { ThemeToggle } from '@/components/atoms-alianza/ThemeToggle';
import { cn } from '@/lib/utils';

export function HeaderAlianza() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const { setLocale } = useTranslationContext();
  const trpcUtils = trpc.useUtils();

  const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isLoggedIn = !!user;

  const updatePreferencesMutation = trpc.user.updateMyPreferences.useMutation();

  const handleLogout = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        await trpcUtils.user.me.invalidate();
    } catch (e) {
        console.error("Logout error", e);
    }
    // Clear cookies manually just in case, similar to NavUser
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    router.push('/auth/login');
  };

  const handleThemeChange = (mode: 'light' | 'dark') => {
    if (isLoggedIn) {
      updatePreferencesMutation.mutate({ theme: mode, language: currentLocale(pathname) });
    }
  };

  const handleLanguageChange = (newLocale: 'es' | 'en') => {
    // Persist to DB if logged in
    if (isLoggedIn) {
      const currentTheme = (localStorage.getItem('theme-mode') as 'light' | 'dark' | 'system') || 'system';
      updatePreferencesMutation.mutate({ theme: currentTheme, language: newLocale });
    }

    // Get current path without language prefix
    const segments = pathname.split('/').filter(Boolean);
    const currentLang = segments[0];

    let newPath = '';

    if (currentLang === 'es' || currentLang === 'en') {
      // Replace current language with new language
      segments[0] = newLocale;
      newPath = '/' + segments.join('/');
    } else {
      // Add language prefix to current path
      newPath = `/${newLocale}${pathname}`;
    }

    // Update client state and navigate
    setLocale(newLocale);
    router.push(newPath);
  };

  const publicRoutes = [
    { name: 'Inicio', href: '/' },
    { name: 'Características', href: '#features' },
    { name: 'Precios', href: '#pricing' },
    { name: 'Testimonios', href: '#testimonials' },
  ];

  const isAuthPage = pathname.startsWith('/auth') || pathname.includes('/auth/');

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md w-full sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[80px] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group transition-opacity hover:opacity-90">
              <Logo className="transition-transform duration-300 group-hover:scale-105" alt="Alkitu Template" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <div className="hidden lg:flex lg:items-center lg:space-x-10">
              {publicRoutes.map((route) => (
                <Link
                  key={route.name}
                  href={route.href}
                  className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group py-2"
                >
                  {route.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
             {/* Auth Buttons */}
            {isLoggedIn ? (
              <>
                 <Button 
                    className="text-sm font-medium border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300" 
                    variant="outline"
                    onClick={() => router.push('/admin/dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Panel Admin
                </Button>
                 <Button 
                    variant="ghost" 
                    className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors" 
                    onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                    className="cursor-pointer text-sm font-medium border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300" 
                    variant="outline"
                    onClick={() => router.push('/auth/login')}
                >
                  Iniciar Sesión
                </Button>
                
                <Button 
                    variant="main" 
                    className="cursor-pointer text-sm font-medium shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300" 
                    onClick={() => router.push('/auth/register')}
                >
                  Registrarse
                </Button>
              </>
            )}

            {/* Icons Divider */}
            <div className="h-8 w-px bg-border/50 mx-2" />

             {/* Theme & Language */}
            <ThemeToggle onThemeChange={handleThemeChange} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="cursor-pointer w-10 h-10 rounded-full border border-primary bg-transparent text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center group"
                  aria-label={t('navbar.language')}
                >
                  <Globe className="h-5 w-5 text-current transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-in fade-in zoom-in-95 duration-200">
                <DropdownMenuItem onClick={() => handleLanguageChange('es')} className="cursor-pointer">
                  <span className="mr-2 text-lg">🇪🇸</span> {t('navbar.spanish')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="cursor-pointer">
                  <span className="mr-2 text-lg">🇺🇸</span> {t('navbar.english')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 -mr-2 text-foreground/80 hover:text-foreground transition-colors">
                  <Menu className="h-8 w-8" />
                  <span className="sr-only">
                    {t('openMenu', {}, 'Common')}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-primary/10 p-0">
                <SheetTitle className="sr-only">Menú</SheetTitle>
                <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl">
                   <div className="p-6 pt-8 border-b border-border/10">
                      <Logo />
                   </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {!isAuthPage && (
                      <div className="flex flex-col space-y-4">
                        {publicRoutes.map((route) => (
                          <Link
                            key={route.name}
                            href={route.href}
                            className="text-lg font-medium text-foreground/70 hover:text-foreground hover:translate-x-1 transition-all duration-200 py-2 border-b border-border/30"
                            onClick={() => setIsOpen(false)}
                          >
                            {route.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Mobile Auth Buttons */}
                    <div className="space-y-4">
                      {isLoggedIn ? (
                         <>
                            <Button
                              variant="outline"
                              className="w-full justify-center text-base font-medium border-primary/20 h-12 gap-2"
                              onClick={() => {
                                router.push('/admin/dashboard');
                                setIsOpen(false);
                              }}
                            >
                              <LayoutDashboard className="w-5 h-5" />
                              Panel Admin
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-center text-base font-medium text-destructive hover:bg-destructive/10 h-12 gap-2"
                              onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                              }}
                            >
                              <LogOut className="w-5 h-5" />
                              Cerrar Sesión
                            </Button>
                         </>
                      ) : (
                         <>
                            <Button
                              variant="outline"
                              className="w-full justify-center text-base font-medium border-primary/20 h-12"
                              onClick={() => {
                                router.push('/auth/login');
                                setIsOpen(false);
                              }}
                            >
                              Iniciar Sesión
                            </Button>
                            <Button onClick={() => {
                                router.push('/auth/register');
                                setIsOpen(false);
                              }}
                              variant="main"
                              className="w-full justify-center text-base font-medium h-12 shadow-md"
                            >
                              Registrarse
                            </Button>
                         </>
                      )}
                    </div>

                    {/* Mobile Theme & Language */}
                    <div className="pt-6 border-t border-border/30 flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                         <span className="text-base font-medium text-muted-foreground">Tema</span>
                         <ThemeToggle onThemeChange={handleThemeChange} />
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <span className="text-base font-medium text-muted-foreground">{t('navbar.language')}</span>
                        <div className="grid grid-cols-2 gap-3">
                           <button
                              onClick={() => {
                                handleLanguageChange('es');
                                setIsOpen(false);
                              }}
                              className={cn("flex items-center justify-center py-3 px-3 rounded-[var(--radius-card)] text-sm border transition-all",
                                  currentLocale(pathname) === 'es' ? "bg-primary/10 border-primary text-primary font-medium" : "border-border hover:bg-muted"
                              )}
                            >
                              <span className="mr-2">🇪🇸</span> Español
                            </button>
                            <button
                              onClick={() => {
                                handleLanguageChange('en');
                                setIsOpen(false);
                              }}
                              className={cn("flex items-center justify-center py-3 px-3 rounded-[var(--radius-card)] text-sm border transition-all",
                                  currentLocale(pathname) === 'en' ? "bg-primary/10 border-primary text-primary font-medium" : "border-border hover:bg-muted"
                              )}
                            >
                              <span className="mr-2">🇺🇸</span> English
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Helper to get locale from path for UI highlighting
function currentLocale(path: string) {
    if (path.startsWith('/en')) return 'en';
    return 'es'; // default
}
