'use client';

import React from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { BreadcrumbNavigation as Breadcrumb, BreadcrumbItemData } from '@/components/atomic-design/molecules/breadcrumb';
import { Home, Folder, File, Settings, User, ShoppingBag } from 'lucide-react';

/**
 * Breadcrumb Showcase Component
 * Demonstrates all Breadcrumb molecule variants with different configurations
 */
export function BreadcrumbShowcase() {
  // Sample breadcrumb items
  const basicItems: BreadcrumbItemData[] = [
    { label: 'Home', onClick: () => console.log('Home clicked') },
    { label: 'Products', onClick: () => console.log('Products clicked') },
    { label: 'Electronics', onClick: () => console.log('Electronics clicked') },
    { label: 'Smartphones', current: true },
  ];

  const withIconsItems: BreadcrumbItemData[] = [
    { label: 'Home', icon: Home, onClick: () => console.log('Home clicked') },
    { label: 'Settings', icon: Settings, onClick: () => console.log('Settings clicked') },
    { label: 'Profile', icon: User, current: true },
  ];

  const longItems: BreadcrumbItemData[] = [
    { label: 'Dashboard', onClick: () => console.log('Dashboard') },
    { label: 'E-commerce', onClick: () => console.log('E-commerce') },
    { label: 'Products', onClick: () => console.log('Products') },
    { label: 'Categories', onClick: () => console.log('Categories') },
    { label: 'Electronics', onClick: () => console.log('Electronics') },
    { label: 'Mobile Devices', onClick: () => console.log('Mobile Devices') },
    { label: 'Smartphones', onClick: () => console.log('Smartphones') },
    { label: 'Apple iPhone', current: true },
  ];

  const fileSystemItems: BreadcrumbItemData[] = [
    { label: 'Root', icon: Home, onClick: () => console.log('Root') },
    { label: 'Documents', icon: Folder, onClick: () => console.log('Documents') },
    { label: 'Projects', icon: Folder, onClick: () => console.log('Projects') },
    { label: 'Website', icon: Folder, onClick: () => console.log('Website') },
    { label: 'index.html', icon: File, current: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* Basic Usage */}
      <ShowcaseContainer name="Basic Usage" tokenId="basic-usage">
        <div className="w-full">
          <Breadcrumb items={basicItems} />
        </div>
      </ShowcaseContainer>

      {/* Separators */}
      <ShowcaseContainer name="Separators" tokenId="separators">
        <div className="space-y-4 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Chevron (default)</p>
            <Breadcrumb items={basicItems} separator="chevron" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Slash</p>
            <Breadcrumb items={basicItems} separator="slash" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Arrow</p>
            <Breadcrumb items={basicItems} separator="arrow" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Custom separator</p>
            <Breadcrumb 
              items={basicItems} 
              separator={<span style={{ color: 'var(--color-primary)' }}>•</span>} 
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Sizes */}
      <ShowcaseContainer name="Sizes" tokenId="breadcrumb-sizes">
        <div className="space-y-4 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Small</p>
            <Breadcrumb items={basicItems} size="sm" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Medium (default)</p>
            <Breadcrumb items={basicItems} size="md" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Large</p>
            <Breadcrumb items={basicItems} size="lg" />
          </div>
        </div>
      </ShowcaseContainer>

      {/* With Icons */}
      <ShowcaseContainer name="With Icons" tokenId="with-icons">
        <div className="w-full">
          <Breadcrumb items={withIconsItems} />
        </div>
      </ShowcaseContainer>

      {/* With Home Icon */}
      <ShowcaseContainer name="With Home Icon" tokenId="with-home">
        <div className="w-full">
          <Breadcrumb items={basicItems} showHome={true} />
        </div>
      </ShowcaseContainer>

      {/* Collapsed Navigation */}
      <ShowcaseContainer name="Collapsed Navigation" tokenId="collapsed">
        <div className="space-y-4 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Max 4 items</p>
            <Breadcrumb items={longItems} maxItems={4} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Max 3 items</p>
            <Breadcrumb items={longItems} maxItems={3} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Max 2 items</p>
            <Breadcrumb items={longItems} maxItems={2} />
          </div>
        </div>
      </ShowcaseContainer>

      {/* File System Example */}
      <ShowcaseContainer name="File System Example" tokenId="file-system">
        <div className="w-full">
          <Breadcrumb 
            items={fileSystemItems} 
            separator="chevron"
            showHome={false}
          />
        </div>
      </ShowcaseContainer>

      {/* Interactive Example */}
      <ShowcaseContainer name="Interactive Example" tokenId="interactive">
        <div className="w-full">
          <p className="text-sm text-muted-foreground mb-3">Click on any breadcrumb item to see console log</p>
          <Breadcrumb 
            items={[
              { 
                label: 'Dashboard', 
                icon: Home,
                onClick: () => alert('Navigating to Dashboard') 
              },
              { 
                label: 'E-commerce', 
                icon: ShoppingBag,
                onClick: () => alert('Navigating to E-commerce') 
              },
              { 
                label: 'Product Details', 
                current: true 
              },
            ]}
            showHome={false}
          />
        </div>
      </ShowcaseContainer>

    </div>
  );
}

export default BreadcrumbShowcase;