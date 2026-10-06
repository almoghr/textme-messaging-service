import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { API_CONSTANTS } from '../common/constants/api.constants';
import { TEXTME_STATUS } from '../common/constants/status-codes.constants';
import { TextMeApiException } from '../common/errors/textme-api.exception';
import { TextMeClientService } from './textme-client.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TextMeClientService', () => {
  let service: TextMeClientService;
  let mockPost: jest.Mock;

  beforeEach(async () => {
    mockPost = jest.fn();
    mockedAxios.create.mockReturnValue({
      post: mockPost,
    } as unknown as ReturnType<typeof axios.create>);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TextMeClientService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'textme') {
                return {
                  baseUrl: API_CONSTANTS.PROD_BASE_URL,
                  testUrl: 'https://my.textme.co.il/api/test',
                  apiToken: 'test-token-123',
                  username: 'test-user',
                  isTestMode: false,
                  timeoutMs: 5000,
                };
              }
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TextMeClientService>(TextMeClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute operation and return data on status 0', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        status: 0,
        message: 'Success',
        shipment_id: '12345',
      },
    });

    const result = await service.execute<Record<string, unknown>, { status: number; shipment_id: string }>(
      'sms',
      { message: 'Hello' },
    );

    expect(result.status).toBe(0);
    expect(result.shipment_id).toBe('12345');
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('should accept status 946 for addNumBL operation as success', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        status: 946,
        message: 'number has successfully added to blacklist',
      },
    });

    const result = await service.execute<Record<string, unknown>, { status: number }>(
      'addNumBL',
      { phones: { phone: '0501234567' } },
    );

    expect(result.status).toBe(946);
  });

  it('should accept status 944 for rmNumBL operation as partial success', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        status: 944,
        message: 'Partial deleted',
      },
    });

    const result = await service.execute<Record<string, unknown>, { status: number }>(
      'rmNumBL',
      { phones: { phone: '0501234567' }, reason: 'Requested' },
    );

    expect(result.status).toBe(944);
  });

  it('should throw TextMeApiException when status is non-zero failure', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        status: TEXTME_STATUS.NOT_ENOUGH_CREDIT,
        message: 'Not enough credit',
      },
    });

    await expect(
      service.execute('sms', { message: 'Test' }),
    ).rejects.toThrow(TextMeApiException);
  });

  it('should throw TextMeApiException if no token is available', async () => {
    const unauthenticatedService = new TextMeClientService({
      get: jest.fn().mockReturnValue({}),
    } as unknown as ConfigService);

    await expect(
      unauthenticatedService.execute('sms', { message: 'Test' }),
    ).rejects.toThrow(TextMeApiException);
  });

  it('should route to test endpoint when isTestMode is enabled', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        status: 0,
        message: 'Test ok',
      },
    });

    await service.execute('sms', { message: 'Test' }, { isTestMode: true, retries: 0 });

    expect(mockPost).toHaveBeenCalledWith(
      'https://my.textme.co.il/api/test',
      expect.anything(),
      expect.anything(),
    );
  });
});
