'use client';

import React from 'react';
import { Badge } from '../../../design-system/atoms/Badge';
import { ShowcaseContainer } from './ShowcaseContainer';
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

// Using universal ShowcaseContainer - no need for custom BadgeContainer

export function BadgeShowcase() {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* Basic Badge */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Basic" tokenId="badge-basic">
          <Badge>Default</Badge>
        </ShowcaseContainer>
      </div>

      {/* With Icon */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="With Icon" tokenId="badge-icon">
          <Badge variant="primary" icon={<Star />}>Featured</Badge>
        </ShowcaseContainer>
      </div>

      {/* Status Variants */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Status" tokenId="badge-status">
          <div className="flex gap-2">
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </ShowcaseContainer>
      </div>
    </div>
  );
}