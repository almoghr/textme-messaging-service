import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { API_CONSTANTS } from '../src/common/constants/api.constants';
import { TextMeClientService } from '../src/textme-client/textme-client.service';

describe('TextMe Service (e2e)', () => {
  let app: INestApplication;
  const mockClientService = {
    execute: jest.fn().mockImplementation((operation: string) => {
      return Promise.resolve({
        status: 0,
        message: `Mock success for ${operation}`,
      });
    }),
    executeRaw: jest.fn().mockResolvedValue({
      status: 0,
      message: 'Mock raw success',
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TextMeClientService)
      .useValue(mockClientService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(API_CONSTANTS.GLOBAL_PREFIX);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health (GET) should return healthy status with Hebrew translation', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('textme-service');
        expect(res.body.message_he).toBe('המערכת פועלת כסדרה');
      });
  });

  it('/api/webhooks/delivery-report (POST) should acknowledge receipt with Hebrew message', () => {
    return request(app.getHttpServer())
      .post('/api/webhooks/delivery-report')
      .send({
        external_id: 'e2e-1',
        status: '0',
        phone: '0501234567',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.received).toBe(true);
        expect(res.body.message_he).toBeDefined();
      });
  });

  it('/api/tokens/current (POST) should reject missing username with 400 and return Hebrew translation', () => {
    return request(app.getHttpServer())
      .post('/api/tokens/current')
      .send({})
      .expect(HttpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message_he).toBeDefined();
        expect(typeof res.body.message_he).toBe('string');
      });
  });

  it('/api/tokens/current (POST) should accept valid username', () => {
    return request(app.getHttpServer())
      .post('/api/tokens/current')
      .send({ username: 'valid_user' })
      .expect(HttpStatus.OK);
  });

  it('/api/sms/send (POST) should validate and process SMS send with Hebrew translation', () => {
    return request(app.getHttpServer())
      .post('/api/sms/send')
      .send({
        source: 'DemoSender',
        destinations: { phone: '0501234567' },
        message: 'Hello E2E',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.status).toBe(0);
        expect(res.body.message_he).toBeDefined();
      });
  });

  it('/api/otp/send (POST) should validate and process OTP send', () => {
    return request(app.getHttpServer())
      .post('/api/otp/send')
      .send({
        phone: '0501234567',
        source: 'AuthSender',
        valid_time: 5,
      })
      .expect(HttpStatus.OK);
  });

  it('/api/textme/call (POST) should forward raw RPC calls', () => {
    return request(app.getHttpServer())
      .post('/api/textme/call')
      .send({
        body: {
          sms: {
            source: 'RawSource',
            destinations: { phone: '0501234567' },
            message: 'Raw Hello',
          },
        },
      })
      .expect(HttpStatus.OK);
  });
});
