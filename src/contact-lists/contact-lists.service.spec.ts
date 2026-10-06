import { Test, TestingModule } from '@nestjs/testing';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { ContactListsController } from './contact-lists.controller';
import { ContactListsService } from './contact-lists.service';

describe('ContactListsService & ContactListsController', () => {
  let service: ContactListsService;
  let controller: ContactListsController;
  let mockClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactListsController],
      providers: [
        ContactListsService,
        {
          provide: TextMeClientService,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<ContactListsService>(ContactListsService);
    controller = module.get<ContactListsController>(ContactListsController);
  });

  it('createContactLists should call client with newCL and formatted members', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      cl_id: 'cl-101',
    });

    const result = await service.createContactLists({
      lists: [
        {
          name: 'VIP Customers',
          contacts: [{ phone: '0501234567', df1: 'VIP' }],
        },
      ],
    });

    expect(result.cl_id).toBe('cl-101');
    expect(mockClient.execute).toHaveBeenCalledWith(
      'newCL',
      expect.objectContaining({
        cl: expect.objectContaining({ name: 'VIP Customers' }),
      }),
      undefined,
    );
  });

  it('removeContactLists should call client with removeCL', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'deleted',
    });

    const result = await controller.removeContactLists({ cl_ids: ['cl-101'] });
    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'removeCL',
      expect.objectContaining({ cl: { id: 'cl-101' } }),
      undefined,
    );
  });

  it('addNumbers should call client with addNumCL', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      message: 'added',
    });

    const result = await controller.addNumbers({
      lists: [
        {
          cl_id: 'cl-101',
          contacts: [{ phone: '0501234567' }],
        },
      ],
    });

    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'addNumCL',
      expect.anything(),
      undefined,
    );
  });

  it('getAllContactLists should call client with getCL', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      contact_lists: [],
    });

    const result = await controller.getAllContactLists({});
    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'getCL',
      expect.anything(),
      undefined,
    );
  });

  it('getContactListById should call client with getCLbyID', async () => {
    mockClient.execute.mockResolvedValueOnce({
      status: 0,
      contact_list: { id: 'cl-101', name: 'VIP' },
    });

    const result = await controller.getContactListById({ cl_id: 'cl-101' });
    expect(result.status).toBe(0);
    expect(mockClient.execute).toHaveBeenCalledWith(
      'getCLbyID',
      expect.objectContaining({ cl: { id: 'cl-101' } }),
      undefined,
    );
  });
});
