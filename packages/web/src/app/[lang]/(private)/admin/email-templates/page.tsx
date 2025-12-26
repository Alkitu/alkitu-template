'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';
import { Button } from '@/components/primitives/ui/button';
import { Plus } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card';
import { Badge } from '@/components/atoms/badge';
import { Typography } from '@/components/atoms/typography';

/**
 * Admin Email Templates Page (ALI-121)
 *
 * Admin-specific page for managing email templates and automation.
 *
 * Features:
 * - View all email templates
 * - Create, edit, and delete templates
 * - Preview templates with placeholder data
 * - Manage triggers and status associations
 *
 * @route /[lang]/admin/email-templates
 */
export default function AdminEmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Fetch all email templates
  const { data: templates, isLoading, refetch } = trpc.emailTemplate.getAll.useQuery({});

  // Fetch available placeholders
  const { data: placeholders } = trpc.emailTemplate.getAvailablePlaceholders.useQuery();

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'ON_REQUEST_CREATED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ON_STATUS_CHANGED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ONGOING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Email Templates"
          description="Loading templates..."
        />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Email Templates"
        description="Manage automated email templates for request lifecycle events"
        actions={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Template
          </Button>
        }
      />

      {/* Templates Grid */}
      <div className="grid gap-4">
        {templates && templates.length > 0 ? (
          templates.map((template) => (
            <Card
              key={template.id}
              className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.subject}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTriggerColor(template.trigger)}>
                      {template.trigger.replace('ON_', '').replace('_', ' ')}
                    </Badge>
                    {template.status && (
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                    )}
                    <Badge variant={template.active ? 'default' : 'secondary'}>
                      {template.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-32 overflow-hidden">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                    {template.body.substring(0, 200)}
                    {template.body.length > 200 ? '...' : ''}
                  </pre>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Typography variant="small" className="text-muted-foreground">
                    Created: {new Date(template.createdAt).toLocaleDateString()}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open edit dialog
                        console.log('Edit template:', template.id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open preview dialog
                        console.log('Preview template:', template.id);
                      }}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Typography variant="h3" className="text-xl mb-2">
                No Templates Found
              </Typography>
              <Typography variant="p" className="text-muted-foreground mb-4">
                Create your first email template to automate notifications
              </Typography>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Placeholders Reference */}
      {placeholders && (
        <Card>
          <CardHeader>
            <CardTitle>Available Placeholders</CardTitle>
            <CardDescription>
              Use these placeholders in your email templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(placeholders).map(([category, items]) => (
                <div key={category}>
                  <Typography variant="h4" className="text-sm font-semibold mb-2 capitalize">
                    {category}
                  </Typography>
                  <div className="space-y-1">
                    {(items as string[]).map((placeholder) => (
                      <code
                        key={placeholder}
                        className="block text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                      >
                        {placeholder}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
