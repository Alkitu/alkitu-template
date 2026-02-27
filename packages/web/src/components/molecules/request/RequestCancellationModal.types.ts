export interface RequestCancellationModalProps {
  open: boolean;
  onClose: () => void;
  requestId: string;
  serviceName?: string;
  onConfirm: (requestId: string, reason: string) => Promise<void>;
  isLoading?: boolean;
}
