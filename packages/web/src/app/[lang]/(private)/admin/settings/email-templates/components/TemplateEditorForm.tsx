'use client';

import { useRef, useCallback } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Switch } from '@/components/primitives/ui/switch';
import { VariableChip } from '@/components/atoms-alianza/VariableChip';
import { EmailTemplate } from '@alkitu/shared';
import { RotateCcw, Save } from 'lucide-react';
import { Label } from '@/components/primitives/ui/label';
import { Textarea } from '@/components/primitives/ui/textarea';

interface TemplateEditorFormProps {
  template: EmailTemplate;
  locale: string;
  onLocaleChange: (locale: string) => void;
  subject: string;
  body: string;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
  onToggleActive: () => void;
  isSaving: boolean;
  variables: string[];
}

export function TemplateEditorForm({
  template,
  locale,
  onLocaleChange,
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  onSave,
  onReset,
  onToggleActive,
  isSaving,
  variables,
}: TemplateEditorFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = useCallback(
    (variable: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBody = body.slice(0, start) + variable + body.slice(end);
      onBodyChange(newBody);

      requestAnimationFrame(() => {
        textarea.selectionStart = start + variable.length;
        textarea.selectionEnd = start + variable.length;
        textarea.focus();
      });
    },
    [body, onBodyChange],
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
           <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{template.name}</h2>
              <div className="flex items-center gap-2 px-2 py-1 bg-muted rounded-full">
                  <Switch
                   id="active-mode"
                   checked={template.active}
                   onCheckedChange={onToggleActive}
                   disabled={isSaving}
                   className="h-4 w-7"
                  />
                  <Label htmlFor="active-mode" className="text-xs text-muted-foreground font-medium cursor-pointer">
                     {template.active ? 'Active' : 'Inactive'}
                  </Label>
              </div>
           </div>
           <p className="text-sm text-muted-foreground">{template.description || 'No description provided.'}</p>
        </div>
        
        <div className="flex items-center gap-2">
            {template.isDefault && (
             <Button
               variant="outline"
               size="sm"
               onClick={onReset}
               disabled={isSaving}
             >
               <RotateCcw className="h-4 w-4 mr-2" />
               Reset
             </Button>
           )}
           <Button size="sm" onClick={onSave} disabled={isSaving}>
             <Save className="h-4 w-4 mr-2" />
             {isSaving ? 'Saving...' : 'Save'}
           </Button>
        </div>
      </div>

       <div className="flex items-center space-x-1 bg-muted p-1 rounded-md w-fit">
        {['es', 'en'].map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => onLocaleChange(loc)}
            className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-all ${
              locale === loc
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="e.g. Welcome to our platform"
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <div className="flex justify-between items-center">
             <Label htmlFor="body">Email Body (HTML)</Label>
             <span className="text-xs text-muted-foreground">Supports HTML & Variables</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your content will be automatically wrapped in the standard email layout with header and footer.
          </p>
          <Textarea
            ref={textareaRef}
            id="body"
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder="Write your email content HTML here..."
            className="font-mono text-sm min-h-[300px] flex-1 resize-y"
          />
        </div>

        {variables.length > 0 && (
          <div className="pt-2 border-t">
            <Label className="mb-3 block text-xs uppercase tracking-wider text-muted-foreground">Available Variables</Label>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <VariableChip
                  key={variable}
                  variable={variable}
                  onClick={insertVariable}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
