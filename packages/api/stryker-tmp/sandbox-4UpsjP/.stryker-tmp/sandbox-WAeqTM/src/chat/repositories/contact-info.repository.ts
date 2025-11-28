// @ts-nocheck
// 
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  IContactInfoRepository,
  CreateContactInfoData,
  ContactInfoFindOptions,
} from '../interfaces/chat.interface';
import { ContactInfo } from '@prisma/client';

@Injectable()
export class ContactInfoRepository implements IContactInfoRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateContactInfoData): Promise<ContactInfo> {
    return this.prisma.contactInfo.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findByEmail(email: string): Promise<ContactInfo | null> {
    return this.prisma.contactInfo.findUnique({
      where: { email },
      include: {
        conversations: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Include last 5 conversations
        },
      },
    });
  }

  async findById(id: string): Promise<ContactInfo | null> {
    return this.prisma.contactInfo.findUnique({
      where: { id },
      include: {
        conversations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findAll(options: ContactInfoFindOptions): Promise<ContactInfo[]> {
    return this.prisma.contactInfo.findMany({
      where: options.where,
      include: options.include,
      orderBy: { createdAt: 'desc' },
    });
  }
}
