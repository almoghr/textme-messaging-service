import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { VerifiedSendersController } from './verified-senders.controller';
import { VerifiedSendersService } from './verified-senders.service';

describe('VerifiedSendersService & VerifiedSendersController', () => {
  let service: VerifiedSendersService;
  let controller: VerifiedSendersController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifiedSendersController],
      providers: [
        VerifiedSendersService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<VerifiedSendersService>(VerifiedSendersService);
    controller = module.get<VerifiedSendersController>(VerifiedSendersController);
  });

  it('verifyPhone should call client with verify_phone', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      verify_message: 'Verification initiated',
    });

    const result = await service.verifyPhone({ phone: '0501234567' });
    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'verify_phone',
      expect.objectContaining({ phone: '0501234567' }),
      undefined,
    );
  });

  it('getVerifiedPhones should call client with getVerifiedPhones', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      verified_phones: [{ phone: '0501234567' }],
    });

    const result = await controller.getVerifiedPhones({ is_subs: '1' });
    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'getVerifiedPhones',
      expect.objectContaining({ is_subs: '1' }),
      undefined,
    );
  });
});
