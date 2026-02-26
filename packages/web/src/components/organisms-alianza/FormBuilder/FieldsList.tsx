'use client';

import React from 'react';
import { Button } from '@/components/molecules-alianza/Button';
import { Card, CardContent } from '@/components/primitives/ui/card';
import { Badge } from '@/components/primitives/ui/badge';
import {
  PlusCircle,
  Edit2,
  Trash2,
  Type,
  AlignLeft,
  Hash,
  List,
  Circle,
  CheckSquare,
  Calendar,
  Clock,
  FileText,
} from 'lucide-react';
import type { FieldsListProps, FieldType } from './FormBuilder.types';

const FIELD_ICONS: Record<FieldType, React.ElementType> = {
  text: Type,
  textarea: AlignLeft,
  number: Hash,
  select: List,
  radio: Circle,
  checkbox: CheckSquare,
  checkboxGroup: CheckSquare,
  date: Calendar,
  time: Clock,
  file: FileText,
};

export function FieldsList({ fields, onEdit, onDelete, onAdd }: FieldsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Campos del Formulario</h3>
        <Button onClick={onAdd} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Agregar Campo
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No hay campos en este formulario
            </p>
            <Button onClick={onAdd} variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar Primer Campo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => {
            const Icon = FIELD_ICONS[field.type];
            return (
              <Card key={field.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="bg-muted rounded-[var(--radius)] p-2 mt-0.5">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono text-muted-foreground">
                            #{index + 1}
                          </span>
                          <h4 className="font-medium truncate">{field.label}</h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {field.type}
                          </Badge>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">
                              Requerido
                            </Badge>
                          )}
                          {field.options && field.options.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {field.options.length} opciones
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground font-mono truncate">
                          ID: {field.id}
                        </p>

                        {field.helpText && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {field.helpText}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(field.id)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(field.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {fields.length > 0 && (
        <div className="text-center">
          <Button onClick={onAdd} variant="outline" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Agregar Otro Campo
          </Button>
        </div>
      )}
    </div>
  );
}
