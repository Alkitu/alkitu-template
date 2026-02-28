'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { Card } from '@/components/primitives/ui/card';
import { Switch } from '@/components/primitives/ui/switch';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Icon } from '@/components/atoms-alianza/Icon';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Button } from '@/components/primitives/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/primitives/ui/collapsible';

// Feature impact information
const featureImpact: Record<string, {
  sidebarItems?: { name: string; url: string; status: 'visible' | 'hidden' }[];
  pages?: { name: string; url: string; status: 'enabled' | 'disabled' | 'hidden' }[];
  components?: { name: string; location: string; status: 'visible' | 'hidden' }[];
  widgets?: { name: string; location: string; status: 'visible' | 'hidden' }[];
}> = {
  'support-chat': {
    sidebarItems: [
      { name: 'Chat (Conversaciones)', url: '/admin/chat', status: 'visible' },
    ],
    pages: [
      { name: 'Lista de Conversaciones', url: '/admin/chat', status: 'enabled' },
      { name: 'Analíticas de Chat', url: '/admin/chat/analytics', status: 'enabled' },
      { name: 'Conversación Individual', url: '/admin/chat/[id]', status: 'enabled' },
    ],
    components: [
      { name: 'Widget de Chat Público', location: 'Sitio Web Público', status: 'visible' },
    ],
  },
  'team-channels': {
    sidebarItems: [
      { name: 'Team Chat (Canales)', url: '/admin/channels', status: 'visible' },
    ],
    pages: [
      { name: 'Canales de Equipo', url: '/admin/channels', status: 'enabled' },
      { name: 'Canal Individual', url: '/admin/channels/[id]', status: 'enabled' },
    ],
  },
  'request-collaboration': {
    components: [
      { name: 'Panel de Chat en Requests', location: 'Request Detail Page', status: 'visible' },
    ],
  },
  analytics: {
    sidebarItems: [
      { name: 'Analytics Dashboard', url: '/admin/analytics', status: 'visible' },
      { name: 'Reportes', url: '/admin/reports', status: 'visible' },
    ],
    pages: [
      { name: 'Dashboard de Analíticas', url: '/admin/analytics', status: 'enabled' },
      { name: 'Reportes Personalizados', url: '/admin/reports', status: 'enabled' },
      { name: 'Exportación de Datos', url: '/admin/exports', status: 'enabled' },
    ],
  },
  notifications: {
    pages: [
      { name: 'Todas las Notificaciones', url: '/admin/notifications', status: 'enabled' },
      { name: 'Analíticas de Notificaciones', url: '/admin/notifications/analytics', status: 'enabled' },
      { name: 'Preferencias', url: '/admin/notifications/preferences', status: 'enabled' },
    ],
    components: [
      { name: 'Notificaciones Push', location: 'Toda la aplicación', status: 'visible' },
      { name: 'Notificaciones Email', location: 'Sistema de email', status: 'visible' },
      { name: 'Notificaciones In-App', location: 'Campana de notificaciones', status: 'visible' },
    ],
  },
  'email-templates': {
    sidebarItems: [
      { name: 'Email Templates', url: '/admin/settings/email-templates', status: 'visible' },
    ],
    pages: [
      { name: 'Editor de Email Templates', url: '/admin/settings/email-templates', status: 'enabled' },
    ],
    components: [
      { name: 'Editor HTML con Preview', location: 'Pagina de Email Templates', status: 'visible' },
      { name: 'Selector de Idioma (es/en)', location: 'Pagina de Email Templates', status: 'visible' },
      { name: 'Chips de Variables', location: 'Pagina de Email Templates', status: 'visible' },
    ],
  },
  'media-manager': {
    sidebarItems: [
      { name: 'Media Manager', url: '/admin/media', status: 'visible' },
    ],
    pages: [
      { name: 'Explorador de archivos', url: '/admin/media', status: 'enabled' },
    ],
    components: [
      { name: 'MediaBrowser', location: 'Media Manager page', status: 'visible' },
      { name: 'FolderBreadcrumb', location: 'Media Manager page', status: 'visible' },
      { name: 'FileGrid', location: 'Media Manager page', status: 'visible' },
    ],
  },
  'file-upload': {
    components: [
      { name: 'EnhancedDropZone', location: 'Media Manager & custom pages', status: 'visible' },
      { name: 'DirectFileUploadManager', location: 'Custom pages', status: 'visible' },
    ],
  },
};

