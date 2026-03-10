'use client';

import { useRef, useCallback, useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Switch } from '@/components/primitives/ui/switch';
import { VariableChip } from '@/components/atoms-alianza/VariableChip';
import { EmailTemplate } from '@alkitu/shared';
import { RotateCcw, Save, Code, Eye, Globe, Info } from 'lucide-react';
import { Label } from '@/components/primitives/ui/label';
import { Textarea } from '@/components/primitives/ui/textarea';
import { EmailVisualEditor } from '@/components/molecules-alianza/EmailVisualEditor';
import type { EmailVisualEditorRef } from '@/components/molecules-alianza/EmailVisualEditor';

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
  t: (key: string) => string;
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
  t,
}: TemplateEditorFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<EmailVisualEditorRef>(null);
  const [editorMode, setEditorMode] = useState<'html' | 'visual'>('html');

  const insertVariable = useCallback(
    (variable: string) => {
      if (editorMode === 'visual') {
        editorRef.current?.insertContent(variable);
        return;
      }

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
    [body, onBodyChange, editorMode],
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
                     {template.active ? t('editor.active') : t('editor.inactive')}
                  </Label>
              </div>
           </div>
           <p className="text-sm text-muted-foreground">{template.description || t('editor.noDescription')}</p>
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
               {t('editor.reset')}
             </Button>
           )}
           <Button size="sm" onClick={onSave} disabled={isSaving}>
             <Save className="h-4 w-4 mr-2" />
             {isSaving ? t('editor.saving') : t('editor.save')}
           </Button>
        </div>
      </div>

       <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1 bg-muted p-1 rounded-md w-fit">
            {(['es', 'en'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => onLocaleChange(loc)}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-sm transition-all ${
                  locale === loc
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                {loc === 'es' ? 'Español' : 'English'}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {t('editor.editing')}: <strong>{locale === 'es' ? t('editor.spanish') : t('editor.english')}</strong>
          </span>
        </div>
        <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            Las traducciones no son automáticas. Recuerda editar y guardar las versiones en español e inglés por separado.
            <span className="mx-1.5 text-amber-400 dark:text-amber-600">|</span>
            Translations are not automatic. Remember to edit and save both the Spanish and English versions separately.
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        <div className="space-y-2">
          <Label htmlFor="subject">{t('editor.subject')}</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="e.g. Welcome to our platform"
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <div className="flex justify-between items-center">
             <Label htmlFor="body">{t('editor.body')}</Label>
             <div className="flex items-center space-x-1 bg-muted p-1 rounded-md">
               {([
                 { key: 'html' as const, label: 'HTML', icon: Code },
                 { key: 'visual' as const, label: 'Visual', icon: Eye },
               ]).map(({ key, label, icon: Icon }) => (
                 <button
                   key={key}
                   type="button"
                   onClick={() => setEditorMode(key)}
                   className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-sm transition-all ${
                     editorMode === key
                       ? 'bg-background text-foreground shadow-sm'
                       : 'text-muted-foreground hover:text-foreground'
                   }`}
                 >
                   <Icon className="h-3.5 w-3.5" />
                   {label}
                 </button>
               ))}
             </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('editor.bodyHint')}
          </p>
          {editorMode === 'html' ? (
            <Textarea
              ref={textareaRef}
              id="body"
              value={body}
              onChange={(e) => onBodyChange(e.target.value)}
              placeholder={t('editor.htmlPlaceholder')}
              className="font-mono text-sm min-h-[300px] flex-1 resize-y"
            />
          ) : (
            <EmailVisualEditor
              ref={editorRef}
              content={body}
              onContentChange={onBodyChange}
              placeholder={t('editor.visualPlaceholder')}
              className="flex-1"
              minHeight="300px"
            />
          )}
        </div>

        {variables.length > 0 && (
          <div className="pt-2 border-t">
            <Label className="mb-3 block text-xs uppercase tracking-wider text-muted-foreground">{t('editor.availableVariables')}</Label>
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
