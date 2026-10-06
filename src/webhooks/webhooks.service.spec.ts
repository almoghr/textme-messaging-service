import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

describe('WebhooksService & WebhooksController', () => {
  let service: WebhooksService;
  let controller: WebhooksController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        WebhooksService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<WebhooksService>(WebhooksService);
    controller = module.get<WebhooksController>(WebhooksController);
  });

  it('registerPushUrl should call client with push_url operation', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'push url has successfully added',
    });

    const result = await service.registerPushUrl({
      type: 'dlr',
      url: 'https://example.com/api/webhooks/delivery-report',
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'push_url',
      expect.objectContaining({ type: 'dlr', url: 'https://example.com/api/webhooks/delivery-report' }),
      undefined,
    );
  });

  it('processDeliveryReport should acknowledge receipt promptly', () => {
    const ack = controller.handleDeliveryReport({
      external_id: 'ext123',
      status: '0',
      phone: '0501234567',
    });

    expect(ack.received).toBe(true);
    expect(ack.timestamp).toBeDefined();
  });

  it('processIncomingMessage should acknowledge receipt promptly', () => {
    const ack = controller.handleIncomingMessage({
      phone: '0501234567',
      dest: '0509999999',
      message: 'Hello TextMe',
    });

    expect(ack.received).toBe(true);
  });

  it('processBlocklistAddition should acknowledge receipt promptly', () => {
    const ack = controller.handleBlocklistAddition({
      dest: '0501234567',
      message: 'Opt out',
    });

    expect(ack.received).toBe(true);
  });
});
