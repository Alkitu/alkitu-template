'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '../../primitives/ui/sidebar';
import {
  Home,
  Users,
  Settings,
  BarChart,
  TrendingUp,
  FileText,
  Bell,
  Calendar,
  Activity,
  MessageCircle,
  CreditCard,
  Building2,
  User,
  HelpCircle,
  ShoppingBag,
  Folder,
  Wrench,
  Hash,
  ClipboardList,
} from 'lucide-react';
import { AppSidebar } from '../../primitives/app-sidebar';
import Header from '../../primitives/ui/header';
import TailwindGrid from '../../primitives/ui/TailwindGrid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../primitives/ui/card';
import { Badge } from '../../primitives/ui/badge';
import { Button } from '../../primitives/ui/button';
import { Separator } from '../../primitives/ui/separator';
import { Progress } from '../../primitives/ui/progress';
import { useTranslations } from '@/context/TranslationsContext';
import { getCurrentLocalizedRoute } from '@/lib/locale';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

// Navigation structure with improved UX/UI organization
const getTransformedData = (
  t: any,
  pathname: string,
  userRole: 'admin' | 'client' | 'employee' | 'user' = 'admin',
  featureFlags?: {
    supportChatEnabled?: boolean;
    teamChannelsEnabled?: boolean;
    analyticsEnabled?: boolean;
    notificationsEnabled?: boolean;
    emailTemplatesEnabled?: boolean;
  }
) => {
  // Client navigation
  if (userRole === 'client') {
    const navItems = [
      {
        title: t?.('nav.dashboard') || 'Panel Principal',
        url: '/client/dashboard',
        icon: Home,
        items: [],
        section: 'overview',
      },
      {
        title: t?.('nav.myRequests') || 'Mis Solicitudes',
        url: '/client/requests',
        icon: ClipboardList,
        section: 'management',
        items: [],
      },
      {
        title: t?.('nav.notifications') || 'Notificaciones',
        url: '/client/notifications',
        icon: Bell,
        section: 'communication',
        items: [],
      },
      {
        title: t?.('nav.profile') || 'Mi Perfil',
        url: '/client/profile',
        icon: User,
        section: 'settings',
        items: [
          {
            title: t?.('nav.account') || 'Cuenta',
            url: '/client/profile',
          },
        ],
      },
    ];

    return {
      navMain: navItems,
      user: {
        id: '',
        name: '',
        email: '',
        avatar: '/avatars/default.jpg',
      },
    };
  }

  // Employee navigation
  if (userRole === 'employee') {
    const navItems = [
      {
        title: t?.('nav.dashboard') || 'Panel Principal',
        url: '/employee/dashboard',
        icon: Home,
        items: [],
        section: 'overview',
      },
      {
        title: t?.('nav.assignedRequests') || 'Solicitudes Asignadas',
        url: '/employee/requests',
        icon: ClipboardList,
        section: 'management',
        items: [
          {
            title: t?.('nav.allRequests') || 'Todas las Solicitudes',
            url: '/employee/requests',
          },
          {
            title: t?.('nav.inProgress') || 'En Proceso',
            url: '/employee/requests?status=ongoing',
          },
          {
            title: t?.('nav.pending') || 'Pendientes',
            url: '/employee/requests?status=pending',
          },
        ],
      },
      {
        title: t?.('nav.notifications') || 'Notificaciones',
        url: '/employee/notifications',
        icon: Bell,
        section: 'communication',
        items: [],
      },
      {
        title: t?.('nav.profile') || 'Mi Perfil',
        url: '/employee/profile',
        icon: User,
        section: 'settings',
        items: [],
      },
    ];

    return {
      navMain: navItems,
      user: {
        id: '',
        name: '',
        email: '',
        avatar: '/avatars/default.jpg',
      },
    };
  }

  // Admin navigation
  if (userRole === 'admin') {
    const navItems = [
        // RESUMEN SECTION
        {
          title: t?.('nav.dashboard') || 'Dashboard',
          url: '/admin/dashboard',
          icon: Home,
          items: [],
          section: 'overview',
        },

        // GESTIÓN SECTION
        {
          title: t?.('nav.requests') || 'Solicitudes',
          url: '/admin/requests',
          icon: FileText,
          section: 'management',
          items: [
            {
              title: t?.('nav.requestList') || 'Lista de Solicitudes',
              url: '/admin/requests',
            },
          ],
        },
        {
          title: t?.('nav.users') || 'Usuarios',
          url: '/admin/users',
          icon: Users,
          section: 'management',
          items: [
            {
              title: t?.('nav.userList') || 'Lista de Usuarios',
              url: '/admin/users',
            },
            {
              title: t?.('nav.createUser') || 'Crear Usuario',
              url: '/admin/users/create',
            },
          ],
        },
        {
          title: t?.('nav.catalog') || 'Catálogo',
          url: '/admin/catalog',
          icon: ShoppingBag,
          section: 'management',
          items: [
            {
              title: t?.('nav.categories') || 'Categorías',
              url: '/admin/catalog/categories',
            },
            {
              title: t?.('nav.services') || 'Servicios',
              url: '/admin/catalog/services',
            },
          ],
        },

        // COMUNICACIÓN SECTION
        // Support Chat - conditionally rendered based on feature flag
        ...(featureFlags?.supportChatEnabled !== false ? [{
          title: t?.('nav.chat') || 'Chat',
          url: '/admin/chat',
          icon: MessageCircle,
          section: 'communication' as const,
          items: [
            {
              title: t?.('nav.conversations') || 'Conversaciones',
              url: '/admin/chat',
            },
            {
              title: t?.('nav.chatAnalytics') || 'Analíticas Chat',
              url: '/admin/chat/analytics',
            },
          ],
        }] : []),
        // Notifications - conditionally rendered based on feature flag
        ...(featureFlags?.notificationsEnabled !== false ? [{
          title: t?.('nav.notifications') || 'Notificaciones',
          url: '/admin/notifications',
          icon: Bell,
          section: 'communication' as const,
          items: [
            {
              title: t?.('nav.allNotifications') || 'Todas las Notificaciones',
              url: '/admin/notifications',
            },
            {
              title: t?.('nav.notificationAnalytics') || 'Analíticas',
              url: '/admin/notifications/analytics',
            },
            {
              title: t?.('nav.notificationPreferences') || 'Preferencias',
              url: '/admin/notifications/preferences',
            },
          ],
        }] : []),
        // Analytics - conditionally rendered based on feature flag
        ...(featureFlags?.analyticsEnabled !== false ? [{
          title: t?.('nav.analytics') || 'Analytics',
          url: '/admin/analytics',
          icon: BarChart,
          section: 'communication' as const,
          items: [
            {
              title: t?.('nav.analyticsOverview') || 'Resumen',
              url: '/admin/analytics',
            },
            {
              title: t?.('nav.analyticsReports') || 'Reportes',
              url: '/admin/analytics/reports',
            },
          ],
        }] : []),
        // Team Channels - conditionally rendered based on feature flag
        ...(featureFlags?.teamChannelsEnabled !== false ? [{
          title: t?.('nav.teamChat') || 'Team Chat',
          url: '/admin/channels',
          icon: Hash,
          section: 'communication' as const,
          items: [],
        }] : []),

        // CONFIGURACIÓN SECTION
        {
          title: t?.('nav.profile') || 'Mi Perfil',
          url: '/admin/profile',
          icon: User,
          section: 'settings',
          items: [],
        },
        {
          title: t?.('nav.settings') || 'Ajustes',
          url: '/admin/settings',
          icon: Settings,
          section: 'settings',
          items: [
            {
              title: t?.('nav.settingsGeneral') || 'General',
              url: '/admin/settings',
            },
            {
              title: t?.('nav.settingsChatbot') || 'Chatbot',
              url: '/admin/settings/chatbot',
            },
            {
              title: t?.('nav.settingsThemes') || 'Temas',
              url: '/admin/settings/themes',
            },
            ...(featureFlags?.emailTemplatesEnabled !== false ? [{
              title: t?.('nav.settingsEmailTemplates') || 'Email Templates',
              url: '/admin/settings/email-templates',
            }] : []),
          ],
        },
      ];

    return {
      navMain: navItems,
      user: {
        id: '',
        name: '',
        email: '',
        avatar: '/avatars/default.jpg',
      },
    };
  }

  // Regular user navigation
  return {
    navMain: [
      {
        title: t?.('nav.dashboard') || 'Dashboard',
        url: '/dashboard',
        icon: Home,
        items: [],
      },
      {
        title: t?.('nav.profile') || 'Mi Perfil',
        url: '/profile',
        icon: User,
        items: [],
      },
      {
        title: t?.('nav.settings') || 'Configuración',
        url: '/settings',
        icon: Settings,
        items: [
          { title: t?.('nav.account') || 'Cuenta', url: '/settings/account' },
          { title: t?.('nav.privacy') || 'Privacidad', url: '/settings/privacy' },
        ],
      },
      {
        title: t?.('nav.docs') || 'Documentación',
        url: '/docs',
        icon: FileText,
        items: [],
      },
      {
        title: t?.('nav.help') || 'Ayuda',
        url: '/help',
        icon: HelpCircle,
        items: [],
      },
    ],
    user: {
      id: '',
      name: '',
      email: '',
      avatar: '/avatars/default.jpg',
    },
  };
};

