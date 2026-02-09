import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
  DropdownMenuMolecule,
} from './DropdownMenu';
import type { DropdownMenuDataItem } from './DropdownMenu.types';
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  UserPlus,
  PlusCircle,
  Github,
  Cloud,
  LifeBuoy,
  Edit,
  Trash,
  Copy,
  Star,
  Share,
  Download,
} from 'lucide-react';
import React from 'react';

const meta = {
  title: 'Molecules-Alianza/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dropdown menu with BOTH primitive composition pattern and data-driven API. Use primitives for maximum flexibility or DropdownMenuMolecule for quick implementation.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * PRIMITIVE COMPOSITION PATTERN STORIES
 */

export const PrimitiveBasic: Story = {
  name: 'Primitive - Basic Menu',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
        Open Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <User className="mr-2 size-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 size-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const PrimitiveWithShortcuts: Story = {
  name: 'Primitive - With Shortcuts',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Edit className="mr-2 size-4" />
          <span>Edit</span>
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 size-4" />
          <span>Duplicate</span>
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash className="mr-2 size-4" />
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const PrimitiveWithCheckboxes: Story = {
  name: 'Primitive - Checkbox Items',
  render: () => {
    const [showStatusBar, setShowStatusBar] = React.useState(true);
    const [showActivityBar, setShowActivityBar] = React.useState(false);
    const [showPanel, setShowPanel] = React.useState(false);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
          View Options
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showActivityBar}
            onCheckedChange={setShowActivityBar}
          >
            Activity Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showPanel}
            onCheckedChange={setShowPanel}
          >
            Panel
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const PrimitiveWithRadioGroup: Story = {
  name: 'Primitive - Radio Group',
  render: () => {
    const [position, setPosition] = React.useState('bottom');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
          Panel Position
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const PrimitiveWithSubMenu: Story = {
  name: 'Primitive - Sub-menu',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
        More Options
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Edit className="mr-2 size-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 size-4" />
          <span>Copy</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Share className="mr-2 size-4" />
            <span>Share</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Mail className="mr-2 size-4" />
              <span>Email</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 size-4" />
              <span>Message</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PlusCircle className="mr-2 size-4" />
              <span>More...</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash className="mr-2 size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * DATA-DRIVEN MOLECULE STORIES
 */

export const MoleculeDefault: Story = {
  name: 'Molecule - Default Variant',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: '1', label: 'Profile', icon: <User className="size-4" />, type: 'item' },
      { id: '2', label: 'Settings', icon: <Settings className="size-4" />, type: 'item' },
      { id: 'sep1', label: '', type: 'separator' },
      { id: '3', label: 'Log out', icon: <LogOut className="size-4" />, type: 'item' },
    ];

    return <DropdownMenuMolecule items={items} variant="default" />;
  },
};

export const MoleculeUser: Story = {
  name: 'Molecule - User Variant',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: 'label', label: 'My Account', type: 'label' },
      { id: '1', label: 'Profile', icon: <User className="size-4" />, shortcut: '⌘P', type: 'item' },
      { id: '2', label: 'Billing', icon: <CreditCard className="size-4" />, shortcut: '⌘B', type: 'item' },
      { id: '3', label: 'Settings', icon: <Settings className="size-4" />, shortcut: '⌘S', type: 'item' },
      { id: 'sep1', label: '', type: 'separator' },
      { id: 'label2', label: 'Support', type: 'label' },
      { id: '4', label: 'Help', icon: <LifeBuoy className="size-4" />, type: 'item' },
      { id: 'sep2', label: '', type: 'separator' },
      { id: '5', label: 'Log out', icon: <LogOut className="size-4" />, type: 'item' },
    ];

    return <DropdownMenuMolecule items={items} variant="user" placement="bottom-end" />;
  },
};

export const MoleculeActions: Story = {
  name: 'Molecule - Actions Variant',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: '1', label: 'Edit', icon: <Edit className="size-4" />, shortcut: '⌘E', type: 'item' },
      { id: '2', label: 'Duplicate', icon: <Copy className="size-4" />, shortcut: '⌘D', type: 'item' },
      { id: '3', label: 'Star', icon: <Star className="size-4" />, shortcut: '⌘⇧S', type: 'item' },
      { id: 'sep1', label: '', type: 'separator' },
      { id: '4', label: 'Download', icon: <Download className="size-4" />, type: 'item' },
      { id: 'sep2', label: '', type: 'separator' },
      {
        id: '5',
        label: 'Delete',
        icon: <Trash className="size-4" />,
        shortcut: '⌘⌫',
        badge: { text: 'Danger', variant: 'destructive' },
        type: 'item',
      },
    ];

    return <DropdownMenuMolecule items={items} variant="actions" placement="bottom-end" />;
  },
};

export const MoleculeContext: Story = {
  name: 'Molecule - Context Variant',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: '1', label: 'View Details', type: 'item' },
      { id: '2', label: 'Open in New Tab', type: 'item' },
      { id: 'sep1', label: '', type: 'separator' },
      { id: '3', label: 'Copy Link', type: 'item' },
      { id: '4', label: 'Share', type: 'item' },
      { id: 'sep2', label: '', type: 'separator' },
      { id: '5', label: 'Delete', type: 'item' },
    ];

    return <DropdownMenuMolecule items={items} variant="context" />;
  },
};

