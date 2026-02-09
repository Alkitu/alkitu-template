import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ServiceIcon } from './ServiceIcon';

expect.extend(toHaveNoViolations);

describe('ServiceIcon Component', () => {
  // ===================================
  // 1. Basic Rendering Tests
  // ===================================

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<ServiceIcon category="Mantenimiento" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders an svg element', () => {
      const { container } = render(<ServiceIcon category="Mantenimiento" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with minimum required props', () => {
      const { container } = render(<ServiceIcon category="default" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // ===================================
  // 2. Service Category Icon Tests
  // ===================================

  describe('Service Category Icons', () => {
    describe('Mantenimiento (Maintenance)', () => {
      it('renders Wrench icon for Mantenimiento category', () => {
        const { container } = render(<ServiceIcon category="Mantenimiento" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('lucide-wrench');
      });

      it('renders Mantenimiento icon with custom className', () => {
        const { container } = render(
          <ServiceIcon category="Mantenimiento" className="custom-class" />,
        );
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('custom-class');
      });
    });

    describe('Limpieza (Cleaning)', () => {
      it('renders Sparkles icon for Limpieza category', () => {
        const { container } = render(<ServiceIcon category="Limpieza" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('lucide-sparkles');
      });

      it('renders Limpieza icon with custom className', () => {
        const { container } = render(
          <ServiceIcon category="Limpieza" className="text-blue-500" />,
        );
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('text-blue-500');
      });
    });

    describe('Reparación (Repair)', () => {
      it('renders Wrench icon for Reparación category', () => {
        const { container } = render(<ServiceIcon category="Reparación" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('lucide-wrench');
      });

      it('renders Reparación icon with custom className', () => {
        const { container } = render(
          <ServiceIcon category="Reparación" className="size-6" />,
        );
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('size-6');
      });
    });

    describe('Entrega (Delivery)', () => {
      it('renders Package icon for Entrega category', () => {
        const { container } = render(<ServiceIcon category="Entrega" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('lucide-package');
      });

      it('renders Entrega icon with custom className', () => {
        const { container } = render(
          <ServiceIcon category="Entrega" className="text-green-600" />,
        );
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('text-green-600');
      });
    });

    describe('Default Fallback', () => {
      it('renders Briefcase icon for unknown category', () => {
        const { container } = render(<ServiceIcon category="UnknownCategory" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('lucide-briefcase');
      });

      it('renders Briefcase icon for "default" category', () => {
        const { container } = render(<ServiceIcon category="default" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('lucide-briefcase');
      });

      it('renders default icon for empty string category', () => {
        const { container } = render(<ServiceIcon category="" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('lucide-briefcase');
      });

      it('renders default icon for arbitrary category name', () => {
        const { container } = render(<ServiceIcon category="RandomService" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('lucide-briefcase');
      });
    });
  });

  // ===================================
  // 3. ClassName Handling Tests
  // ===================================

  describe('ClassName Handling', () => {
    it('applies custom className to icon', () => {
      const { container } = render(
        <ServiceIcon category="Mantenimiento" className="custom-icon-class" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-icon-class');
    });

    it('applies multiple classes via className', () => {
      const { container } = render(
        <ServiceIcon category="Limpieza" className="size-8 text-primary" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('size-8');
      expect(svg).toHaveClass('text-primary');
    });

    it('renders without className when not provided', () => {
      const { container } = render(<ServiceIcon category="Entrega" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('handles empty className string', () => {
      const { container } = render(<ServiceIcon category="Mantenimiento" className="" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('applies Tailwind sizing classes', () => {
      const { container } = render(
        <ServiceIcon category="Limpieza" className="size-4" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('size-4');
    });

    it('applies Tailwind color classes', () => {
      const { container } = render(
        <ServiceIcon category="Reparación" className="text-red-500" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-red-500');
    });

    it('applies Tailwind utility classes', () => {
      const { container } = render(
        <ServiceIcon category="Entrega" className="opacity-50 rotate-45" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('opacity-50');
      expect(svg).toHaveClass('rotate-45');
    });
  });

  // ===================================
  // 4. Icon Component Behavior Tests
  // ===================================

  describe('Icon Component Behavior', () => {
    it('renders correct icon for each supported category', () => {
      const categories = [
        { name: 'Mantenimiento', icon: 'lucide-wrench' },
        { name: 'Limpieza', icon: 'lucide-sparkles' },
        { name: 'Reparación', icon: 'lucide-wrench' },
        { name: 'Entrega', icon: 'lucide-package' },
      ];

      categories.forEach(({ name, icon }) => {
        const { container } = render(<ServiceIcon category={name} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass(icon);
      });
    });

    it('renders same icon for Mantenimiento and Reparación', () => {
      const { container: container1 } = render(<ServiceIcon category="Mantenimiento" />);
      const { container: container2 } = render(<ServiceIcon category="Reparación" />);

      const svg1 = container1.querySelector('svg');
      const svg2 = container2.querySelector('svg');

      expect(svg1).toHaveClass('lucide-wrench');
      expect(svg2).toHaveClass('lucide-wrench');
    });

    it('renders different icons for different categories', () => {
      const { container: container1 } = render(<ServiceIcon category="Limpieza" />);
      const { container: container2 } = render(<ServiceIcon category="Entrega" />);

      const svg1 = container1.querySelector('svg');
      const svg2 = container2.querySelector('svg');

      expect(svg1).toHaveClass('lucide-sparkles');
      expect(svg2).toHaveClass('lucide-package');
    });
  });

  // ===================================
  // 5. Edge Cases Tests
  // ===================================

  describe('Edge Cases', () => {
    it('handles category with different casing (case-sensitive)', () => {
      const { container } = render(<ServiceIcon category="mantenimiento" />);
      const svg = container.querySelector('svg');
      // Should fallback to default since map is case-sensitive
      expect(svg).toHaveClass('lucide-briefcase');
    });

    it('handles category with uppercase letters', () => {
      const { container } = render(<ServiceIcon category="LIMPIEZA" />);
      const svg = container.querySelector('svg');
      // Should fallback to default since map is case-sensitive
      expect(svg).toHaveClass('lucide-briefcase');
    });

    it('handles category with leading/trailing spaces', () => {
      const { container } = render(<ServiceIcon category=" Mantenimiento " />);
      const svg = container.querySelector('svg');
      // Should fallback to default since spaces make it different
      expect(svg).toHaveClass('lucide-briefcase');
    });

    it('handles category with special characters', () => {
      const { container } = render(<ServiceIcon category="Servicio-Especial" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('lucide-briefcase');
    });

    it('handles category with numbers', () => {
      const { container } = render(<ServiceIcon category="Service123" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('lucide-briefcase');
    });

    it('handles very long category names', () => {
      const { container } = render(
        <ServiceIcon category="VeryLongCategoryNameThatShouldStillWork" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('lucide-briefcase');
    });

    it('handles single character category', () => {
      const { container } = render(<ServiceIcon category="M" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('lucide-briefcase');
    });

    it('does not break with very long className', () => {
      const longClassName = 'class1 class2 class3 class4 class5 class6 class7 class8';
      const { container } = render(
        <ServiceIcon category="Limpieza" className={longClassName} />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  // ===================================
  // 6. Props Validation Tests
  // ===================================

  describe('Props Validation', () => {
    it('requires category prop', () => {
      const { container } = render(<ServiceIcon category="Mantenimiento" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('accepts string type for category prop', () => {
      const category: string = 'Limpieza';
      const { container } = render(<ServiceIcon category={category} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('accepts string type for className prop', () => {
      const className: string = 'custom-class';
      const { container } = render(<ServiceIcon category="Entrega" className={className} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });

    it('accepts undefined for optional className prop', () => {
      const { container } = render(<ServiceIcon category="Mantenimiento" className={undefined} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // ===================================
  // 7. Integration Tests
  // ===================================

  describe('Integration', () => {
    it('renders multiple ServiceIcons with different categories', () => {
      const { container } = render(
        <div>
          <ServiceIcon category="Mantenimiento" />
          <ServiceIcon category="Limpieza" />
          <ServiceIcon category="Entrega" />
        </div>,
      );
      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(3);
    });

    it('renders ServiceIcons with different styling in a list', () => {
      const categories = ['Mantenimiento', 'Limpieza', 'Reparación', 'Entrega'];
      const { container } = render(
        <ul>
          {categories.map((cat, index) => (
            <li key={index}>
              <ServiceIcon category={cat} className="size-5" />
            </li>
          ))}
        </ul>,
      );
      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(4);
      svgs.forEach((svg) => {
        expect(svg).toHaveClass('size-5');
      });
    });

    it('works within a button component', () => {
      render(
        <button type="button" aria-label="Service button">
          <ServiceIcon category="Mantenimiento" className="size-4" />
        </button>,
      );
      const button = screen.getByRole('button', { name: 'Service button' });
      expect(button).toBeInTheDocument();
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('works within a link component', () => {
      render(
        <a href="/service" aria-label="Service link">
          <ServiceIcon category="Limpieza" />
        </a>,
      );
      const link = screen.getByRole('link', { name: 'Service link' });
      expect(link).toBeInTheDocument();
      expect(link.querySelector('svg')).toBeInTheDocument();
    });
  });

  // ===================================
  // 8. Accessibility Tests
  // ===================================

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <div>
          <ServiceIcon category="Mantenimiento" />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with custom className', async () => {
      const { container } = render(
        <div>
          <ServiceIcon category="Limpieza" className="size-6 text-blue-500" />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when used in button', async () => {
      const { container } = render(
        <button type="button" aria-label="Service action">
          <ServiceIcon category="Entrega" />
        </button>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with multiple icons', async () => {
      const { container } = render(
        <div role="list">
          <div role="listitem">
            <ServiceIcon category="Mantenimiento" />
          </div>
          <div role="listitem">
            <ServiceIcon category="Limpieza" />
          </div>
          <div role="listitem">
            <ServiceIcon category="Entrega" />
          </div>
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===================================
  // 9. Consistency Tests
  // ===================================

  describe('Consistency', () => {
    it('renders consistently across multiple renders', () => {
      const { container: container1 } = render(<ServiceIcon category="Mantenimiento" />);
      const { container: container2 } = render(<ServiceIcon category="Mantenimiento" />);

      const svg1 = container1.querySelector('svg');
      const svg2 = container2.querySelector('svg');

      expect(svg1?.className).toBe(svg2?.className);
    });

    it('maintains same icon for same category', () => {
      const { container, rerender } = render(<ServiceIcon category="Limpieza" />);
      const svg1 = container.querySelector('svg');

      rerender(<ServiceIcon category="Limpieza" />);
      const svg2 = container.querySelector('svg');

      expect(svg1?.className).toBe(svg2?.className);
    });

    it('changes icon when category changes', () => {
      const { container, rerender } = render(<ServiceIcon category="Limpieza" />);
      const svg1 = container.querySelector('svg');
      expect(svg1).toHaveClass('lucide-sparkles');

      rerender(<ServiceIcon category="Entrega" />);
      const svg2 = container.querySelector('svg');
      expect(svg2).toHaveClass('lucide-package');
    });

    it('updates className when changed', () => {
      const { container, rerender } = render(
        <ServiceIcon category="Mantenimiento" className="size-4" />,
      );
      const svg1 = container.querySelector('svg');
      expect(svg1).toHaveClass('size-4');

      rerender(<ServiceIcon category="Mantenimiento" className="size-8" />);
      const svg2 = container.querySelector('svg');
      expect(svg2).toHaveClass('size-8');
    });
  });

  // ===================================
  // 10. SVG Attributes Tests
  // ===================================

  describe('SVG Attributes', () => {
    it('renders SVG with default Lucide attributes', () => {
      const { container } = render(<ServiceIcon category="Mantenimiento" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });

    it('SVG has viewBox attribute', () => {
      const { container } = render(<ServiceIcon category="Limpieza" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox');
    });

    it('SVG has width and height attributes', () => {
      const { container } = render(<ServiceIcon category="Entrega" />);
      const svg = container.querySelector('svg');
      // Lucide icons have default width/height
      expect(svg).toHaveAttribute('width');
      expect(svg).toHaveAttribute('height');
    });

    it('SVG contains path elements', () => {
      const { container } = render(<ServiceIcon category="Reparación" />);
      const svg = container.querySelector('svg');
      const paths = svg?.querySelectorAll('path');
      expect(paths?.length).toBeGreaterThan(0);
    });
  });
});
