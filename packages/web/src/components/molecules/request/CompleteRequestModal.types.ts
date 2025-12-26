import type { Request } from '@alkitu/shared';

export interface CompleteRequestModalProps {
  open: boolean;
  onClose: () => void;
  request: Request | null;
  onConfirm: (requestId: string, notes?: string) => Promise<void>;
  isLoading?: boolean;
}
