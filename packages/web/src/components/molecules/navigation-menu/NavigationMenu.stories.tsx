import type { Meta, StoryObj } from '@storybook/react';
import {
  Home,
  Package,
  ShoppingCart,
  Star,
  Zap,
  Heart,
  BookOpen,
  Code,
  Users,
} from 'lucide-react';
import { NavigationMenu, NavigationMenuPresets } from './NavigationMenu';
import type { NavigationItem } from './NavigationMenu.types';

const meta: Meta<typeof NavigationMenu> = {
  title: 'Molecules/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'featured'],
      description: 'Visual variant of the navigation menu',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the navigation menu',
    },
    viewport: {
      control: 'boolean',
      description: 'Whether to show the viewport for dropdown content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

// ============================================================================
// Test Data
// ============================================================================

const simpleItems: NavigationItem[] = [
  {
    id: '1',
    label: 'Home',
    href: '/',
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: '2',
    label: 'Products',
    href: '/products',
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: '3',
    label: 'Cart',
    href: '/cart',
    icon: <ShoppingCart className="w-4 h-4" />,
    badge: { text: '3', variant: 'default' },
  },
];

const nestedItems: NavigationItem[] = [
  {
    id: '1',
    label: 'Home',
    href: '/',
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: '2',
    label: 'Products',
    icon: <Package className="w-4 h-4" />,
    badge: { text: 'New', variant: 'secondary' },
    children: [
      {
        id: '2-1',
        label: 'All Products',
        href: '/products',
        description: 'Browse our complete product catalog',
      },
      {
        id: '2-2',
        label: 'New Arrivals',
        href: '/products/new',
        description: 'Check out our latest products',
        badge: { text: 'Hot', variant: 'destructive' },
      },
      {
        id: '2-3',
        label: 'On Sale',
        href: '/products/sale',
        description: 'Great deals on selected items',
        badge: { text: '50% OFF', variant: 'default' },
      },
    ],
  },
  {
    id: '3',
    label: 'Resources',
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      {
        id: '3-1',
        label: 'Documentation',
        href: '/docs',
        description: 'Learn how to use our products',
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        id: '3-2',
        label: 'API Reference',
        href: '/api',
        description: 'Complete API documentation',
        icon: <Code className="w-4 h-4" />,
      },
      {
        id: '3-3',
        label: 'Community',
        href: 'https://community.example.com',
        description: 'Join our developer community',
        icon: <Users className="w-4 h-4" />,
        external: true,
      },
    ],
  },
];

const featuredItems: NavigationItem[] = [
  {
    id: '1',
    label: 'Home',
    href: '/',
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: '2',
    label: 'Products',
    icon: <Package className="w-4 h-4" />,
    badge: { text: '12', variant: 'default' },
    children: [
      // Featured items
      {
        id: '2-1',
        label: 'New Arrivals',
        href: '/products/new',
        description: 'Check out our latest products and innovations',
        icon: <Zap className="w-4 h-4" />,
        featured: true,
        badge: { text: 'New', variant: 'default' },
      },
      {
        id: '2-2',
        label: 'Best Sellers',
        href: '/products/best',
        description: 'Our most popular products this month',
        icon: <Star className="w-4 h-4" />,
        featured: true,
        badge: { text: 'Popular', variant: 'default' },
      },
      {
        id: '2-3',
        label: 'Favorites',
        href: '/products/favorites',
        description: 'Customer favorites and top-rated items',
        icon: <Heart className="w-4 h-4" />,
        featured: true,
      },
      // Regular items
      {
        id: '2-4',
        label: 'All Products',
        href: '/products',
        icon: <Package className="w-4 h-4" />,
      },
      {
        id: '2-5',
        label: 'Categories',
        href: '/categories',
      },
      {
        id: '2-6',
        label: 'Brands',
        href: '/brands',
      },
      {
        id: '2-7',
        label: 'On Sale',
        href: '/sale',
        badge: { text: '30% OFF', variant: 'destructive' },
      },
    ],
  },
  {
    id: '3',
    label: 'Resources',
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      {
        id: '3-1',
        label: 'Getting Started Guide',
        href: '/docs/getting-started',
        description: 'Quick start guide for new users',
        icon: <BookOpen className="w-4 h-4" />,
        featured: true,
      },
      {
        id: '3-2',
        label: 'Documentation',
        href: '/docs',
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        id: '3-3',
        label: 'API Reference',
        href: '/api',
        icon: <Code className="w-4 h-4" />,
      },
      {
        id: '3-4',
        label: 'Community',
        href: 'https://community.example.com',
        icon: <Users className="w-4 h-4" />,
        external: true,
      },
    ],
  },
];

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  args: {
    items: simpleItems,
    variant: 'default',
    orientation: 'horizontal',
  },
};

