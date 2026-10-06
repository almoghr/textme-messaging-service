import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

describe('OtpService & OtpController', () => {
  let service: OtpService;
  let controller: OtpController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpController],
      providers: [
        OtpService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    controller = module.get<OtpController>(OtpController);
  });

  it('sendOtp should call client with send_otp operation', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'OTP sent',
    });

    const result = await service.sendOtp({
      phone: '0501234567',
      source: 'AuthSender',
      valid_time: 5,
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'send_otp',
      expect.objectContaining({ phone: '0501234567', source: 'AuthSender', valid_time: 5 }),
      undefined,
    );
  });

  it('validateOtp should call client with validate_otp operation', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'Verified',
    });

    const result = await controller.validateOtp({
      phone: '0501234567',
      code: '123456',
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'validate_otp',
      expect.objectContaining({ phone: '0501234567', code: '123456' }),
      undefined,
    );
  });
});
