import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import { EmailTemplate, RequestStatus } from '@prisma/client';
import { TemplateTrigger } from '@alkitu/shared/types/email-template';

describe('EmailTemplateService (ALI-121)', () => {
  let service: EmailTemplateService;
  let prismaService: jest.Mocked<PrismaService>;
  let emailService: jest.Mocked<EmailService>;

  const mockTemplateId = '507f1f77bcf86cd799439011';
  const mockRequestId = '507f1f77bcf86cd799439020';
  const mockUserId = '507f1f77bcf86cd799439021';
  const mockEmployeeId = '507f1f77bcf86cd799439022';
  const mockServiceId = '507f1f77bcf86cd799439023';
  const mockCategoryId = '507f1f77bcf86cd799439024';
  const mockLocationId = '507f1f77bcf86cd799439025';

  const mockTemplate: EmailTemplate = {
    id: mockTemplateId,
    name: 'request_created_client',
    subject: 'Request #{{request.id}} Created',
    body: 'Hello {{user.firstname}}, your request has been created.',
    trigger: 'ON_REQUEST_CREATED' as TemplateTrigger,
    status: null,
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  const mockRequestWithRelations = {
    id: mockRequestId,
    status: RequestStatus.PENDING,
    executionDateTime: new Date('2024-02-01T10:00:00Z'),
    createdAt: new Date('2024-01-15T00:00:00Z'),
    completedAt: null,
    templateResponses: { question1: 'answer1' },
    user: {
      id: mockUserId,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
    service: {
      id: mockServiceId,
      name: 'Plumbing Repair',
      category: {
        id: mockCategoryId,
        name: 'Plumbing',
      },
    },
    location: {
      id: mockLocationId,
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    },
    assignedTo: null,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      emailTemplate: {
        create: jest.fn().mockResolvedValue(mockTemplate),
        findMany: jest.fn().mockResolvedValue([mockTemplate]),
        findFirst: jest.fn().mockResolvedValue(mockTemplate),
        findUnique: jest.fn().mockResolvedValue(mockTemplate),
        update: jest.fn().mockResolvedValue(mockTemplate),
        delete: jest.fn().mockResolvedValue(mockTemplate),
        count: jest.fn().mockResolvedValue(1),
      },
    };

    const mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue({ success: true, messageId: 'test-123' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailTemplateService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<EmailTemplateService>(EmailTemplateService);
    prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
    emailService = module.get<EmailService>(EmailService) as jest.Mocked<EmailService>;

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      name: 'new_template_client',
      subject: 'Test Subject',
      body: 'Test Body',
      trigger: 'ON_REQUEST_CREATED' as TemplateTrigger,
      status: null,
      active: true,
    };

    it('should create a template successfully', async () => {
      prismaService.emailTemplate.findUnique = jest.fn().mockResolvedValue(null);

      const result = await service.create(createDto);

      expect(prismaService.emailTemplate.findUnique).toHaveBeenCalledWith({
        where: { name: createDto.name },
      });
      expect(prismaService.emailTemplate.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual(mockTemplate);
    });

    it('should throw ConflictException if template name already exists', async () => {
      prismaService.emailTemplate.findUnique = jest.fn().mockResolvedValue(mockTemplate);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow(
        `Email template with name "${createDto.name}" already exists`,
      );

      expect(prismaService.emailTemplate.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if trigger is ON_STATUS_CHANGED but status is null', async () => {
      const invalidDto = {
        ...createDto,
        trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
        status: null,
      };

      prismaService.emailTemplate.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(invalidDto)).rejects.toThrow(
        'Status is required when trigger is ON_STATUS_CHANGED',
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.emailTemplate.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.emailTemplate.create = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all templates', async () => {
      const result = await service.findAll({});

      expect(prismaService.emailTemplate.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockTemplate]);
    });

    it('should filter by trigger', async () => {
      const filters = { trigger: 'ON_REQUEST_CREATED' as TemplateTrigger };

      await service.findAll(filters);

      expect(prismaService.emailTemplate.findMany).toHaveBeenCalledWith({
        where: { trigger: 'ON_REQUEST_CREATED' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by active status', async () => {
      const filters = { active: true };

      await service.findAll(filters);

      expect(prismaService.emailTemplate.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      const filters = { status: RequestStatus.COMPLETED };

      await service.findAll(filters);

      expect(prismaService.emailTemplate.findMany).toHaveBeenCalledWith({
        where: { status: RequestStatus.COMPLETED },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a template by id', async () => {
      const result = await service.findOne(mockTemplateId);

      expect(prismaService.emailTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: mockTemplateId },
      });
      expect(result).toEqual(mockTemplate);
    });

    it('should throw NotFoundException if template not found', async () => {
      prismaService.emailTemplate.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(mockTemplateId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(mockTemplateId)).rejects.toThrow(
        `Email template with id "${mockTemplateId}" not found`,
      );
    });
  });

  describe('findByTrigger', () => {
    it('should return templates by trigger', async () => {
      await service.findByTrigger('ON_REQUEST_CREATED' as TemplateTrigger);

      expect(prismaService.emailTemplate.findMany).toHaveBeenCalledWith({
        where: {
          trigger: 'ON_REQUEST_CREATED',
          active: true,
        },
      });
    });

    it('should filter by status when provided', async () => {
      await service.findByTrigger(
        'ON_STATUS_CHANGED' as TemplateTrigger,
        RequestStatus.COMPLETED,
      );

      expect(prismaService.emailTemplate.findMany).toHaveBeenCalledWith({
        where: {
          trigger: 'ON_STATUS_CHANGED',
          status: RequestStatus.COMPLETED,
          active: true,
        },
      });
    });
  });

  describe('update', () => {
    const updateDto = {
      subject: 'Updated Subject',
      body: 'Updated Body',
      active: false,
    };

    it('should update a template successfully', async () => {
      const result = await service.update(mockTemplateId, updateDto);

      expect(prismaService.emailTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: mockTemplateId },
      });
      expect(prismaService.emailTemplate.update).toHaveBeenCalledWith({
        where: { id: mockTemplateId },
        data: updateDto,
      });
      expect(result).toEqual(mockTemplate);
    });

    it('should throw NotFoundException if template not found', async () => {
      prismaService.emailTemplate.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.update(mockTemplateId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.emailTemplate.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.update(mockTemplateId, updateDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a template successfully', async () => {
      const result = await service.delete(mockTemplateId);

      expect(prismaService.emailTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: mockTemplateId },
      });
      expect(prismaService.emailTemplate.delete).toHaveBeenCalledWith({
        where: { id: mockTemplateId },
      });
      expect(result).toEqual(mockTemplate);
    });

    it('should throw NotFoundException if template not found', async () => {
      prismaService.emailTemplate.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.delete(mockTemplateId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAvailablePlaceholders', () => {
    it('should return all available placeholders', () => {
      const result = service.getAvailablePlaceholders();

      expect(result).toHaveProperty('request');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('service');
      expect(result).toHaveProperty('location');
      expect(result).toHaveProperty('employee');
      expect(result).toHaveProperty('templateResponses');

      expect(result.request).toContain('{{request.id}}');
      expect(result.user).toContain('{{user.firstname}}');
      expect(result.service).toContain('{{service.name}}');
      expect(result.location).toContain('{{location.city}}');
      expect(result.employee).toContain('{{employee.email}}');
    });
  });

  describe('replacePlaceholders', () => {
    it('should replace all placeholders in text', () => {
      const template = 'Hello {{user.firstname}} {{user.lastname}}, your request #{{request.id}} is {{request.status}}';
      const data = {
        request: {
          id: mockRequestId,
          status: 'PENDING',
          executionDateTime: new Date(),
          createdAt: new Date(),
        },
        user: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
        },
        service: {
          name: 'Test Service',
          category: 'Test Category',
        },
        location: {
          street: '123 Main',
          city: 'NYC',
          state: 'NY',
          zip: '10001',
        },
      };

      const result = service.replacePlaceholders(template, data);

      expect(result).toBe(`Hello John Doe, your request #${mockRequestId} is PENDING`);
    });

    it('should handle missing optional placeholders', () => {
      const template = 'Employee: {{employee.firstname}}';
      const data = {
        request: { id: '1', status: 'PENDING', executionDateTime: new Date(), createdAt: new Date() },
        user: { firstname: 'John', lastname: 'Doe', email: 'john@example.com' },
        service: { name: 'Test', category: 'Test' },
        location: { street: '', city: '', state: '', zip: '' },
        employee: null,
      };

      const result = service.replacePlaceholders(template, data);

      expect(result).toBe('Employee: ');
    });

    it('should format dates correctly', () => {
      const template = 'Created: {{request.createdAt}}';
      const testDate = new Date('2024-01-15T10:30:00Z');
      const data = {
        request: {
          id: '1',
          status: 'PENDING',
          executionDateTime: new Date(),
          createdAt: testDate,
        },
        user: { firstname: 'John', lastname: 'Doe', email: 'john@example.com' },
        service: { name: 'Test', category: 'Test' },
        location: { street: '', city: '', state: '', zip: '' },
      };

      const result = service.replacePlaceholders(template, data);

      expect(result).toContain('2024');
    });
  });


  describe('sendRequestCreatedEmails', () => {
    it('should send email to client when template ends with _client', async () => {
      const clientTemplate = { ...mockTemplate, name: 'request_created_client' };
      prismaService.emailTemplate.findMany = jest.fn().mockResolvedValue([clientTemplate]);

      await service.sendRequestCreatedEmails(mockRequestWithRelations as any);

      expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'john@example.com',
          subject: expect.stringContaining(mockRequestId),
        }),
      );
    });

    it('should send email to employee when template ends with _employee and employee exists', async () => {
      const employeeTemplate = { ...mockTemplate, name: 'request_created_employee' };
      const requestWithEmployee = {
        ...mockRequestWithRelations,
        assignedTo: {
          id: mockEmployeeId,
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane@example.com',
          phone: '+9876543210',
        },
      };

      prismaService.emailTemplate.findMany = jest.fn().mockResolvedValue([employeeTemplate]);

      await service.sendRequestCreatedEmails(requestWithEmployee as any);

      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'jane@example.com',
        }),
      );
    });

    it('should not send employee email if assignedTo is null', async () => {
      const employeeTemplate = { ...mockTemplate, name: 'request_created_employee' };
      prismaService.emailTemplate.findMany = jest.fn().mockResolvedValue([employeeTemplate]);

      await service.sendRequestCreatedEmails(mockRequestWithRelations as any);

      expect(emailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should handle email sending errors gracefully', async () => {
      prismaService.emailTemplate.findMany = jest.fn().mockResolvedValue([mockTemplate]);
      emailService.sendEmail = jest.fn().mockRejectedValue(new Error('Email API error'));

      // Should not throw, just log error
      await expect(
        service.sendRequestCreatedEmails(mockRequestWithRelations as any),
      ).resolves.not.toThrow();
    });
  });

  describe('sendStatusChangedEmails', () => {
    it('should send emails for status change', async () => {
      const statusTemplate = {
        ...mockTemplate,
        trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
        status: RequestStatus.COMPLETED,
        name: 'status_completed_client',
      };

      prismaService.emailTemplate.findMany = jest.fn().mockResolvedValue([statusTemplate]);

      await service.sendStatusChangedEmails(
        mockRequestWithRelations as any,
        RequestStatus.COMPLETED,
      );

      expect(prismaService.emailTemplate.findMany).toHaveBeenCalledWith({
        where: {
          trigger: 'ON_STATUS_CHANGED',
          status: RequestStatus.COMPLETED,
          active: true,
        },
      });
      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it('should not send emails if no templates match the status', async () => {
      prismaService.emailTemplate.findMany = jest.fn().mockResolvedValue([]);

      await service.sendStatusChangedEmails(
        mockRequestWithRelations as any,
        RequestStatus.CANCELLED,
      );

      expect(emailService.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('buildPlaceholderData', () => {
    it('should build complete placeholder data from request', () => {
      const result = (service as any).buildPlaceholderData(mockRequestWithRelations);

      expect(result).toHaveProperty('request');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('service');
      expect(result).toHaveProperty('location');
      expect(result).toHaveProperty('employee');
      expect(result).toHaveProperty('templateResponses');

      expect(result.request.id).toBe(mockRequestId);
      expect(result.user.firstname).toBe('John');
      expect(result.service.name).toBe('Plumbing Repair');
      expect(result.location.city).toBe('New York');
    });

    it('should handle request with employee assigned', () => {
      const requestWithEmployee = {
        ...mockRequestWithRelations,
        assignedTo: {
          id: mockEmployeeId,
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane@example.com',
          phone: '+9876543210',
        },
      };

      const result = (service as any).buildPlaceholderData(requestWithEmployee);

      expect(result.employee).toBeDefined();
      expect(result.employee?.firstname).toBe('Jane');
    });

    it('should map location.zip correctly', () => {
      const result = (service as any).buildPlaceholderData(mockRequestWithRelations);

      expect(result.location.zip).toBe('10001');
    });
  });

  describe('previewTemplate', () => {
    it('should preview template with test data', async () => {
      const testData: any = {
        request: {
          id: 'test-123',
          status: 'PENDING',
          executionDateTime: new Date(),
          createdAt: new Date(),
        },
        user: {
          firstname: 'Test',
          lastname: 'User',
          email: 'test@example.com',
        },
        service: { name: 'Test Service', category: 'Test' },
        location: { street: '', city: '', state: '', zip: '' },
      };

      const result = await service.previewTemplate(mockTemplateId, testData);

      expect(prismaService.emailTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: mockTemplateId },
      });
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('body');
      expect(result.subject).toContain('test-123');
    });

    it('should throw NotFoundException if template not found', async () => {
      prismaService.emailTemplate.findUnique = jest.fn().mockResolvedValue(null);

      const testData: any = {
        request: {
          id: 'test-123',
          status: 'PENDING',
          executionDateTime: new Date(),
          createdAt: new Date(),
        },
        user: {
          firstname: 'Test',
          lastname: 'User',
          email: 'test@example.com',
        },
        service: { name: 'Test Service', category: 'Test' },
        location: { street: '', city: '', state: '', zip: '' },
      };

      await expect(service.previewTemplate(mockTemplateId, testData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
