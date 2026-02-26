'use client';

import { NotificationsPageOrganism } from '@/components/organisms-alianza/NotificationsPageOrganism';

export default function EmployeeNotificationsPage() {
  return <NotificationsPageOrganism requestsBasePath="/employee/requests" />;
}
