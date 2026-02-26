'use client';

import { EnhancedDropZone } from './EnhancedDropZone';
import type { UploadFileItem } from './EnhancedDropZone';

interface DriveUploadZoneProps {
  folderId: string;
  folderName: string;
  className?: string;
  disabled?: boolean;
  allowedRoles?: string[];
  onUploadComplete?: (files: UploadFileItem[]) => void;
}

/**
 * "Batteries included" wrapper that obtains userRole from
 * alkitu's auth context and passes it to EnhancedDropZone.
 *
 * Adapt the `userRole` source to your auth store/hook.
 */
export function DriveUploadZone({
  allowedRoles,
  ...props
}: DriveUploadZoneProps) {
  // TODO: Obtain userRole from your auth store, e.g.:
  // import { useAuthStore } from '@/stores/auth';
  // const userRole = useAuthStore((s) => s.user?.role);
  const userRole: string | undefined = undefined;

  return (
    <EnhancedDropZone
      {...props}
      allowedRoles={allowedRoles}
      userRole={userRole}
    />
  );
}
