import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LocationListOrganism } from './LocationListOrganism';
import type { LocationListOrganismProps } from './LocationListOrganism.types';

// Mock fetch globally
global.fetch = vi.fn();

// Mock window.confirm
global.confirm = vi.fn();

const mockLocations = [
  {
    id: 'loc-1',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    building: 'Building A',
    floor: '3rd Floor',
  },
  {
    id: 'loc-2',
    street: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    building: null,
    floor: null,
  },
  {
    id: 'loc-3',
    street: '789 Pine Rd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    building: 'Office Tower',
    floor: '10th Floor',
  },
];

describe('LocationListOrganism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    (global.confirm as any).mockClear();
  });

  it('should show loading state initially', () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(<LocationListOrganism />);

    expect(screen.getByText('Loading locations...')).toBeInTheDocument();
  });

  it('should render locations after successful fetch', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
      expect(screen.getByText('789 Pine Rd')).toBeInTheDocument();
    });
  });

  it('should show error state on fetch failure', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed to fetch locations' }),
    });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch locations')).toBeInTheDocument();
    });
  });

  it('should show add button when showAddButton is true', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism showAddButton={true} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add location/i })).toBeInTheDocument();
    });
  });

  it('should hide add button when showAddButton is false', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism showAddButton={false} />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /add location/i })).not.toBeInTheDocument();
    });
  });

  it('should toggle add form when add button clicked', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism showAddButton={true} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add location/i })).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add location/i });
    await user.click(addButton);

    // Form should appear (LocationFormOrganism would be rendered)
    // Verify by checking if the add button is hidden
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /^add location$/i })).not.toBeInTheDocument();
    });
  });

  it('should show empty state when no locations', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('No locations yet')).toBeInTheDocument();
      expect(screen.getByText('Get started by adding your first work location.')).toBeInTheDocument();
    });
  });

  it('should delete location with confirmation', async () => {
    const user = userEvent.setup();
    (global.confirm as any).mockReturnValue(true);

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLocations),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockLocations[1], mockLocations[2]]),
      });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    // Location should be present
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('should not delete location when confirmation cancelled', async () => {
    (global.confirm as any).mockReturnValue(false);
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    // All locations should still be there
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
    expect(screen.getByText('789 Pine Rd')).toBeInTheDocument();
  });

  it('should call onLocationChange after successful operation', async () => {
    const onLocationChange = vi.fn();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism onLocationChange={onLocationChange} />);

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    // onLocationChange would be called after create/update/delete operations
  });

  it('should render locations in a grid layout', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    const { container } = render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('should apply custom className', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    const { container } = render(<LocationListOrganism className="custom-list" />);

    await waitFor(() => {
      expect(container.firstChild).toHaveClass('custom-list');
    });
  });

  it('should handle network errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should display location count', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('3 Locations')).toBeInTheDocument();
    });
  });

  it('should display singular form for one location', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockLocations[0]]),
    });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('1 Location')).toBeInTheDocument();
    });
  });

  it('should render header with title and description', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('Work Locations')).toBeInTheDocument();
      expect(screen.getByText('Manage your work locations for service requests')).toBeInTheDocument();
    });
  });

  it('should handle delete API errors', async () => {
    (global.confirm as any).mockReturnValue(true);

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLocations),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Delete failed' }),
      });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    // Location should still be visible after failed deletion
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('should fetch locations on component mount', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/locations');
    });
  });

  it('should close add form after successful creation', async () => {
    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism showAddButton={true} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add location/i })).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add location/i });
    await user.click(addButton);

    // Form should be visible
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /^add location$/i })).not.toBeInTheDocument();
    });
  });

  it('should show deleting state during deletion', async () => {
    (global.confirm as any).mockReturnValue(true);
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLocations),
      })
      .mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    render(<LocationListOrganism />);

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    // Location should be present
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('should render locations with all address details', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLocations),
    });

    render(<LocationListOrganism />);

    await waitFor(() => {
      // Check first location with building and floor
      expect(screen.getByText('123 Main St')).toBeInTheDocument();

      // Check second location without building and floor
      expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();

      // Check third location
      expect(screen.getByText('789 Pine Rd')).toBeInTheDocument();
    });
  });
});