export const WithBadges: Story = {
  args: {
    items: simpleItems,
    variant: 'default',
    orientation: 'horizontal',
  },
};

export const WithNestedMenus: Story = {
  args: {
    items: nestedItems,
    variant: 'default',
    orientation: 'horizontal',
  },
};

export const CompactVariant: Story = {
  args: {
    items: nestedItems,
    variant: 'compact',
    orientation: 'horizontal',
  },
};

export const FeaturedVariant: Story = {
  args: {
    items: featuredItems,
    variant: 'featured',
    orientation: 'horizontal',
  },
};

export const VerticalOrientation: Story = {
  args: {
    items: nestedItems,
    variant: 'default',
    orientation: 'vertical',
  },
};

export const WithoutViewport: Story = {
  args: {
    items: nestedItems,
    variant: 'default',
    orientation: 'horizontal',
    viewport: false,
  },
};

export const ComplexNavigation: Story = {
  args: {
    items: [
      {
        id: '1',
        label: 'Home',
        href: '/',
        icon: <Home className="w-4 h-4" />,
      },
      {
        id: '2',
        label: 'Products',
        icon: <Package className="w-4 h-4" />,
        badge: { text: 'New', variant: 'secondary' },
        children: [
          {
            id: '2-1',
            label: 'Electronics',
            href: '/products/electronics',
            description: 'Phones, laptops, and more',
            icon: <Zap className="w-4 h-4" />,
            featured: true,
          },
          {
            id: '2-2',
            label: 'Clothing',
            href: '/products/clothing',
            description: 'Fashion for every occasion',
            icon: <Star className="w-4 h-4" />,
            featured: true,
          },
          {
            id: '2-3',
            label: 'All Categories',
            href: '/categories',
          },
          {
            id: '2-4',
            label: 'Sale Items',
            href: '/sale',
            badge: { text: 'Up to 70% OFF', variant: 'destructive' },
          },
        ],
      },
      {
        id: '3',
        label: 'Services',
        icon: <Heart className="w-4 h-4" />,
        children: [
          {
            id: '3-1',
            label: 'Consulting',
            href: '/services/consulting',
            description: 'Expert advice for your business',
          },
          {
            id: '3-2',
            label: 'Development',
            href: '/services/development',
            description: 'Custom software solutions',
          },
          {
            id: '3-3',
            label: 'Support',
            href: '/support',
            badge: { text: '24/7', variant: 'default' },
          },
        ],
      },
      {
        id: '4',
        label: 'About',
        href: '/about',
      },
      {
        id: '5',
        label: 'Contact',
        href: '/contact',
        badge: { text: 'Get in touch', variant: 'outline' },
      },
    ],
    variant: 'featured',
    orientation: 'horizontal',
  },
};

export const UsingPresets: Story = {
  args: {
    items: nestedItems,
    ...NavigationMenuPresets.basic,
  },
};

export const VerticalPreset: Story = {
  args: {
    items: nestedItems,
    ...NavigationMenuPresets.vertical,
  },
};

export const FeaturedPreset: Story = {
  args: {
    items: featuredItems,
    ...NavigationMenuPresets.featured,
  },
};
