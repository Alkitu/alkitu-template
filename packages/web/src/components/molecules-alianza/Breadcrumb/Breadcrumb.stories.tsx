import type { Meta, StoryObj } from '@storybook/react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbNavigation,
} from './Breadcrumb';
import { Home, Folder, File, Settings, Users, ShoppingCart } from 'lucide-react';

const meta = {
  title: 'Molecules/Breadcrumb',
  component: BreadcrumbNavigation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Breadcrumb component for displaying navigation trails. Supports custom separators, item collapsing, icons, and multiple size variants.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreadcrumbNavigation>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

/**
 * Basic breadcrumb navigation with three levels
 */
export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details', current: true },
    ],
  },
};

/**
 * Simple two-level breadcrumb
 */
export const Simple: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings', current: true },
    ],
  },
};

/**
 * Single item breadcrumb (current page only)
 */
export const SingleItem: Story = {
  args: {
    items: [{ label: 'Current Page', current: true }],
  },
};

/**
 * Breadcrumb with slash separator
 */
export const SlashSeparator: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Category', href: '/products/category' },
      { label: 'Item Details', current: true },
    ],
    separator: 'slash',
  },
};

/**
 * Breadcrumb with arrow separator
 */
export const ArrowSeparator: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Users', href: '/dashboard/users' },
      { label: 'Profile', current: true },
    ],
    separator: 'arrow',
  },
};

/**
 * Breadcrumb with custom React separator
 */
export const CustomSeparator: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details', current: true },
    ],
    separator: <span style={{ margin: '0 4px' }}>•</span>,
  },
};

/**
 * Breadcrumb with home icon on first item
 */
export const WithHomeIcon: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Laptops', current: true },
    ],
    showHome: true,
  },
};

/**
 * Breadcrumb with custom icons for each item
 */
export const WithCustomIcons: Story = {
  args: {
    items: [
      { label: 'Home', icon: Home, href: '/' },
      { label: 'Folder', icon: Folder, href: '/folder' },
      { label: 'Subfolder', icon: Folder, href: '/folder/subfolder' },
      { label: 'Document.pdf', icon: File, current: true },
    ],
  },
};

/**
 * Breadcrumb with various icon types
 */
export const MixedIcons: Story = {
  args: {
    items: [
      { label: 'Dashboard', icon: Home, href: '/dashboard' },
      { label: 'Users', icon: Users, href: '/dashboard/users' },
      { label: 'Settings', icon: Settings, href: '/dashboard/users/settings' },
      { label: 'Shopping Cart', icon: ShoppingCart, current: true },
    ],
    separator: 'slash',
  },
};

/**
 * Long breadcrumb trail with collapsed items (maxItems=3)
 */
export const CollapsedShort: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Level 1', href: '/l1' },
      { label: 'Level 2', href: '/l2' },
      { label: 'Level 3', href: '/l3' },
      { label: 'Level 4', href: '/l4' },
      { label: 'Level 5', href: '/l5' },
      { label: 'Current Page', current: true },
    ],
    maxItems: 3,
  },
};

/**
 * Long breadcrumb trail with moderate collapse (maxItems=5)
 */
export const CollapsedMedium: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Computers', href: '/products/electronics/computers' },
      { label: 'Laptops', href: '/products/electronics/computers/laptops' },
      { label: 'Gaming', href: '/products/electronics/computers/laptops/gaming' },
      { label: 'High-End', href: '/products/electronics/computers/laptops/gaming/high-end' },
      { label: 'Product Details', current: true },
    ],
    maxItems: 5,
  },
};

/**
 * Collapsed with icons and home icon
 */
export const CollapsedWithIcons: Story = {
  args: {
    items: [
      { label: 'Home', icon: Home, href: '/' },
      { label: 'Folder 1', icon: Folder, href: '/f1' },
      { label: 'Folder 2', icon: Folder, href: '/f2' },
      { label: 'Folder 3', icon: Folder, href: '/f3' },
      { label: 'Folder 4', icon: Folder, href: '/f4' },
      { label: 'Document', icon: File, current: true },
    ],
    maxItems: 3,
    showHome: true,
  },
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details', current: true },
    ],
    size: 'sm',
  },
};

/**
 * Medium size variant (default)
 */
export const MediumSize: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details', current: true },
    ],
    size: 'md',
  },
};

/**
 * Large size variant
 */
export const LargeSize: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details', current: true },
    ],
    size: 'lg',
  },
};

/**
 * Breadcrumb with click handlers instead of links
 */
export const WithClickHandlers: Story = {
  args: {
    items: [
      { label: 'Home', onClick: () => alert('Navigating to Home') },
      { label: 'Products', onClick: () => alert('Navigating to Products') },
      { label: 'Details', current: true },
    ],
  },
};

/**
 * Mixed navigation (some with href, some with onClick)
 */
