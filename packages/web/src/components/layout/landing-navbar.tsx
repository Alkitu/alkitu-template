'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  useTranslations,
  useTranslationContext,
} from '@/context/TranslationContext';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const { locale, setLocale } = useTranslationContext();

  const handleLanguageChange = (newLocale: 'es' | 'en') => {
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

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  A
                </span>
              </div>
              <span className="font-bold text-xl">Alkitu Template</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {publicRoutes.map((route) => (
              <Link
                key={route.name}
                href={route.href}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {route.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth & Language */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Registrarse</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">{t('navbar.language')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
                  🇪🇸 {t('navbar.spanish')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                  🇺🇸 {t('navbar.english')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">
                    {t('navbar.openMenu', {}, 'Common')}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">
                          A
                        </span>
                      </div>
                      <span className="font-bold text-xl">Alkitu Template</span>
                    </Link>
                  </div>

                  <div className="flex flex-col space-y-3">
                    {publicRoutes.map((route) => (
                      <Link
                        key={route.name}
                        href={route.href}
                        className="text-foreground/80 hover:text-foreground transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {route.name}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className="border-t pt-4 space-y-3">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        Iniciar Sesión
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        Registrarse
                      </Link>
                    </Button>
                  </div>

                  {/* Mobile Language Selector */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">
                      {t('navbar.language')}
                    </p>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => {
                          handleLanguageChange('es');
                          setIsOpen(false);
                        }}
                        className="flex items-center space-x-2 py-2 text-foreground/80 hover:text-foreground w-full text-left"
                      >
                        <span>🇪🇸</span>
                        <span>{t('navbar.spanish')}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLanguageChange('en');
                          setIsOpen(false);
                        }}
                        className="flex items-center space-x-2 py-2 text-foreground/80 hover:text-foreground w-full text-left"
                      >
                        <span>🇺🇸</span>
                        <span>{t('navbar.english')}</span>
                      </button>
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
