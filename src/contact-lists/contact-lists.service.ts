import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import {
  ContactListMemberDto,
  CreateContactListDto,
  CreateContactListItemDto,
  CreateContactListResponseDto,
} from './dto/create-contact-list.dto';
import {
  GetAllContactListsDto,
  GetAllContactListsResponseDto,
  GetContactListByIdDto,
  GetContactListByIdResponseDto,
} from './dto/get-contact-lists.dto';
import {
  AddNumbersToContactListDto,
  ManageNumbersResponseDto,
  RemoveNumbersFromContactListDto,
} from './dto/manage-numbers-contact-list.dto';
import { RemoveContactListDto, RemoveContactListResponseDto } from './dto/remove-contact-list.dto';

@Injectable()
export class ContactListsService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Create one or more contact lists with optional pre-populated contacts and dynamic fields.
   */
  async createContactLists(
    dto: CreateContactListDto,
    options?: TextMeRequestOptions,
  ): Promise<CreateContactListResponseDto> {
    const formattedCl = dto.lists.map((list: CreateContactListItemDto) => {
      const item: Record<string, unknown> = {
        name: list.name,
      };

      if (list.contacts && list.contacts.length > 0) {
        item.destinations = {
          destination: list.contacts.map((c: ContactListMemberDto) => this.formatMember(c)),
        };
      }

      return item;
    });

    const payload: Record<string, unknown> = {
      cl: formattedCl.length === 1 ? formattedCl[0] : formattedCl,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, CreateContactListResponseDto>(
      TEXTME_OPERATIONS.CL_CREATE,
      payload,
      options,
    );
  }

  /**
   * Delete one or more contact lists by their IDs.
   */
  async removeContactLists(
    dto: RemoveContactListDto,
    options?: TextMeRequestOptions,
  ): Promise<RemoveContactListResponseDto> {
    const payload: Record<string, unknown> = {
      cl: {
        id: dto.cl_ids.length === 1 ? dto.cl_ids[0] : dto.cl_ids,
      },
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, RemoveContactListResponseDto>(
      TEXTME_OPERATIONS.CL_REMOVE,
      payload,
      options,
    );
  }

  /**
   * Add recipient numbers and dynamic fields to existing contact lists.
   */
  async addNumbers(
    dto: AddNumbersToContactListDto,
    options?: TextMeRequestOptions,
  ): Promise<ManageNumbersResponseDto> {
    const formattedCl = dto.lists.map((list) => ({
      id: list.cl_id,
      destinations: {
        destination: list.contacts.map((c: ContactListMemberDto) => this.formatMember(c)),
      },
    }));

    const payload: Record<string, unknown> = {
      cl: formattedCl.length === 1 ? formattedCl[0] : formattedCl,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, ManageNumbersResponseDto>(
      TEXTME_OPERATIONS.CL_ADD_NUMBERS,
      payload,
      options,
    );
  }

  /**
   * Remove recipient numbers from existing contact lists.
   */
  async removeNumbers(
    dto: RemoveNumbersFromContactListDto,
    options?: TextMeRequestOptions,
  ): Promise<ManageNumbersResponseDto> {
    const formattedCl = dto.lists.map((list) => ({
      id: list.cl_id,
      destinations: {
        destination: list.phones.map((p) => ({ phone: p })),
      },
    }));

    const payload: Record<string, unknown> = {
      cl: formattedCl.length === 1 ? formattedCl[0] : formattedCl,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, ManageNumbersResponseDto>(
      TEXTME_OPERATIONS.CL_REMOVE_NUMBERS,
      payload,
      options,
    );
  }

  /**
   * Get all contact lists and their basic metrics.
   */
  async getAllContactLists(
    dto?: GetAllContactListsDto,
    options?: TextMeRequestOptions,
  ): Promise<GetAllContactListsResponseDto> {
    const payload: Record<string, unknown> = {};
    if (dto?.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, GetAllContactListsResponseDto>(
      TEXTME_OPERATIONS.CL_GET_ALL,
      payload,
      options,
    );
  }

  /**
   * Get members and details of a specific contact list by ID.
   */
  async getContactListById(
    dto: GetContactListByIdDto,
    options?: TextMeRequestOptions,
  ): Promise<GetContactListByIdResponseDto> {
    const payload: Record<string, unknown> = {
      cl: {
        id: dto.cl_id,
      },
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, GetContactListByIdResponseDto>(
      TEXTME_OPERATIONS.CL_GET_BY_ID,
      payload,
      options,
    );
  }

  private formatMember(c: ContactListMemberDto): Record<string, unknown> {
    const dest: Record<string, unknown> = { phone: c.phone };
    if (c.df1) dest.df1 = c.df1;
    if (c.df2) dest.df2 = c.df2;
    if (c.df3) dest.df3 = c.df3;
    if (c.df4) dest.df4 = c.df4;
    if (c.df5) dest.df5 = c.df5;
    if (c.df6) dest.df6 = c.df6;
    return dest;
  }
}
