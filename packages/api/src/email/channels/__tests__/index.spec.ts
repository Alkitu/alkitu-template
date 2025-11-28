/**
 * Email Channels Index Test
 * 
 * Tests the centralized exports to ensure all modules are properly re-exported
 * and achieve coverage for the index.ts file.
 */

describe('Email Channels Index Exports', () => {
  it('should export email channel interface', async () => {
    const module = await import('../index');
    
    // IEmailChannel is a TypeScript interface, not available at runtime
    // But we can verify the import doesn't fail
    expect(module).toBeDefined();
  });

  it('should export welcome email channel', async () => {
    const module = await import('../index');
    
    expect(module).toHaveProperty('WelcomeEmailChannel');
  });

  it('should export password reset email channel', async () => {
    const module = await import('../index');
    
    expect(module).toHaveProperty('PasswordResetEmailChannel');
  });

  it('should export verification email channel', async () => {
    const module = await import('../index');
    
    expect(module).toHaveProperty('EmailVerificationChannel');
  });

  it('should export notification email channel', async () => {
    const module = await import('../index');
    
    expect(module).toHaveProperty('NotificationEmailChannel');
  });

  it('should export marketing email channel', async () => {
    const module = await import('../index');
    
    expect(module).toHaveProperty('MarketingEmailChannel');
  });

  it('should export email channel registry service', async () => {
    const module = await import('../index');
    
    expect(module).toHaveProperty('EmailChannelRegistryService');
  });

  it('should successfully import the index module', async () => {
    const module = await import('../index');
    
    // The module should be imported successfully
    expect(module).toBeDefined();
  });

  it('should have all expected exports available', async () => {
    const module = await import('../index');
    
    const expectedExports = [
      'WelcomeEmailChannel', 
      'PasswordResetEmailChannel',
      'EmailVerificationChannel',
      'NotificationEmailChannel',
      'MarketingEmailChannel',
      'EmailChannelRegistryService'
    ];

    expectedExports.forEach(exportName => {
      expect(module).toHaveProperty(exportName);
    });
  });
});