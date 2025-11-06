'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Settings } from 'lucide-react';
import { ThemeEditor } from '@/components/admin/ThemeEditor';
import { useTranslations } from '@/context/TranslationContext';
import { Typography } from '@/components/atomic-design/atoms/typography';

export default function ThemesSettingsPage() {
  const t = useTranslations('dashboard.settings');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1">
            Themes
          </Typography>
          <Typography variant="p">
            Customize your application&apos;s appearance with themes and colors
          </Typography>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Theme Editor
          </CardTitle>
          <CardDescription>
            Create and customize themes for both light and dark modes. Design
            your perfect color palette and save it for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeEditor />
        </CardContent>
      </Card>
    </div>
  );
}
