// @ts-nocheck
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

export const prismaServiceMock = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  account: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  verificationToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  passwordResetToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
    groupBy: jest.fn(),
  },
  notificationPreference: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
  },
  tag: {
    findMany: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(),
};

export const mockPrismaService = () => ({
  provide: PrismaService,
  useValue: prismaServiceMock,
});

export const resetAllMocks = () => {
  Object.values(prismaServiceMock.user).forEach((mock) => mock.mockReset());
  Object.values(prismaServiceMock.account).forEach((mock) => mock.mockReset());
  Object.values(prismaServiceMock.verificationToken).forEach((mock) =>
    mock.mockReset(),
  );
  Object.values(prismaServiceMock.passwordResetToken).forEach((mock) =>
    mock.mockReset(),
  );
  Object.values(prismaServiceMock.notification).forEach((mock) =>
    mock.mockReset(),
  );
  Object.values(prismaServiceMock.notificationPreference).forEach((mock) =>
    mock.mockReset(),
  );
  prismaServiceMock.$connect.mockReset();
  prismaServiceMock.$disconnect.mockReset();
  prismaServiceMock.$transaction.mockReset();
};
