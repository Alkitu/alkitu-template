import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { User, MapPin, Bell } from 'lucide-react';
import { OnboardingStepsCard } from './OnboardingStepsCard';
import type { OnboardingStep } from './OnboardingStepsCard.types';

describe('OnboardingStepsCard', () => {
  const mockSteps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Complete Profile',
      description: 'Add your personal information',
      icon: User,
      status: 'completed',
      completed: true,
      href: '/profile',
    },
    {
      id: 2,
      title: 'Add Location',
      description: 'Register a work location',
      icon: MapPin,
      status: 'current',
      completed: false,
      href: '/locations',
    },
    {
      id: 3,
      title: 'Create Request',
      description: 'Submit your first service request',
      icon: Bell,
      status: 'upcoming',
      completed: false,
      href: '/requests/new',
    },
  ];

  describe('Rendering', () => {
    it('should render all steps correctly', () => {
      render(<OnboardingStepsCard steps={mockSteps} />);

      expect(screen.getByText(/Complete Profile/)).toBeInTheDocument();
      expect(screen.getByText(/Add Location/)).toBeInTheDocument();
      expect(screen.getByText(/Create Request/)).toBeInTheDocument();
    });

    it('should display step descriptions', () => {
      render(<OnboardingStepsCard steps={mockSteps} />);

      expect(screen.getByText('Add your personal information')).toBeInTheDocument();
      expect(screen.getByText('Register a work location')).toBeInTheDocument();
      expect(screen.getByText('Submit your first service request')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <OnboardingStepsCard steps={mockSteps} className="custom-class" />,
      );

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('custom-class');
    });

    it('should number steps correctly', () => {
      render(<OnboardingStepsCard steps={mockSteps} />);

      expect(screen.getByText(/1\. Complete Profile/)).toBeInTheDocument();
      expect(screen.getByText(/2\. Add Location/)).toBeInTheDocument();
      expect(screen.getByText(/3\. Create Request/)).toBeInTheDocument();
    });
  });

  describe('Progress Bar', () => {
    it('should display progress bar by default', () => {
      render(<OnboardingStepsCard steps={mockSteps} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should calculate progress percentage correctly', () => {
      render(<OnboardingStepsCard steps={mockSteps} />);

      const progressBar = screen.getByRole('progressbar');
      // 1 completed out of 3 = 33.33%
      expect(progressBar).toHaveAttribute('aria-valuenow', '33.33333333333333');
    });

    it('should display progress text correctly', () => {
      render(
        <OnboardingStepsCard
          steps={mockSteps}
          progressConfig={{
            progressText: '1 of 3 completed',
          }}
        />,
      );

      expect(screen.getByText('1 of 3 completed')).toBeInTheDocument();
    });

    it('should hide progress bar when showProgressBar is false', () => {
      render(
        <OnboardingStepsCard
          steps={mockSteps}
          progressConfig={{ showProgressBar: false }}
        />,
      );

      const progressBar = screen.queryByRole('progressbar');
      expect(progressBar).not.toBeInTheDocument();
    });

    it('should display custom progress title', () => {
      render(
        <OnboardingStepsCard
          steps={mockSteps}
          progressConfig={{ title: 'Custom Progress Title' }}
        />,
      );

      expect(screen.getByText('Custom Progress Title')).toBeInTheDocument();
    });

    it('should show 100% progress when all steps completed', () => {
      const allCompleted = mockSteps.map(step => ({ ...step, completed: true }));
      render(<OnboardingStepsCard steps={allCompleted} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });
  });

  describe('Step Status', () => {
    it('should show checkmark for completed steps', () => {
      render(<OnboardingStepsCard steps={mockSteps} completedText="Done" />);

      expect(screen.getByText('✓ Done')).toBeInTheDocument();
    });

    it('should show action button for incomplete steps', () => {
      render(<OnboardingStepsCard steps={mockSteps} actionButtonText="Begin" />);

      const buttons = screen.getAllByText('Begin');
      // Should have 2 buttons for 2 incomplete steps
      expect(buttons).toHaveLength(2);
    });

    it('should apply correct styling to completed steps', () => {
      const { container } = render(<OnboardingStepsCard steps={mockSteps} />);

      const completedCard = container.querySelector('[class*="border-green-500"]');
      expect(completedCard).toBeInTheDocument();
    });

    it('should render custom action button text', () => {
      render(<OnboardingStepsCard steps={mockSteps} actionButtonText="Get Started" />);

      expect(screen.getAllByText('Get Started').length).toBeGreaterThan(0);
    });

    it('should render custom completed text', () => {
      render(<OnboardingStepsCard steps={mockSteps} completedText="Finished" />);

      expect(screen.getByText('✓ Finished')).toBeInTheDocument();
    });
  });

  describe('Step Interactions', () => {
    it('should call onStepClick when incomplete step is clicked', () => {
      const onStepClick = vi.fn();
      render(<OnboardingStepsCard steps={mockSteps} onStepClick={onStepClick} />);

      // Click on the second step (incomplete) - find by data-slot attribute
      const stepCard = screen.getByText(/Add Location/).closest('[data-slot="card"]');
      if (stepCard) {
        fireEvent.click(stepCard);
      }

      expect(onStepClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 2,
          title: 'Add Location',
        }),
      );
    });

    it('should not call onStepClick when completed step is clicked', () => {
      const onStepClick = vi.fn();
      render(<OnboardingStepsCard steps={mockSteps} onStepClick={onStepClick} />);

      // Click on the first step (completed) - find by data-slot attribute
      const stepCard = screen.getByText(/Complete Profile/).closest('[data-slot="card"]');
      if (stepCard) {
        fireEvent.click(stepCard);
      }

      expect(onStepClick).not.toHaveBeenCalled();
    });

    it('should render links for steps with href', () => {
      render(<OnboardingStepsCard steps={mockSteps} />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Completion Card', () => {
    const allCompleted: OnboardingStep[] = mockSteps.map(step => ({
      ...step,
      completed: true,
      status: 'completed',
    }));

    it('should show completion card when all steps are completed', () => {
      render(
        <OnboardingStepsCard
          steps={allCompleted}
          completionConfig={{
            title: 'All Done!',
          }}
        />,
      );

      expect(screen.getByText('All Done!')).toBeInTheDocument();
    });

    it('should not show completion card when steps are incomplete', () => {
      render(
        <OnboardingStepsCard
          steps={mockSteps}
          completionConfig={{
            title: 'All Done!',
          }}
        />,
      );

      expect(screen.queryByText('All Done!')).not.toBeInTheDocument();
    });

    it('should hide completion card when show is false', () => {
      render(
        <OnboardingStepsCard
          steps={allCompleted}
          completionConfig={{
            show: false,
            title: 'All Done!',
          }}
        />,
      );

      expect(screen.queryByText('All Done!')).not.toBeInTheDocument();
    });

    it('should display custom completion description', () => {
      render(
        <OnboardingStepsCard
          steps={allCompleted}
          completionConfig={{
            description: 'Great job finishing everything!',
          }}
        />,
      );

      expect(screen.getByText('Great job finishing everything!')).toBeInTheDocument();
    });

    it('should display custom completion button text', () => {
      render(
        <OnboardingStepsCard
          steps={allCompleted}
          completionConfig={{
            buttonText: 'Continue to App',
          }}
        />,
      );

      expect(screen.getByText('Continue to App')).toBeInTheDocument();
    });

    it('should render completion button with correct href', () => {
      render(
        <OnboardingStepsCard
          steps={allCompleted}
          completionConfig={{
            buttonHref: '/custom-dashboard',
            buttonText: 'Go',
          }}
        />,
      );

      const link = screen.getByText('Go').closest('a');
      expect(link).toHaveAttribute('href', '/custom-dashboard');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty steps array', () => {
      render(<OnboardingStepsCard steps={[]} />);

      const progressBar = screen.queryByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      // Should show 0% progress
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    it('should handle steps without href', () => {
      const stepsWithoutHref = mockSteps.map(step => ({ ...step, href: undefined }));
      render(<OnboardingStepsCard steps={stepsWithoutHref} />);

      // Should render without errors
      expect(screen.getByText(/Complete Profile/)).toBeInTheDocument();
    });

    it('should handle steps with string IDs', () => {
      const stepsWithStringIds = mockSteps.map((step, idx) => ({
        ...step,
        id: `step-${idx}`,
      }));

      render(<OnboardingStepsCard steps={stepsWithStringIds} />);

      expect(screen.getByText(/Complete Profile/)).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = vi.fn();
      render(<OnboardingStepsCard ref={ref} steps={mockSteps} />);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on progress bar', () => {
      render(<OnboardingStepsCard steps={mockSteps} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      expect(progressBar).toHaveAttribute('aria-valuenow');
    });

    it('should render semantic HTML', () => {
      render(<OnboardingStepsCard steps={mockSteps} />);

      // Should have headings for step titles
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});
