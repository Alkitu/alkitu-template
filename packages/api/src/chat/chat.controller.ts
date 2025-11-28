import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { ChatService } from './chat.service';
import {
  StartConversationDto,
  SendMessageDto,
  GetConversationsDto,
  AssignConversationDto,
  UpdateStatusDto,
  ReplyToMessageDto,
  AddInternalNoteDto,
  MarkAsReadDto,
} from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Start a new chat conversation',
    description:
      'Create a new chat conversation with optional initial message and contact information',
  })
  @ApiBody({ type: StartConversationDto })
  @ApiResponse({
    status: 201,
    description: 'Conversation started successfully',
    schema: {
      example: {
        conversation: {
          id: '60d5ecb74f3b2c001c8b4567',
          status: 'OPEN',
          priority: 'NORMAL',
          source: 'website',
          createdAt: '2024-06-29T12:00:00.000Z',
        },
        contactInfo: {
          id: '60d5ecb74f3b2c001c8b4566',
          email: 'visitor@example.com',
          name: 'John Doe',
          company: 'Acme Corp',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async startConversation(@Body() startConversationDto: StartConversationDto) {
    return this.chatService.startConversation(startConversationDto);
  }

  @Get('conversations')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Get all conversations with filtering',
    description:
      'Retrieve conversations with optional filtering by status, priority, and search terms',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by conversation status',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    description: 'Filter by conversation priority',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in conversation content',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of conversations retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          status: { type: 'string' },
          priority: { type: 'string' },
          contactInfo: { type: 'object' },
          messages: { type: 'array' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async getConversations(@Query() filterDto: GetConversationsDto) {
    return this.chatService.getConversations(filterDto);
  }

  @Get('conversations/:id/messages')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  @ApiOperation({
    summary: 'Get messages from a conversation',
    description: 'Retrieve all messages from a specific conversation',
  })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          content: { type: 'string' },
          isFromVisitor: { type: 'boolean' },
          senderUserId: { type: 'string' },
          createdAt: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getMessages(@Param('id') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }

  @Post('messages')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send a message in a conversation',
    description: 'Send a new message in an existing conversation',
  })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    schema: {
      example: {
        message: {
          id: '60d5ecb74f3b2c001c8b4568',
          conversationId: '60d5ecb74f3b2c001c8b4567',
          content: 'Thank you for contacting us!',
          isFromVisitor: false,
          senderUserId: '60d5ecb74f3b2c001c8b4566',
          createdAt: '2024-06-29T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(sendMessageDto);
  }

  @Post('messages/reply')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Reply to a message in a conversation',
    description: 'Send a reply message from an agent to a conversation',
  })
  @ApiBody({ type: ReplyToMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Reply sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Agent access required',
  })
  async replyToMessage(@Body() replyDto: ReplyToMessageDto) {
    return this.chatService.replyToMessage(replyDto);
  }

  @Patch('conversations/:id/assign')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Assign conversation to an agent',
    description: 'Assign a conversation to a specific agent or user',
  })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @ApiBody({ type: AssignConversationDto })
  @ApiResponse({
    status: 200,
    description: 'Conversation assigned successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Agent access required',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async assignConversation(
    @Param('id') conversationId: string,
    @Body() assignDto: Omit<AssignConversationDto, 'conversationId'>,
  ) {
    return this.chatService.assignConversation({
      conversationId,
      assignedToId: assignDto.assignedToId,
    });
  }

  @Patch('conversations/:id/status')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Update conversation status',
    description:
      'Change the status of a conversation (open, in_progress, resolved, etc.)',
  })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @ApiBody({ type: UpdateStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Conversation status updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Agent access required',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async updateStatus(
    @Param('id') conversationId: string,
    @Body() statusDto: Omit<UpdateStatusDto, 'conversationId'>,
  ) {
    return this.chatService.updateStatus({
      conversationId,
      status: statusDto.status,
    });
  }

  @Post('conversations/:id/notes')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add internal note to conversation',
    description:
      'Add an internal note to a conversation (not visible to visitors)',
  })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @ApiBody({ type: AddInternalNoteDto })
  @ApiResponse({
    status: 201,
    description: 'Internal note added successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Agent access required',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async addInternalNote(
    @Param('id') conversationId: string,
    @Body() noteDto: Omit<AddInternalNoteDto, 'conversationId'>,
  ) {
    return this.chatService.addInternalNote({
      conversationId,
      note: noteDto.note,
    });
  }

  @Patch('conversations/:id/read')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER)
  @ApiOperation({
    summary: 'Mark conversation as read',
    description:
      'Mark all messages in a conversation as read for the current user',
  })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @ApiBody({ type: MarkAsReadDto })
  @ApiResponse({
    status: 200,
    description: 'Conversation marked as read successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async markAsRead(
    @Param('id') conversationId: string,
    @Body() readDto: Omit<MarkAsReadDto, 'conversationId'>,
  ) {
    return this.chatService.markAsRead({
      conversationId,
      userId: readDto.userId,
    });
  }

  @Get('analytics')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Get chat analytics',
    description:
      'Retrieve chat analytics including conversation stats and performance metrics',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to include in analytics',
    type: Number,
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: 'Chat analytics retrieved successfully',
    schema: {
      example: {
        totalConversations: 150,
        openConversations: 25,
        resolvedConversations: 120,
        leadsCaptured: 89,
        averageResponseTime: 0,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Agent access required',
  })
  async getChatAnalytics(@Query('days') days?: number) {
    return this.chatService.getChatAnalytics(days);
  }
}
