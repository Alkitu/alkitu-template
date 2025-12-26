/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ContactInfoRepository } from './contact-info.repository';
import { PrismaService } from '../../prisma.service';
import { CreateContactInfoData, ContactInfoFindOptions } from '../interfaces/chat.interface';
import { ContactInfo } from '@prisma/client';

describe('ContactInfoRepository', () => {
  let repository: ContactInfoRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockContactInfo: ContactInfo = {
    id: 'contact-123',
    email: 'test@example.com',
    name: 'John Doe',
    company: 'Acme Corp',
    phone: '+1234567890',
    source: 'website',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    userId: null,
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactInfoRepository,
        {
          provide: PrismaService,
          useValue: {
            contactInfo: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<ContactInfoRepository>(ContactInfoRepository);
    prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new contact info', async () => {
      const createData: CreateContactInfoData = {
        email: 'test@example.com',
        name: 'John Doe',
        company: 'Acme Corp',
        phone: '+1234567890',
      };

      const expectedData = {
        ...createData,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      (prismaService.contactInfo.create as jest.Mock).mockResolvedValue(mockContactInfo);

      const result = await repository.create(createData);

      expect(prismaService.contactInfo.create).toHaveBeenCalledWith({
        data: expectedData,
      });
      expect(result).toEqual(mockContactInfo);
    });

    it('should create contact info with minimal data', async () => {
      const createData: CreateContactInfoData = {
        email: 'minimal@example.com',
        name: 'Jane Smith',
      };

      const minimalContactInfo = {
        ...mockContactInfo,
        email: 'minimal@example.com',
        name: 'Jane Smith',
        company: null,
        phone: null,
      };

      (prismaService.contactInfo.create as jest.Mock).mockResolvedValue(minimalContactInfo);

      const result = await repository.create(createData);

      expect(prismaService.contactInfo.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(minimalContactInfo);
    });
  });

  describe('findByEmail', () => {
    it('should find contact info by email with conversations', async () => {
      const email = 'test@example.com';
      const contactWithConversations = {
        ...mockContactInfo,
        conversations: [
          {
            id: 'conv-123',
            status: 'OPEN',
            createdAt: new Date(),
          },
        ],
      };

      (prismaService.contactInfo.findUnique as jest.Mock).mockResolvedValue(contactWithConversations);

      const result = await repository.findByEmail(email);

      expect(prismaService.contactInfo.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: {
          conversations: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
      expect(result).toEqual(contactWithConversations);
    });

    it('should return null when contact not found', async () => {
      const email = 'notfound@example.com';

      (prismaService.contactInfo.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(prismaService.contactInfo.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: {
          conversations: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find contact info by id with all conversations', async () => {
      const id = 'contact-123';
      const contactWithConversations = {
        ...mockContactInfo,
        conversations: [
          {
            id: 'conv-123',
            status: 'OPEN',
            createdAt: new Date(),
          },
          {
            id: 'conv-124',
            status: 'RESOLVED',
            createdAt: new Date(),
          },
        ],
      };

      (prismaService.contactInfo.findUnique as jest.Mock).mockResolvedValue(contactWithConversations);

      const result = await repository.findById(id);

      expect(prismaService.contactInfo.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          conversations: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      expect(result).toEqual(contactWithConversations);
    });

    it('should return null when contact not found by id', async () => {
      const id = 'non-existent-id';

      (prismaService.contactInfo.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(prismaService.contactInfo.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          conversations: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all contacts with default options', async () => {
      const options: ContactInfoFindOptions = {};
      const contacts = [mockContactInfo];

      (prismaService.contactInfo.findMany as jest.Mock).mockResolvedValue(contacts);

      const result = await repository.findAll(options);

      expect(prismaService.contactInfo.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(contacts);
    });

    it('should find all contacts with specific where conditions', async () => {
      const options: ContactInfoFindOptions = {
        where: {
          id: 'contact-123',
        },
      };
      const contacts = [mockContactInfo];

      (prismaService.contactInfo.findMany as jest.Mock).mockResolvedValue(contacts);

      const result = await repository.findAll(options);

      expect(prismaService.contactInfo.findMany).toHaveBeenCalledWith({
        where: { id: 'contact-123' },
        include: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(contacts);
    });

    it('should find all contacts with include options', async () => {
      const options: ContactInfoFindOptions = {
        include: {
          conversations: true,
        },
      };
      const contactsWithConversations = [
        {
          ...mockContactInfo,
          conversations: [
            {
              id: 'conv-123',
              status: 'OPEN',
              createdAt: new Date(),
            },
          ],
        },
      ];

      (prismaService.contactInfo.findMany as jest.Mock).mockResolvedValue(contactsWithConversations);

      const result = await repository.findAll(options);

      expect(prismaService.contactInfo.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: { conversations: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(contactsWithConversations);
    });

    it('should find all contacts with both where and include options', async () => {
      const options: ContactInfoFindOptions = {
        where: {
          email: 'test@example.com',
        },
        include: {
          conversations: true,
        },
      };
      const filteredContacts = [mockContactInfo];

      (prismaService.contactInfo.findMany as jest.Mock).mockResolvedValue(filteredContacts);

      const result = await repository.findAll(options);

      expect(prismaService.contactInfo.findMany).toHaveBeenCalledWith({
        where: {
          email: 'test@example.com',
        },
        include: {
          conversations: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(filteredContacts);
    });

    it('should return empty array when no contacts found', async () => {
      const options: ContactInfoFindOptions = {
        where: {
          email: 'nonexistent@example.com',
        },
      };

      (prismaService.contactInfo.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findAll(options);

      expect(result).toEqual([]);
    });
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});