export default function AddonsPage() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const { data: features, isLoading, refetch } = trpc.featureFlags.getAll.useQuery() as { data: any[] | undefined; isLoading: boolean; refetch: () => void };
  const toggleMutation = trpc.featureFlags.toggle.useMutation();

  const handleToggle = async (key: string, currentlyEnabled: boolean) => {
    try {
      await toggleMutation.mutateAsync({
        key,
        enabled: !currentlyEnabled,
      });
      toast.success(`Feature ${!currentlyEnabled ? 'enabled' : 'disabled'} successfully`);
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Addons & Features"
          description="Enable or disable platform features and addons"
          backHref="/admin/settings"
          backLabel="Back to Settings"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Addons & Features"
        description="Enable or disable platform features and addons"
        backHref="/admin/settings"
        backLabel="Back to Settings"
      />

      <div className="grid grid-cols-1 gap-4">
        {features?.map((feature) => {
          const isEnabled = feature.status === 'ENABLED';
          const impact = featureImpact[feature.key];
          const isExpanded = expandedCards[feature.id] || false;

          return (
            <Card key={feature.id} className="p-6">
              {/* Header with toggle */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                    <Icon
                      name={feature.icon || 'Box'}
                      size="md"
                      variant="primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {feature.name}
                    </h3>
                    {feature.badge && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => handleToggle(feature.key, isEnabled)}
                  disabled={toggleMutation.isPending}
                />
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">
                {feature.description}
              </p>

              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-medium ${
                    isEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                  }`}
                >
                  {isEnabled ? '● Active' : '○ Inactive'}
                </span>
                {feature.enabledAt && isEnabled && (
                  <span className="text-xs text-muted-foreground">
                    Since {new Date(feature.enabledAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Impact Details - Collapsible */}
              {impact && (
                <Collapsible
                  open={isExpanded}
                  onOpenChange={(open) =>
                    setExpandedCards((prev) => ({ ...prev, [feature.id]: open }))
                  }
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs"
                    >
                      <span className="flex items-center gap-2">
                        {isEnabled ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <X className="h-3 w-3 text-gray-500" />
                        )}
                        Ver páginas y funciones afectadas
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-4">
                    <div className="space-y-4 text-sm">
                      {/* Sidebar Items */}
                      {impact.sidebarItems && impact.sidebarItems.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-xs uppercase text-muted-foreground">
                            📋 Opciones del Menú Lateral
                          </h4>
                          <div className="space-y-1 pl-4 border-l-2 border-border">
                            {impact.sidebarItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs"
                              >
                                {isEnabled ? (
                                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <X className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-muted-foreground">
                                    {item.url}
                                  </p>
                                </div>
                                <Badge
                                  variant={isEnabled ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {isEnabled ? 'Visible' : 'Oculto'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pages */}
                      {impact.pages && impact.pages.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-xs uppercase text-muted-foreground">
                            🌐 Páginas Afectadas
                          </h4>
                          <div className="space-y-1 pl-4 border-l-2 border-border">
                            {impact.pages.map((page, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs"
                              >
                                {isEnabled ? (
                                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <X className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{page.name}</p>
                                  <p className="text-muted-foreground">
                                    {page.url}
                                  </p>
                                </div>
                                <Badge
                                  variant={isEnabled ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {isEnabled ? 'Activa' : 'Desactivada'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Components */}
                      {impact.components && impact.components.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-xs uppercase text-muted-foreground">
                            🧩 Componentes Afectados
                          </h4>
                          <div className="space-y-1 pl-4 border-l-2 border-border">
                            {impact.components.map((component, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs"
                              >
                                {isEnabled ? (
                                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <X className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{component.name}</p>
                                  <p className="text-muted-foreground">
                                    {component.location}
                                  </p>
                                </div>
                                <Badge
                                  variant={isEnabled ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {isEnabled ? 'Visible' : 'Oculto'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Widgets */}
                      {impact.widgets && impact.widgets.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-xs uppercase text-muted-foreground">
                            🎨 Widgets Afectados
                          </h4>
                          <div className="space-y-1 pl-4 border-l-2 border-border">
                            {impact.widgets.map((widget, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs"
                              >
                                {isEnabled ? (
                                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <X className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{widget.name}</p>
                                  <p className="text-muted-foreground">
                                    {widget.location}
                                  </p>
                                </div>
                                <Badge
                                  variant={isEnabled ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {isEnabled ? 'Visible' : 'Oculto'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warning for partially implemented features */}
                      {(feature.key === 'support-chat' || feature.key === 'team-channels') && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="text-xs text-yellow-800 dark:text-yellow-200">
                            <strong>⚠️ Implementación Pendiente:</strong> Las opciones
                            del menú lateral y el bloqueo de rutas están pendientes de
                            implementación.
                          </p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </Card>
          );
        })}
      </div>

      {(!features || features.length === 0) && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No feature flags configured</p>
        </div>
      )}
    </div>
  );
}
