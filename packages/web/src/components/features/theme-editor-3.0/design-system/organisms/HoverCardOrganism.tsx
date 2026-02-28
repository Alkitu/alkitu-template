'use client';

import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/primitives/ui/hover-card';
import { Button } from '../atoms/Button';
import { Badge } from '@/components/atoms-alianza/Badge';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  ExternalLink,
  Star,
  Clock,
  TrendingUp,
  TrendingDown,
  Globe,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  Heart,
  Share2,
  BarChart3,
  Users,
  Award,
  CheckCircle
} from 'lucide-react';

export interface HoverCardOrganismProps {
  variant?: 'user' | 'product' | 'stats' | 'company' | 'social';
  className?: string;
}

interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  company: string;
  email: string;
  phone: string;
  joinDate: string;
  followers: number;
  following: number;
  verified: boolean;
  status: 'online' | 'offline' | 'away';
}

interface ProductInfo {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  description: string;
  features: string[];
}

interface StatsData {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  description: string;
}

interface CompanyInfo {
  name: string;
  logo: string;
  industry: string;
  founded: string;
  employees: string;
  website: string;
  location: string;
  description: string;
  rating: number;
}

const SAMPLE_USER: UserProfile = {
  name: 'Sarah Johnson',
  username: 'sarahj_design',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b776?w=100&h=100&fit=crop&crop=face',
  bio: 'Senior UX Designer passionate about creating meaningful digital experiences',
  location: 'San Francisco, CA',
  company: 'Design Studio Inc',
  email: 'sarah@example.com',
  phone: '+1 (555) 123-4567',
  joinDate: 'March 2020',
  followers: 2845,
  following: 1203,
  verified: true,
  status: 'online'
};

const SAMPLE_PRODUCT: ProductInfo = {
  name: 'Wireless Pro Headphones',
  price: '$299.99',
  rating: 4.8,
  reviews: 1247,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
  category: 'Electronics',
  inStock: true,
  description: 'Premium noise-canceling wireless headphones with superior sound quality',
  features: ['30h Battery', 'ANC Technology', 'Hi-Fi Audio', 'Quick Charge']
};

const SAMPLE_STATS: StatsData = {
  title: 'Monthly Revenue',
  value: '$45,231',
  change: 12.3,
  trend: 'up',
  period: 'vs last month',
  description: 'Revenue increased by 12.3% compared to previous month'
};

const SAMPLE_COMPANY: CompanyInfo = {
  name: 'TechCorp Solutions',
  logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=60&h=60&fit=crop',
  industry: 'Software Technology',
  founded: '2018',
  employees: '250-500',
  website: 'techcorp.com',
  location: 'New York, NY',
  description: 'Leading provider of enterprise software solutions for modern businesses',
  rating: 4.6
};

/**
 * HoverCardOrganism - Complex hover card component with theme integration
 * 
 * Combines: HoverCard + Avatar + Badge + Button + Typography + Icons
 * Features: Multiple content types, theme-responsive design, rich information display
 * Spacing: Small (internal padding), Medium (component gaps), Large (section spacing)
 */
