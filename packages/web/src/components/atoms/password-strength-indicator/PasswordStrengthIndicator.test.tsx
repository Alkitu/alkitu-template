import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  it('should not render when password is empty', () => {
    const { container } = render(<PasswordStrengthIndicator password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when password is provided', () => {
    render(<PasswordStrengthIndicator password="test" />);
    expect(
      screen.getByTestId('password-strength-indicator'),
    ).toBeInTheDocument();
  });

  it('should show very weak for weak password', () => {
    render(<PasswordStrengthIndicator password="abc" />);
    // Only lowercase, no uppercase, no number, too short = 1/4 = 25% = weak
    expect(screen.getByText(/Débil/i)).toBeInTheDocument();
  });

  it('should show fair for password with some requirements', () => {
    render(<PasswordStrengthIndicator password="abcdefgh" />);
    // Has lowercase + minLength = 2/4 = 50% = fair
    expect(screen.getByText(/Regular/i)).toBeInTheDocument();
  });

  it('should show strong for strong password', () => {
    render(<PasswordStrengthIndicator password="SecurePass123" />);
    expect(screen.getByText(/Fuerte/i)).toBeInTheDocument();
  });

  it('should check minimum length requirement', () => {
    render(<PasswordStrengthIndicator password="short" minLength={8} />);
    expect(screen.getByText(/○ Mínimo 8 caracteres/)).toBeInTheDocument();

    render(<PasswordStrengthIndicator password="longenough" minLength={8} />);
    expect(screen.getByText(/✓ Mínimo 8 caracteres/)).toBeInTheDocument();
  });

  it('should check uppercase requirement', () => {
    render(<PasswordStrengthIndicator password="lowercase123" />);
    expect(screen.getByText(/○ Al menos una mayúscula/)).toBeInTheDocument();

    render(<PasswordStrengthIndicator password="Uppercase123" />);
    expect(screen.getByText(/✓ Al menos una mayúscula/)).toBeInTheDocument();
  });

  it('should check lowercase requirement', () => {
    render(<PasswordStrengthIndicator password="UPPERCASE123" />);
    expect(screen.getByText(/○ Al menos una minúscula/)).toBeInTheDocument();

    render(<PasswordStrengthIndicator password="Lowercase123" />);
    expect(screen.getByText(/✓ Al menos una minúscula/)).toBeInTheDocument();
  });

  it('should check number requirement', () => {
    render(<PasswordStrengthIndicator password="NoNumbers" />);
    expect(screen.getByText(/○ Al menos un número/)).toBeInTheDocument();

    render(<PasswordStrengthIndicator password="HasNumbers123" />);
    expect(screen.getByText(/✓ Al menos un número/)).toBeInTheDocument();
  });

  it('should check all requirements for strong password', () => {
    render(<PasswordStrengthIndicator password="SecurePass123" />);

    expect(screen.getByText(/✓ Mínimo 8 caracteres/)).toBeInTheDocument();
    expect(screen.getByText(/✓ Al menos una mayúscula/)).toBeInTheDocument();
    expect(screen.getByText(/✓ Al menos una minúscula/)).toBeInTheDocument();
    expect(screen.getByText(/✓ Al menos un número/)).toBeInTheDocument();
  });

  it('should show unchecked for missing requirements', () => {
    render(<PasswordStrengthIndicator password="short" />);

    expect(screen.getByText(/○ Mínimo 8 caracteres/)).toBeInTheDocument();
    expect(screen.getByText(/○ Al menos una mayúscula/)).toBeInTheDocument();
    expect(screen.getByText(/○ Al menos un número/)).toBeInTheDocument();
  });

  it('should handle special character requirement when enabled', () => {
    render(
      <PasswordStrengthIndicator password="SecurePass123" requireSpecial />,
    );
    expect(
      screen.getByText(/○ Al menos un carácter especial/),
    ).toBeInTheDocument();
  });

  it('should check special character requirement when met', () => {
    render(
      <PasswordStrengthIndicator password="SecurePass123!" requireSpecial />,
    );
    expect(
      screen.getByText(/✓ Al menos un carácter especial/),
    ).toBeInTheDocument();
  });

  it('should not show special character requirement by default', () => {
    render(<PasswordStrengthIndicator password="SecurePass123" />);
    expect(screen.queryByText(/carácter especial/)).not.toBeInTheDocument();
  });

  it('should display progress bar', () => {
    render(<PasswordStrengthIndicator password="test123" />);
    expect(screen.getByTestId('strength-bar')).toBeInTheDocument();
  });

  it('should apply custom className when provided', () => {
    const { container } = render(
      <PasswordStrengthIndicator password="test" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should respect custom minLength', () => {
    render(<PasswordStrengthIndicator password="test" minLength={10} />);
    expect(screen.getByText(/○ Mínimo 10 caracteres/)).toBeInTheDocument();
  });

  describe('strength levels', () => {
    it('should show good for moderately strong password', () => {
      render(<PasswordStrengthIndicator password="Password1" />);
      // Has uppercase + lowercase + number + minLength = 4/4 = 100% = strong
      expect(screen.getByText(/Fuerte/i)).toBeInTheDocument();
    });

    it('should calculate score correctly', () => {
      const { rerender } = render(<PasswordStrengthIndicator password="a" />);
      let strengthBar = screen.getByTestId('strength-bar');
      // Very weak password should have low score (1/4 = 25%)
      expect(strengthBar).toHaveStyle({ width: '25%' });

      rerender(<PasswordStrengthIndicator password="SecurePass123" />);
      strengthBar = screen.getByTestId('strength-bar');
      // Strong password should have high score (4/4 = 100%)
      expect(strengthBar).toHaveStyle({ width: '100%' });
    });
  });
});
