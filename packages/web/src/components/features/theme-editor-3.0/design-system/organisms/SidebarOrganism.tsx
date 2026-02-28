'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/primitives/ui/card';
import { Button } from '../atoms/Button';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Separator } from '@/components/primitives/ui/separator';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { 
  Home, 
  Settings, 
  User, 
  Bell, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Menu,
  X,
  FileText,
  BarChart3,
  Users,
  Calendar,
  Mail,
  Shield,
  HelpCircle
} from 'lucide-react';

export interface SidebarOrganismProps {
  variant?: 'default' | 'compact' | 'floating';
  collapsible?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  children?: SidebarItem[];
  active?: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'home', label: 'Dashboard', icon: <Home size={18} />, active: true },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} />, badge: 'New' },
  { 
    id: 'users', 
    label: 'User Management', 
    icon: <Users size={18} />,
    children: [
      { id: 'all-users', label: 'All Users', icon: <User size={16} /> },
      { id: 'permissions', label: 'Permissions', icon: <Shield size={16} /> }
    ]
  },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} />, badge: '3' },
  { id: 'messages', label: 'Messages', icon: <Mail size={18} />, badge: '12' },
  { id: 'documents', label: 'Documents', icon: <FileText size={18} /> },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: <Settings size={18} />,
    children: [
      { id: 'general', label: 'General', icon: <Settings size={16} /> },
      { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> }
    ]
  },
  { id: 'help', label: 'Help & Support', icon: <HelpCircle size={18} /> }
];

/**
 * SidebarOrganism - Complex sidebar navigation component with theme integration
 * 
 * Combines: Navigation + Card + Button + Badge + Separator + Icons
 * Features: Collapsible sections, nested navigation, theme-responsive design
 * Spacing: Small (internal padding), Medium (component gaps), Large (section spacing)
 */
