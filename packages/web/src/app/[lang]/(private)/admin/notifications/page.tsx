'use client';

import { NotificationsPageOrganism } from '@/components/organisms-alianza/NotificationsPageOrganism';

export default function AdminNotificationsPage() {
  return <NotificationsPageOrganism requestsBasePath="/admin/requests" />;
}
