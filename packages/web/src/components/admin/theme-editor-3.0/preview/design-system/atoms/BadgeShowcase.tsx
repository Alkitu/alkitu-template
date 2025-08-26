'use client';

import React from 'react';
import { Badge } from '../../../design-system/atoms/Badge';
import { 
  Star, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Zap,
  Users,
  Calendar,
  Mail,
  Tag,
  Trash2
} from 'lucide-react';

interface BadgeContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function BadgeContainer({ name, tokenId, children }: BadgeContainerProps) {
  return (
    <div className="flex flex-col gap-2 p-3 border border-border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {name}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {tokenId}
        </span>
      </div>
      <div className="flex items-center justify-center min-h-[40px]">
        {children}
      </div>
    </div>
  );
}

export function BadgeShowcase() {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* Basic Badge */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <BadgeContainer name="Basic" tokenId="badge-basic">
          <Badge>Default</Badge>
        </BadgeContainer>
      </div>

      {/* With Icon */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <BadgeContainer name="With Icon" tokenId="badge-icon">
          <Badge variant="primary" icon={<Star />}>Featured</Badge>
        </BadgeContainer>
      </div>

      {/* Status Variants */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <BadgeContainer name="Status" tokenId="badge-status">
          <div className="flex gap-2">
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </BadgeContainer>
      </div>
    </div>
  );
}