import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async createBilling(data: CreateBillingDto) {
    return this.prisma.billing.create({ data });
  }

  async getBillingRecords(userId: string) {
    return this.prisma.billing.findMany({ where: { userId } });
  }

  async updateBilling(id: string, data: UpdateBillingDto) {
    return this.prisma.billing.update({ where: { id }, data });
  }

  async deleteBilling(id: string) {
    return this.prisma.billing.delete({ where: { id } });
  }
}