export function SidebarOrganism({
  variant = 'default',
  collapsible = true,
  showHeader = true,
  showFooter = true,
  className = ''
}: SidebarOrganismProps) {
  const { state } = useThemeEditor();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['users', 'settings']));
  
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

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getSidebarWidth = () => {
    if (variant === 'compact') return '240px';
    if (isCollapsed) return '64px';
    return '280px';
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = item.active;

    return (
      <div key={item.id} className="w-full">
        <Button
          variant={isActive ? 'default' : 'ghost'}
          className={`w-full justify-start h-auto p-3 ${level > 0 ? 'ml-4' : ''}`}
          style={{
            background: isActive ? 
              colors?.primary?.value || 'var(--color-primary)' :
              'transparent',
            color: isActive ?
              colors?.primaryForeground?.value || 'var(--color-primary-foreground)' :
              colors?.foreground?.value || 'var(--color-foreground)',
            borderRadius: 'var(--radius-button, 6px)'
          }}
          onClick={() => hasChildren ? toggleItem(item.id) : undefined}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {!isCollapsed && (
                <span style={{ color: 'currentColor' }}>
                  {item.icon}
                </span>
              )}
              {(!isCollapsed || variant === 'compact') && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (!isCollapsed || variant === 'compact') && (
                <Badge 
                  variant="secondary"
                  className="text-xs px-1.5 py-0.5"
                  style={{
                    background: colors?.accent?.value || 'var(--color-accent)',
                    color: colors?.accentForeground?.value || 'var(--color-accent-foreground)'
                  }}
                >
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (!isCollapsed || variant === 'compact') && (
                <span style={{ color: 'currentColor' }}>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              )}
            </div>
          </div>
        </Button>
        
        {/* Children items */}
        {hasChildren && isExpanded && (!isCollapsed || variant === 'compact') && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card 
      className={`transition-all duration-300 ${className}`}
      style={{
        width: getSidebarWidth(),
        minHeight: variant === 'floating' ? '500px' : '600px',
        background: `${colors?.card?.value || 'var(--color-card)'}`,
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: variant === 'floating' ? 
          (shadows?.shadowLg || 'var(--shadow-lg)') : 
          (shadows?.shadowMd || 'var(--shadow-md)')
      }}
    >
      {/* Header */}
      {showHeader && (
        <CardHeader 
          className="flex flex-row items-center justify-between"
          style={{ padding: mediumSpacing }}
        >
          <div className="flex items-center gap-3">
            {(!isCollapsed || variant === 'compact') && (
              <>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}, ${colors?.secondary?.value || 'var(--color-secondary)'})`
                  }}
                >
                  <Menu size={16} color="white" />
                </div>
                <div>
                  <h3 
                    style={{ 
                      color: colors?.foreground?.value || 'var(--color-foreground)',
                      fontFamily: 'var(--typography-h4-font-family)',
                      fontSize: 'var(--typography-h4-font-size)',
                      fontWeight: 'var(--typography-h4-font-weight)',
                      marginBottom: '2px'
                    }}
                  >
                    Navigation
                  </h3>
                  <p 
                    style={{ 
                      color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                      fontSize: '12px'
                    }}
                  >
                    Main menu
                  </p>
                </div>
              </>
            )}
          </div>
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
              }}
            >
              {isCollapsed ? <Menu size={16} /> : <X size={16} />}
            </Button>
          )}
        </CardHeader>
      )}

      {/* Search Bar (only when expanded) */}
      {(!isCollapsed || variant === 'compact') && (
        <div style={{ padding: `0 ${mediumSpacing} ${smallSpacing}` }}>
          <div 
            className="relative flex items-center"
            style={{
              background: `${colors?.accent?.value || 'var(--color-accent)'}20`,
              borderRadius: 'var(--radius-input, 6px)',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`
            }}
          >
            <Search 
              size={16} 
              className="absolute left-3"
              style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent pl-10 pr-4 py-2 text-sm outline-none"
              style={{ 
                color: colors?.foreground?.value || 'var(--color-foreground)',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <CardContent 
        className="flex-1 space-y-1"
        style={{ 
          padding: `0 ${smallSpacing} ${mediumSpacing}`,
          paddingTop: '0'
        }}
      >
        {SIDEBAR_ITEMS.map(item => renderSidebarItem(item))}
      </CardContent>

      {/* Footer */}
      {showFooter && (
        <>
          <Separator style={{ background: colors?.border?.value || 'var(--color-border)' }} />
          <div 
            className="flex items-center gap-3"
            style={{ padding: mediumSpacing }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: `${colors?.primary?.value || 'var(--color-primary)'}20`,
                border: `2px solid ${colors?.primary?.value || 'var(--color-primary)'}`
              }}
            >
              <User 
                size={14} 
                style={{ color: colors?.primary?.value || 'var(--color-primary)' }}
              />
            </div>
            {(!isCollapsed || variant === 'compact') && (
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-medium truncate"
                  style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
                >
                  John Doe
                </p>
                <p 
                  className="text-xs truncate"
                  style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
                >
                  john@example.com
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              style={{
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
              }}
            >
              <Settings size={16} />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

/**
 * SidebarOrganismShowcase - Demo component showing different sidebar variants
 */
export function SidebarOrganismShowcase() {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  return (
    <div className="flex flex-wrap gap-6 w-full overflow-x-auto">
      <div className="flex-shrink-0">
        <div className="mb-3">
          <h4 
            className="text-sm font-medium"
            style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
          >
            Default Sidebar
          </h4>
          <p 
            className="text-xs"
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          >
            Full featured with collapsible sections
          </p>
        </div>
        <SidebarOrganism variant="default" />
      </div>
      
      <div className="flex-shrink-0">
        <div className="mb-3">
          <h4 
            className="text-sm font-medium"
            style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
          >
            Compact Sidebar
          </h4>
          <p 
            className="text-xs"
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          >
            Reduced width for tight layouts
          </p>
        </div>
        <SidebarOrganism variant="compact" collapsible={false} />
      </div>
      
      <div className="flex-shrink-0">
        <div className="mb-3">
          <h4 
            className="text-sm font-medium"
            style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
          >
            Floating Sidebar
          </h4>
          <p 
            className="text-xs"
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          >
            Elevated with enhanced shadows
          </p>
        </div>
        <SidebarOrganism variant="floating" />
      </div>
    </div>
  );
}