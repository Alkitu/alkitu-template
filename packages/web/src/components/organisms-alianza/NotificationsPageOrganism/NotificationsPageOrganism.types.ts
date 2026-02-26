export interface NotificationData {
  requestId?: string;
  serviceId?: string;
  serviceName?: string;
  clientId?: string;
  clientName?: string;
  employeeId?: string;
  employeeName?: string;
  previousStatus?: string;
  newStatus?: string;
  cancellationReason?: string;
  completionNotes?: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  userId: string;
  title?: string;
  message: string;
  type: string;
  link: string | null;
  data: NotificationData | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsPageOrganismProps {
  /** Base path for request detail links (e.g. "/admin/requests") */
  requestsBasePath: string;
}
