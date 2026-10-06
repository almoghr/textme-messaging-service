import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

describe('BalanceService & BalanceController', () => {
  let service: BalanceService;
  let controller: BalanceController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        BalanceService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    controller = module.get<BalanceController>(BalanceController);
  });

  it('getBalance should call client with balance operation and return amount', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      amount: '5000',
    });

    const result = await service.getBalance({ type: 'sms' });
    expect(result.amount).toBe('5000');
    expect(mockClient.execute).toHaveBeenCalledWith(
      'balance',
      expect.objectContaining({ type: 'sms' }),
      undefined,
    );
  });

  it('controller should invoke getBalance service method', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      amount: '120',
    });

    const result = await controller.getBalance({});
    expect(result.amount).toBe('120');
  });
});
