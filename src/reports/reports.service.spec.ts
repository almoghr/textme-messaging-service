import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsService & ReportsController', () => {
  let service: ReportsService;
  let controller: ReportsController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        ReportsService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    controller = module.get<ReportsController>(ReportsController);
  });

  it('getDlr should call client with dlr and external_id array', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      transactions: [{ external_id: 'ext1', status: '0' }],
    });

    const result = await service.getDlr({
      external_ids: ['ext1'],
      from: '01/01/26 00:00',
      to: '02/01/26 00:00',
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'dlr',
      expect.objectContaining({
        transactions: { external_id: ['ext1'] },
        from: '01/01/26 00:00',
      }),
      undefined,
    );
  });

  it('getDlrByDate should call client with dlrByDate', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      transactions: [],
    });

    const result = await controller.getDlrByDate({
      from: '01/01/26 00:00',
      to: '02/01/26 00:00',
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'dlrByDate',
      expect.objectContaining({ from: '01/01/26 00:00' }),
      undefined,
    );
  });

  it('getIncomingMessages should call client with incoming', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      incoming_messages: [{ source: '0501234567', message: 'Hi' }],
    });

    const result = await controller.getIncomingMessages({
      from: '01/01/26 00:00',
      to: '02/01/26 00:00',
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'incoming',
      expect.objectContaining({ from: '01/01/26 00:00' }),
      undefined,
    );
  });
});
