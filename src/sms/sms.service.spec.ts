import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

describe('SmsService & SmsController', () => {
  let service: SmsService;
  let controller: SmsController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsController],
      providers: [
        SmsService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    controller = module.get<SmsController>(SmsController);
  });

  it('sendSms should format payload and call client', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'SMS will be sent',
      shipment_id: '12345',
    });

    const result = await service.sendSms({
      source: 'DemoSender',
      destinations: { phone: '0501234567' },
      message: 'Hello World',
    });

    expect(result.status).toBe(0);
    expect(result.shipment_id).toBe('12345');
    expect(mockClient.execute).toHaveBeenCalledWith(
      'sms',
      expect.objectContaining({
        source: 'DemoSender',
        message: 'Hello World',
      }),
      undefined,
    );
  });

  it('sendBulk should format messages array and call client', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'Bulk queued',
      shipment_id: '99999',
    });

    const result = await controller.sendBulk({
      messages: [
        {
          source: 'BulkSource',
          destinations: { phone: '0501234567' },
          message: 'Bulk text 1',
        },
      ],
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'bulk',
      expect.objectContaining({
        messages: expect.objectContaining({
          message: expect.arrayContaining([
            expect.objectContaining({ source: 'BulkSource' }),
          ]),
        }),
      }),
      undefined,
    );
  });
});