export const MoleculeCommand: Story = {
  name: 'Molecule - Command Variant',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: 'label', label: 'Create New', type: 'label' },
      { id: '1', label: 'Document', icon: <Plus className="size-4" />, type: 'item' },
      { id: '2', label: 'Folder', icon: <Plus className="size-4" />, type: 'item' },
      { id: '3', label: 'Project', icon: <PlusCircle className="size-4" />, type: 'item' },
      { id: 'sep1', label: '', type: 'separator' },
      { id: '4', label: 'Team Member', icon: <UserPlus className="size-4" />, type: 'item' },
    ];

    return <DropdownMenuMolecule items={items} variant="command" />;
  },
};

export const MoleculeWithCheckboxes: Story = {
  name: 'Molecule - Checkbox Items',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: 'label', label: 'Features', type: 'label' },
      { id: 'cb1', label: 'Status Bar', type: 'checkbox' },
      { id: 'cb2', label: 'Activity Bar', type: 'checkbox' },
      { id: 'cb3', label: 'Panel', type: 'checkbox' },
      { id: 'sep1', label: '', type: 'separator' },
      { id: 'cb4', label: 'Minimap', type: 'checkbox', disabled: true },
    ];

    return <DropdownMenuMolecule items={items} />;
  },
};

export const MoleculeWithRadioGroup: Story = {
  name: 'Molecule - Radio Group',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: 'label', label: 'Theme', type: 'label' },
      { id: 'r1', label: 'Light', type: 'radio' },
      { id: 'r2', label: 'Dark', type: 'radio' },
      { id: 'r3', label: 'System', type: 'radio' },
    ];

    return <DropdownMenuMolecule items={items} />;
  },
};

export const MoleculeWithSubMenu: Story = {
  name: 'Molecule - Sub-menu',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: '1', label: 'Edit', icon: <Edit className="size-4" />, type: 'item' },
      { id: '2', label: 'Copy', icon: <Copy className="size-4" />, type: 'item' },
      {
        id: 'sub1',
        label: 'Share',
        icon: <Share className="size-4" />,
        type: 'sub',
        children: [
          { id: 'sub1-1', label: 'Email', icon: <Mail className="size-4" />, type: 'item' },
          { id: 'sub1-2', label: 'Message', icon: <MessageSquare className="size-4" />, type: 'item' },
          {
            id: 'sub1-3',
            label: 'Social',
            type: 'sub',
            children: [
              { id: 'social-1', label: 'GitHub', icon: <Github className="size-4" />, type: 'item' },
              { id: 'social-2', label: 'Cloud', icon: <Cloud className="size-4" />, type: 'item' },
            ],
          },
        ],
      },
      { id: 'sep1', label: '', type: 'separator' },
      { id: '3', label: 'Delete', icon: <Trash className="size-4" />, type: 'item' },
    ];

    return <DropdownMenuMolecule items={items} />;
  },
};

export const MoleculeCustomTrigger: Story = {
  name: 'Molecule - Custom Trigger',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: '1', label: 'Profile', type: 'item' },
      { id: '2', label: 'Settings', type: 'item' },
      { id: 'sep1', label: '', type: 'separator' },
      { id: '3', label: 'Log out', type: 'item' },
    ];

    return (
      <DropdownMenuMolecule
        items={items}
        trigger={
          <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:from-purple-600 hover:to-pink-600">
            Custom Styled Trigger
          </button>
        }
        triggerAsChild
      />
    );
  },
};

export const MoleculeDisabled: Story = {
  name: 'Molecule - Disabled Items',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: '1', label: 'Active Item', type: 'item' },
      { id: '2', label: 'Disabled Item', disabled: true, type: 'item' },
      { id: 'sep1', label: '', type: 'separator' },
      { id: '3', label: 'Another Active Item', type: 'item' },
    ];

    return <DropdownMenuMolecule items={items} />;
  },
};

export const MoleculeComplex: Story = {
  name: 'Molecule - Complex Example',
  render: () => {
    const items: DropdownMenuDataItem[] = [
      { id: 'label1', label: 'My Account', type: 'label' },
      {
        id: '1',
        label: 'Profile',
        icon: <User className="size-4" />,
        shortcut: '⌘P',
        badge: { text: 'Pro', variant: 'default' },
        type: 'item',
      },
      { id: '2', label: 'Billing', icon: <CreditCard className="size-4" />, shortcut: '⌘B', type: 'item' },
      { id: 'sep1', label: '', type: 'separator' },
      { id: 'label2', label: 'Preferences', type: 'label' },
      { id: 'cb1', label: 'Email Notifications', type: 'checkbox' },
      { id: 'cb2', label: 'Marketing Emails', type: 'checkbox' },
      { id: 'sep2', label: '', type: 'separator' },
      { id: 'label3', label: 'Theme', type: 'label' },
      { id: 'r1', label: 'Light', type: 'radio' },
      { id: 'r2', label: 'Dark', type: 'radio' },
      { id: 'r3', label: 'System', type: 'radio' },
      { id: 'sep3', label: '', type: 'separator' },
      {
        id: 'sub1',
        label: 'More Options',
        icon: <Settings className="size-4" />,
        type: 'sub',
        children: [
          { id: 'sub1-1', label: 'Help Center', icon: <LifeBuoy className="size-4" />, type: 'item' },
          { id: 'sub1-2', label: 'API Documentation', type: 'item' },
          { id: 'sep-sub1', label: '', type: 'separator' },
          { id: 'sub1-3', label: 'Report a Bug', type: 'item' },
        ],
      },
      { id: 'sep4', label: '', type: 'separator' },
      { id: 'logout', label: 'Log out', icon: <LogOut className="size-4" />, shortcut: '⌘Q', type: 'item' },
    ];

    return <DropdownMenuMolecule items={items} variant="user" placement="bottom-end" />;
  },
};
