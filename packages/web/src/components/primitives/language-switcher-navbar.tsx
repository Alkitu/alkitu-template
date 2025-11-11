'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/primitives/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/DropdownMenu';
import { Globe } from 'lucide-react';

export function LanguageSwitcherNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    let newPath = `/${lang}`;
    const pathSegments = pathname
      .split('/')
      .filter((segment) => segment !== '');

    if (
      pathSegments.length > 0 &&
      (pathSegments[0] === 'es' || pathSegments[0] === 'en')
    ) {
      // If there's already a language prefix, replace it
      newPath += `/${pathSegments.slice(1).join('/')}`;
    } else if (pathname !== '/') {
      // If no language prefix but not root, prepend new language
      newPath += pathname;
    }
    window.location.href = newPath;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
          Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
