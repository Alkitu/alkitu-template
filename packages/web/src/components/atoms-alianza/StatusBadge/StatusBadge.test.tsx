import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { UserStatus } from '@alkitu/shared';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders VERIFIED status correctly', () => {
    const { container } = render(<StatusBadge status={UserStatus.VERIFIED} />);
    expect(container.textContent).toContain('Verified');
  });

  it('renders PENDING status correctly', () => {
    const { container } = render(<StatusBadge status={UserStatus.PENDING} />);
    expect(container.textContent).toContain('Pending');
  });

  it('renders SUSPENDED status correctly', () => {
    const { container } = render(<StatusBadge status={UserStatus.SUSPENDED} />);
    expect(container.textContent).toContain('Suspended');
  });

  it('renders ANONYMIZED status correctly', () => {
    const { container } = render(<StatusBadge status={UserStatus.ANONYMIZED} />);
    expect(container.textContent).toContain('Anonymized');
  });

  it('shows (Online) suffix when isActive is true', () => {
    const { container } = render(<StatusBadge status={UserStatus.VERIFIED} isActive={true} />);
    expect(container.textContent).toContain('Verified (Online)');
  });

  it('does not show (Online) suffix when isActive is false', () => {
    const { container } = render(<StatusBadge status={UserStatus.VERIFIED} isActive={false} />);
    expect(container.textContent).toContain('Verified');
    expect(container.textContent).not.toContain('(Online)');
  });

  it('does not show (Online) suffix when isActive is undefined', () => {
    const { container } = render(<StatusBadge status={UserStatus.PENDING} />);
    expect(container.textContent).toContain('Pending');
    expect(container.textContent).not.toContain('(Online)');
  });
});
