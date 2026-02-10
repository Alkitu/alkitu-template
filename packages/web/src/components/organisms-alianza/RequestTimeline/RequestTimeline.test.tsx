import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RequestTimeline } from './RequestTimeline';
import { RequestStatus } from '@prisma/client';

describe('RequestTimeline', () => {
  const baseRequest = {
    id: 'request-123',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    executionDateTime: new Date('2024-01-15T14:00:00Z'),
    completedAt: null,
    cancelledAt: null,
  };

  describe('Rendering', () => {
    it('should render timeline with all steps', () => {
      render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.PENDING,
          }}
        />,
      );

      expect(screen.getByTestId('request-timeline')).toBeInTheDocument();
      expect(screen.getByText('Solicitud Creada')).toBeInTheDocument();
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
      expect(screen.getByText('Programada')).toBeInTheDocument();
      expect(screen.getByText('Completada')).toBeInTheDocument();
    });

    it('should show dates when showDates is true', () => {
      render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.PENDING,
          }}
          showDates
        />,
      );

      // Should show creation date
      expect(screen.getByText(/01 ene/i)).toBeInTheDocument();
    });

    it('should hide dates when showDates is false', () => {
      render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.PENDING,
          }}
          showDates={false}
        />,
      );

      // Date should not be visible
      expect(screen.queryByText(/01 ene/i)).not.toBeInTheDocument();
    });
  });

  describe('Status States', () => {
    it('should show PENDING status correctly', () => {
      render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.PENDING,
          }}
        />,
      );

      // Only "Solicitud Creada" should be completed
      const createdStep = screen.getByTestId('timeline-step-0');
      expect(createdStep).toHaveClass('border-green-500');

      // Other steps should not be completed
      const ongoingStep = screen.getByTestId('timeline-step-1');
      expect(ongoingStep).not.toHaveClass('border-green-500');
    });

    it('should show ONGOING status correctly', () => {
      render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.ONGOING,
          }}
        />,
      );

      // "En Proceso" should be active
      expect(screen.getByText('En progreso')).toBeInTheDocument();

      const ongoingStep = screen.getByTestId('timeline-step-1');
      expect(ongoingStep).toHaveClass('animate-pulse');
    });

    it('should show COMPLETED status correctly', () => {
      render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.COMPLETED,
            completedAt: new Date('2024-01-15T16:00:00Z'),
          }}
        />,
      );

      // All steps should be completed
      const completedStep = screen.getByTestId('timeline-step-3');
      expect(completedStep).toHaveClass('border-green-500');

      // Should show completion date
      expect(screen.getByText(/15 ene/i)).toBeInTheDocument();
    });

    it('should show CANCELLED status correctly', () => {
      render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.CANCELLED,
            cancelledAt: new Date('2024-01-10T12:00:00Z'),
          }}
        />,
      );

      // Should show "Cancelada" instead of "Completada"
      expect(screen.getByText('Cancelada')).toBeInTheDocument();
      expect(screen.queryByText('Completada')).not.toBeInTheDocument();

      // Last step should have destructive styling
      const cancelledStep = screen.getByTestId('timeline-step-3');
      expect(cancelledStep).toHaveClass('border-red-500');
    });
  });

  describe('Compact Mode', () => {
    it('should render in compact mode', () => {
      render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.ONGOING,
          }}
          compact
        />,
      );

      // Should render without errors
      expect(screen.getByTestId('request-timeline')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels', () => {
      render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.ONGOING,
          }}
        />,
      );

      expect(screen.getByLabelText('Solicitud Creada')).toBeInTheDocument();
      expect(screen.getByLabelText('En Proceso')).toBeInTheDocument();
      expect(screen.getByLabelText('Programada')).toBeInTheDocument();
    });

    it('should use semantic time elements for dates', () => {
      const { container } = render(
        <RequestTimeline
          request={{
            ...baseRequest,
            status: RequestStatus.COMPLETED,
            completedAt: new Date('2024-01-15T16:00:00Z'),
          }}
          showDates
        />,
      );

      const timeElements = container.querySelectorAll('time');
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });
});
