import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

describe('TokensService & TokensController', () => {
  let service: TokensService;
  let controller: TokensController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [
        TokensService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
    controller = module.get<TokensController>(TokensController);
  });

  it('createToken should call client with action new', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      token: 'new-token-abc',
      expiration_date: '01/01/26 00:00',
    });

    const result = await service.createToken({ username: 'demo' });
    expect(result.token).toBe('new-token-abc');
    expect(mockClient.execute).toHaveBeenCalledWith(
      'getApiToken',
      expect.objectContaining({ username: 'demo', action: 'new' }),
      undefined,
    );
  });

  it('getCurrentToken should call client with action current', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      token: 'current-token-xyz',
    });

    const result = await controller.getCurrentToken({ username: 'demo' });
    expect(result.token).toBe('current-token-xyz');
    expect(mockClient.execute).toHaveBeenCalledWith(
      'getApiToken',
      expect.objectContaining({ username: 'demo', action: 'current' }),
      undefined,
    );
  });
});
