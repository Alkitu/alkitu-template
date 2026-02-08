import React from 'react';
import Dashboard from '@/components/features/dashboard/dashboard';

/**
 * Client Layout Component
 *
 * Wraps all CLIENT role routes with the dashboard layout.
 * Role protection is handled by middleware.
 *
 * Provides client-specific navigation:
 * - Panel Principal (Dashboard)
 * - Nueva Solicitud (New Request)
 * - Mis Solicitudes (My Requests)
 * - Ubicaciones (Locations)
 * - Notificaciones (Notifications)
 * - Mi Perfil (Profile)
 *
 * @param children - Child routes to render within the dashboard
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Dashboard userRole="client">{children}</Dashboard>;
}
