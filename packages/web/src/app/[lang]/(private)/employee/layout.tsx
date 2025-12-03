import React from 'react';
import Dashboard from '@/components/features/dashboard/dashboard';

/**
 * Employee Layout Component
 *
 * Wraps all EMPLOYEE role routes with the dashboard layout.
 * Role protection is handled by middleware.
 *
 * @param children - Child routes to render within the dashboard
 */
export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Dashboard>{children}</Dashboard>;
}
