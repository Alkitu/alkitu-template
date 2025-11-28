// @ts-nocheck
// 
const fs = require('fs');

function fixEmailControllerTest() {
  const filePath = 'src/email/email.controller.spec.ts';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar todas las llamadas del emailService por emailChannelRegistry
  const replacements = [
    // Mocks setup
    {
      from: /emailService\.sendWelcomeEmail\.mockResolvedValue/g,
      to: 'emailChannelRegistry.sendEmail.mockResolvedValue'
    },
    {
      from: /emailService\.sendPasswordResetEmail\.mockResolvedValue/g,
      to: 'emailChannelRegistry.sendEmail.mockResolvedValue'
    },
    {
      from: /emailService\.sendEmailVerification\.mockResolvedValue/g,
      to: 'emailChannelRegistry.sendEmail.mockResolvedValue'
    },
    {
      from: /emailService\.sendNotification\.mockResolvedValue/g,
      to: 'emailChannelRegistry.sendEmail.mockResolvedValue'
    },
    
    // Expectations - pattern: expect(emailService.methodName).toHaveBeenCalledWith
    {
      from: /expect\(emailService\.sendWelcomeEmail\)\.toHaveBeenCalledWith\(/g,
      to: "expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith('welcome', "
    },
    {
      from: /expect\(emailService\.sendPasswordResetEmail\)\.toHaveBeenCalledWith\(/g,
      to: "expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith('reset', "
    },
    {
      from: /expect\(emailService\.sendEmailVerification\)\.toHaveBeenCalledWith\(/g,
      to: "expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith('verification', "
    },
    {
      from: /expect\(emailService\.sendNotification\)\.toHaveBeenCalledWith\(/g,
      to: "expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith('notification', "
    },
    
    // Mock errors
    {
      from: /emailService\.sendWelcomeEmail\.mockRejectedValue/g,
      to: 'emailChannelRegistry.sendEmail.mockRejectedValue'
    },
    {
      from: /emailService\.sendPasswordResetEmail\.mockRejectedValue/g,
      to: 'emailChannelRegistry.sendEmail.mockRejectedValue'
    },
    {
      from: /emailService\.sendEmailVerification\.mockRejectedValue/g,
      to: 'emailChannelRegistry.sendEmail.mockRejectedValue'
    },
    {
      from: /emailService\.sendNotification\.mockRejectedValue/g,
      to: 'emailChannelRegistry.sendEmail.mockRejectedValue'
    }
  ];
  
  let modified = false;
  
  replacements.forEach(replacement => {
    if (content.match(replacement.from)) {
      content = content.replace(replacement.from, replacement.to);
      modified = true;
      console.log(`✅ Fixed: ${replacement.from.toString()}`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log('✅ Email controller tests fixed successfully!');
  } else {
    console.log('ℹ️  No changes needed');
  }
}

console.log('🔧 Fixing Email Controller Tests...');
fixEmailControllerTest(); 