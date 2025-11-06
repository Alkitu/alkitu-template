'use client';

import React from 'react';
import { EditorTabs } from './EditorTabs';
import { EditorSection } from '../../types/editor.types';

interface EditorNavigationProps {
  activeSection: EditorSection;
  onSectionChange: (section: EditorSection) => void;
  className?: string;
}

export function EditorNavigation({ 
  activeSection, 
  onSectionChange, 
  className = ""
}: EditorNavigationProps) {
  return (
    <div className={`border-b bg-card ${className}`}>
      <div className="p-2">
        <EditorTabs 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </div>
    </div>
  );
}