interface DashboardProps {
  children?: React.ReactNode;
  showWelcome?: boolean;
  userRole?: 'admin' | 'client' | 'employee' | 'user';
}

function Dashboard({ children, showWelcome = false, userRole = 'admin' }: DashboardProps) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const { data: sessionUser } = trpc.user.me.useQuery();
  const { data: fullUser } = trpc.user.getUserByEmail.useQuery(
    { email: sessionUser?.email || '' },
    { enabled: !!sessionUser?.email }
  );

  // Feature flags for conditional navigation
  const { isEnabled: supportChatEnabled } = useFeatureFlag('support-chat');
  const { isEnabled: teamChannelsEnabled } = useFeatureFlag('team-channels');
  const { isEnabled: analyticsEnabled } = useFeatureFlag('analytics');
  const { isEnabled: notificationsEnabled } = useFeatureFlag('notifications');
  const { isEnabled: emailTemplatesEnabled } = useFeatureFlag('email-templates');

  const transformedData = getTransformedData(t, pathname, userRole, {
    supportChatEnabled,
    teamChannelsEnabled,
    analyticsEnabled,
    notificationsEnabled,
    emailTemplatesEnabled,
  });

  const currentUser = fullUser || sessionUser;

  const user = currentUser ? {
    id: currentUser.id || 'user',
    name: (currentUser as any).name || `${(currentUser as any).firstname || ''} ${(currentUser as any).lastname || ''}`.trim() || (currentUser as any).role || 'User',
    email: currentUser.email || '',
    avatar: (currentUser as any).avatar || '/avatars/default.jpg',
    role: userRole,
  } : { ...transformedData.user, role: userRole };

  // Determine header type and home label based on role
  const headerType = userRole === 'admin' ? 'admin' : 'user';
  const homeLabel =
    userRole === 'admin'
      ? (t?.('nav.dashboard') || 'Dashboard')
      : userRole === 'client'
        ? (t?.('nav.clientDashboard') || 'Panel de Cliente')
        : userRole === 'employee'
          ? (t?.('nav.employeeDashboard') || 'Panel de Empleado')
          : (t?.('nav.home') || 'Inicio');

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar {...transformedData} user={user} />

      <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
        <div className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
          <SidebarTrigger className="-ml-1" />
          <div className="w-full col-start-1 col-end-full ">
            <Header
              type={headerType}
              homeLabel={homeLabel}
              dropdownSliceEnd={-1}
              separator
              userId={user?.id}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <TailwindGrid fullSize={true} padding="lg" className="p-0">
            {showWelcome && userRole === 'admin' && <DashboardWelcome />}
            <div className="col-span-4 md:col-span-8 lg:col-span-12">
              {children || (userRole === 'admin' && <DashboardOverview />)}
            </div>
          </TailwindGrid>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Dashboard Welcome Section
