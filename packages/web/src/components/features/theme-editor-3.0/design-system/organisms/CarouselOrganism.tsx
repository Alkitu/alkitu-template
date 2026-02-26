'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../primitives/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../primitives/carousel';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { Play, Pause, SkipBack, SkipForward, Heart, Share2, Star, Eye } from 'lucide-react';

export interface CarouselOrganismProps {
  variant?: 'media' | 'product' | 'testimonial' | 'feature' | 'gallery';
  autoPlay?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

interface CarouselItemData {
  id: string;
  title: string;
  description: string;
  image?: string;
  badge?: string;
  rating?: number;
  price?: string;
  author?: string;
}

const CAROUSEL_DATA: Record<string, CarouselItemData[]> = {
  media: [
    {
      id: '1',
      title: 'Beautiful Sunset',
      description: 'A stunning view of the golden hour over the mountains.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      badge: 'Featured',
      rating: 4.8
    },
    {
      id: '2',
      title: 'Ocean Waves',
      description: 'Peaceful sounds of waves crashing against the shore.',
      image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
      rating: 4.6
    },
    {
      id: '3',
      title: 'Forest Path',
      description: 'A mysterious trail through the ancient woods.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      badge: 'New',
      rating: 4.9
    }
  ],
  product: [
    {
      id: '1',
      title: 'Wireless Headphones',
      description: 'Premium noise-canceling headphones with 30-hour battery life.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=250&fit=crop',
      badge: 'Best Seller',
      price: '$299.99',
      rating: 4.7
    },
    {
      id: '2',
      title: 'Smart Watch',
      description: 'Advanced fitness tracking with health monitoring features.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=250&fit=crop',
      price: '$199.99',
      rating: 4.5
    },
    {
      id: '3',
      title: 'Laptop Stand',
      description: 'Ergonomic aluminum stand for better posture and cooling.',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=250&fit=crop',
      badge: 'Sale',
      price: '$89.99',
      rating: 4.3
    }
  ],
  testimonial: [
    {
      id: '1',
      title: 'Game Changer',
      description: 'This product completely transformed how I work. The productivity boost is incredible!',
      author: 'Sarah Johnson',
      badge: 'CEO',
      rating: 5
    },
    {
      id: '2',
      title: 'Outstanding Quality',
      description: 'Exceeded all my expectations. The attention to detail is remarkable.',
      author: 'Michael Chen',
      badge: 'Designer',
      rating: 4.8
    },
    {
      id: '3',
      title: 'Highly Recommend',
      description: 'Best investment I\'ve made for my business this year. Worth every penny!',
      author: 'Emily Davis',
      badge: 'Entrepreneur',
      rating: 4.9
    }
  ]
};

/**
 * CarouselOrganism - Complex carousel component with theme integration
 * 
 * Combines: Carousel + Card + Button + Badge + Typography + Media
 * Features: Multiple variants, auto-play, theme-responsive design, interactive controls
 * Spacing: Small (internal padding), Medium (component gaps), Large (section spacing)
 */
export function CarouselOrganism({
  variant = 'media',
  autoPlay = false,
  showControls = true,
  showIndicators = true,
  className = ''
}: CarouselOrganismProps) {
  const { state } = useThemeEditor();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
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

  const items = CAROUSEL_DATA[variant] || CAROUSEL_DATA.media;

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'fill-current' : ''}
        style={{ 
          color: i < Math.floor(rating) 
            ? '#fbbf24' 
            : colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
        }}
      />
    ));
  };

  const renderMediaItem = (item: CarouselItemData) => (
    <Card 
      className="relative overflow-hidden"
      style={{
        background: `${colors?.card?.value || 'var(--color-card)'}`,
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowMd || 'var(--shadow-md)'
      }}
    >
      <div className="relative">
        <div 
          className="w-full h-[250px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
          style={{
            background: item.image ? 
              `url(${item.image}) center/cover` : 
              `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}, ${colors?.secondary?.value || 'var(--color-secondary)'})`
          }}
        >
          {!item.image && <Eye size={48} color="white" opacity={0.7} />}
        </div>
        
        {/* Overlays */}
        <div className="absolute top-3 left-3">
          {item.badge && (
            <Badge 
              style={{
                background: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
              }}
            >
              {item.badge}
            </Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 backdrop-blur-sm"
            onClick={() => toggleFavorite(item.id)}
            style={{
              background: 'rgba(0,0,0,0.5)',
              color: favorites.has(item.id) ? '#ef4444' : 'white'
            }}
          >
            <Heart size={14} className={favorites.has(item.id) ? 'fill-current' : ''} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 backdrop-blur-sm"
            style={{
              background: 'rgba(0,0,0,0.5)',
              color: 'white'
            }}
          >
            <Share2 size={14} />
          </Button>
        </div>
      </div>
      
      <CardContent style={{ padding: mediumSpacing }}>
        <CardTitle 
          className="mb-2"
          style={{ 
            color: colors?.foreground?.value || 'var(--color-foreground)',
            fontSize: '18px'
          }}
        >
          {item.title}
        </CardTitle>
        <CardDescription 
          className="mb-3"
          style={{ 
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' 
          }}
        >
          {item.description}
        </CardDescription>
        
        {item.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(item.rating)}
            </div>
            <span 
              className="text-sm font-medium"
              style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
            >
              {item.rating}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderProductItem = (item: CarouselItemData) => (
    <Card 
      className="relative overflow-hidden"
      style={{
        background: `${colors?.card?.value || 'var(--color-card)'}`,
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowMd || 'var(--shadow-md)'
      }}
    >
      <div className="relative">
        <div 
          className="w-full h-[200px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
          style={{
            background: item.image ? 
              `url(${item.image}) center/cover` : 
              `linear-gradient(135deg, ${colors?.accent?.value || 'var(--color-accent)'}, ${colors?.muted?.value || 'var(--color-muted)'})`
          }}
        >
          {!item.image && <Eye size={32} color="gray" opacity={0.5} />}
        </div>
        
        {item.badge && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="error"
              style={{
                background: item.badge === 'Sale' ? '#ef4444' : (colors?.primary?.value || 'var(--color-primary)'),
                color: 'white'
              }}
            >
              {item.badge}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent style={{ padding: mediumSpacing }}>
        <div className="flex items-start justify-between mb-2">
          <CardTitle 
            className="text-lg"
            style={{ 
              color: colors?.foreground?.value || 'var(--color-foreground)' 
            }}
          >
            {item.title}
          </CardTitle>
          {item.price && (
            <span 
              className="text-lg font-bold"
              style={{ color: colors?.primary?.value || 'var(--color-primary)' }}
            >
              {item.price}
            </span>
          )}
        </div>
        
        <CardDescription 
          className="mb-3"
          style={{ 
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' 
          }}
        >
          {item.description}
        </CardDescription>
        
        <div className="flex items-center justify-between">
          {item.rating && (
            <div className="flex items-center gap-1">
              {renderStars(item.rating)}
              <span 
                className="text-sm ml-1"
                style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
              >
                ({item.rating})
              </span>
            </div>
          )}
          
          <Button
            size="sm"
            style={{
              background: colors?.primary?.value || 'var(--color-primary)',
              color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
            }}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTestimonialItem = (item: CarouselItemData) => (
    <Card 
      className="text-center"
      style={{
        background: `${colors?.card?.value || 'var(--color-card)'}`,
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowMd || 'var(--shadow-md)'
      }}
    >
      <CardContent style={{ padding: `${mediumSpacing} ${mediumSpacing} ${smallSpacing}` }}>
        <div className="mb-4">
          {item.rating && (
            <div className="flex items-center justify-center gap-1 mb-3">
              {renderStars(item.rating)}
            </div>
          )}
          
          <CardTitle 
            className="text-xl mb-3"
            style={{ 
              color: colors?.foreground?.value || 'var(--color-foreground)' 
            }}
          >
            "{item.title}"
          </CardTitle>
          
          <CardDescription 
            className="text-base italic"
            style={{ 
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' 
            }}
          >
            {item.description}
          </CardDescription>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}, ${colors?.secondary?.value || 'var(--color-secondary)'})`
            }}
          >
            <span className="text-white font-bold">
              {item.author?.charAt(0) || 'A'}
            </span>
          </div>
          
          <div>
            <p 
              className="font-semibold"
              style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
            >
              {item.author}
            </p>
            {item.badge && (
              <Badge 
                variant="outline"
                className="mt-1"
                style={{
                  borderColor: colors?.border?.value || 'var(--color-border)',
                  color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
                }}
              >
                {item.badge}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderItem = (item: CarouselItemData) => {
    switch (variant) {
      case 'product': return renderProductItem(item);
      case 'testimonial': return renderTestimonialItem(item);
      case 'media':
      case 'feature':
      case 'gallery':
      default: return renderMediaItem(item);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id} className="basis-1/1 md:basis-1/2 lg:basis-1/3">
              {renderItem(item)}
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious 
          className="-left-12"
          style={{
            borderColor: colors?.border?.value || 'var(--color-border)',
            background: colors?.background?.value || 'var(--color-background)',
            color: colors?.foreground?.value || 'var(--color-foreground)'
          }}
        />
        
        <CarouselNext 
          className="-right-12"
          style={{
            borderColor: colors?.border?.value || 'var(--color-border)',
            background: colors?.background?.value || 'var(--color-background)',
            color: colors?.foreground?.value || 'var(--color-foreground)'
          }}
        />
      </Carousel>

      {/* Controls */}
      {showControls && (
        <div 
          className="flex items-center justify-center gap-4 mt-6 p-4 rounded-lg"
          style={{
            background: `${colors?.accent?.value || 'var(--color-accent)'}20`,
            border: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
          >
            <SkipBack size={16} />
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={togglePlayPause}
            style={{
              background: colors?.primary?.value || 'var(--color-primary)',
              color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
          >
            <SkipForward size={16} />
          </Button>
        </div>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: index === currentIndex ? 
                  (colors?.primary?.value || 'var(--color-primary)') :
                  (colors?.muted?.value || 'var(--color-muted)')
              }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * CarouselOrganismShowcase - Demo component showing different carousel variants
 */
export function CarouselOrganismShowcase() {
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
          Media Carousel
        </h4>
        <p 
          className="text-sm mb-4"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Image gallery with ratings and social actions
        </p>
        <CarouselOrganism variant="media" />
      </div>
      
      <div>
        <h4 
          className="text-lg font-semibold mb-2"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Product Carousel
        </h4>
        <p 
          className="text-sm mb-4"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          E-commerce product showcase with pricing
        </p>
        <CarouselOrganism variant="product" />
      </div>
      
      <div>
        <h4 
          className="text-lg font-semibold mb-2"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Testimonial Carousel
        </h4>
        <p 
          className="text-sm mb-4"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Customer reviews and testimonials
        </p>
        <CarouselOrganism variant="testimonial" />
      </div>
    </div>
  );
}