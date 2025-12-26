import type { Request } from '@alkitu/shared';

export interface CancelRequestModalProps {
  open: boolean;
  onClose: () => void;
  request: Request | null;
  onConfirm: (requestId: string, reason: string) => Promise<void>;
  isLoading?: boolean;
}
