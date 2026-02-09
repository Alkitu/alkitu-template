import type { Meta, StoryObj } from '@storybook/react';
import { UserStatus } from '@alkitu/shared';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Atoms/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A badge component for displaying user status with different variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: Object.values(UserStatus),
      description: 'The user status to display',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether to show the online indicator',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Verified: Story = {
  args: {
    status: UserStatus.VERIFIED,
  },
};

export const Pending: Story = {
  args: {
    status: UserStatus.PENDING,
  },
};

export const Suspended: Story = {
  args: {
    status: UserStatus.SUSPENDED,
  },
};

export const Anonymized: Story = {
  args: {
    status: UserStatus.ANONYMIZED,
  },
};

export const VerifiedOnline: Story = {
  args: {
    status: UserStatus.VERIFIED,
    isActive: true,
  },
};

export const PendingOnline: Story = {
  args: {
    status: UserStatus.PENDING,
    isActive: true,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <StatusBadge status={UserStatus.VERIFIED} />
        <StatusBadge status={UserStatus.VERIFIED} isActive={true} />
      </div>
      <div className="flex gap-2 items-center">
        <StatusBadge status={UserStatus.PENDING} />
        <StatusBadge status={UserStatus.PENDING} isActive={true} />
      </div>
      <div className="flex gap-2 items-center">
        <StatusBadge status={UserStatus.SUSPENDED} />
        <StatusBadge status={UserStatus.SUSPENDED} isActive={true} />
      </div>
      <div className="flex gap-2 items-center">
        <StatusBadge status={UserStatus.ANONYMIZED} />
        <StatusBadge status={UserStatus.ANONYMIZED} isActive={true} />
      </div>
    </div>
  ),
};
