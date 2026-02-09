import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Logo } from './Logo';

expect.extend(toHaveNoViolations);

describe('Logo - Atom (Alianza)', () => {
  describe('Basic Rendering', () => {
    it('renders logo container with correct dimensions', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveClass('w-[130.943px]', 'h-[42.811px]');
    });

    it('renders with default structure', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass('relative', 'shrink-0');
    });

    it('renders both light and dark mode images', () => {
      render(<Logo />);

      const images = screen.getAllByAltText('Alianza Logo');
      expect(images).toHaveLength(2);
    });

    it('uses default alt text when not provided', () => {
      render(<Logo />);

      const images = screen.getAllByAltText('Alianza Logo');
      expect(images).toHaveLength(2);
    });

    it('applies custom alt text to both images', () => {
      const customAlt = 'Custom Logo Text';
      render(<Logo alt={customAlt} />);

      const images = screen.getAllByAltText(customAlt);
      expect(images).toHaveLength(2);
    });
  });

  describe('Image Elements', () => {
    it('renders light mode image with correct attributes', () => {
      const { container } = render(<Logo />);

      const lightImage = container.querySelector(
        'img[src="/alianza-logo-light.png"]'
      );
      expect(lightImage).toBeInTheDocument();
      expect(lightImage).toHaveClass('absolute', 'inset-0', 'size-full');
      expect(lightImage).toHaveClass('object-contain');
    });

    it('renders dark mode image with correct attributes', () => {
      const { container } = render(<Logo />);

      const darkImage = container.querySelector(
        'img[src="/alianza-logo-dark.png"]'
      );
      expect(darkImage).toBeInTheDocument();
      expect(darkImage).toHaveClass('absolute', 'inset-0', 'size-full');
      expect(darkImage).toHaveClass('object-contain');
    });

    it('light mode image is visible by default (dark:hidden)', () => {
      const { container } = render(<Logo />);

      const lightImage = container.querySelector(
        'img[src="/alianza-logo-light.png"]'
      );
      expect(lightImage).toHaveClass('dark:hidden');
    });

    it('dark mode image is hidden by default', () => {
      const { container } = render(<Logo />);

      const darkImage = container.querySelector(
        'img[src="/alianza-logo-dark.png"]'
      );
      expect(darkImage).toHaveClass('hidden', 'dark:block');
    });

    it('both images have object-contain for proper scaling', () => {
      const { container } = render(<Logo />);

      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveClass('object-contain');
      });
    });

    it('both images use absolute positioning', () => {
      const { container } = render(<Logo />);

      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveClass('absolute', 'inset-0');
      });
    });

    it('both images fill container with size-full', () => {
      const { container } = render(<Logo />);

      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveClass('size-full');
      });
    });
  });

  describe('Theme Switching', () => {
    it('light mode image is visible in light theme', () => {
      const { container } = render(<Logo />);

      const lightImage = container.querySelector(
        'img[src="/alianza-logo-light.png"]'
      );
      // Has dark:hidden class, meaning it's visible in light mode
      expect(lightImage).toHaveClass('dark:hidden');
      expect(lightImage).not.toHaveClass('hidden');
    });

    it('dark mode image is hidden in light theme', () => {
      const { container } = render(<Logo />);

      const darkImage = container.querySelector(
        'img[src="/alianza-logo-dark.png"]'
      );
      // Has hidden class for light mode
      expect(darkImage).toHaveClass('hidden');
    });

    it('dark mode image has dark:block class for dark theme', () => {
      const { container } = render(<Logo />);

      const darkImage = container.querySelector(
        'img[src="/alianza-logo-dark.png"]'
      );
      expect(darkImage).toHaveClass('dark:block');
    });

    it('uses different image sources for light and dark modes', () => {
      const { container } = render(<Logo />);

      const lightImage = container.querySelector(
        'img[src="/alianza-logo-light.png"]'
      );
      const darkImage = container.querySelector(
        'img[src="/alianza-logo-dark.png"]'
      );

      expect(lightImage?.getAttribute('src')).toBe('/alianza-logo-light.png');
      expect(darkImage?.getAttribute('src')).toBe('/alianza-logo-dark.png');
    });
  });

  describe('Custom className', () => {
    it('accepts and applies custom className', () => {
      const { container } = render(<Logo className="custom-logo-class" />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass('custom-logo-class');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<Logo className="custom-class" />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass(
        'custom-class',
        'relative',
        'shrink-0',
        'w-[130.943px]',
        'h-[42.811px]'
      );
    });

    it('applies multiple custom classes correctly', () => {
      const { container } = render(
        <Logo className="class-one class-two class-three" />
      );

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass('class-one', 'class-two', 'class-three');
    });

    it('handles empty className prop', () => {
      const { container } = render(<Logo className="" />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveClass('relative', 'shrink-0');
    });

    it('handles undefined className prop', () => {
      const { container } = render(<Logo className={undefined} />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveClass('relative', 'shrink-0');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with default props', async () => {
      const { container } = render(<Logo />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom alt text', async () => {
      const { container } = render(<Logo alt="Company Brand Logo" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom className', async () => {
      const { container } = render(<Logo className="custom-logo" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides meaningful alt text by default', () => {
      render(<Logo />);

      const images = screen.getAllByAltText('Alianza Logo');
      expect(images.length).toBeGreaterThan(0);
    });

    it('allows custom alt text for better accessibility', () => {
      const customAlt = 'Alkitu Template Logo';
      render(<Logo alt={customAlt} />);

      const images = screen.getAllByAltText(customAlt);
      expect(images).toHaveLength(2);
    });

    it('both images have alt attribute', () => {
      const { container } = render(<Logo alt="Test Alt" />);

      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).toBe('Test Alt');
      });
    });

    it('images have descriptive alt text for screen readers', () => {
      render(<Logo alt="Alianza Platform Logo" />);

      const images = screen.getAllByAltText('Alianza Platform Logo');
      expect(images).toHaveLength(2);
    });
  });

  describe('Layout and Positioning', () => {
    it('uses relative positioning for container', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass('relative');
    });

    it('prevents shrinking with shrink-0', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass('shrink-0');
    });

    it('has fixed width dimensions', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass('w-[130.943px]');
    });

    it('has fixed height dimensions', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass('h-[42.811px]');
    });

    it('images use inset-0 for full container coverage', () => {
      const { container } = render(<Logo />);

      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveClass('inset-0');
      });
    });

    it('container is a div element', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer?.tagName).toBe('DIV');
    });
  });

  describe('Props Handling', () => {
    it('handles alt prop with empty string', () => {
      render(<Logo alt="" />);

      const images = screen.getAllByAltText('');
      expect(images).toHaveLength(2);
    });

    it('handles alt prop with special characters', () => {
      const specialAlt = 'Logo © 2024 - Alianza™';
      render(<Logo alt={specialAlt} />);

      const images = screen.getAllByAltText(specialAlt);
      expect(images).toHaveLength(2);
    });

    it('handles alt prop with unicode characters', () => {
      const unicodeAlt = 'Alianza 🚀 Logo';
      render(<Logo alt={unicodeAlt} />);

      const images = screen.getAllByAltText(unicodeAlt);
      expect(images).toHaveLength(2);
    });

    it('handles alt prop with long text', () => {
      const longAlt = 'This is a very long alternative text for the Alianza logo that describes the brand in detail for screen readers and accessibility purposes';
      render(<Logo alt={longAlt} />);

      const images = screen.getAllByAltText(longAlt);
      expect(images).toHaveLength(2);
    });

    it('accepts only supported props', () => {
      const { container } = render(
        <Logo className="test-class" alt="Test Alt" />
      );

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass('test-class');
    });
  });

  describe('Image Sources', () => {
    it('light mode image points to correct file', () => {
      const { container } = render(<Logo />);

      const lightImage = container.querySelector('img.dark\\:hidden');
      expect(lightImage?.getAttribute('src')).toBe('/alianza-logo-light.png');
    });

    it('dark mode image points to correct file', () => {
      const { container } = render(<Logo />);

      const darkImage = container.querySelector('img.hidden.dark\\:block');
      expect(darkImage?.getAttribute('src')).toBe('/alianza-logo-dark.png');
    });

    it('uses root-relative paths for images', () => {
      const { container } = render(<Logo />);

      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        const src = img.getAttribute('src');
        expect(src).toMatch(/^\//); // Starts with /
      });
    });

    it('image sources are distinct', () => {
      const { container } = render(<Logo />);

      const lightImage = container.querySelector(
        'img[src="/alianza-logo-light.png"]'
      );
      const darkImage = container.querySelector(
        'img[src="/alianza-logo-dark.png"]'
      );

      expect(lightImage?.getAttribute('src')).not.toBe(
        darkImage?.getAttribute('src')
      );
    });
  });

  describe('Data Attributes', () => {
    it('has data-name attribute for identification', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toBeInTheDocument();
    });

    it('data-name attribute has correct value', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer?.getAttribute('data-name')).toBe('Logo');
    });

    it('container can be selected by data-name', () => {
      const { container } = render(<Logo className="test-logo" />);

      const logoByDataName = container.querySelector('[data-name="Logo"]');
      const logoByClass = container.querySelector('.test-logo');

      expect(logoByDataName).toBe(logoByClass);
    });
  });

  describe('Edge Cases', () => {
    it('renders correctly with null className', () => {
      const { container } = render(<Logo className={null as any} />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toBeInTheDocument();
    });

    it('handles className with leading/trailing spaces', () => {
      const { container } = render(<Logo className="  custom-class  " />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toHaveClass('custom-class');
    });

    it('renders only once', () => {
      const { container } = render(<Logo />);

      const logoContainers = container.querySelectorAll('[data-name="Logo"]');
      expect(logoContainers).toHaveLength(1);
    });

    it('maintains aspect ratio with object-contain', () => {
      const { container } = render(<Logo />);

      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveClass('object-contain');
      });
    });

    it('images are properly layered with absolute positioning', () => {
      const { container } = render(<Logo />);

      const lightImage = container.querySelector(
        'img[src="/alianza-logo-light.png"]'
      );
      const darkImage = container.querySelector(
        'img[src="/alianza-logo-dark.png"]'
      );

      expect(lightImage).toHaveClass('absolute');
      expect(darkImage).toHaveClass('absolute');
    });
  });

  describe('Component Structure', () => {
    it('has correct element hierarchy', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      const images = logoContainer?.querySelectorAll('img');

      expect(images?.length).toBe(2);
    });

    it('all images are direct children of container', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      const directChildren = logoContainer?.children;

      expect(directChildren?.length).toBe(2);
      Array.from(directChildren || []).forEach((child) => {
        expect(child.tagName).toBe('IMG');
      });
    });

    it('maintains consistent structure across renders', () => {
      const { container, rerender } = render(<Logo />);

      const initialStructure = container.innerHTML;

      rerender(<Logo />);

      expect(container.innerHTML).toBe(initialStructure);
    });

    it('maintains structure with different props', () => {
      const { container, rerender } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      const initialChildCount = logoContainer?.children.length;

      rerender(<Logo className="different-class" alt="Different Alt" />);

      const updatedLogoContainer = container.querySelector('[data-name="Logo"]');
      expect(updatedLogoContainer?.children.length).toBe(initialChildCount);
    });
  });

  describe('Display and Visibility', () => {
    it('container is visible by default', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('[data-name="Logo"]');
      expect(logoContainer).toBeVisible();
    });

    it('light mode image is not marked as hidden by default', () => {
      const { container } = render(<Logo />);

      const lightImage = container.querySelector(
        'img[src="/alianza-logo-light.png"]'
      );
      // Should have dark:hidden but not hidden
      expect(lightImage).toHaveClass('dark:hidden');
      expect(lightImage?.classList.contains('hidden')).toBe(false);
    });

    it('dark mode image has hidden class for light mode', () => {
      const { container } = render(<Logo />);

      const darkImage = container.querySelector(
        'img[src="/alianza-logo-dark.png"]'
      );
      expect(darkImage).toHaveClass('hidden');
    });
  });

  describe('Integration Tests', () => {
    it('works correctly in a parent container', () => {
      const { container } = render(
        <div data-testid="parent">
          <Logo />
        </div>
      );

      const parent = container.querySelector('[data-testid="parent"]');
      const logo = container.querySelector('[data-name="Logo"]');

      expect(parent).toContainElement(logo);
    });

    it('can be rendered multiple times', () => {
      const { container } = render(
        <>
          <Logo alt="First Logo" />
          <Logo alt="Second Logo" />
        </>
      );

      const firstImages = screen.getAllByAltText('First Logo');
      const secondImages = screen.getAllByAltText('Second Logo');

      expect(firstImages).toHaveLength(2);
      expect(secondImages).toHaveLength(2);
    });

    it('maintains independence when rendered multiple times', () => {
      const { container } = render(
        <>
          <Logo className="logo-one" alt="Logo One" />
          <Logo className="logo-two" alt="Logo Two" />
        </>
      );

      const logoOne = container.querySelector('.logo-one');
      const logoTwo = container.querySelector('.logo-two');

      expect(logoOne).toBeInTheDocument();
      expect(logoTwo).toBeInTheDocument();
      expect(logoOne).not.toBe(logoTwo);
    });
  });
});
