'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/ui/card';
import { Badge } from '@/components/primitives/ui/badge';
import { Eye } from 'lucide-react';
import { RequestTemplateRenderer } from '@/components/organisms-alianza/RequestTemplateRenderer';
import type { TemplatePreviewProps } from './FormBuilder.types';

export function TemplatePreview({ template }: TemplatePreviewProps) {
  // Mock submit handler for preview mode
  const handlePreviewSubmit = (data: Record<string, unknown>) => {
    console.log('Preview data:', data);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Eye className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Vista Previa</h3>
        <Badge variant="outline" className="ml-auto">
          {template.fields.length} {template.fields.length === 1 ? 'campo' : 'campos'}
        </Badge>
      </div>

      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Vista del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {template.fields.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>Agregue campos para ver la vista previa</p>
            </div>
          ) : (
            <div className="pointer-events-none opacity-90">
              <RequestTemplateRenderer
                template={template}
                onSubmit={handlePreviewSubmit}
                submitButtonText="Vista Previa"
                onCancel={undefined}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          Esta es una vista previa de cómo verán el formulario los clientes.
        </p>
        <p>
          Los campos no son funcionales en modo previa.
        </p>
      </div>
    </div>
  );
}
