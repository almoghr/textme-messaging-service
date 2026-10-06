import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';

describe('BlacklistService & BlacklistController', () => {
  let service: BlacklistService;
  let controller: BlacklistController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlacklistController],
      providers: [
        BlacklistService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<BlacklistService>(BlacklistService);
    controller = module.get<BlacklistController>(BlacklistController);
  });

  it('getBlacklist should call client with blacklist', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      blacklists: [{ phone: '0501234567' }],
    });

    const result = await service.getBlacklist({
      from: '01/01/26 00:00',
      to: '02/01/26 00:00',
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'blacklist',
      expect.objectContaining({ from: '01/01/26 00:00' }),
      undefined,
    );
  });

  it('addToBlacklist should call client with addNumBL', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 946,
      message: 'number has successfully added to blacklist',
    });

    const result = await controller.addToBlacklist({
      phones: ['0501234567'],
    });

    expect(result.status).toBe(946);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'addNumBL',
      expect.objectContaining({
        phones: { phone: ['0501234567'] },
      }),
      undefined,
    );
  });

  it('removeFromBlacklist should call client with rmNumBL', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'deleted',
    });

    const result = await controller.removeFromBlacklist({
      phones: ['0501234567'],
      reason: 'User opted back in',
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'rmNumBL',
      expect.objectContaining({
        phones: { phone: ['0501234567'] },
        reason: 'User opted back in',
      }),
      undefined,
    );
  });
});
