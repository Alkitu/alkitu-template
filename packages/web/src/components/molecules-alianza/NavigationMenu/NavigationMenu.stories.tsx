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

export const WithExternalLinks: Story = {
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
        label: 'Documentation',
        href: 'https://docs.example.com',
        icon: <BookOpen className="w-4 h-4" />,
        external: true,
      },
      {
        id: '3',
        label: 'Resources',
        icon: <Package className="w-4 h-4" />,
        children: [
          {
            id: '3-1',
            label: 'Blog',
            href: 'https://blog.example.com',
            external: true,
          },
          {
            id: '3-2',
            label: 'GitHub',
            href: 'https://github.com/example',
            external: true,
            icon: <Code className="w-4 h-4" />,
          },
        ],
      },
    ],
    variant: 'default',
    orientation: 'horizontal',
  },
};

export const MinimalMenu: Story = {
  args: {
    items: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'About', href: '/about' },
      { id: '3', label: 'Contact', href: '/contact' },
    ],
    variant: 'default',
    orientation: 'horizontal',
  },
};

export const WithAllBadgeVariants: Story = {
  args: {
    items: [
      {
        id: '1',
        label: 'Default',
        href: '/',
        badge: { text: 'Default', variant: 'default' },
      },
      {
        id: '2',
        label: 'Secondary',
        href: '/secondary',
        badge: { text: 'Secondary', variant: 'secondary' },
      },
      {
        id: '3',
        label: 'Outline',
        href: '/outline',
        badge: { text: 'Outline', variant: 'outline' },
      },
      {
        id: '4',
        label: 'Destructive',
        href: '/destructive',
        badge: { text: 'Destructive', variant: 'destructive' },
      },
    ],
    variant: 'default',
    orientation: 'horizontal',
  },
};

export const MegaMenu: Story = {
  args: {
    items: [
      {
        id: '1',
        label: 'Shop',
        icon: <ShoppingCart className="w-4 h-4" />,
        children: [
          {
            id: '1-1',
            label: 'New Collection',
            href: '/shop/new',
            description: 'Explore our latest arrivals and trending styles',
            icon: <Zap className="w-4 h-4" />,
            featured: true,
            badge: { text: 'Just Dropped', variant: 'default' },
          },
          {
            id: '1-2',
            label: 'Best Sellers',
            href: '/shop/bestsellers',
            description: 'Most loved by our customers worldwide',
            icon: <Star className="w-4 h-4" />,
            featured: true,
            badge: { text: 'Top Rated', variant: 'default' },
          },
          {
            id: '1-3',
            label: 'Summer Sale',
            href: '/shop/sale',
            description: 'Up to 70% off on selected items',
            icon: <Heart className="w-4 h-4" />,
            featured: true,
            badge: { text: 'Save Big', variant: 'destructive' },
          },
          {
            id: '1-4',
            label: 'All Products',
            href: '/shop',
          },
          {
            id: '1-5',
            label: "Men's",
            href: '/shop/mens',
          },
          {
            id: '1-6',
            label: "Women's",
            href: '/shop/womens',
          },
          {
            id: '1-7',
            label: 'Accessories',
            href: '/shop/accessories',
          },
          {
            id: '1-8',
            label: 'Gift Cards',
            href: '/shop/gift-cards',
            badge: { text: 'Perfect Gift', variant: 'outline' },
          },
        ],
      },
      {
        id: '2',
        label: 'Learn',
        icon: <BookOpen className="w-4 h-4" />,
        children: [
          {
            id: '2-1',
            label: 'Getting Started',
            href: '/learn/getting-started',
            description: 'Everything you need to begin your journey',
            featured: true,
          },
          {
            id: '2-2',
            label: 'Guides',
            href: '/learn/guides',
          },
          {
            id: '2-3',
            label: 'Tutorials',
            href: '/learn/tutorials',
          },
          {
            id: '2-4',
            label: 'FAQ',
            href: '/learn/faq',
          },
        ],
      },
      {
        id: '3',
        label: 'Community',
        href: '/community',
        icon: <Users className="w-4 h-4" />,
        badge: { text: '2.5k online', variant: 'secondary' },
      },
    ],
    variant: 'featured',
    orientation: 'horizontal',
  },
};

export const CompactPreset: Story = {
  args: {
    items: nestedItems,
    ...NavigationMenuPresets.compact,
  },
};
