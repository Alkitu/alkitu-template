// @ts-nocheck
// 
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IContactInfoRepository } from '../interfaces/chat.interface';
import { ContactInfo } from '@prisma/client';

@Injectable()
export class ContactInfoRepository implements IContactInfoRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<ContactInfo> {
    return this.prisma.contactInfo.create({ data });
  }

  async findByEmail(email: string): Promise<ContactInfo | null> {
    return this.prisma.contactInfo.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<ContactInfo | null> {
    return this.prisma.contactInfo.findUnique({ where: { id } });
  }

  async findAll(filter: any): Promise<ContactInfo[]> {
    return this.prisma.contactInfo.findMany(filter);
  }
}
