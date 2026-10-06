import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

describe('CampaignsService & CampaignsController', () => {
  let service: CampaignsService;
  let controller: CampaignsController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsController],
      providers: [
        CampaignsService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    controller = module.get<CampaignsController>(CampaignsController);
  });

  it('cancelById should call client with cancel and campaign_id', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'Cancelled',
    });

    const result = await service.cancelById({ campaign_id: 'cmp-123' });
    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'cancel',
      expect.objectContaining({ campaign_id: 'cmp-123' }),
      undefined,
    );
  });

  it('cancelByName should call client with cancel and campaign_name', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'Cancelled',
    });

    const result = await controller.cancelByName({ campaign_name: 'SummerPromo' });
    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'cancel',
      expect.objectContaining({ campaign_name: 'SummerPromo' }),
      undefined,
    );
  });

  it('getBirthdayCampaigns should call client with get_birthday_campaigns', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      birthday_campaigns: [],
    });

    const result = await controller.getBirthdayCampaigns({});
    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'get_birthday_campaigns',
      expect.anything(),
      undefined,
    );
  });

  it('editBirthdayCampaign should call client with edit_birthday_campaign', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'Updated',
    });

    const result = await controller.editBirthdayCampaign({
      campaign_id: 'cmp-123',
      message: 'Happy Birthday!',
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'edit_birthday_campaign',
      expect.objectContaining({ campaign_id: 'cmp-123', message: 'Happy Birthday!' }),
      undefined,
    );
  });
});
