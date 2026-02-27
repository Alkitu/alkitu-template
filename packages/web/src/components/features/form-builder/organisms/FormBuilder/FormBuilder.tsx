'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/primitives/ui/card';
import { Button } from '@/components/primitives/ui/button';
import { Label } from '@/components/primitives/ui/label';
import { Input } from '@/components/primitives/ui/input';
import { Textarea } from '@/components/primitives/ui/textarea';
import { Switch } from '@/components/primitives/ui/switch';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import { Badge } from '@/components/primitives/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/primitives/ui/tabs';
import {
  Copy,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Plus,
  Globe,
  InfoIcon as InfoCircle,
  Download,
  Upload,
  Eye,
  EyeOff,
  Search,
  // Field type icons
  TextIcon,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  List,
  Circle,
  ListChecks,
  ToggleLeft,
  Calendar,
  Clock,
  CalendarClock,
  Folder,
  Image,
  Images,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/primitives/ui/tooltip';

import type { FormBuilderProps, DropTarget } from './FormBuilder.types';
import type { FormSettings, FormField, FormFieldType, SupportedLocale } from '../../types';
import { FieldEditor } from '../FieldEditor';
import { FieldTypePicker } from '../FieldTypePicker';
import { generateFieldId, createDefaultField } from '../../lib/field-helpers';
import { cn } from '@/lib/utils';
import { FormPreview } from '../FormPreview';

/**
 * Field type icons map
 */
const FIELD_ICONS: Record<string, LucideIcon> = {
  text: TextIcon,
  textarea: AlignLeft,
  number: Hash,
  email: Mail,
  phone: Phone,
  select: List,
  radio: Circle,
  multiselect: ListChecks,
  toggle: ToggleLeft,
  date: Calendar,
  time: Clock,
  datetime: CalendarClock,
  group: Folder,
  imageSelect: Image,
  imageSelectMulti: Images,
  fileUpload: Upload,
};

/**
 * Default form settings
 */
const defaultSettings: FormSettings = {
  title: 'New Form',
  description: '',
  fields: [],
  submitButtonText: 'Submit',
  supportedLocales: ['en'],
  defaultLocale: 'en',
  showStepNumbers: true,
};

/**
 * FormBuilder Organism Component
 *
 * Main form builder interface that manages:
 * - Form metadata (title, description, submit button text)
 * - Field management (add, edit, delete, duplicate, reorder)
 * - Drag & drop field reordering with @dnd-kit
 * - Multi-locale support (EN/ES)
 * - Form configuration (supported locales, default locale)
 *
 * This is the top-level integration component for building forms.
 *
 * @example
 * ```tsx
 * <FormBuilder
 *   formSettings={settings}
 *   onChange={handleChange}
 *   supportedLocales={['en', 'es']}
 *   defaultLocale="en"
 * />
 * ```
 */
export function FormBuilder({
  formSettings: providedSettings,
  onChange,
  supportedLocales = ['en'],
  defaultLocale = 'en',
  driveFolderId,
}: FormBuilderProps) {
  // Merge provided settings with defaults
  const formSettings = React.useMemo(
    () => ({
      ...defaultSettings,
      ...providedSettings,
      supportedLocales:
        providedSettings?.supportedLocales || defaultSettings.supportedLocales,
      defaultLocale:
        providedSettings?.defaultLocale || defaultSettings.defaultLocale,
    }),
    [providedSettings]
  );

  // State management
  const [editingLocale, setEditingLocale] = React.useState<SupportedLocale>(
    formSettings.defaultLocale as SupportedLocale
  );
  const [collapsedFields, setCollapsedFields] = React.useState<Set<string>>(
    new Set()
  );
  const [showFieldPicker, setShowFieldPicker] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('builder');
  const [showPreview, setShowPreview] = React.useState(true);


  // Setup drag & drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check if form has groups (step mode)
  const hasGroups = formSettings.fields.some((field) => field.type === 'group');

  /**
   * Handle form settings change
   */
  const handleChange = (updates: Partial<FormSettings>) => {
    onChange({
      ...formSettings,
      ...updates,
    });
  };

  /**
   * Handle field change at specific index
   */
  const handleFieldChange = (updatedField: FormField, index: number) => {
    const newFields = [...formSettings.fields];
    newFields[index] = updatedField;
    handleChange({ fields: newFields });
  };

  /**
   * Handle adding a new field
   */
  const handleAddField = (fieldType: string) => {
    const type = fieldType.replace('form-', '');

    // Logic to handle transition from flat fields to groups (Steps)
    if (type === 'group' && !hasGroups && formSettings.fields.length > 0) {
      // 1. Create Initial Group with existing fields
      const initialGroup: FormField = {
        id: generateFieldId(),
        type: 'group',
        label: 'Step 1',
        validation: {},
        groupOptions: {
          title: 'Step 1',
          description: '',
          fields: [...formSettings.fields], // Move existing fields here
          showTitle: true,
          showDescription: false,
        }
      };

      // 2. Create the NEW requested group
      const newGroup: FormField = {
        id: generateFieldId(),
        type: 'group',
        label: 'Step 2',
        validation: {},
        groupOptions: {
          title: 'Step 2',
          description: '',
          fields: [],
          showTitle: true,
          showDescription: false,
        }
      };

      // 3. Replace fields with these two groups
      handleChange({ fields: [initialGroup, newGroup] });
      setShowFieldPicker(false);

      toast.success('Your form has been converted to a multi-step form. Existing fields are now in Step 1.');
      return;
    }

    const newField = createDefaultField(type as FormFieldType);
    handleChange({ fields: [...formSettings.fields, newField] });
    setShowFieldPicker(false);
  };

  /**
   * Handle removing a field
   */
  const handleRemoveField = (index: number) => {
    const newFields = formSettings.fields.filter((_, i) => i !== index);
    handleChange({ fields: newFields });
  };

  /**
   * Handle duplicating a field
   */
  const handleDuplicateField = (index: number) => {
    const field = formSettings.fields[index];
    const newField: FormField = {
      ...field,
      id: generateFieldId(),
      label: `${field.label} (copy)`,
    };
    const newFields = [...formSettings.fields];
    newFields.splice(index + 1, 0, newField);
    handleChange({ fields: newFields });
  };

  /**
   * Toggle field collapse state
   */
  const toggleFieldCollapse = (fieldId: string) => {
    setCollapsedFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) {
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }
      return next;
    });
  };

  /**
   * Handle drag end event from @dnd-kit
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formSettings.fields.findIndex((f) => f.id === active.id);
      const newIndex = formSettings.fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(formSettings.fields, oldIndex, newIndex);
        handleChange({ fields: newFields });
      }
    }
  };

  /**
   * Handle locale change for supported locales
   */
  const handleLocaleChange = (locale: SupportedLocale, checked: boolean) => {
    const currentLocales = formSettings.supportedLocales || ['en'];
    let newLocales: SupportedLocale[];

    if (checked) {
      newLocales = [...currentLocales, locale];
    } else {
      newLocales = currentLocales.filter((l) => l !== locale);
      // Ensure at least one locale
      if (newLocales.length === 0) newLocales = ['en'];
    }

    // Ensure default locale is in supported list
    if (
      formSettings.defaultLocale &&
      !newLocales.includes(formSettings.defaultLocale)
    ) {
      handleChange({
        supportedLocales: newLocales,
        defaultLocale: newLocales[0],
      });
    } else {
      handleChange({ supportedLocales: newLocales });
    }
  };

  /**
   * Export form settings as JSON
   */
  const handleExportJSON = () => {
    try {
      const jsonString = JSON.stringify(formSettings, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `form-${formSettings.title?.replace(/\s+/g, '-').toLowerCase() || 'export'}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Form settings exported as JSON file.');
    } catch (error) {
      toast.error('Failed to export form settings.');
    }
  };

  /**
   * Import form settings from JSON
   */
  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text);

        // Validate imported data has required fields
        if (!imported.fields || !Array.isArray(imported.fields)) {
          throw new Error('Invalid form settings format');
        }

        // Merge with defaults to ensure all required properties exist
        const validatedSettings: FormSettings = {
          ...defaultSettings,
          ...imported,
          supportedLocales: imported.supportedLocales || ['en'],
          defaultLocale: imported.defaultLocale || 'en',
        };

        onChange(validatedSettings);

        toast.success(`Imported form: ${validatedSettings.title || 'Untitled'}`);
      } catch (error) {
        toast.error('Failed to import form settings. Please check the JSON format.');
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Form Builder</h2>
            <span className="text-xs text-muted-foreground">
              {formSettings.fields.length} field{formSettings.fields.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportJSON}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button
              variant={showPreview ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className={cn('grid gap-4', showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}>
        {/* Editor */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">Form Builder</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

        {/* BUILDER TAB */}
        <TabsContent value="builder" className="space-y-6 mt-6">
          {/* Global Configuration Section */}
          <GlobalConfigEditor
            value={formSettings}
            onChange={handleChange}
            editingLocale={editingLocale}
            onLocaleChange={setEditingLocale}
            supportedLocales={formSettings.supportedLocales || ['en']}
            defaultLocale={formSettings.defaultLocale as SupportedLocale}
          />

          {/* Fields Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {hasGroups
                    ? 'Form Structure (Groups)'
                    : 'Form Fields'}
                </h3>
              </div>
              {hasGroups && (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  STEP MODE ACTIVE
                </span>
              )}
            </div>

            {/* Empty State */}
            {formSettings.fields.length === 0 && (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-muted p-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      No fields yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get started by adding your first field
                    </p>
                    <Button onClick={() => setShowFieldPicker(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Fields List with Drag & Drop */}
            {formSettings.fields.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formSettings.fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {formSettings.fields.map((field, index) => (
                      <SortableFieldItem
                        key={field.id}
                        field={field}
                        index={index}
                        isCollapsed={collapsedFields.has(field.id)}
                        onToggleCollapse={toggleFieldCollapse}
                        onFieldChange={handleFieldChange}
                        onDuplicateField={handleDuplicateField}
                        onRemoveField={handleRemoveField}
                        supportedLocales={
                          formSettings.supportedLocales || ['en']
                        }
                        defaultLocale={
                          formSettings.defaultLocale as SupportedLocale
                        }
                        editingLocale={editingLocale}
                        onLocaleChange={setEditingLocale}
                        driveFolderId={driveFolderId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Add Field Button */}
            <Button
              onClick={() => setShowFieldPicker(true)}
              className={cn(
                'w-full py-6 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all',
                hasGroups
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-md'
                  : ''
              )}
              variant={hasGroups ? 'default' : 'outline'}
            >
              {hasGroups ? (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Group (Step)
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </>
              )}
            </Button>
          </div>

          {/* Final Actions Section */}
          <FinalActionsEditor
            value={formSettings}
            onChange={handleChange}
            editingLocale={editingLocale}
            onLocaleChange={setEditingLocale}
            supportedLocales={formSettings.supportedLocales || ['en']}
            defaultLocale={formSettings.defaultLocale as SupportedLocale}
          />
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <LocaleSettings value={formSettings} onChange={handleChange} />
        </TabsContent>
          </Tabs>

          {/* Field Type Picker Dialog */}
          <FieldTypePicker
            open={showFieldPicker}
            onClose={() => setShowFieldPicker(false)}
            onSelect={handleAddField}
            hasGroups={hasGroups}
          />
        </Card>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:sticky lg:top-4 lg:self-start">
            <FormPreview
              formSettings={formSettings}
              supportedLocales={formSettings.supportedLocales || ['en']}
              defaultLocale={formSettings.defaultLocale as SupportedLocale}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SortableFieldItem Component
 * Wraps a field with drag & drop functionality
 */
interface SortableFieldItemProps {
  field: FormField;
  index: number;
  isCollapsed: boolean;
  onToggleCollapse: (fieldId: string) => void;
  onFieldChange: (field: FormField, index: number) => void;
  onDuplicateField: (index: number) => void;
  onRemoveField: (index: number) => void;
  supportedLocales: SupportedLocale[];
  defaultLocale: SupportedLocale;
  editingLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
  driveFolderId?: string;
}

function SortableFieldItem({
  field,
  index,
  isCollapsed,
  onToggleCollapse,
  onFieldChange,
  onDuplicateField,
  onRemoveField,
  supportedLocales,
  defaultLocale,
  editingLocale,
  onLocaleChange,
  driveFolderId,
}: SortableFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative border rounded-lg overflow-hidden transition-all',
        field.type === 'group' ? 'border-primary/30 shadow-sm' : 'border-border'
      )}
    >
      {/* Field Header */}
      <div
        className={cn(
          'flex items-center gap-2 p-3',
          field.type === 'group' ? 'bg-primary/5' : 'bg-muted/50'
        )}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Field Label & Type */}
        <div className="flex-1 font-semibold text-sm">
          {field.label || 'Untitled Field'}
          <span className="ml-2 text-[10px] uppercase opacity-60 font-normal px-1.5 py-0.5 bg-background border rounded">
            {field.type}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDuplicateField(index)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onRemoveField(index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleCollapse(field.id)}
          >
            <ChevronUp
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isCollapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>
      </div>

      {/* Field Editor (Collapsed/Expanded) */}
      {!isCollapsed && (
        <div className="p-4 border-t bg-background">
          <FieldEditor
            field={field}
            onChange={(updatedField) => onFieldChange(updatedField, index)}
            onDelete={() => onRemoveField(index)}
            supportedLocales={supportedLocales}
            defaultLocale={defaultLocale}
            editingLocale={editingLocale}
            onLocaleChange={onLocaleChange}
            driveFolderId={driveFolderId}
          />
        </div>
      )}
    </div>
  );
}

/**
 * GlobalConfigEditor Component
 * Manages form title, description, and global settings
 */
interface GlobalConfigEditorProps {
  value: FormSettings;
  onChange: (value: Partial<FormSettings>) => void;
  editingLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
  supportedLocales: SupportedLocale[];
  defaultLocale: SupportedLocale;
}

function GlobalConfigEditor({
  value,
  onChange,
  editingLocale,
  onLocaleChange,
  supportedLocales,
  defaultLocale,
}: GlobalConfigEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;
  const hasGroups = value.fields.some((field) => field.type === 'group');

  const getLocalizedFormValue = (
    key: 'title' | 'description'
  ): string => {
    if (isDefaultLocale) {
      return value[key] || '';
    }
    return value.i18n?.[editingLocale]?.[key] || '';
  };

  const updateLocalizedFormValue = (
    key: 'title' | 'description',
    val: string
  ) => {
    if (isDefaultLocale) {
      onChange({ [key]: val });
    } else {
      onChange({
        i18n: {
          ...value.i18n,
          [editingLocale]: {
            ...value.i18n?.[editingLocale],
            [key]: val,
          },
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Global Configuration
          </h3>
        </div>

        {supportedLocales.length > 1 && (
          <div className="flex items-center gap-2">
            <Select
              value={editingLocale}
              onValueChange={(v) => onLocaleChange(v as SupportedLocale)}
            >
              <SelectTrigger className="w-[140px] h-8 bg-background text-xs">
                <Globe className="h-3 w-3 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(new Set(supportedLocales)).map((locale) => (
                  <SelectItem key={locale} value={locale} className="text-xs">
                    {locale === 'en' ? 'English' : 'Español'}{' '}
                    {locale === defaultLocale ? '(Default)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="formTitle" className="text-xs font-semibold">
          Form Title
          {!isDefaultLocale && (
            <span className="text-xs text-muted-foreground ml-2">
              ({editingLocale})
            </span>
          )}
        </Label>
        <Input
          id="formTitle"
          value={getLocalizedFormValue('title')}
          onChange={(e) => updateLocalizedFormValue('title', e.target.value)}
          className="bg-background"
          placeholder={!isDefaultLocale ? value.title : 'Enter form title'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="formDescription" className="text-xs font-semibold">
          Form Description
          {!isDefaultLocale && (
            <span className="text-xs text-muted-foreground ml-2">
              ({editingLocale})
            </span>
          )}
        </Label>
        <Textarea
          id="formDescription"
          value={getLocalizedFormValue('description')}
          onChange={(e) =>
            updateLocalizedFormValue('description', e.target.value)
          }
          className="bg-background min-h-[80px]"
          placeholder={
            !isDefaultLocale ? value.description : 'Enter form description'
          }
        />
      </div>

      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-dashed">
        <div className="flex items-center space-x-2">
          <Label htmlFor="showStepNumbers" className="text-xs cursor-pointer">
            Show Step Numbers
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircle className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Display step numbers when using groups</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch
          id="showStepNumbers"
          checked={value.showStepNumbers ?? true}
          onCheckedChange={(showStepNumbers) => onChange({ showStepNumbers })}
          disabled={!hasGroups || !isDefaultLocale}
        />
      </div>
    </div>
  );
}

/**
 * FinalActionsEditor Component
 * Manages submit button text and final form actions
 */
interface FinalActionsEditorProps {
  value: FormSettings;
  onChange: (value: Partial<FormSettings>) => void;
  editingLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
  supportedLocales: SupportedLocale[];
  defaultLocale: SupportedLocale;
}

function FinalActionsEditor({
  value,
  onChange,
  editingLocale,
  onLocaleChange,
  supportedLocales,
  defaultLocale,
}: FinalActionsEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;

  const getLocalizedFormValue = (key: 'submitButtonText'): string => {
    if (isDefaultLocale) {
      return value[key] || '';
    }
    return value.i18n?.[editingLocale]?.[key] || '';
  };

  const updateLocalizedFormValue = (key: 'submitButtonText', val: string) => {
    if (isDefaultLocale) {
      onChange({ [key]: val });
    } else {
      onChange({
        i18n: {
          ...value.i18n,
          [editingLocale]: {
            ...value.i18n?.[editingLocale],
            [key]: val,
          },
        },
      });
    }
  };

  return (
    <div className="space-y-4 pt-6 border-t">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Final Actions
          </h3>
        </div>

        {supportedLocales.length > 1 && (
          <div className="flex items-center gap-2">
            <Select
              value={editingLocale}
              onValueChange={(v) => onLocaleChange(v as SupportedLocale)}
            >
              <SelectTrigger className="w-[140px] h-8 bg-background text-xs">
                <Globe className="h-3 w-3 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(new Set(supportedLocales)).map((locale) => (
                  <SelectItem key={locale} value={locale} className="text-xs">
                    {locale === 'en' ? 'English' : 'Español'}{' '}
                    {locale === defaultLocale ? '(Default)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="submitButtonText" className="text-xs font-semibold">
          Submit Button Text
          {!isDefaultLocale && (
            <span className="text-xs text-muted-foreground ml-2">
              ({editingLocale})
            </span>
          )}
        </Label>
        <Input
          id="submitButtonText"
          value={getLocalizedFormValue('submitButtonText')}
          onChange={(e) =>
            updateLocalizedFormValue('submitButtonText', e.target.value)
          }
          className="bg-background"
          placeholder={!isDefaultLocale ? value.submitButtonText : 'Submit'}
        />
      </div>

      {/* Show Response Summary Toggle */}
      {isDefaultLocale && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-dashed">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showResponseSummary" className="text-xs cursor-pointer">
              Show Response Summary
            </Label>
          </div>
          <Switch
            id="showResponseSummary"
            checked={value.showResponseSummary ?? false}
            onCheckedChange={(showResponseSummary) => onChange({ showResponseSummary })}
          />
        </div>
      )}
    </div>
  );
}

/**
 * LocaleSettings Component
 * Manages supported locales and default locale
 */
interface LocaleSettingsProps {
  value: FormSettings;
  onChange: (value: Partial<FormSettings>) => void;
}

function LocaleSettings({ value, onChange }: LocaleSettingsProps) {
  const handleLocaleChange = (locale: SupportedLocale, checked: boolean) => {
    const currentLocales = value.supportedLocales || ['en'];
    let newLocales: SupportedLocale[];

    if (checked) {
      newLocales = [...currentLocales, locale];
    } else {
      newLocales = currentLocales.filter((l) => l !== locale);
      if (newLocales.length === 0) newLocales = ['en'];
    }

    // Ensure default locale is in supported list
    if (value.defaultLocale && !newLocales.includes(value.defaultLocale)) {
      onChange({ supportedLocales: newLocales, defaultLocale: newLocales[0] });
    } else {
      onChange({ supportedLocales: newLocales });
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="space-y-2">
        <Label>Supported Languages</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="locale-en"
              checked={value.supportedLocales?.includes('en')}
              onCheckedChange={(c) => handleLocaleChange('en', c as boolean)}
            />
            <Label htmlFor="locale-en">English</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="locale-es"
              checked={value.supportedLocales?.includes('es')}
              onCheckedChange={(c) => handleLocaleChange('es', c as boolean)}
            />
            <Label htmlFor="locale-es">Español</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Default Language</Label>
        <Select
          value={value.defaultLocale}
          onValueChange={(val) =>
            onChange({ defaultLocale: val as SupportedLocale })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {value.supportedLocales?.map((l) => (
              <SelectItem key={l} value={l}>
                {l === 'en' ? 'English' : 'Español'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
