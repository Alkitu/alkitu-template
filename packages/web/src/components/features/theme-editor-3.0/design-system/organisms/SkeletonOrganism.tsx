'use client';

import React from 'react';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/primitives/ui/card';
import { Button } from '../atoms/Button';
import { Badge } from '@/components/atoms-alianza/Badge';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface SkeletonOrganismProps {
  variant?: 'article' | 'profile' | 'dashboard' | 'list' | 'gallery';
  showHeader?: boolean;
  itemCount?: number;
  className?: string;
}

/**
 * SkeletonOrganism - Complex loading skeleton component with theme integration
 * 
 * Combines: Skeleton + Card + Various layout patterns
 * Features: Multiple skeleton variants, theme-responsive design, loading states
 * Spacing: Small (internal padding), Medium (component gaps), Large (section spacing)
 */
export function SkeletonOrganism({
  variant = 'article',
  showHeader = true,
  itemCount = 3,
  className = ''
}: SkeletonOrganismProps) {
  const { state } = useThemeEditor();
  
  // Theme integration
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const shadows = state.currentTheme?.shadows;
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;

  const getVariantName = () => {
    const names = {
      article: 'Article Layout',
      profile: 'Profile Card',
      dashboard: 'Dashboard Widget',
      list: 'List Items',
      gallery: 'Gallery Grid'
    };
    return names[variant];
  };

  const renderArticleSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <Skeleton className="h-6 w-12 mx-auto" />
          <Skeleton className="h-4 w-16 mx-auto" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-6 w-12 mx-auto" />
          <Skeleton className="h-4 w-20 mx-auto" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-6 w-12 mx-auto" />
          <Skeleton className="h-4 w-18 mx-auto" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );

  const renderDashboardSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 p-4 rounded-lg">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 rounded-lg">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-3 w-[200px]" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );

  const renderGallerySkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: itemCount * 2 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );

  const renderVariantContent = () => {
    switch (variant) {
      case 'article': return renderArticleSkeleton();
      case 'profile': return renderProfileSkeleton();
      case 'dashboard': return renderDashboardSkeleton();
      case 'list': return renderListSkeleton();
      case 'gallery': return renderGallerySkeleton();
      default: return renderArticleSkeleton();
    }
  };

  return (
    <Card 
      className={`w-full ${className}`}
      style={{
        background: `${colors?.card?.value || 'var(--color-card)'}`,
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowMd || 'var(--shadow-md)'
      }}
    >
      {/* Header */}
      {showHeader && (
        <CardHeader style={{ padding: mediumSpacing }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h3 
                  style={{ 
                    color: colors?.foreground?.value || 'var(--color-foreground)',
                    fontFamily: 'var(--typography-h3-font-family)',
                    fontSize: 'var(--typography-h3-font-size)',
                    marginBottom: '4px'
                  }}
                >
                  Loading {getVariantName()}
                </h3>
                <p 
                  style={{ 
                    color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                    fontSize: '14px'
                  }}
                >
                  Please wait while content loads...
                </p>
              </div>
            </div>
            <Badge 
              variant="outline"
              style={{
                background: `${colors?.secondary?.value || 'var(--color-secondary)'}20`,
                borderColor: colors?.secondary?.value || 'var(--color-secondary)',
                color: colors?.secondary?.value || 'var(--color-secondary)'
              }}
            >
              {variant}
            </Badge>
          </div>
        </CardHeader>
      )}

      {/* Skeleton Content */}
      <CardContent style={{ padding: mediumSpacing, paddingTop: showHeader ? '0' : mediumSpacing }}>
        {renderVariantContent()}
        
        {/* Loading Actions */}
        <div 
          className="mt-6 flex items-center justify-between p-4 rounded-lg"
          style={{
            background: `${colors?.accent?.value || 'var(--color-accent)'}10`,
            border: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: colors?.primary?.value || 'var(--color-primary)' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                background: colors?.primary?.value || 'var(--color-primary)',
                animationDelay: '0.1s'
              }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                background: colors?.primary?.value || 'var(--color-primary)',
                animationDelay: '0.2s'
              }}
            />
            <span 
              className="text-sm ml-2"
              style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
            >
              Loading content...
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            style={{
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
              fontSize: '12px'
            }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * SkeletonOrganismShowcase - Demo component showing different skeleton variants
 */
export function SkeletonOrganismShowcase() {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  return (
    <div className="flex flex-wrap gap-6 w-full">
      <div className="flex-1 min-w-[300px] max-w-[400px]">
        <SkeletonOrganism
          variant="article"
        />
      </div>
      
      <div className="flex-1 min-w-[300px] max-w-[400px]">
        <SkeletonOrganism
          variant="profile"
        />
      </div>
      
      <div className="flex-1 min-w-[300px] max-w-[400px]">
        <SkeletonOrganism
          variant="dashboard"
        />
      </div>
      
      <div className="flex-1 min-w-[300px] max-w-[400px]">
        <SkeletonOrganism
          variant="list"
          itemCount={4}
        />
      </div>
      
      <div className="flex-1 min-w-[300px] max-w-[400px]">
        <SkeletonOrganism
          variant="gallery"
          itemCount={3}
        />
      </div>
    </div>
  );
}