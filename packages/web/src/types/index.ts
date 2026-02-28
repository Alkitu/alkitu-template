import { LucideIcon } from 'lucide-react';
import { Icons } from '@/components/primitives/icons';

// Tipos existentes mejorados
export type IconKeys = keyof typeof Icons;

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface Project {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface User {
  id: string;
  name: string;
  firstname?: string;
  lastname?: string;
  email: string;
  avatar: string;
  role?: 'admin' | 'client' | 'employee' | 'user';
}

export interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
  routes: Route[];
}

export interface Route {
  id: string;
  icon: IconKeys;
  path: string;
  translations: {
    en: string;
    es: string;
  };
}
