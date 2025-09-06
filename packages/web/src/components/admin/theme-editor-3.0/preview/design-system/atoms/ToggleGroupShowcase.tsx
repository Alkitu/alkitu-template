'use client';

import React, { useState } from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { ToggleGroup } from '../../../design-system/atoms/ToggleGroup';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  Type, Palette, Layout, Grid, List, Calendar, Map, User,
  Heart, Star, Bookmark, Share, Download, Upload, Copy, Trash,
  Play, Pause, SkipForward, Volume2, Shuffle, Repeat
} from 'lucide-react';

/**
 * ToggleGroup Showcase Component
 * Demonstrates all ToggleGroup atom variants and configurations
 */
export function ToggleGroupShowcase() {
  const [textFormat, setTextFormat] = useState<string[]>(['bold']);
  const [alignment, setAlignment] = useState<string>('left');
  const [viewMode, setViewMode] = useState<string>('grid');
  const [multipleSelection, setMultipleSelection] = useState<string[]>(['star', 'bookmark']);
  const [mediaControls, setMediaControls] = useState<string>('play');

  // Sample items for different use cases
  const formatItems = [
    { value: 'bold', label: 'Bold', icon: Bold },
    { value: 'italic', label: 'Italic', icon: Italic },
    { value: 'underline', label: 'Underline', icon: Underline },
  ];

  const alignmentItems = [
    { value: 'left', label: 'Left', icon: AlignLeft },
    { value: 'center', label: 'Center', icon: AlignCenter },
    { value: 'right', label: 'Right', icon: AlignRight },
  ];

  const viewItems = [
    { value: 'grid', label: 'Grid', icon: Grid },
    { value: 'list', label: 'List', icon: List },
    { value: 'calendar', label: 'Calendar', icon: Calendar },
    { value: 'map', label: 'Map', icon: Map },
  ];

  const actionItems = [
    { value: 'heart', label: 'Like', icon: Heart },
    { value: 'star', label: 'Star', icon: Star },
    { value: 'bookmark', label: 'Bookmark', icon: Bookmark },
    { value: 'share', label: 'Share', icon: Share },
  ];

  const mediaItems = [
    { value: 'shuffle', label: 'Shuffle', icon: Shuffle },
    { value: 'previous', label: 'Previous', icon: SkipForward },
    { value: 'play', label: 'Play', icon: Play },
    { value: 'pause', label: 'Pause', icon: Pause },
    { value: 'next', label: 'Next', icon: SkipForward },
    { value: 'repeat', label: 'Repeat', icon: Repeat },
  ];

  const sizeItems = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Basic Toggle Groups */}
      <ShowcaseContainer name="Basic Toggle Groups" tokenId="basic-toggle-groups">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Single Selection</p>
            <ToggleGroup
              items={alignmentItems}
              type="single"
              value={alignment}
              onChange={(value) => setAlignment(value as string)}
              aria-label="Text alignment"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Multiple Selection</p>
            <ToggleGroup
              items={formatItems}
              type="multiple"
              value={textFormat}
              onChange={(value) => setTextFormat(value as string[])}
              aria-label="Text formatting"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Sizes */}
      <ShowcaseContainer name="Sizes" tokenId="toggle-group-sizes">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Small</p>
            <ToggleGroup
              items={sizeItems}
              size="sm"
              defaultValue="md"
              aria-label="Small toggle group"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Medium (default)</p>
            <ToggleGroup
              items={sizeItems}
              size="md"
              defaultValue="md"
              aria-label="Medium toggle group"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Large</p>
            <ToggleGroup
              items={sizeItems}
              size="lg"
              defaultValue="md"
              aria-label="Large toggle group"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Color Variants */}
      <ShowcaseContainer name="Color Variants" tokenId="color-variants">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Default</p>
            <ToggleGroup
              items={alignmentItems}
              variant="default"
              defaultValue="left"
              aria-label="Default toggle group"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Primary</p>
            <ToggleGroup
              items={alignmentItems}
              variant="primary"
              defaultValue="center"
              aria-label="Primary toggle group"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Secondary</p>
            <ToggleGroup
              items={alignmentItems}
              variant="secondary"
              defaultValue="right"
              aria-label="Secondary toggle group"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Outline</p>
            <ToggleGroup
              items={alignmentItems}
              variant="outline"
              defaultValue="left"
              aria-label="Outline toggle group"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Orientations */}
      <ShowcaseContainer name="Orientations" tokenId="orientations">
        <div className="flex gap-12 items-start w-full">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-3">Horizontal (default)</p>
            <ToggleGroup
              items={viewItems}
              orientation="horizontal"
              value={viewMode}
              onChange={(value) => setViewMode(value as string)}
              aria-label="Horizontal view selector"
            />
          </div>
          
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-3">Vertical</p>
            <ToggleGroup
              items={viewItems}
              orientation="vertical"
              defaultValue="list"
              aria-label="Vertical view selector"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Connection Styles */}
      <ShowcaseContainer name="Connection Styles" tokenId="connection-styles">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Connected (default)</p>
            <ToggleGroup
              items={formatItems}
              connected={true}
              type="multiple"
              defaultValue={['bold', 'italic']}
              aria-label="Connected toggle group"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Separated</p>
            <ToggleGroup
              items={formatItems}
              connected={false}
              type="multiple"
              defaultValue={['underline']}
              aria-label="Separated toggle group"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Icon Only */}
      <ShowcaseContainer name="Icon Only" tokenId="icon-only">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Text Alignment</p>
            <ToggleGroup
              items={[
                { value: 'left', label: '', icon: AlignLeft },
                { value: 'center', label: '', icon: AlignCenter },
                { value: 'right', label: '', icon: AlignRight },
              ]}
              defaultValue="left"
              size="sm"
              aria-label="Text alignment icons"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Actions</p>
            <ToggleGroup
              items={actionItems.map(item => ({ ...item, label: '' }))}
              type="multiple"
              value={multipleSelection}
              onChange={(value) => setMultipleSelection(value as string[])}
              variant="outline"
              aria-label="Action icons"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Text Only */}
      <ShowcaseContainer name="Text Only" tokenId="text-only">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Filter Options</p>
            <ToggleGroup
              items={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'archived', label: 'Archived' },
              ]}
              defaultValue="all"
              variant="primary"
              aria-label="Filter options"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Categories</p>
            <ToggleGroup
              items={[
                { value: 'work', label: 'Work' },
                { value: 'personal', label: 'Personal' },
                { value: 'shopping', label: 'Shopping' },
                { value: 'health', label: 'Health' },
              ]}
              type="multiple"
              defaultValue={['work', 'personal']}
              connected={false}
              size="sm"
              aria-label="Categories"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* States */}
      <ShowcaseContainer name="States" tokenId="toggle-group-states">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Normal</p>
            <ToggleGroup
              items={formatItems}
              type="multiple"
              defaultValue={['bold']}
              aria-label="Normal state"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Disabled</p>
            <ToggleGroup
              items={formatItems}
              type="multiple"
              defaultValue={['bold', 'italic']}
              disabled
              aria-label="Disabled state"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Individual Disabled Items</p>
            <ToggleGroup
              items={[
                { value: 'bold', label: 'Bold', icon: Bold },
                { value: 'italic', label: 'Italic', icon: Italic, disabled: true },
                { value: 'underline', label: 'Underline', icon: Underline },
              ]}
              type="multiple"
              defaultValue={['bold']}
              aria-label="Individual disabled items"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Real World Examples */}
      <ShowcaseContainer name="Real World Examples" tokenId="real-world-examples">
        <div className="space-y-8 w-full">
          {/* Text Editor Toolbar */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Text Editor Toolbar</p>
            <div className="flex gap-2 flex-wrap">
              <ToggleGroup
                items={formatItems}
                type="multiple"
                defaultValue={['bold']}
                size="sm"
                aria-label="Text formatting"
              />
              <ToggleGroup
                items={alignmentItems}
                defaultValue="left"
                size="sm"
                variant="outline"
                aria-label="Text alignment"
              />
            </div>
          </div>

          {/* Media Player Controls */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Media Player Controls</p>
            <ToggleGroup
              items={mediaItems.slice(0, 4)}
              value={mediaControls}
              onChange={(value) => setMediaControls(value as string)}
              variant="primary"
              connected={false}
              aria-label="Media controls"
            />
          </div>

          {/* Dashboard View Selector */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Dashboard View Selector</p>
            <ToggleGroup
              items={viewItems}
              value={viewMode}
              onChange={(value) => setViewMode(value as string)}
              variant="secondary"
              size="lg"
              aria-label="Dashboard view"
            />
          </div>

          {/* Filter Tags */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Filter Tags</p>
            <ToggleGroup
              items={[
                { value: 'featured', label: 'Featured' },
                { value: 'sale', label: 'On Sale' },
                { value: 'new', label: 'New Arrivals' },
                { value: 'popular', label: 'Popular' },
              ]}
              type="multiple"
              defaultValue={['featured', 'sale']}
              connected={false}
              variant="outline"
              size="sm"
              aria-label="Product filters"
            />
          </div>

          {/* Vertical Sidebar Options */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Sidebar Navigation</p>
            <ToggleGroup
              items={[
                { value: 'dashboard', label: 'Dashboard', icon: Layout },
                { value: 'users', label: 'Users', icon: User },
                { value: 'content', label: 'Content', icon: Type },
                { value: 'design', label: 'Design', icon: Palette },
              ]}
              orientation="vertical"
              defaultValue="dashboard"
              variant="primary"
              connected={false}
              aria-label="Sidebar navigation"
            />
          </div>
        </div>
      </ShowcaseContainer>

    </div>
  );
}

export default ToggleGroupShowcase;