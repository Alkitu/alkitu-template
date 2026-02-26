import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CounterService {
  private readonly logger = new Logger(CounterService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Atomically increment and return the next value for a named counter.
   * Uses MongoDB's findAndModify via $runCommandRaw for true atomicity.
   */
  async getNextValue(counterName: string): Promise<number> {
    const result = (await this.prisma.$runCommandRaw({
      findAndModify: 'counters',
      query: { name: counterName },
      update: { $inc: { value: 1 } },
      upsert: true,
      new: true,
    })) as { value?: { value?: number } };

    const nextValue = result?.value?.value;
    if (typeof nextValue !== 'number') {
      throw new Error(
        `Counter "${counterName}" returned unexpected result: ${JSON.stringify(result)}`,
      );
    }

    return nextValue;
  }

  /**
   * Generate a sequential custom ID for a request.
   * Format: REQ-{SERVICE_CODE}-{YYYYMM}-{NNNN}
   *
   * @param serviceCode - The service code (e.g., "LIMP", "ELEC")
   * @returns The generated custom ID (e.g., "REQ-LIMP-202602-0001")
   */
  async generateRequestCustomId(serviceCode: string): Promise<string> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const counterName = `req_${serviceCode}_${yearMonth}`;

    const seq = await this.getNextValue(counterName);
    const paddedSeq = String(seq).padStart(4, '0');

    const customId = `REQ-${serviceCode}-${yearMonth}-${paddedSeq}`;
    this.logger.log(`Generated customId: ${customId}`);

    return customId;
  }
}