export function HoverCardOrganism({
  variant = 'user',
  className = ''
}: HoverCardOrganismProps) {
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

  const getStatusColor = (status: string) => {
    const colors = {
      online: '#22c55e',
      offline: '#6b7280',
      away: '#f59e0b'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? 'fill-current' : ''}
        style={{ 
          color: i < Math.floor(rating) 
            ? '#fbbf24' 
            : colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
        }}
      />
    ));
  };

  const renderUserCard = () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-2 h-auto"
          style={{
            color: colors?.foreground?.value || 'var(--color-foreground)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}, ${colors?.secondary?.value || 'var(--color-secondary)'})`
                }}
              >
                <User size={18} color="white" />
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                style={{ background: getStatusColor(SAMPLE_USER.status) }}
              />
            </div>
            <div className="text-left">
              <div className="font-medium">{SAMPLE_USER.name}</div>
              <div 
                className="text-sm"
                style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
              >
                @{SAMPLE_USER.username}
              </div>
            </div>
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80"
        style={{
          background: colors?.card?.value || 'var(--color-card)',
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
          boxShadow: shadows?.shadowLg || 'var(--shadow-lg)'
        }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}, ${colors?.secondary?.value || 'var(--color-secondary)'})`
                  }}
                >
                  <User size={20} color="white" />
                </div>
                <div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card"
                  style={{ background: getStatusColor(SAMPLE_USER.status) }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 
                    className="font-semibold"
                    style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
                  >
                    {SAMPLE_USER.name}
                  </h4>
                  {SAMPLE_USER.verified && (
                    <CheckCircle size={16} className="text-blue-500" />
                  )}
                </div>
                <p 
                  className="text-sm"
                  style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
                >
                  @{SAMPLE_USER.username}
                </p>
              </div>
            </div>
            
            <Badge 
              variant="outline"
              className="text-xs capitalize"
              style={{
                borderColor: getStatusColor(SAMPLE_USER.status),
                color: getStatusColor(SAMPLE_USER.status)
              }}
            >
              {SAMPLE_USER.status}
            </Badge>
          </div>

          {/* Bio */}
          <p 
            className="text-sm leading-relaxed"
            style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
          >
            {SAMPLE_USER.bio}
          </p>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Building size={14} style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }} />
              <span style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}>
                {SAMPLE_USER.company}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }} />
              <span style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}>
                {SAMPLE_USER.location}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }} />
              <span style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}>
                Joined {SAMPLE_USER.joinDate}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span 
                className="font-semibold"
                style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
              >
                {SAMPLE_USER.followers.toLocaleString()}
              </span>
              <span 
                className="ml-1"
                style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
              >
                followers
              </span>
            </div>
            <div>
              <span 
                className="font-semibold"
                style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
              >
                {SAMPLE_USER.following.toLocaleString()}
              </span>
              <span 
                className="ml-1"
                style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
              >
                following
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              style={{
                background: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
              }}
            >
              <MessageCircle size={14} className="mr-1" />
              Message
            </Button>
            <Button
              size="sm"
              variant="outline"
              style={{
                borderColor: colors?.border?.value || 'var(--color-border)',
                color: colors?.foreground?.value || 'var(--color-foreground)'
              }}
            >
              <ExternalLink size={14} className="mr-1" />
              Profile
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  const renderProductCard = () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-3 h-auto"
          style={{
            color: colors?.foreground?.value || 'var(--color-foreground)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `${colors?.accent?.value || 'var(--color-accent)'}20`
              }}
            >
              <Star size={20} style={{ color: colors?.primary?.value || 'var(--color-primary)' }} />
            </div>
            <div className="text-left">
              <div className="font-medium">{SAMPLE_PRODUCT.name}</div>
              <div 
                className="text-sm font-semibold"
                style={{ color: colors?.primary?.value || 'var(--color-primary)' }}
              >
                {SAMPLE_PRODUCT.price}
              </div>
            </div>
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-96"
        style={{
          background: colors?.card?.value || 'var(--color-card)',
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
          boxShadow: shadows?.shadowLg || 'var(--shadow-lg)'
        }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex gap-4">
            <div 
              className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}, ${colors?.secondary?.value || 'var(--color-secondary)'})`
              }}
            >
              <Star size={32} color="white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h4 
                  className="font-semibold leading-tight"
                  style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
                >
                  {SAMPLE_PRODUCT.name}
                </h4>
                <Badge 
                  variant={SAMPLE_PRODUCT.inStock ? 'default' : 'secondary'}
                  className="text-xs"
                  style={{
                    background: SAMPLE_PRODUCT.inStock ? '#22c55e' : (colors?.muted?.value || 'var(--color-muted)'),
                    color: SAMPLE_PRODUCT.inStock ? 'white' : (colors?.mutedForeground?.value || 'var(--color-muted-foreground)')
                  }}
                >
                  {SAMPLE_PRODUCT.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {renderStars(SAMPLE_PRODUCT.rating)}
                </div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
                >
                  {SAMPLE_PRODUCT.rating}
                </span>
                <span 
                  className="text-sm"
                  style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
                >
                  ({SAMPLE_PRODUCT.reviews.toLocaleString()} reviews)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span 
                  className="text-2xl font-bold"
                  style={{ color: colors?.primary?.value || 'var(--color-primary)' }}
                >
                  {SAMPLE_PRODUCT.price}
                </span>
                <Badge 
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: colors?.border?.value || 'var(--color-border)',
                    color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
                  }}
                >
                  {SAMPLE_PRODUCT.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <p 
            className="text-sm leading-relaxed"
            style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
          >
            {SAMPLE_PRODUCT.description}
          </p>

          {/* Features */}
          <div>
            <h5 
              className="text-sm font-medium mb-2"
              style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
            >
              Key Features:
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PRODUCT.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-green-500" />
                  <span 
                    className="text-sm"
                    style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={!SAMPLE_PRODUCT.inStock}
              style={{
                background: SAMPLE_PRODUCT.inStock ? 
                  (colors?.primary?.value || 'var(--color-primary)') : 
                  (colors?.muted?.value || 'var(--color-muted)'),
                color: SAMPLE_PRODUCT.inStock ?
                  (colors?.primaryForeground?.value || 'var(--color-primary-foreground)') :
                  (colors?.mutedForeground?.value || 'var(--color-muted-foreground)')
              }}
            >
              Add to Cart
            </Button>
            <Button
              size="sm"
              variant="outline"
              style={{
                borderColor: colors?.border?.value || 'var(--color-border)',
                color: colors?.foreground?.value || 'var(--color-foreground)'
              }}
            >
              <Heart size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              style={{
                borderColor: colors?.border?.value || 'var(--color-border)',
                color: colors?.foreground?.value || 'var(--color-foreground)'
              }}
            >
              <Share2 size={14} />
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  const renderStatsCard = () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div 
          className="p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50"
          style={{
            border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
            background: colors?.card?.value || 'var(--color-card)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 
              className="text-sm font-medium"
              style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
            >
              {SAMPLE_STATS.title}
            </h4>
            <BarChart3 size={16} style={{ color: colors?.primary?.value || 'var(--color-primary)' }} />
          </div>
          <div className="flex items-end gap-2">
            <span 
              className="text-2xl font-bold"
              style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
            >
              {SAMPLE_STATS.value}
            </span>
            <div 
              className="flex items-center gap-1 text-sm"
              style={{ 
                color: SAMPLE_STATS.trend === 'up' ? '#22c55e' : 
                       SAMPLE_STATS.trend === 'down' ? '#ef4444' : 
                       (colors?.mutedForeground?.value || 'var(--color-muted-foreground)')
              }}
            >
              {SAMPLE_STATS.trend === 'up' ? <TrendingUp size={14} /> : 
               SAMPLE_STATS.trend === 'down' ? <TrendingDown size={14} /> : null}
              +{SAMPLE_STATS.change}%
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80"
        style={{
          background: colors?.card?.value || 'var(--color-card)',
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
          boxShadow: shadows?.shadowLg || 'var(--shadow-lg)'
        }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: SAMPLE_STATS.trend === 'up' ? '#22c55e20' : '#ef444420',
                color: SAMPLE_STATS.trend === 'up' ? '#22c55e' : '#ef4444'
              }}
            >
              {SAMPLE_STATS.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <div>
              <h4 
                className="font-semibold"
                style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
              >
                {SAMPLE_STATS.title}
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
              >
                {SAMPLE_STATS.period}
              </p>
            </div>
          </div>

          {/* Main Value */}
          <div className="text-center py-4">
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
            >
              {SAMPLE_STATS.value}
            </div>
            <div 
              className="flex items-center justify-center gap-2 text-lg font-semibold"
              style={{ 
                color: SAMPLE_STATS.trend === 'up' ? '#22c55e' : '#ef4444'
              }}
            >
              {SAMPLE_STATS.trend === 'up' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {SAMPLE_STATS.change}% {SAMPLE_STATS.trend === 'up' ? 'increase' : 'decrease'}
            </div>
          </div>

          {/* Description */}
          <p 
            className="text-sm leading-relaxed text-center"
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          >
            {SAMPLE_STATS.description}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              style={{
                background: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
              }}
            >
              <BarChart3 size={14} className="mr-1" />
              View Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              style={{
                borderColor: colors?.border?.value || 'var(--color-border)',
                color: colors?.foreground?.value || 'var(--color-foreground)'
              }}
            >
              <Share2 size={14} />
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  const renderContent = () => {
    switch (variant) {
      case 'product': return renderProductCard();
      case 'stats': return renderStatsCard();
      case 'user':
      default: return renderUserCard();
    }
  };

  return (
    <div className={className}>
      {renderContent()}
    </div>
  );
}

/**
 * HoverCardOrganismShowcase - Demo component showing different hover card variants
 */
export function HoverCardOrganismShowcase() {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h4 
          className="text-lg font-semibold mb-2"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          User Profile Hover Card
        </h4>
        <p 
          className="text-sm mb-4"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Rich user information on hover
        </p>
        <HoverCardOrganism variant="user" />
      </div>
      
      <div>
        <h4 
          className="text-lg font-semibold mb-2"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Product Information Hover Card
        </h4>
        <p 
          className="text-sm mb-4"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Product details with features and actions
        </p>
        <HoverCardOrganism variant="product" />
      </div>
      
      <div>
        <h4 
          className="text-lg font-semibold mb-2"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Statistics Hover Card
        </h4>
        <p 
          className="text-sm mb-4"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Detailed metrics with trend analysis
        </p>
        <HoverCardOrganism variant="stats" />
      </div>
    </div>
  );
}