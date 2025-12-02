import React from 'react';
import Dashboard from '@/components/features/dashboard/dashboard';

/**
 * Client Layout Component
 *
 * Wraps all CLIENT role routes with the dashboard layout.
 * Role protection is handled by middleware.
 *
 * @param children - Child routes to render within the dashboard
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Dashboard>{children}</Dashboard>;
}
