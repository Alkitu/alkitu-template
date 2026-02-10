import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServiceRequestLink } from './ServiceRequestLink';

describe('ServiceRequestLink', () => {
  const defaultProps = {
    serviceId: 'service-123',
    serviceName: 'Limpieza de Oficina',
    lang: 'es',
  };

  describe('Rendering', () => {
    it('should render zero state when no requests', () => {
      render(<ServiceRequestLink {...defaultProps} requestCount={0} />);

      expect(screen.getByTestId('service-request-link-zero')).toBeInTheDocument();
      expect(screen.getByText('Sin solicitudes')).toBeInTheDocument();
    });

    it('should render link with request count', () => {
      render(<ServiceRequestLink {...defaultProps} requestCount={15} />);

      const link = screen.getByTestId('service-request-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        '/es/admin/requests?serviceId=service-123',
      );
      expect(screen.getByText(/15 solicitudes/)).toBeInTheDocument();
    });

    it('should show singular form for 1 request', () => {
      render(<ServiceRequestLink {...defaultProps} requestCount={1} />);

      expect(screen.getByText(/1 solicitud$/)).toBeInTheDocument();
    });

    it('should show pending count in compact view', () => {
      render(
        <ServiceRequestLink
          {...defaultProps}
          requestCount={15}
          pendingCount={5}
        />,
      );

      expect(screen.getByText('5 pendientes')).toBeInTheDocument();
    });

    it('should show detailed stats when detailed=true', () => {
      render(
        <ServiceRequestLink
          {...defaultProps}
          requestCount={15}
          pendingCount={5}
          ongoingCount={8}
          detailed
        />,
      );

      expect(screen.getByTitle('Pendientes')).toBeInTheDocument();
      expect(screen.getByTitle('En progreso')).toBeInTheDocument();
    });

    it('should use custom baseHref', () => {
      render(
        <ServiceRequestLink
          {...defaultProps}
          requestCount={10}
          baseHref="/employee/requests"
        />,
      );

      const link = screen.getByTestId('service-request-link');
      expect(link).toHaveAttribute(
        'href',
        '/es/employee/requests?serviceId=service-123',
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      render(
        <ServiceRequestLink
          {...defaultProps}
          requestCount={15}
          serviceName="Limpieza de Oficina"
        />,
      );

      const link = screen.getByTestId('service-request-link');
      expect(link).toHaveAttribute(
        'aria-label',
        'Ver 15 solicitudes de Limpieza de Oficina',
      );
    });

    it('should be keyboard accessible', () => {
      render(<ServiceRequestLink {...defaultProps} requestCount={10} />);

      const link = screen.getByTestId('service-request-link');
      expect(link).toHaveClass('focus-visible:ring-2');
    });
  });
});
