import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserStatsCard } from './UserStatsCard';
import type { UserStatsCardProps } from './UserStatsCard';

expect.extend(toHaveNoViolations);

describe('UserStatsCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with label and value', () => {
      render(<UserStatsCard label="Total de Usuarios" value={24} />);

      expect(screen.getByText('Total de Usuarios')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
    });

    it('renders as a div container', () => {
      const { container } = render(<UserStatsCard label="Test" value={10} />);

      const card = container.querySelector('div');
      expect(card).toBeInTheDocument();
    });

    it('displays label and value in separate spans', () => {
      const { container } = render(<UserStatsCard label="Usuarios" value={50} />);

      const spans = container.querySelectorAll('span');
      expect(spans).toHaveLength(2);
      expect(spans[0]).toHaveTextContent('Usuarios');
      expect(spans[1]).toHaveTextContent('50');
    });

    it('renders with minimum structure', () => {
      const { container } = render(<UserStatsCard label="Test" value={0} />);

      const card = container.firstChild;
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('flex', 'flex-col');
    });
  });

  describe('Label Display', () => {
    it('displays label with correct text', () => {
      render(<UserStatsCard label="Administradores" value={3} />);

      expect(screen.getByText('Administradores')).toBeInTheDocument();
    });

    it('applies correct label styling classes', () => {
      const { container } = render(<UserStatsCard label="Empleados" value={15} />);

      const label = screen.getByText('Empleados');
      // Custom typography utilities + Tailwind classes
      expect(label.className).toContain('text-');
      expect(label).toHaveClass('font-light');
      expect(label).toHaveClass('whitespace-nowrap');
    });

    it('prevents label text wrapping', () => {
      const { container } = render(
        <UserStatsCard label="Very Long Label That Should Not Wrap" value={100} />
      );

      const label = screen.getByText('Very Long Label That Should Not Wrap');
      expect(label).toHaveClass('whitespace-nowrap');
    });

    it('handles empty label gracefully', () => {
      render(<UserStatsCard label="" value={10} />);

      const { container } = render(<UserStatsCard label="" value={10} />);
      const spans = container.querySelectorAll('span');
      expect(spans[0]).toHaveTextContent('');
    });

    it('handles special characters in label', () => {
      render(<UserStatsCard label="Usuarios (Activos & Pendientes)" value={42} />);

      expect(screen.getByText('Usuarios (Activos & Pendientes)')).toBeInTheDocument();
    });

    it('handles unicode characters in label', () => {
      render(<UserStatsCard label="Usuarios 👥" value={25} />);

      expect(screen.getByText('Usuarios 👥')).toBeInTheDocument();
    });
  });

  describe('Value Display', () => {
    it('displays zero value', () => {
      render(<UserStatsCard label="Nuevos Usuarios" value={0} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('displays single digit values', () => {
      render(<UserStatsCard label="Test" value={5} />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('displays double digit values', () => {
      render(<UserStatsCard label="Test" value={42} />);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('displays triple digit values', () => {
      render(<UserStatsCard label="Test" value={999} />);

      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('displays large numbers (1,000+)', () => {
      render(<UserStatsCard label="Total Users" value={1234} />);

      expect(screen.getByText('1234')).toBeInTheDocument();
    });

    it('displays very large numbers (10,000+)', () => {
      render(<UserStatsCard label="Users" value={50000} />);

      expect(screen.getByText('50000')).toBeInTheDocument();
    });

    it('displays extremely large numbers (1,000,000+)', () => {
      render(<UserStatsCard label="Users" value={1500000} />);

      expect(screen.getByText('1500000')).toBeInTheDocument();
    });

    it('applies correct value styling classes', () => {
      const { container } = render(<UserStatsCard label="Test" value={100} />);

      const value = screen.getByText('100');
      expect(value).toHaveClass('font-extrabold');
      // Font class is applied via custom typography utility
      expect(value.className).toContain('text-');
    });

    it('handles negative values', () => {
      render(<UserStatsCard label="Test" value={-5} />);

      expect(screen.getByText('-5')).toBeInTheDocument();
    });

    it('handles decimal values', () => {
      render(<UserStatsCard label="Test" value={42.7} />);

      expect(screen.getByText('42.7')).toBeInTheDocument();
    });
  });

  describe('Variant Styles', () => {
    it('applies default variant styles by default', () => {
      const { container } = render(<UserStatsCard label="Test" value={10} />);

      const value = screen.getByText('10');
      expect(value).toHaveClass('text-foreground');
      expect(value).not.toHaveClass('text-primary');
    });

    it('applies default variant when explicitly specified', () => {
      const { container } = render(
        <UserStatsCard label="Test" value={10} variant="default" />
      );

      const value = screen.getByText('10');
      expect(value).toHaveClass('text-foreground');
    });

    it('applies accent variant styles', () => {
      const { container } = render(
        <UserStatsCard label="Administradores" value={3} variant="accent" />
      );

      const value = screen.getByText('3');
      expect(value).toHaveClass('text-primary');
      expect(value).not.toHaveClass('text-foreground');
    });

    it('renders all role-specific stats with accent variant', () => {
      const { rerender } = render(
        <UserStatsCard label="Administradores" value={5} variant="accent" />
      );
      expect(screen.getByText('5')).toHaveClass('text-primary');

      rerender(<UserStatsCard label="Empleados" value={12} variant="accent" />);
      expect(screen.getByText('12')).toHaveClass('text-primary');

      rerender(<UserStatsCard label="Clientes" value={89} variant="accent" />);
      expect(screen.getByText('89')).toHaveClass('text-primary');
    });

    it('maintains base value classes across variants', () => {
      const { rerender } = render(
        <UserStatsCard label="Test" value={10} variant="default" />
      );

      let value = screen.getByText('10');
      expect(value).toHaveClass('font-extrabold');

      rerender(<UserStatsCard label="Test" value={10} variant="accent" />);
      value = screen.getByText('10');
      expect(value).toHaveClass('font-extrabold');
    });
  });

  describe('Card Container Styles', () => {
    it('applies base container classes', () => {
      const { container } = render(<UserStatsCard label="Test" value={5} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('flex', 'flex-col');
    });

    it('applies gap spacing', () => {
      const { container } = render(<UserStatsCard label="Test" value={5} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('gap-[5px]');
    });

    it('applies padding classes', () => {
      const { container } = render(<UserStatsCard label="Test" value={5} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('pl-[18px]', 'pr-[5px]', 'py-[15px]');
    });

    it('applies border and rounded classes', () => {
      const { container } = render(<UserStatsCard label="Test" value={5} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border', 'border-ring', 'rounded-[14px]');
    });

    it('applies background color class', () => {
      const { container } = render(<UserStatsCard label="Test" value={5} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-card');
    });

    it('applies minimum width constraint', () => {
      const { container } = render(<UserStatsCard label="Test" value={5} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('min-w-[200px]');
    });

    it('maintains minimum width with short content', () => {
      const { container } = render(<UserStatsCard label="A" value={1} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('min-w-[200px]');
    });
  });

  describe('Custom className', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <UserStatsCard label="Test" value={5} className="custom-class" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

    it('merges custom className with base classes', () => {
      const { container } = render(
        <UserStatsCard label="Test" value={5} className="shadow-lg" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-lg');
      expect(card).toHaveClass('flex', 'flex-col', 'border');
    });

    it('allows overriding base classes via className', () => {
      const { container } = render(
        <UserStatsCard label="Test" value={5} className="min-w-[300px]" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('min-w-[300px]');
    });

    it('handles multiple custom classes', () => {
      const { container } = render(
        <UserStatsCard
          label="Test"
          value={5}
          className="custom-shadow custom-border hover:scale-105"
        />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-shadow', 'custom-border', 'hover:scale-105');
    });

    it('works without custom className', () => {
      const { container } = render(<UserStatsCard label="Test" value={5} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('flex');
    });
  });

  describe('Real-World Use Cases', () => {
    it('renders total users stat', () => {
      render(<UserStatsCard label="Total de Usuarios" value={24} />);

      expect(screen.getByText('Total de Usuarios')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
    });

    it('renders admin count with accent', () => {
      render(<UserStatsCard label="Administradores" value={3} variant="accent" />);

      expect(screen.getByText('Administradores')).toBeInTheDocument();
      const value = screen.getByText('3');
      expect(value).toHaveClass('text-primary');
    });

    it('renders employee count with accent', () => {
      render(<UserStatsCard label="Empleados" value={12} variant="accent" />);

      expect(screen.getByText('Empleados')).toBeInTheDocument();
      const value = screen.getByText('12');
      expect(value).toHaveClass('text-primary');
    });

    it('renders client count with accent', () => {
      render(<UserStatsCard label="Clientes" value={9} variant="accent" />);

      expect(screen.getByText('Clientes')).toBeInTheDocument();
      const value = screen.getByText('9');
      expect(value).toHaveClass('text-primary');
    });

    it('renders active users stat', () => {
      render(<UserStatsCard label="Usuarios Activos" value={18} />);

      expect(screen.getByText('Usuarios Activos')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
    });

    it('renders pending users stat', () => {
      render(<UserStatsCard label="Usuarios Pendientes" value={6} />);

      expect(screen.getByText('Usuarios Pendientes')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('renders new users this month', () => {
      render(<UserStatsCard label="Nuevos este mes" value={15} />);

      expect(screen.getByText('Nuevos este mes')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined variant (defaults to default)', () => {
      const { container } = render(
        <UserStatsCard label="Test" value={10} variant={undefined} />
      );

      const value = screen.getByText('10');
      expect(value).toHaveClass('text-foreground');
    });

    it('handles maximum safe integer', () => {
      const maxInt = Number.MAX_SAFE_INTEGER;
      render(<UserStatsCard label="Max" value={maxInt} />);

      expect(screen.getByText(maxInt.toString())).toBeInTheDocument();
    });

    it('handles minimum safe integer', () => {
      const minInt = Number.MIN_SAFE_INTEGER;
      render(<UserStatsCard label="Min" value={minInt} />);

      expect(screen.getByText(minInt.toString())).toBeInTheDocument();
    });

    it('renders correctly when label contains numbers', () => {
      render(<UserStatsCard label="Top 10 Users" value={10} />);

      expect(screen.getByText('Top 10 Users')).toBeInTheDocument();
    });

    it('renders correctly with very long labels', () => {
      const longLabel = 'This is a very long label that might cause layout issues';
      render(<UserStatsCard label={longLabel} value={99} />);

      expect(screen.getByText(longLabel)).toBeInTheDocument();
      expect(screen.getByText(longLabel)).toHaveClass('whitespace-nowrap');
    });

    it('handles HTML entities in label', () => {
      render(<UserStatsCard label="Users &amp; Admins" value={15} />);

      expect(screen.getByText('Users & Admins')).toBeInTheDocument();
    });
  });

  describe('TypeScript Props Interface', () => {
    it('accepts valid UserStatsCardProps', () => {
      const props: UserStatsCardProps = {
        label: 'Test Label',
        value: 42,
        variant: 'accent',
        className: 'custom-class',
      };

      render(<UserStatsCard {...props} />);

      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('requires label and value props', () => {
      const props: UserStatsCardProps = {
        label: 'Required',
        value: 10,
      };

      render(<UserStatsCard {...props} />);

      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('accepts optional variant prop', () => {
      const props: Omit<UserStatsCardProps, 'variant'> = {
        label: 'Test',
        value: 5,
      };

      render(<UserStatsCard {...props} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('accepts optional className prop', () => {
      const props: Omit<UserStatsCardProps, 'className'> = {
        label: 'Test',
        value: 5,
      };

      render(<UserStatsCard {...props} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with default props', async () => {
      const { container } = render(<UserStatsCard label="Users" value={10} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with accent variant', async () => {
      const { container } = render(
        <UserStatsCard label="Admins" value={5} variant="accent" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom className', async () => {
      const { container } = render(
        <UserStatsCard label="Users" value={20} className="shadow-md" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('label text is readable by screen readers', () => {
      render(<UserStatsCard label="Total Users" value={42} />);

      const label = screen.getByText('Total Users');
      expect(label).toBeVisible();
    });

    it('value text is readable by screen readers', () => {
      render(<UserStatsCard label="Count" value={99} />);

      const value = screen.getByText('99');
      expect(value).toBeVisible();
    });

    it('maintains semantic structure', () => {
      const { container } = render(<UserStatsCard label="Users" value={10} />);

      const card = container.firstChild;
      expect(card?.nodeName).toBe('DIV');

      const spans = container.querySelectorAll('span');
      expect(spans).toHaveLength(2);
    });

    it('label appears before value in DOM order', () => {
      const { container } = render(<UserStatsCard label="Label" value={5} />);

      const card = container.firstChild as HTMLElement;
      const children = Array.from(card.children);

      expect(children[0]).toHaveTextContent('Label');
      expect(children[1]).toHaveTextContent('5');
    });
  });

  describe('Visual Consistency', () => {
    it('maintains consistent structure across all variants', () => {
      const { container: container1 } = render(
        <UserStatsCard label="Test 1" value={10} variant="default" />
      );
      const { container: container2 } = render(
        <UserStatsCard label="Test 2" value={20} variant="accent" />
      );

      const card1 = container1.firstChild as HTMLElement;
      const card2 = container2.firstChild as HTMLElement;

      // Both should have same base classes
      expect(card1).toHaveClass('flex', 'flex-col', 'border');
      expect(card2).toHaveClass('flex', 'flex-col', 'border');
    });

    it('maintains consistent label styling', () => {
      const { rerender } = render(<UserStatsCard label="Label 1" value={1} />);

      let label = screen.getByText('Label 1');
      const classes1 = Array.from(label.classList);

      rerender(<UserStatsCard label="Label 2" value={2} variant="accent" />);
      label = screen.getByText('Label 2');
      const classes2 = Array.from(label.classList);

      // Label classes should be identical regardless of variant
      expect(classes1).toEqual(classes2);
    });

    it('applies consistent padding and spacing', () => {
      const { container } = render(<UserStatsCard label="Test" value={5} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('gap-[5px]');
      expect(card).toHaveClass('pl-[18px]', 'pr-[5px]', 'py-[15px]');
    });
  });

  describe('Component Documentation Examples', () => {
    it('renders example 1 from JSDoc', () => {
      render(<UserStatsCard label="Total de Usuarios" value={24} />);

      expect(screen.getByText('Total de Usuarios')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
    });

    it('renders example 2 from JSDoc', () => {
      render(<UserStatsCard label="Administradores" value={3} variant="accent" />);

      expect(screen.getByText('Administradores')).toBeInTheDocument();
      const value = screen.getByText('3');
      expect(value).toHaveClass('text-primary');
    });
  });

  describe('Rerender Behavior', () => {
    it('updates value when prop changes', () => {
      const { rerender } = render(<UserStatsCard label="Count" value={5} />);

      expect(screen.getByText('5')).toBeInTheDocument();

      rerender(<UserStatsCard label="Count" value={10} />);

      expect(screen.queryByText('5')).not.toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('updates label when prop changes', () => {
      const { rerender } = render(<UserStatsCard label="Old Label" value={5} />);

      expect(screen.getByText('Old Label')).toBeInTheDocument();

      rerender(<UserStatsCard label="New Label" value={5} />);

      expect(screen.queryByText('Old Label')).not.toBeInTheDocument();
      expect(screen.getByText('New Label')).toBeInTheDocument();
    });

    it('updates variant when prop changes', () => {
      const { rerender } = render(
        <UserStatsCard label="Test" value={10} variant="default" />
      );

      let value = screen.getByText('10');
      expect(value).toHaveClass('text-foreground');

      rerender(<UserStatsCard label="Test" value={10} variant="accent" />);

      value = screen.getByText('10');
      expect(value).toHaveClass('text-primary');
    });

    it('updates className when prop changes', () => {
      const { container, rerender } = render(
        <UserStatsCard label="Test" value={5} className="class-1" />
      );

      let card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('class-1');

      rerender(<UserStatsCard label="Test" value={5} className="class-2" />);

      card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('class-1');
      expect(card).toHaveClass('class-2');
    });
  });
});
