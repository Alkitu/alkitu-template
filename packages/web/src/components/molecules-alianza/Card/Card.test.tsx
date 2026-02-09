import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';
import type { CardProps } from './Card.types';

expect.extend(toHaveNoViolations);

describe('Card Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders Card with default props', () => {
      const { container } = render(<Card>Card content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card content');
      expect(card).toHaveClass('rounded-lg');
    });

    it('renders all card sections together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>,
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('renders with data-slot attributes', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>,
      );

      expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument();
    });

    it('renders Card without children', () => {
      const { container } = render(<Card />);
      const card = container.firstChild as HTMLElement;

      expect(card).toBeInTheDocument();
      expect(card).toBeEmptyDOMElement();
    });

    it('renders CardHeader standalone', () => {
      const { container } = render(<CardHeader>Header content</CardHeader>);
      const header = container.firstChild as HTMLElement;

      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Header content');
    });

    it('renders CardTitle standalone', () => {
      render(<CardTitle>Standalone Title</CardTitle>);
      const title = screen.getByText('Standalone Title');

      expect(title).toBeInTheDocument();
    });

    it('renders CardDescription standalone', () => {
      render(<CardDescription>Standalone description</CardDescription>);
      const desc = screen.getByText('Standalone description');

      expect(desc).toBeInTheDocument();
    });

    it('renders CardContent standalone', () => {
      const { container } = render(<CardContent>Standalone content</CardContent>);
      const content = container.firstChild as HTMLElement;

      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Standalone content');
    });

    it('renders CardFooter standalone', () => {
      const { container } = render(<CardFooter>Standalone footer</CardFooter>);
      const footer = container.firstChild as HTMLElement;

      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Standalone footer');
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it.each<CardProps['variant']>(['default', 'bordered', 'elevated', 'flat'])(
      'renders %s variant correctly',
      (variant) => {
        const { container } = render(<Card variant={variant}>Content</Card>);
        const card = container.firstChild as HTMLElement;

        expect(card).toBeInTheDocument();

        if (variant === 'default') {
          expect(card).toHaveClass('border', 'border-border');
        } else if (variant === 'bordered') {
          expect(card).toHaveClass('border-2', 'border-border');
        } else if (variant === 'elevated') {
          expect(card).toHaveClass('shadow-md');
        } else if (variant === 'flat') {
          expect(card).toHaveClass('bg-card');
        }
      },
    );

    it('default variant has border', () => {
      const { container } = render(<Card variant="default">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border', 'border-border');
    });

    it('default variant has background color', () => {
      const { container } = render(<Card variant="default">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-card', 'text-card-foreground');
    });

    it('bordered variant has emphasized border', () => {
      const { container } = render(<Card variant="bordered">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border-2', 'border-border');
    });

    it('bordered variant has background color', () => {
      const { container } = render(<Card variant="bordered">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-card', 'text-card-foreground');
    });

    it('elevated variant has shadow', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-md', 'hover:shadow-lg');
    });

    it('elevated variant has transition', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('transition-shadow', 'duration-300');
    });

    it('elevated variant has background color', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-card', 'text-card-foreground');
    });

    it('flat variant has no border or shadow', () => {
      const { container } = render(<Card variant="flat">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('border');
      expect(card).not.toHaveClass('shadow-md');
    });

    it('flat variant has background color', () => {
      const { container } = render(<Card variant="flat">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-card', 'text-card-foreground');
    });

    it('variant can be changed dynamically', () => {
      const { container, rerender } = render(<Card variant="default">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border');

      rerender(<Card variant="elevated">Content</Card>);
      expect(card).toHaveClass('shadow-md');
    });
  });

  // 3. PADDING TESTS
  describe('Padding', () => {
    it.each<CardProps['padding']>(['none', 'sm', 'md', 'lg'])(
      'renders %s padding correctly',
      (padding) => {
        const { container } = render(<Card padding={padding}>Content</Card>);
        const card = container.firstChild as HTMLElement;

        const paddingClass = {
          none: 'p-0',
          sm: 'p-4',
          md: 'p-6',
          lg: 'p-8',
        }[padding!];

        expect(card).toHaveClass(paddingClass);
      },
    );

    it('defaults to medium padding', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-6');
    });

    it('none padding removes all padding', () => {
      const { container } = render(<Card padding="none">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-0');
    });

    it('small padding applies p-4', () => {
      const { container } = render(<Card padding="sm">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-4');
    });

    it('medium padding applies p-6', () => {
      const { container } = render(<Card padding="md">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-6');
    });

    it('large padding applies p-8', () => {
      const { container } = render(<Card padding="lg">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-8');
    });

    it('padding can be changed dynamically', () => {
      const { container, rerender } = render(<Card padding="sm">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-4');

      rerender(<Card padding="lg">Content</Card>);
      expect(card).toHaveClass('p-8');
    });
  });

  // 4. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('uses theme CSS variables for colors', () => {
      const { container } = render(<Card variant="default">Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('bg-card', 'text-card-foreground');
    });

    it('uses border theme variable', () => {
      const { container } = render(<Card variant="default">Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('border-border');
    });

    it('applies custom border radius via CSS variable', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveStyle({
        borderRadius: 'var(--radius-card, 12px)',
      });
    });

    it('CardDescription uses muted foreground color', () => {
      render(<CardDescription>Description text</CardDescription>);
      const description = screen.getByText('Description text');

      expect(description).toHaveClass('text-muted-foreground');
    });

    it('all variants use theme colors', () => {
      const variants: CardProps['variant'][] = ['default', 'bordered', 'elevated', 'flat'];

      variants.forEach((variant) => {
        const { container } = render(<Card variant={variant}>Content</Card>);
        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass('bg-card', 'text-card-foreground');
      });
    });
  });

  // 5. COMPOSITION TESTS
  describe('Composition', () => {
    it('CardHeader contains title and description', () => {
      render(
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>,
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('CardContent is flexible and grows', () => {
      const { container } = render(<CardContent>Content area</CardContent>);
      const content = container.firstChild as HTMLElement;

      expect(content).toHaveClass('flex-1');
    });

    it('CardFooter has flex layout for actions', () => {
      const { container } = render(
        <CardFooter>
          <button>Action 1</button>
          <button>Action 2</button>
        </CardFooter>,
      );
      const footer = container.firstChild as HTMLElement;

      expect(footer).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('supports Header + Content composition', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>,
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('supports Content + Footer composition', () => {
      render(
        <Card>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>,
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('supports Header + Footer composition', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardFooter>Footer</CardFooter>
        </Card>,
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('supports full composition with all sections', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>,
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  // 6. CUSTOM PROPS TESTS
  describe('Custom Props', () => {
    it('accepts custom className on Card', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('custom-class', 'rounded-lg');
    });

    it('accepts custom style on Card', () => {
      const { container } = render(
        <Card style={{ maxWidth: '500px' }}>Content</Card>,
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveStyle({ maxWidth: '500px' });
    });

    it('merges custom style with default styles', () => {
      const { container } = render(
        <Card style={{ maxWidth: '500px' }}>Content</Card>,
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveStyle({
        maxWidth: '500px',
        borderRadius: 'var(--radius-card, 12px)',
      });
    });

    it('accepts custom className on CardHeader', () => {
      const { container } = render(
        <CardHeader className="custom-header">Header</CardHeader>,
      );
      const header = container.firstChild as HTMLElement;

      expect(header).toHaveClass('custom-header');
    });

    it('accepts custom className on CardTitle', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = screen.getByText('Title');

      expect(title).toHaveClass('custom-title');
    });

    it('accepts custom className on CardDescription', () => {
      render(<CardDescription className="custom-desc">Desc</CardDescription>);
      const desc = screen.getByText('Desc');

      expect(desc).toHaveClass('custom-desc');
    });

    it('accepts custom className on CardContent', () => {
      const { container } = render(
        <CardContent className="custom-content">Content</CardContent>,
      );
      const content = container.firstChild as HTMLElement;

      expect(content).toHaveClass('custom-content');
    });

    it('accepts custom className on CardFooter', () => {
      const { container } = render(
        <CardFooter className="custom-footer">Footer</CardFooter>,
      );
      const footer = container.firstChild as HTMLElement;

      expect(footer).toHaveClass('custom-footer');
    });
  });

  // 7. HTML ATTRIBUTES TESTS
  describe('HTML Attributes', () => {
    it('forwards HTML attributes to Card', () => {
      const { container } = render(
        <Card data-testid="custom-card" aria-label="Test Card">
          Content
        </Card>,
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveAttribute('data-testid', 'custom-card');
      expect(card).toHaveAttribute('aria-label', 'Test Card');
    });

    it('forwards data attributes to Card', () => {
      const { container } = render(
        <Card data-custom="value">Content</Card>,
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveAttribute('data-custom', 'value');
    });

    it('forwards aria attributes to CardHeader', () => {
      const { container } = render(
        <CardHeader aria-label="Header section">Header</CardHeader>,
      );
      const header = container.firstChild as HTMLElement;

      expect(header).toHaveAttribute('aria-label', 'Header section');
    });

    it('forwards aria attributes to CardTitle', () => {
      render(<CardTitle aria-level={1}>Title</CardTitle>);
      const title = screen.getByText('Title');

      expect(title).toHaveAttribute('aria-level', '1');
    });

    it('forwards data attributes to CardContent', () => {
      const { container } = render(
        <CardContent data-content="main">Content</CardContent>,
      );
      const content = container.firstChild as HTMLElement;

      expect(content).toHaveAttribute('data-content', 'main');
    });

    it('forwards data attributes to CardFooter', () => {
      const { container } = render(
        <CardFooter data-footer="actions">Footer</CardFooter>,
      );
      const footer = container.firstChild as HTMLElement;

      expect(footer).toHaveAttribute('data-footer', 'actions');
    });

    it('CardTitle renders as h3 element', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');

      expect(title.tagName).toBe('H3');
    });

    it('CardDescription renders as p element', () => {
      render(<CardDescription>Description</CardDescription>);
      const desc = screen.getByText('Description');

      expect(desc.tagName).toBe('P');
    });

    it('forwards ref to Card', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref to CardHeader', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<CardHeader ref={ref}>Header</CardHeader>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref to CardTitle', () => {
      const ref = { current: null as HTMLHeadingElement | null };
      render(<CardTitle ref={ref}>Title</CardTitle>);

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('forwards ref to CardDescription', () => {
      const ref = { current: null as HTMLParagraphElement | null };
      render(<CardDescription ref={ref}>Description</CardDescription>);

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });

    it('forwards ref to CardContent', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<CardContent ref={ref}>Content</CardContent>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref to CardFooter', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<CardFooter ref={ref}>Footer</CardFooter>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // 8. SEMANTIC HTML TESTS
  describe('Semantic HTML', () => {
    it('Card renders as div element', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card.tagName).toBe('DIV');
    });

    it('CardHeader renders as div element', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      const header = container.firstChild as HTMLElement;

      expect(header.tagName).toBe('DIV');
    });

    it('CardHeader has proper structure for grid layout', () => {
      const { container } = render(
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>,
      );
      const header = container.firstChild as HTMLElement;

      expect(header).toHaveClass('flex', 'flex-col', 'gap-2');
    });

    it('CardContent renders as div element', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.firstChild as HTMLElement;

      expect(content.tagName).toBe('DIV');
    });

    it('CardFooter renders as div element', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild as HTMLElement;

      expect(footer.tagName).toBe('DIV');
    });

    it('CardContent allows any children', () => {
      render(
        <CardContent>
          <p>Paragraph</p>
          <ul>
            <li>List item</li>
          </ul>
        </CardContent>,
      );

      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('List item')).toBeInTheDocument();
    });

    it('maintains proper flex structure', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('flex', 'flex-col');
    });
  });

  // 9. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('CardTitle has proper heading level', () => {
      render(<CardTitle>Accessible Title</CardTitle>);
      const title = screen.getByText('Accessible Title');

      expect(title.tagName).toBe('H3');
      expect(title).toHaveClass('leading-tight', 'tracking-tight');
    });

    it('supports custom aria attributes', () => {
      const { container } = render(
        <Card aria-labelledby="card-title" role="article">
          <CardTitle id="card-title">Title</CardTitle>
        </Card>,
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveAttribute('aria-labelledby', 'card-title');
      expect(card).toHaveAttribute('role', 'article');
    });

    it('CardDescription has readable text styling', () => {
      render(<CardDescription>Readable description</CardDescription>);
      const desc = screen.getByText('Readable description');

      expect(desc).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('CardTitle typography is optimized for readability', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');

      expect(title).toHaveClass('text-lg', 'font-semibold');
    });

    it('has no accessibility violations - basic card', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>Description text</CardDescription>
          </CardHeader>
          <CardContent>Main content</CardContent>
        </Card>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with semantic role', async () => {
      const { container } = render(
        <Card role="article" aria-labelledby="card-title">
          <CardHeader>
            <CardTitle id="card-title">Article Title</CardTitle>
          </CardHeader>
          <CardContent>Article content</CardContent>
        </Card>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - elevated variant', async () => {
      const { container } = render(
        <Card variant="elevated">
          <CardContent>Elevated card content</CardContent>
        </Card>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 10. EDGE CASES
  describe('Edge Cases', () => {
    it('renders empty Card', () => {
      const { container } = render(<Card />);
      const card = container.firstChild as HTMLElement;

      expect(card).toBeInTheDocument();
      expect(card).toBeEmptyDOMElement();
    });

    it('renders Card with only CardHeader', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Only Header</CardTitle>
          </CardHeader>
        </Card>,
      );

      expect(screen.getByText('Only Header')).toBeInTheDocument();
    });

    it('renders Card with only CardContent', () => {
      render(
        <Card>
          <CardContent>Only Content</CardContent>
        </Card>,
      );

      expect(screen.getByText('Only Content')).toBeInTheDocument();
    });

    it('renders Card with only CardFooter', () => {
      render(
        <Card>
          <CardFooter>Only Footer</CardFooter>
        </Card>,
      );

      expect(screen.getByText('Only Footer')).toBeInTheDocument();
    });

    it('renders Card with only CardTitle', () => {
      render(
        <Card>
          <CardTitle>Only Title</CardTitle>
        </Card>,
      );

      expect(screen.getByText('Only Title')).toBeInTheDocument();
    });

    it('handles very long content', () => {
      const longText = 'A'.repeat(1000);
      render(
        <Card>
          <CardContent>{longText}</CardContent>
        </Card>,
      );

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles complex nested structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>
              <span>Nested</span> <strong>Title</strong>
            </CardTitle>
            <CardDescription>
              <em>Styled</em> description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p>Nested content</p>
            </div>
          </CardContent>
        </Card>,
      );

      expect(screen.getByText('Nested')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Styled')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });

    it('handles empty CardHeader', () => {
      const { container } = render(<CardHeader />);
      const header = container.firstChild as HTMLElement;

      expect(header).toBeInTheDocument();
      expect(header).toBeEmptyDOMElement();
    });

    it('handles empty CardContent', () => {
      const { container } = render(<CardContent />);
      const content = container.firstChild as HTMLElement;

      expect(content).toBeInTheDocument();
      expect(content).toBeEmptyDOMElement();
    });

    it('handles empty CardFooter', () => {
      const { container } = render(<CardFooter />);
      const footer = container.firstChild as HTMLElement;

      expect(footer).toBeInTheDocument();
      expect(footer).toBeEmptyDOMElement();
    });

    it('handles CardHeader with only CardDescription', () => {
      render(
        <CardHeader>
          <CardDescription>Description only</CardDescription>
        </CardHeader>,
      );

      expect(screen.getByText('Description only')).toBeInTheDocument();
    });

    it('handles multiple CardFooter children', () => {
      render(
        <CardFooter>
          <button>Button 1</button>
          <button>Button 2</button>
          <button>Button 3</button>
        </CardFooter>,
      );

      expect(screen.getByText('Button 1')).toBeInTheDocument();
      expect(screen.getByText('Button 2')).toBeInTheDocument();
      expect(screen.getByText('Button 3')).toBeInTheDocument();
    });
  });

  // 11. TRANSITION TESTS
  describe('Transitions', () => {
    it('Card has transition classes', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('transition-all', 'duration-300');
    });

    it('elevated variant has hover transition', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow');
    });

    it('elevated variant has shadow transition duration', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('duration-300');
    });

    it('default variant has general transitions', () => {
      const { container } = render(<Card variant="default">Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('transition-all');
    });

    it('flat variant has transitions', () => {
      const { container } = render(<Card variant="flat">Content</Card>);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('transition-all', 'duration-300');
    });
  });

  // 12. DISPLAY NAME TESTS
  describe('Display Names', () => {
    it('Card has correct displayName', () => {
      expect(Card.displayName).toBe('Card');
    });

    it('CardHeader has correct displayName', () => {
      expect(CardHeader.displayName).toBe('CardHeader');
    });

    it('CardTitle has correct displayName', () => {
      expect(CardTitle.displayName).toBe('CardTitle');
    });

    it('CardDescription has correct displayName', () => {
      expect(CardDescription.displayName).toBe('CardDescription');
    });

    it('CardContent has correct displayName', () => {
      expect(CardContent.displayName).toBe('CardContent');
    });

    it('CardFooter has correct displayName', () => {
      expect(CardFooter.displayName).toBe('CardFooter');
    });
  });
});
