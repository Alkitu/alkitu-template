import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ServiceStatsCard } from './ServiceStatsCard';
import type { ServiceStatsCardProps } from './ServiceStatsCard.types';

expect.extend(toHaveNoViolations);

describe('ServiceStatsCard Component', () => {
  // ===================================
  // 1. Basic Rendering Tests
  // ===================================

  describe('Rendering', () => {
    it('renders with required props', () => {
      render(<ServiceStatsCard label="Servicios" value={24} />);

      expect(screen.getByText('Servicios')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
    });

    it('renders label with correct styling classes', () => {
      render(<ServiceStatsCard label="Test Label" value={10} />);

      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('body-xs', 'text-muted-foreground-m', 'font-light', 'whitespace-nowrap');
    });

    it('renders value with correct styling classes', () => {
      render(<ServiceStatsCard label="Test" value={42} />);

      const value = screen.getByText('42');
      expect(value).toHaveClass('font-extrabold');
      expect(value).toHaveClass('text-foreground');
    });

    it('renders card container with correct base classes', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={5} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('flex', 'flex-col', 'gap-[5px]', 'pl-[18px]', 'pr-[5px]', 'py-[15px]');
      expect(card).toHaveClass('border', 'border-ring', 'rounded-[14px]');
      expect(card).toHaveClass('bg-card', 'min-w-[200px]');
    });

    it('renders as a div element', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={1} />);

      expect(container.firstChild?.nodeName).toBe('DIV');
    });
  });

  // ===================================
  // 2. Variant Tests
  // ===================================

  describe('Variants', () => {
    it('renders with default variant by default', () => {
      render(<ServiceStatsCard label="Test" value={10} />);

      const value = screen.getByText('10');
      expect(value).toHaveClass('text-foreground');
      expect(value).not.toHaveClass('text-primary');
    });

    it('renders with default variant explicitly', () => {
      render(<ServiceStatsCard label="Test" value={10} variant="default" />);

      const value = screen.getByText('10');
      expect(value).toHaveClass('text-foreground');
      expect(value).not.toHaveClass('text-primary');
    });

    it('renders with accent variant', () => {
      render(<ServiceStatsCard label="Test" value={10} variant="accent" />);

      const value = screen.getByText('10');
      expect(value).toHaveClass('text-primary');
      expect(value).not.toHaveClass('text-foreground');
    });

    it('applies accent color only to value, not label', () => {
      render(<ServiceStatsCard label="Categorías" value={3} variant="accent" />);

      const label = screen.getByText('Categorías');
      const value = screen.getByText('3');

      expect(label).toHaveClass('text-muted-foreground-m');
      expect(value).toHaveClass('text-primary');
    });
  });

  // ===================================
  // 3. Value Display Tests
  // ===================================

  describe('Value Display', () => {
    it('displays zero value', () => {
      render(<ServiceStatsCard label="Empty" value={0} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('displays single digit value', () => {
      render(<ServiceStatsCard label="Test" value={5} />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('displays double digit value', () => {
      render(<ServiceStatsCard label="Test" value={42} />);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('displays triple digit value', () => {
      render(<ServiceStatsCard label="Test" value={999} />);

      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('displays large value (thousands)', () => {
      render(<ServiceStatsCard label="Test" value={1000} />);

      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('displays very large value (millions)', () => {
      render(<ServiceStatsCard label="Test" value={1000000} />);

      expect(screen.getByText('1000000')).toBeInTheDocument();
    });

    it('displays negative value', () => {
      render(<ServiceStatsCard label="Test" value={-10} />);

      expect(screen.getByText('-10')).toBeInTheDocument();
    });

    it('displays decimal value', () => {
      render(<ServiceStatsCard label="Test" value={3.14} />);

      expect(screen.getByText('3.14')).toBeInTheDocument();
    });

    it('displays value with many decimal places', () => {
      render(<ServiceStatsCard label="Test" value={3.14159265} />);

      expect(screen.getByText('3.14159265')).toBeInTheDocument();
    });
  });

  // ===================================
  // 4. Label Display Tests
  // ===================================

  describe('Label Display', () => {
    it('displays short label', () => {
      render(<ServiceStatsCard label="Test" value={1} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('displays long label', () => {
      render(<ServiceStatsCard label="Very Long Service Label Name" value={1} />);

      expect(screen.getByText('Very Long Service Label Name')).toBeInTheDocument();
    });

    it('displays label with special characters', () => {
      render(<ServiceStatsCard label="Categorías & Servicios" value={1} />);

      expect(screen.getByText('Categorías & Servicios')).toBeInTheDocument();
    });

    it('displays label with numbers', () => {
      render(<ServiceStatsCard label="Top 10 Services" value={10} />);

      expect(screen.getByText('Top 10 Services')).toBeInTheDocument();
    });

    it('displays empty string label', () => {
      render(<ServiceStatsCard label="" value={5} />);

      // Label element should still exist, just empty
      const { container } = render(<ServiceStatsCard label="" value={5} />);
      const spans = container.querySelectorAll('span');
      expect(spans.length).toBeGreaterThan(0);
    });

    it('applies whitespace-nowrap to label', () => {
      render(<ServiceStatsCard label="Multi Word Label" value={1} />);

      const label = screen.getByText('Multi Word Label');
      expect(label).toHaveClass('whitespace-nowrap');
    });
  });

  // ===================================
  // 5. Custom Styling Tests
  // ===================================

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ServiceStatsCard label="Test" value={1} className="custom-class" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(
        <ServiceStatsCard label="Test" value={1} className="extra-padding" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('extra-padding');
      expect(card).toHaveClass('border', 'border-ring', 'bg-card');
    });

    it('applies multiple custom classes', () => {
      const { container } = render(
        <ServiceStatsCard label="Test" value={1} className="class-one class-two class-three" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('class-one', 'class-two', 'class-three');
    });

    it('handles undefined className', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={1} className={undefined} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-card', 'border');
    });
  });

  // ===================================
  // 6. Layout and Structure Tests
  // ===================================

  describe('Layout and Structure', () => {
    it('renders label and value in correct order', () => {
      const { container } = render(<ServiceStatsCard label="Servicios" value={24} />);

      const spans = container.querySelectorAll('span');
      expect(spans[0]).toHaveTextContent('Servicios');
      expect(spans[1]).toHaveTextContent('24');
    });

    it('uses flex-col for vertical layout', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={1} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('flex-col');
    });

    it('has minimum width constraint', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={1} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('min-w-[200px]');
    });

    it('has consistent gap between label and value', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={1} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('gap-[5px]');
    });

    it('has correct padding on all sides', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={1} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('pl-[18px]', 'pr-[5px]', 'py-[15px]');
    });

    it('has rounded corners', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={1} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-[14px]');
    });

    it('has border styling', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={1} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border', 'border-ring');
    });
  });

  // ===================================
  // 7. Integration Tests
  // ===================================

  describe('Integration', () => {
    it('works with all props together', () => {
      render(
        <ServiceStatsCard
          label="Total Services"
          value={150}
          variant="accent"
          className="custom-stats-card"
        />
      );

      expect(screen.getByText('Total Services')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();

      const value = screen.getByText('150');
      expect(value).toHaveClass('text-primary');
    });

    it('renders multiple cards independently', () => {
      render(
        <>
          <ServiceStatsCard label="Servicios" value={24} variant="default" />
          <ServiceStatsCard label="Categorías" value={3} variant="accent" />
          <ServiceStatsCard label="Usuarios" value={150} />
        </>
      );

      expect(screen.getByText('Servicios')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
      expect(screen.getByText('Categorías')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Usuarios')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('maintains correct styling when rendered in a list', () => {
      const stats = [
        { label: 'Stat 1', value: 10 },
        { label: 'Stat 2', value: 20 },
        { label: 'Stat 3', value: 30 },
      ];

      render(
        <div>
          {stats.map((stat) => (
            <ServiceStatsCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      );

      stats.forEach((stat) => {
        expect(screen.getByText(stat.label)).toBeInTheDocument();
        expect(screen.getByText(stat.value.toString())).toBeInTheDocument();
      });
    });
  });

  // ===================================
  // 8. Accessibility Tests
  // ===================================

  describe('Accessibility', () => {
    it('has no accessibility violations (default variant)', async () => {
      const { container } = render(<ServiceStatsCard label="Servicios" value={24} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (accent variant)', async () => {
      const { container } = render(<ServiceStatsCard label="Categorías" value={3} variant="accent" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with zero value', async () => {
      const { container } = render(<ServiceStatsCard label="Empty Stats" value={0} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('label is readable by screen readers', () => {
      render(<ServiceStatsCard label="Servicios Activos" value={24} />);

      const label = screen.getByText('Servicios Activos');
      expect(label).toBeVisible();
    });

    it('value is readable by screen readers', () => {
      render(<ServiceStatsCard label="Test" value={42} />);

      const value = screen.getByText('42');
      expect(value).toBeVisible();
    });

    it('maintains semantic HTML structure', () => {
      const { container } = render(<ServiceStatsCard label="Test" value={10} />);

      const card = container.firstChild as HTMLElement;
      expect(card.tagName).toBe('DIV');

      const spans = card.querySelectorAll('span');
      expect(spans.length).toBe(2);
    });

    it('has sufficient color contrast (default variant)', () => {
      render(<ServiceStatsCard label="Test" value={10} />);

      const label = screen.getByText('Test');
      const value = screen.getByText('10');

      // Check that contrast-related classes are present
      expect(label).toHaveClass('text-muted-foreground-m');
      expect(value).toHaveClass('text-foreground');
    });

    it('has sufficient color contrast (accent variant)', () => {
      render(<ServiceStatsCard label="Test" value={10} variant="accent" />);

      const value = screen.getByText('10');
      expect(value).toHaveClass('text-primary');
    });
  });

  // ===================================
  // 9. Edge Cases
  // ===================================

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      render(<ServiceStatsCard label="Huge" value={999999999} />);

      expect(screen.getByText('999999999')).toBeInTheDocument();
    });

    it('handles floating point precision', () => {
      render(<ServiceStatsCard label="Float" value={0.1 + 0.2} />);

      // 0.1 + 0.2 = 0.30000000000000004 in JavaScript
      expect(screen.getByText(/0\.3/)).toBeInTheDocument();
    });

    it('handles Number.MAX_SAFE_INTEGER', () => {
      render(<ServiceStatsCard label="Max" value={Number.MAX_SAFE_INTEGER} />);

      expect(screen.getByText(Number.MAX_SAFE_INTEGER.toString())).toBeInTheDocument();
    });

    it('handles Number.MIN_SAFE_INTEGER', () => {
      render(<ServiceStatsCard label="Min" value={Number.MIN_SAFE_INTEGER} />);

      expect(screen.getByText(Number.MIN_SAFE_INTEGER.toString())).toBeInTheDocument();
    });

    it('handles value with exponential notation', () => {
      render(<ServiceStatsCard label="Exponential" value={1e10} />);

      expect(screen.getByText('10000000000')).toBeInTheDocument();
    });

    it('renders correctly when unmounted', () => {
      const { unmount } = render(<ServiceStatsCard label="Test" value={1} />);

      expect(() => unmount()).not.toThrow();
    });

    it('handles rapid re-renders', () => {
      const { rerender } = render(<ServiceStatsCard label="Test" value={1} />);

      expect(() => {
        for (let i = 0; i < 100; i++) {
          rerender(<ServiceStatsCard label="Test" value={i} />);
        }
      }).not.toThrow();
    });

    it('handles changing variants dynamically', () => {
      const { rerender } = render(<ServiceStatsCard label="Test" value={10} variant="default" />);

      let value = screen.getByText('10');
      expect(value).toHaveClass('text-foreground');

      rerender(<ServiceStatsCard label="Test" value={10} variant="accent" />);

      value = screen.getByText('10');
      expect(value).toHaveClass('text-primary');
    });

    it('handles undefined variant gracefully', () => {
      render(<ServiceStatsCard label="Test" value={10} variant={undefined} />);

      const value = screen.getByText('10');
      expect(value).toHaveClass('text-foreground');
    });
  });

  // ===================================
  // 10. TypeScript Type Tests
  // ===================================

  describe('TypeScript Props', () => {
    it('accepts valid ServiceStatsCardProps', () => {
      const props: ServiceStatsCardProps = {
        label: 'Test',
        value: 42,
        variant: 'accent',
        className: 'custom',
      };

      render(<ServiceStatsCard {...props} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('accepts minimal props', () => {
      const props: ServiceStatsCardProps = {
        label: 'Minimal',
        value: 1,
      };

      render(<ServiceStatsCard {...props} />);

      expect(screen.getByText('Minimal')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('accepts only required props', () => {
      render(<ServiceStatsCard label="Required Only" value={99} />);

      expect(screen.getByText('Required Only')).toBeInTheDocument();
      expect(screen.getByText('99')).toBeInTheDocument();
    });
  });

  // ===================================
  // 11. Visual Regression Tests
  // ===================================

  describe('Visual Consistency', () => {
    it('maintains consistent appearance across renders', () => {
      const { container: container1 } = render(
        <ServiceStatsCard label="Test" value={10} />
      );

      const { container: container2 } = render(
        <ServiceStatsCard label="Test" value={10} />
      );

      const card1 = container1.firstChild as HTMLElement;
      const card2 = container2.firstChild as HTMLElement;

      expect(card1.className).toBe(card2.className);
    });

    it('applies consistent styling to label across different instances', () => {
      render(
        <>
          <ServiceStatsCard label="Label 1" value={1} />
          <ServiceStatsCard label="Label 2" value={2} />
        </>
      );

      const label1 = screen.getByText('Label 1');
      const label2 = screen.getByText('Label 2');

      expect(label1.className).toBe(label2.className);
    });

    it('applies consistent styling to values across different instances', () => {
      render(
        <>
          <ServiceStatsCard label="Test 1" value={100} />
          <ServiceStatsCard label="Test 2" value={200} />
        </>
      );

      const value1 = screen.getByText('100');
      const value2 = screen.getByText('200');

      expect(value1.className).toBe(value2.className);
    });
  });

  // ===================================
  // 12. Real-world Usage Tests
  // ===================================

  describe('Real-world Usage', () => {
    it('displays service statistics', () => {
      render(<ServiceStatsCard label="Servicios" value={24} />);

      expect(screen.getByText('Servicios')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
    });

    it('displays category count with accent', () => {
      render(<ServiceStatsCard label="Categorías" value={3} variant="accent" />);

      expect(screen.getByText('Categorías')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      const value = screen.getByText('3');
      expect(value).toHaveClass('text-primary');
    });

    it('displays user count', () => {
      render(<ServiceStatsCard label="Usuarios Activos" value={1523} />);

      expect(screen.getByText('Usuarios Activos')).toBeInTheDocument();
      expect(screen.getByText('1523')).toBeInTheDocument();
    });

    it('displays zero state gracefully', () => {
      render(<ServiceStatsCard label="Nuevos Servicios" value={0} />);

      expect(screen.getByText('Nuevos Servicios')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('works in a dashboard grid layout', () => {
      render(
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <ServiceStatsCard label="Total" value={100} />
          <ServiceStatsCard label="Active" value={85} variant="accent" />
          <ServiceStatsCard label="Pending" value={15} />
        </div>
      );

      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });
});
