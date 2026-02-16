'use client';

import { EmailTemplate, GroupedEmailTemplates } from '@alkitu/shared';
import { EmailTemplateCard } from './EmailTemplateCard';
import { Key } from 'react';

interface TemplateGridProps {
  groups: GroupedEmailTemplates[];
  onEdit: (template: EmailTemplate) => void;
  onToggleActive: (template: EmailTemplate) => void;
}

export function TemplateGrid({ groups, onEdit, onToggleActive }: TemplateGridProps) {
  // Flatten templates or keep them grouped? 
  // The user requirement image shows "Plantillas de Emails" title and then cards.
  // We can show sections for each group.

  if (!groups || groups.length === 0) {
     return (
        <div className="text-center py-20 text-muted-foreground">
           <p>No email templates found.</p>
        </div>
     );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.category} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2">
            <h3 className="text-lg font-semibold text-foreground capitalize">
              {group.label}
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {group.templates.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {group.templates.map((template) => (
              <EmailTemplateCard
                key={template.id}
                template={template}
                onEdit={onEdit}
                onToggleActive={onToggleActive}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
