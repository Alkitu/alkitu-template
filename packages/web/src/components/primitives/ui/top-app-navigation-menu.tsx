'use client';
import * as React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/primitives/icons';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/primitives/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { ModeToggleButton } from './mode-toggle-button';

type MenuItem = {
  title: string;
  mainContent?: {
    main?: boolean;
    title: string;
    description: string;
  };
  items: {
    title: string;
    href: string;
    description: string;
  }[];
};

const marketingItems = [
  {
    title: 'Redes Sociales',
    href: '/marketing/social',
    description:
      'Gestiona y optimiza tus redes sociales de manera profesional.',
  },
  {
    title: 'Email Marketing',
    href: '/marketing/email',
    description: 'Crea y gestiona campañas de email marketing efectivas.',
  },
  {
    title: 'Contenido Digital',
    href: '/marketing/content',
    description: 'Estrategias y herramientas para crear contenido de valor.',
  },
];

const formacionItems = [
  {
    title: 'Cursos Online',
    href: '/formaciones/cursos',
    description: 'Accede a nuestra biblioteca de cursos especializados.',
  },
  {
    title: 'Workshops',
    href: '/formaciones/workshops',
    description: 'Talleres prácticos con expertos del sector.',
  },
  {
    title: 'Certificaciones',
    href: '/formaciones/certificaciones',
    description: 'Obtén certificaciones profesionales reconocidas.',
  },
];

const menuItems: Record<string, MenuItem> = {
  inicio: {
    title: 'Inicio',
    mainContent: {
      main: true,
      title: 'Inside Hair',
      description:
        'Tu plataforma integral para el crecimiento profesional en el mundo de la belleza.',
    },
    items: [
      {
        title: 'Novedades',
        href: '/novedades',
        description: 'Descubre las últimas actualizaciones y contenidos.',
      },
      {
        title: 'Destacados',
        href: '/destacados',
        description: 'Contenido y recursos más populares.',
      },
      {
        title: 'Comunidad',
        href: '/comunidad',
        description: 'Conecta con otros profesionales del sector.',
      },
    ],
  },
  marketing: {
    title: 'Marketing',
    items: marketingItems, // usando el array existente
  },
  formaciones: {
    title: 'Formaciones',
    items: formacionItems, // usando el array existente
  },
  eventos: {
    title: 'Eventos',
    items: [
      {
        title: 'Próximos Eventos',
        href: '/eventos/proximos',
        description: 'Calendario de eventos y formaciones presenciales.',
      },
      {
        title: 'Eventos Grabados',
        href: '/eventos/grabados',
        description: 'Accede a las grabaciones de eventos anteriores.',
      },
    ],
  },
  insideClub: {
    title: 'Inside Club',
    items: [],
  },
};

export default function TopAppNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {Object.entries(menuItems).map(([key, section]) => (
          <NavigationMenuItem key={key}>
            {section.items.length > 0 ? (
              <>
                <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={cn(
                      'grid gap-3 p-4',
                      key === 'inicio'
                        ? 'md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'
                        : 'w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]',
                    )}
                  >
                    {section.mainContent && (
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                            {section.mainContent.main && (
                              <Icons.PackageIcon className="h-6 w-6" />
                            )}
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {section.mainContent.title}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {section.mainContent.description}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    )}
                    {section.items.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={`/${key}`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {section.title}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      <ModeToggleButton />
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