export const MixedNavigation: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', onClick: () => alert('Products clicked') },
      { label: 'Category', href: '/category' },
      { label: 'Details', current: true },
    ],
  },
};

/**
 * Custom styling with className
 */
export const CustomStyling: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details', current: true },
    ],
    className: 'bg-gray-100 p-4 rounded-lg',
  },
};

/**
 * Custom inline styles
 */
export const CustomInlineStyles: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details', current: true },
    ],
    style: {
      padding: '16px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      border: '1px solid #ccc',
    },
  },
};

/**
 * E-commerce navigation example
 */
export const EcommerceExample: Story = {
  args: {
    items: [
      { label: 'Home', icon: Home, href: '/' },
      { label: 'Shop', icon: ShoppingCart, href: '/shop' },
      { label: 'Electronics', href: '/shop/electronics' },
      { label: 'Laptops', href: '/shop/electronics/laptops' },
      { label: 'Gaming Laptop Pro X1', current: true },
    ],
    showHome: true,
    separator: 'slash',
  },
};

/**
 * Admin panel navigation example
 */
export const AdminPanelExample: Story = {
  args: {
    items: [
      { label: 'Dashboard', icon: Home, href: '/admin' },
      { label: 'Users', icon: Users, href: '/admin/users' },
      { label: 'Settings', icon: Settings, href: '/admin/users/settings' },
      { label: 'Profile Configuration', current: true },
    ],
    separator: 'arrow',
  },
};

/**
 * File system navigation example
 */
export const FileSystemExample: Story = {
  args: {
    items: [
      { label: 'Home', icon: Home, href: '/' },
      { label: 'Documents', icon: Folder, href: '/documents' },
      { label: 'Projects', icon: Folder, href: '/documents/projects' },
      { label: 'Q1 2024', icon: Folder, href: '/documents/projects/q1-2024' },
      { label: 'report.pdf', icon: File, current: true },
    ],
    showHome: true,
  },
};

/**
 * Deep navigation with collapse
 */
export const DeepNavigationCollapsed: Story = {
  args: {
    items: [
      { label: 'Root', icon: Home, href: '/' },
      { label: 'Level 1', icon: Folder, href: '/l1' },
      { label: 'Level 2', icon: Folder, href: '/l1/l2' },
      { label: 'Level 3', icon: Folder, href: '/l1/l2/l3' },
      { label: 'Level 4', icon: Folder, href: '/l1/l2/l3/l4' },
      { label: 'Level 5', icon: Folder, href: '/l1/l2/l3/l4/l5' },
      { label: 'Final Document', icon: File, current: true },
    ],
    maxItems: 4,
    showHome: true,
    size: 'md',
  },
};

/**
 * Breadcrumb using primitive components for custom layouts
 */
export const PrimitiveComponents: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Primitive components with custom separator
 */
export const PrimitiveCustomSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span style={{ fontSize: '1.2em', color: '#666' }}>→</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span style={{ fontSize: '1.2em', color: '#666' }}>→</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Primitive components with ellipsis
 */
export const PrimitiveWithEllipsis: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products/electronics">Electronics</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Laptops</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Very long breadcrumb trail showing responsive behavior
 */
export const VeryLongTrail: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Computers & Accessories', href: '/products/electronics/computers' },
      { label: 'Laptops & Notebooks', href: '/products/electronics/computers/laptops' },
      { label: 'Gaming Laptops', href: '/products/electronics/computers/laptops/gaming' },
      { label: 'High Performance Gaming', href: '/products/electronics/computers/laptops/gaming/high-perf' },
      { label: '17 inch and above', href: '/products/electronics/computers/laptops/gaming/high-perf/17inch' },
      { label: 'ASUS ROG Strix G17 Gaming Laptop', current: true },
    ],
  },
};

/**
 * Responsive showcase - all sizes side by side
 */
export const ResponsiveSizes: Story = {
  render: () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details', current: true },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '600px' }}>
        <div>
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Small (sm)</p>
          <BreadcrumbNavigation items={items} size="sm" />
        </div>
        <div>
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Medium (md) - Default</p>
          <BreadcrumbNavigation items={items} size="md" />
        </div>
        <div>
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Large (lg)</p>
          <BreadcrumbNavigation items={items} size="lg" />
        </div>
      </div>
    );
  },
};

/**
 * All separator types showcase
 */
export const SeparatorShowcase: Story = {
  render: () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details', current: true },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '600px' }}>
        <div>
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Chevron (default)</p>
          <BreadcrumbNavigation items={items} separator="chevron" />
        </div>
        <div>
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Slash</p>
          <BreadcrumbNavigation items={items} separator="slash" />
        </div>
        <div>
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Arrow</p>
          <BreadcrumbNavigation items={items} separator="arrow" />
        </div>
        <div>
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Custom (bullet)</p>
          <BreadcrumbNavigation items={items} separator={<span>•</span>} />
        </div>
      </div>
    );
  },
};
