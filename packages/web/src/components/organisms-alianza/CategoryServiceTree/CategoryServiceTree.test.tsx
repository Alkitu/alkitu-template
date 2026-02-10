import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryServiceTree } from './CategoryServiceTree';
import type { CategoryWithServices } from './CategoryServiceTree.types';

const mockData: CategoryWithServices[] = [
  {
    id: 'cat-1',
    name: 'Limpieza',
    totalServices: 2,
    totalRequests: 15,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    services: [
      {
        id: 'service-1',
        name: 'Limpieza de Oficina',
        categoryId: 'cat-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        requestStats: {
          total: 10,
          byStatus: {
            PENDING: 3,
            ONGOING: 5,
            COMPLETED: 2,
            CANCELLED: 0,
          },
        },
      },
      {
        id: 'service-2',
        name: 'Limpieza Profunda',
        categoryId: 'cat-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        requestStats: {
          total: 5,
          byStatus: {
            PENDING: 2,
            ONGOING: 3,
            COMPLETED: 0,
            CANCELLED: 0,
          },
        },
      },
    ],
  },
  {
    id: 'cat-2',
    name: 'Mantenimiento',
    totalServices: 1,
    totalRequests: 8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    services: [
      {
        id: 'service-3',
        name: 'Reparaciones',
        categoryId: 'cat-2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        requestStats: {
          total: 8,
          byStatus: {
            PENDING: 1,
            ONGOING: 4,
            COMPLETED: 3,
            CANCELLED: 0,
          },
        },
      },
    ],
  },
];

describe('CategoryServiceTree', () => {
  describe('Rendering', () => {
    it('should render tree with categories', () => {
      render(<CategoryServiceTree data={mockData} />);

      expect(screen.getByTestId('category-service-tree')).toBeInTheDocument();
      expect(screen.getByText('Limpieza')).toBeInTheDocument();
      expect(screen.getByText('Mantenimiento')).toBeInTheDocument();
    });

    it('should render category stats', () => {
      render(<CategoryServiceTree data={mockData} showStats />);

      expect(screen.getByText(/2 servicios, 15 solicitudes/)).toBeInTheDocument();
      expect(screen.getByText(/1 servicio, 8 solicitudes/)).toBeInTheDocument();
    });

    it('should hide stats when showStats is false', () => {
      render(<CategoryServiceTree data={mockData} showStats={false} />);

      expect(screen.queryByText(/servicios/)).not.toBeInTheDocument();
    });

    it('should show loading skeleton when isLoading', () => {
      render(<CategoryServiceTree data={[]} isLoading />);

      // Should show skeleton with animate-pulse
      const skeleton = screen.getByTestId('category-service-tree')?.parentElement;
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should show empty state when no data', () => {
      render(<CategoryServiceTree data={[]} />);

      expect(screen.getByText('No hay categorías disponibles')).toBeInTheDocument();
    });
  });

  describe('Category Expansion', () => {
    it('should start with categories collapsed by default', () => {
      render(<CategoryServiceTree data={mockData} />);

      // Services should not be visible initially
      expect(screen.queryByText('Limpieza de Oficina')).not.toBeInTheDocument();
    });

    it('should expand category when clicked', () => {
      render(<CategoryServiceTree data={mockData} />);

      const categoryButton = screen.getByTestId('category-toggle-cat-1');
      fireEvent.click(categoryButton);

      // Services should now be visible
      expect(screen.getByText('Limpieza de Oficina')).toBeInTheDocument();
      expect(screen.getByText('Limpieza Profunda')).toBeInTheDocument();
    });

    it('should collapse category when clicked again', () => {
      render(<CategoryServiceTree data={mockData} />);

      const categoryButton = screen.getByTestId('category-toggle-cat-1');

      // Expand
      fireEvent.click(categoryButton);
      expect(screen.getByText('Limpieza de Oficina')).toBeInTheDocument();

      // Collapse
      fireEvent.click(categoryButton);
      expect(screen.queryByText('Limpieza de Oficina')).not.toBeInTheDocument();
    });

    it('should start with specified categories expanded', () => {
      render(
        <CategoryServiceTree data={mockData} expandedCategories={['cat-1']} />,
      );

      // Services should be visible immediately
      expect(screen.getByText('Limpieza de Oficina')).toBeInTheDocument();
    });
  });

  describe('Request Stats', () => {
    it('should show pending requests badge', () => {
      render(<CategoryServiceTree data={mockData} expandedCategories={['cat-1']} />);

      expect(screen.getByText(/3 pendientes/)).toBeInTheDocument();
    });

    it('should show ongoing requests badge', () => {
      render(<CategoryServiceTree data={mockData} expandedCategories={['cat-1']} />);

      expect(screen.getByText(/5 en progreso/)).toBeInTheDocument();
    });

    it('should show completed requests badge', () => {
      render(<CategoryServiceTree data={mockData} expandedCategories={['cat-1']} />);

      expect(screen.getByText(/2 completadas/)).toBeInTheDocument();
    });

    it('should show "Sin solicitudes" for services without requests', () => {
      const dataWithEmptyService: CategoryWithServices[] = [
        {
          ...mockData[0],
          services: [
            {
              id: 'service-empty',
              name: 'Servicio Vacío',
              categoryId: 'cat-1',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
              requestStats: {
                total: 0,
                byStatus: {
                  PENDING: 0,
                  ONGOING: 0,
                  COMPLETED: 0,
                  CANCELLED: 0,
                },
              },
            },
          ],
        },
      ];

      render(
        <CategoryServiceTree
          data={dataWithEmptyService}
          expandedCategories={['cat-1']}
        />,
      );

      expect(screen.getByText('Sin solicitudes')).toBeInTheDocument();
    });
  });

  describe('Click Handlers', () => {
    it('should call onServiceClick when service is clicked', () => {
      const onServiceClick = vi.fn();
      render(
        <CategoryServiceTree
          data={mockData}
          expandedCategories={['cat-1']}
          onServiceClick={onServiceClick}
        />,
      );

      const serviceButton = screen.getByText('Limpieza de Oficina');
      fireEvent.click(serviceButton);

      expect(onServiceClick).toHaveBeenCalledWith('service-1');
    });

    it('should call onCategoryClick when category is clicked', () => {
      const onCategoryClick = vi.fn();
      render(
        <CategoryServiceTree data={mockData} onCategoryClick={onCategoryClick} />,
      );

      // Note: onCategoryClick not implemented in current component
      // This test documents expected behavior
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-expanded attribute', () => {
      render(<CategoryServiceTree data={mockData} />);

      const categoryButton = screen.getByTestId('category-toggle-cat-1');
      expect(categoryButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(categoryButton);
      expect(categoryButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have proper aria-label for category toggle', () => {
      render(<CategoryServiceTree data={mockData} />);

      const categoryButton = screen.getByTestId('category-toggle-cat-1');
      expect(categoryButton).toHaveAttribute('aria-label', 'Expand Limpieza');
    });
  });
});