function DashboardWelcome() {
  const t = useTranslations('dashboard');

  return (
    <div className="col-span-4 md:col-span-8 lg:col-span-12 mb-6">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            {t?.('welcome.title') || 'Welcome to Alkitu Dashboard'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t?.('welcome.description') ||
              'Manage your projects, users, and analytics from one place.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {t?.('welcome.status') || 'System Online'}
            </Badge>
            <Badge variant="default">
              {t?.('welcome.version') || 'v1.0.0'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard Overview Section
function DashboardOverview() {
  const t = useTranslations('dashboard');

  return (
    <>
      {/* Quick Stats */}
      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t?.('stats.totalUsers') || 'Total Users'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +12% {t?.('stats.fromLastMonth') || 'from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t?.('stats.activeProjects') || 'Active Projects'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +8% {t?.('stats.fromLastMonth') || 'from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t?.('stats.revenue') || 'Revenue'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +20% {t?.('stats.fromLastMonth') || 'from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t?.('stats.notifications') || 'Notifications'}
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              {t?.('stats.unread') || 'unread messages'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="col-span-4 md:col-span-4 lg:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {t?.('recentActivity.title') || 'Recent Activity'}
            </CardTitle>
            <CardDescription>
              {t?.('recentActivity.description') ||
                'Latest updates from your projects'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: 'Luis Urdaneta',
                  action: 'completed project setup',
                  time: '2 hours ago',
                },
                {
                  user: 'Sarah Chen',
                  action: 'added new user permissions',
                  time: '4 hours ago',
                },
                {
                  user: 'Mike Johnson',
                  action: 'updated analytics dashboard',
                  time: '6 hours ago',
                },
                {
                  user: 'Anna Rodriguez',
                  action: 'created new project',
                  time: '8 hours ago',
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user} {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="col-span-4 md:col-span-4 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>{t?.('progress.title') || 'Project Progress'}</CardTitle>
            <CardDescription>
              {t?.('progress.description') ||
                'Overview of current project status'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Alkitu Platform</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mobile App</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Integration</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <Separator />
            <Button variant="outline" className="w-full">
              {t?.('progress.viewAll') || 'View All Projects'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Dashboard;
