import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';

describe('SubscribersService & SubscribersController', () => {
  let service: SubscribersService;
  let controller: SubscribersController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscribersController],
      providers: [
        SubscribersService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<SubscribersService>(SubscribersService);
    controller = module.get<SubscribersController>(SubscribersController);
  });

  it('addSubscriber should call client with addSub', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'Created',
    });

    const result = await service.addSubscriber({
      userDetails: {
        name: 'Sub Name',
        username: 'subuser',
        password: 'password123',
        source: 'SubSource',
        amount: '1000',
      },
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'addSub',
      expect.objectContaining({
        userDetails: expect.objectContaining({ username: 'subuser', amount: '1000' }),
      }),
      undefined,
    );
  });

  it('updateWallet should call client with updateAmountSub', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'Wallet updated',
    });

    const result = await controller.updateWallet({
      userDetails: {
        username: 'subuser',
        amount: '500',
      },
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'updateAmountSub',
      expect.objectContaining({
        userDetails: expect.objectContaining({ username: 'subuser', amount: '500' }),
      }),
      undefined,
    );
  });

  it('getBalances should call client with getBlanceSubs', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      balances: [],
    });

    const result = await controller.getBalances({});
    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'getBlanceSubs',
      expect.anything(),
      undefined,
    );
  });
});
