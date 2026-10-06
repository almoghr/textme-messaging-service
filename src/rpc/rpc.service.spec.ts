import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { RpcController } from './rpc.controller';
import { RpcService } from './rpc.service';

describe('RpcService & RpcController', () => {
  let service: RpcService;
  let controller: RpcController;
  let mockClient: { executeRaw: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      executeRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RpcController],
      providers: [
        RpcService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<RpcService>(RpcService);
    controller = module.get<RpcController>(RpcController);
  });

  it('executeCall should call client executeRaw with isTestMode false', async () => {
    mockClient.executeRaw.mockResolvedValueOnce({
      status: 0,
      message: 'OK',
    });

    const result = await service.executeCall({
      body: { sms: { message: 'Raw' } },
    });

    expect(result.status).toBe(0);
    expect(mockClient.executeRaw).toHaveBeenCalledWith(
      { sms: { message: 'Raw' } },
      expect.objectContaining({ isTestMode: false }),
      'sms',
    );
  });

  it('executeTest should call client executeRaw with isTestMode true', async () => {
    mockClient.executeRaw.mockResolvedValueOnce({
      status: 0,
      message: 'Dry run valid',
    });

    const result = await controller.test({
      body: { sms: { message: 'Test dry run' } },
    });

    expect(result.status).toBe(0);
    expect(mockClient.executeRaw).toHaveBeenCalledWith(
      { sms: { message: 'Test dry run' } },
      expect.objectContaining({ isTestMode: true }),
      'sms',
    );
  });
});
