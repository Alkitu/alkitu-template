// @ts-nocheck
// 
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { ChatbotConfigService } from './chatbot-config.service';
import { UpdateChatbotConfigDto } from './dto/update-chatbot-config.dto';

@ApiTags('chatbot-config')
@Controller('chatbot-config')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ChatbotConfigController {
  constructor(private readonly chatbotConfigService: ChatbotConfigService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  @ApiOperation({
    summary: 'Get current chatbot configuration',
    description: 'Retrieve the current chatbot configuration settings'
  })
  @ApiResponse({
    status: 200,
    description: 'Chatbot configuration retrieved successfully',
    schema: {
      example: {
        id: '60d5ecb74f3b2c001c8b4567',
        name: 'Alkitu Assistant',
        welcomeMessage: 'Hello! How can I help you today?',
        avatarUrl: 'https://example.com/avatar.png',
        primaryColor: '#1976d2',
        enabled: true,
        showTypingIndicator: true,
        quickReplies: ['Talk to sales', 'Technical support', 'General inquiry'],
        businessHours: {
          enabled: true,
          timezone: 'UTC',
          schedule: {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '17:00' },
            saturday: null,
            sunday: null
          }
        },
        offlineMessage: {
          enabled: true,
          message: 'We are currently offline. Please leave a message.',
          collectEmail: true,
          collectPhone: false
        },
        position: 'bottom-right',
        customCss: '.chat-widget { border-radius: 10px; }',
        createdAt: '2024-06-29T12:00:00.000Z',
        updatedAt: '2024-06-29T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async getChatbotConfig() {
    return this.chatbotConfigService.getChatbotConfig();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create initial chatbot configuration',
    description: 'Create the initial chatbot configuration if none exists. Admin only.'
  })
  @ApiBody({ type: UpdateChatbotConfigDto })
  @ApiResponse({
    status: 201,
    description: 'Chatbot configuration created successfully',
    schema: {
      example: {
        id: '60d5ecb74f3b2c001c8b4567',
        name: 'Alkitu Assistant',
        welcomeMessage: 'Hello! How can I help you today?',
        enabled: true,
        createdAt: '2024-06-29T12:00:00.000Z',
        updatedAt: '2024-06-29T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 409, description: 'Configuration already exists' })
  async createChatbotConfig(@Body() configDto: UpdateChatbotConfigDto) {
    return this.chatbotConfigService.updateChatbotConfig(configDto);
  }

  @Patch()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Update chatbot configuration',
    description: 'Update existing chatbot configuration settings. Requires Admin or Employee role.'
  })
  @ApiBody({ 
    type: UpdateChatbotConfigDto,
    description: 'Partial configuration update - only provided fields will be updated'
  })
  @ApiResponse({
    status: 200,
    description: 'Chatbot configuration updated successfully',
    schema: {
      example: {
        id: '60d5ecb74f3b2c001c8b4567',
        name: 'Updated Assistant Name',
        welcomeMessage: 'Welcome! How may I assist you?',
        primaryColor: '#2196f3',
        enabled: true,
        updatedAt: '2024-06-29T12:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Employee access required' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async updateChatbotConfig(@Body() configDto: UpdateChatbotConfigDto) {
    return this.chatbotConfigService.updateChatbotConfig(configDto);
  }

  @Post('reset')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset chatbot configuration to defaults',
    description: 'Reset the chatbot configuration to default values. Admin only.'
  })
  @ApiResponse({
    status: 200,
    description: 'Chatbot configuration reset to defaults successfully',
    schema: {
      example: {
        id: '60d5ecb74f3b2c001c8b4567',
        name: 'Alkitu Assistant',
        welcomeMessage: 'Hello! How can I help you today?',
        enabled: true,
        primaryColor: '#1976d2',
        updatedAt: '2024-06-29T12:45:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async resetChatbotConfig() {
    const defaultConfig: UpdateChatbotConfigDto = {
      primaryColor: '#007ee6',
      textColor: '#FFFFFF',
      backgroundColor: '#222222',
      borderRadius: 8,
      position: 'bottom-right',
      autoOpen: false,
      autoOpenDelay: 5000,
      offlineMode: false,
      requireEmail: true,
      requirePhone: false,
      requireName: true,
      requireCompany: false,
      allowAnonymous: false,
      welcomeMessage: 'Hi there! How can we help you today?',
      offlineMessage: 'We are currently offline. Please leave a message and we\'ll get back to you.',
      thankYouMessage: 'Thank you for your message! We\'ll get back to you shortly.',
      businessHoursEnabled: false,
      timezone: 'UTC',
      schedule: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: null,
        sunday: null
      },
      rateLimitMessages: 5,
      rateLimitWindow: 60,
      blockSpamKeywords: []
    };

    return this.chatbotConfigService.updateChatbotConfig(defaultConfig);
  }

  @Get('preview')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Get chatbot configuration for preview',
    description: 'Get configuration formatted for widget preview (public-safe data only)'
  })
  @ApiResponse({
    status: 200,
    description: 'Preview configuration retrieved successfully',
    schema: {
      example: {
        name: 'Alkitu Assistant',
        welcomeMessage: 'Hello! How can I help you today?',
        avatarUrl: 'https://example.com/avatar.png',
        primaryColor: '#1976d2',
        enabled: true,
        showTypingIndicator: true,
        quickReplies: ['Talk to sales', 'Technical support', 'General inquiry'],
        position: 'bottom-right'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async getPreviewConfig() {
    const config = await this.chatbotConfigService.getChatbotConfig();
    
    if (!config) {
      return null;
    }

    // Return only public-safe configuration for preview
    return {
      welcomeMessage: config.welcomeMessage,
      primaryColor: config.primaryColor,
      textColor: config.textColor,
      backgroundColor: config.backgroundColor,
      borderRadius: config.borderRadius,
      position: config.position,
      autoOpen: config.autoOpen,
      autoOpenDelay: config.autoOpenDelay,
      offlineMode: config.offlineMode,
      offlineMessage: config.offlineMessage,
      thankYouMessage: config.thankYouMessage,
      requireEmail: config.requireEmail,
      requirePhone: config.requirePhone,
      requireName: config.requireName,
      requireCompany: config.requireCompany,
      allowAnonymous: config.allowAnonymous
    };
  }
}