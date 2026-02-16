'use client';

import * as React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Badge } from '@/components/primitives/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import {
  ChevronUp,
  ChevronDown,
  Search,
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
  Upload,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type FieldStatus = 'active' | 'coming-soon';

export interface FieldTypeEntry {
  id: string;
  label: string;
  labelEs?: string;
  category: string;
  iconKey: string;
  status: FieldStatus;
}

export interface FieldTypePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (fieldType: string) => void;
  /** When true, only group fields are shown (form already has groups) */
  hasGroups?: boolean;
  /** Field type IDs to exclude from the picker (e.g., ['form-group'] inside a group) */
  excludeTypes?: string[];
}

// ============================================================================
// Icon Map
// ============================================================================

const iconMap: Record<string, LucideIcon> = {
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

// ============================================================================
// Category Labels (i18n ready)
// ============================================================================

const categoryLabels: Record<string, { en: string; es: string }> = {
  basic: { en: 'Basic Fields', es: 'Campos Básicos' },
  choice: { en: 'Choice Fields', es: 'Campos de Selección' },
  'date-time': { en: 'Date & Time', es: 'Fecha y Hora' },
  media: { en: 'Media Fields', es: 'Campos de Medios' },
  layout: { en: 'Layout', es: 'Diseño' },
};

// ============================================================================
// All Field Types Registry
// ============================================================================

const allFieldTypes: FieldTypeEntry[] = [
  // Basic Fields
  { id: 'form-text', label: 'Text', labelEs: 'Texto', category: 'basic', iconKey: 'text', status: 'active' },
  { id: 'form-textarea', label: 'Text Area', labelEs: 'Área de Texto', category: 'basic', iconKey: 'textarea', status: 'active' },
  { id: 'form-number', label: 'Number', labelEs: 'Número', category: 'basic', iconKey: 'number', status: 'active' },
  { id: 'form-email', label: 'Email', labelEs: 'Correo', category: 'basic', iconKey: 'email', status: 'active' },
  { id: 'form-phone', label: 'Phone', labelEs: 'Teléfono', category: 'basic', iconKey: 'phone', status: 'active' },

  // Choice Fields
  { id: 'form-select', label: 'Select', labelEs: 'Selección', category: 'choice', iconKey: 'select', status: 'active' },
  { id: 'form-radio', label: 'Radio', labelEs: 'Radio', category: 'choice', iconKey: 'radio', status: 'active' },
  { id: 'form-multiselect', label: 'Multi-Select', labelEs: 'Multi-Selección', category: 'choice', iconKey: 'multiselect', status: 'active' },
  { id: 'form-toggle', label: 'Toggle', labelEs: 'Interruptor', category: 'choice', iconKey: 'toggle', status: 'active' },

  // Date & Time
  { id: 'form-date', label: 'Date', labelEs: 'Fecha', category: 'date-time', iconKey: 'date', status: 'active' },
  { id: 'form-time', label: 'Time', labelEs: 'Hora', category: 'date-time', iconKey: 'time', status: 'active' },
  { id: 'form-datetime', label: 'Date & Time', labelEs: 'Fecha y Hora', category: 'date-time', iconKey: 'datetime', status: 'active' },

  // Media Fields
  { id: 'form-imageSelect', label: 'Image Select', labelEs: 'Selector de Imagen', category: 'media', iconKey: 'imageSelect', status: 'active' },
  { id: 'form-imageSelectMulti', label: 'Image Multi-Select', labelEs: 'Multi-Selector de Imágenes', category: 'media', iconKey: 'imageSelectMulti', status: 'active' },
  { id: 'form-fileUpload', label: 'File Upload', labelEs: 'Subida de Archivo', category: 'media', iconKey: 'fileUpload', status: 'active' },

  // Layout
  { id: 'form-group', label: 'Group (Step)', labelEs: 'Grupo (Paso)', category: 'layout', iconKey: 'group', status: 'active' },
];

// ============================================================================
// Component
// ============================================================================

export function FieldTypePicker({
  open,
  onClose,
  onSelect,
  hasGroups = false,
  excludeTypes = [],
}: FieldTypePickerProps) {
  const [search, setSearch] = React.useState('');
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([
    'basic',
    'choice',
    'date-time',
    'media',
    'layout',
  ]);

  // Filter field types
  const fieldTypes = React.useMemo(() => {
    let filtered = allFieldTypes;

    // Exclude specified types
    if (excludeTypes.length > 0) {
      filtered = filtered.filter((t) => !excludeTypes.includes(t.id));
    }

    // If already has groups, only allow adding more groups
    if (hasGroups) {
      filtered = filtered.filter((t) => t.id === 'form-group');
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (type) =>
          type.label.toLowerCase().includes(searchLower) ||
          type.labelEs?.toLowerCase().includes(searchLower) ||
          type.id.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [hasGroups, search, excludeTypes]);

  // Group by category
  const fieldsByCategory = React.useMemo(() => {
    const grouped: Record<string, FieldTypeEntry[]> = {};
    fieldTypes.forEach((field) => {
      if (!grouped[field.category]) {
        grouped[field.category] = [];
      }
      grouped[field.category].push(field);
    });
    return grouped;
  }, [fieldTypes]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getStatusBadge = (status: FieldStatus) => {
    if (status === 'active') {
      return (
        <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[9px] px-1.5 py-0.5">
          Active
        </Badge>
      );
    }
    return (
      <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-[9px] px-1.5 py-0.5">
        Soon
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Field Type</DialogTitle>
          <DialogDescription>
            Choose the type of field you want to add to your form
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search field types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Scrollable Categories */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {Object.entries(fieldsByCategory).map(([category, fields]) => (
            <div key={category} className="space-y-3">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center justify-between w-full text-sm font-semibold text-left hover:text-primary transition-colors"
              >
                <span>{categoryLabels[category]?.en || category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {fields.length} {fields.length === 1 ? 'field' : 'fields'}
                  </span>
                  {expandedCategories.includes(category) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {/* Category Fields */}
              {expandedCategories.includes(category) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {fields.map((type) => {
                    const IconComponent = iconMap[type.iconKey];
                    const isDisabled = type.status === 'coming-soon';

                    return (
                      <Button
                        key={type.id}
                        variant="outline"
                        disabled={isDisabled}
                        className={cn(
                          'relative h-auto min-h-[120px] py-4 flex flex-col items-center justify-center gap-2',
                          'hover:border-primary hover:bg-primary/5 transition-all',
                          isDisabled && 'opacity-60 cursor-not-allowed'
                        )}
                        onClick={() => {
                          if (!isDisabled) {
                            onSelect(type.id);
                            onClose();
                          }
                        }}
                      >
                        {getStatusBadge(type.status)}
                        {IconComponent && (
                          <IconComponent
                            className="h-8 w-8 text-primary"
                            style={{
                              width: '32px',
                              height: '32px',
                              minWidth: '32px',
                              minHeight: '32px',
                            }}
                          />
                        )}
                        <span className="font-semibold text-sm text-center px-2">
                          {type.label}
                        </span>
                        <span className="text-[10px] uppercase opacity-60 text-center">
                          {type.category.replace('-', ' ')}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* No Results */}
          {Object.keys(fieldsByCategory).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No field types found matching &quot;{search}&quot;</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch('')}
                className="mt-2"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
