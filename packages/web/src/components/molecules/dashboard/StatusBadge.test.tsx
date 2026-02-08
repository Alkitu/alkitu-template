import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StatusBadge } from './StatusBadge';
import type { RequestStatus } from './StatusBadge.types';

expect.extend(toHaveNoViolations);

describe('StatusBadge - Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders StatusBadge with PENDING status', () => {
      render(<StatusBadge status="PENDING" />);
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });

    it('renders StatusBadge with ONGOING status', () => {
      render(<StatusBadge status="ONGOING" />);
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
    });

    it('renders StatusBadge with COMPLETED status', () => {
      render(<StatusBadge status="COMPLETED" />);
      expect(screen.getByText('Completada')).toBeInTheDocument();
    });

    it('renders StatusBadge with CANCELLED status', () => {
      render(<StatusBadge status="CANCELLED" />);
      expect(screen.getByText('Cancelada')).toBeInTheDocument();
    });

    it('renders as a span element', () => {
      render(<StatusBadge status="PENDING" />);
      const badge = screen.getByText('Pendiente');
      expect(badge.tagName).toBe('SPAN');
    });
  });

  // 2. STATUS VARIANTS TESTS
  describe('Status Variants', () => {
    it.each<RequestStatus>(['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED'])(
      'renders %s status correctly',
      (status) => {
        const { container } = render(<StatusBadge status={status} />);
        const badge = container.firstChild as HTMLElement;
        expect(badge).toBeInTheDocument();
      }
    );

    it('PENDING status has yellow styling', () => {
      render(<StatusBadge status="PENDING" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('ONGOING status has blue styling', () => {
      render(<StatusBadge status="ONGOING" />);
      const badge = screen.getByText('En Proceso');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('COMPLETED status has green styling', () => {
      render(<StatusBadge status="COMPLETED" />);
      const badge = screen.getByText('Completada');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('CANCELLED status has red styling', () => {
      render(<StatusBadge status="CANCELLED" />);
      const badge = screen.getByText('Cancelada');
      expect(badge).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  // 3. DARK MODE TESTS
  describe('Dark Mode Styling', () => {
    it('PENDING has dark mode classes', () => {
      render(<StatusBadge status="PENDING" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('dark:bg-yellow-900/20', 'dark:text-yellow-400');
    });

    it('ONGOING has dark mode classes', () => {
      render(<StatusBadge status="ONGOING" />);
      const badge = screen.getByText('En Proceso');
      expect(badge).toHaveClass('dark:bg-blue-900/20', 'dark:text-blue-400');
    });

    it('COMPLETED has dark mode classes', () => {
      render(<StatusBadge status="COMPLETED" />);
      const badge = screen.getByText('Completada');
      expect(badge).toHaveClass('dark:bg-green-900/20', 'dark:text-green-400');
    });

    it('CANCELLED has dark mode classes', () => {
      render(<StatusBadge status="CANCELLED" />);
      const badge = screen.getByText('Cancelada');
      expect(badge).toHaveClass('dark:bg-red-900/20', 'dark:text-red-400');
    });
  });

  // 4. BASE STYLING TESTS
  describe('Base Styling', () => {
    it('has rounded-full class', () => {
      render(<StatusBadge status="PENDING" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('rounded-full');
    });

    it('has proper padding', () => {
      render(<StatusBadge status="PENDING" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('px-2', 'py-1');
    });

    it('has small text size', () => {
      render(<StatusBadge status="PENDING" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('text-xs');
    });

    it('has medium font weight', () => {
      render(<StatusBadge status="PENDING" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('font-medium');
    });
  });

  // 5. CUSTOM CLASSNAME TESTS
  describe('Custom ClassName', () => {
    it('accepts custom className', () => {
      render(<StatusBadge status="PENDING" className="custom-class" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      render(<StatusBadge status="PENDING" className="ml-4" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('ml-4', 'rounded-full', 'px-2');
    });

    it('defaults to empty string when className not provided', () => {
      render(<StatusBadge status="PENDING" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toBeInTheDocument();
    });

    it('handles multiple custom classes', () => {
      render(<StatusBadge status="PENDING" className="ml-2 mr-4 uppercase" />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('ml-2', 'mr-4', 'uppercase');
    });
  });

  // 6. TEXT CONTENT TESTS
  describe('Text Content', () => {
    it('displays "Pendiente" for PENDING', () => {
      render(<StatusBadge status="PENDING" />);
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });

    it('displays "En Proceso" for ONGOING', () => {
      render(<StatusBadge status="ONGOING" />);
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
    });

    it('displays "Completada" for COMPLETED', () => {
      render(<StatusBadge status="COMPLETED" />);
      expect(screen.getByText('Completada')).toBeInTheDocument();
    });

    it('displays "Cancelada" for CANCELLED', () => {
      render(<StatusBadge status="CANCELLED" />);
      expect(screen.getByText('Cancelada')).toBeInTheDocument();
    });
  });

  // 7. FALLBACK BEHAVIOR TESTS
  describe('Fallback Behavior', () => {
    it('uses PENDING config as fallback for invalid status', () => {
      // TypeScript would catch this, but testing runtime behavior
      render(<StatusBadge status={'INVALID' as RequestStatus} />);
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });

    it('fallback has PENDING styling', () => {
      render(<StatusBadge status={'INVALID' as RequestStatus} />);
      const badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });
  });

  // 8. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations for PENDING', async () => {
      const { container } = render(<StatusBadge status="PENDING" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for ONGOING', async () => {
      const { container } = render(<StatusBadge status="ONGOING" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for COMPLETED', async () => {
      const { container } = render(<StatusBadge status="COMPLETED" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for CANCELLED', async () => {
      const { container } = render(<StatusBadge status="CANCELLED" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('text has sufficient contrast (tested via colors)', () => {
      render(<StatusBadge status="PENDING" />);
      const badge = screen.getByText('Pendiente');
      // Yellow text on yellow background should have dark text (text-yellow-800)
      expect(badge).toHaveClass('text-yellow-800');
    });
  });

  // 9. EDGE CASES
  describe('Edge Cases', () => {
    it('handles rapid status changes', () => {
      const { rerender } = render(<StatusBadge status="PENDING" />);
      expect(screen.getByText('Pendiente')).toBeInTheDocument();

      rerender(<StatusBadge status="ONGOING" />);
      expect(screen.getByText('En Proceso')).toBeInTheDocument();

      rerender(<StatusBadge status="COMPLETED" />);
      expect(screen.getByText('Completada')).toBeInTheDocument();

      rerender(<StatusBadge status="CANCELLED" />);
      expect(screen.getByText('Cancelada')).toBeInTheDocument();
    });

    it('maintains styling across updates', () => {
      const { rerender } = render(<StatusBadge status="PENDING" className="ml-2" />);
      let badge = screen.getByText('Pendiente');
      expect(badge).toHaveClass('ml-2', 'rounded-full');

      rerender(<StatusBadge status="COMPLETED" className="ml-2" />);
      badge = screen.getByText('Completada');
      expect(badge).toHaveClass('ml-2', 'rounded-full');
    });
  });

  // 10. INTEGRATION TESTS
  describe('Integration', () => {
    it('works in a list of badges', () => {
      render(
        <div className="flex gap-2">
          <StatusBadge status="PENDING" />
          <StatusBadge status="ONGOING" />
          <StatusBadge status="COMPLETED" />
          <StatusBadge status="CANCELLED" />
        </div>
      );

      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
      expect(screen.getByText('Completada')).toBeInTheDocument();
      expect(screen.getByText('Cancelada')).toBeInTheDocument();
    });

    it('works with different className for each instance', () => {
      render(
        <div>
          <StatusBadge status="PENDING" className="mr-2" />
          <StatusBadge status="ONGOING" className="ml-2" />
        </div>
      );

      const pending = screen.getByText('Pendiente');
      const ongoing = screen.getByText('En Proceso');

      expect(pending).toHaveClass('mr-2');
      expect(ongoing).toHaveClass('ml-2');
    });

    it('can be used in tables', () => {
      render(
        <table>
          <tbody>
            <tr>
              <td>
                <StatusBadge status="PENDING" />
              </td>
            </tr>
            <tr>
              <td>
                <StatusBadge status="COMPLETED" />
              </td>
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('Completada')).toBeInTheDocument();
    });

    it('can be used in cards', () => {
      render(
        <div className="card">
          <h3>Request Status</h3>
          <StatusBadge status="ONGOING" />
        </div>
      );

      expect(screen.getByText('Request Status')).toBeInTheDocument();
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
    });
  });

  // 11. SNAPSHOT TESTS
  describe('Visual Consistency', () => {
    it('renders consistently for PENDING', () => {
      const { container } = render(<StatusBadge status="PENDING" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders consistently for ONGOING', () => {
      const { container } = render(<StatusBadge status="ONGOING" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders consistently for COMPLETED', () => {
      const { container } = render(<StatusBadge status="COMPLETED" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders consistently for CANCELLED', () => {
      const { container } = render(<StatusBadge status="CANCELLED" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
