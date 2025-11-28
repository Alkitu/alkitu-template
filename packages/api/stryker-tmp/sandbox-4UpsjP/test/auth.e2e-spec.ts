// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe.skip('Auth (e2e) - DISABLED: MongoDB replica set required', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let prisma: PrismaService;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'alkitu-test',
      },
    });

    const mongoUri = mongoServer.getUri();
    process.env.DATABASE_URL = `${mongoUri}alkitu-test`;
    process.env.JWT_SECRET = 'test-jwt-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
    await mongoServer.stop();
  }, 30000);

  beforeEach(async () => {
    // Clean database before each test
    try {
      await prisma.user.deleteMany();
      await prisma.account.deleteMany();
      await prisma.verificationToken.deleteMany();
      await prisma.passwordResetToken.deleteMany();
    } catch (error) {
      // If collections don't exist yet, that's fine for clean state
      console.log(
        'Cleaning database collections (some may not exist yet):',
        error.message,
      );
    }
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      const registerDto = {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        password: 'password123',
        contactNumber: '+1234567890',
        terms: true,
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(registerDto.email);
          expect(res.body.name).toBe(registerDto.name);
          expect(res.body.lastName).toBe(registerDto.lastName);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 409 if user already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        password: 'password123',
        contactNumber: '+1234567890',
        terms: true,
      };

      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      // Second registration with same email
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);
    });

    it('should return 400 for invalid data', () => {
      const invalidData = {
        email: 'invalid-email',
        name: '',
        password: '123', // too short
        terms: false, // must be true
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Create a test user
      const registerDto = {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        password: 'password123',
        contactNumber: '+1234567890',
        terms: true,
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);
    });

    it('should login with valid credentials', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(loginDto.email);
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should return 401 for invalid credentials', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should return 401 for non-existent user', () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });

  describe('Authentication Flow', () => {
    it('should complete full registration and login flow', async () => {
      const registerDto = {
        email: 'flow@example.com',
        name: 'Flow',
        lastName: 'Test',
        password: 'password123',
        contactNumber: '+1234567890',
        terms: true,
      };

      // 1. Register user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(registerResponse.body.email).toBe(registerDto.email);

      // 2. Login with registered user
      const loginDto = {
        email: registerDto.email,
        password: registerDto.password,
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(loginResponse.body).toHaveProperty('access_token');
      expect(loginResponse.body.user.id).toBe(registerResponse.body.id);

      // 3. Access protected endpoint with token
      const token = loginResponse.body.access_token;

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].email).toBe(registerDto.email);
        });
    });
  });
});
