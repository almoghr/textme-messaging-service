import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ContactListsService } from './contact-lists.service';
import { CreateContactListDto, CreateContactListResponseDto } from './dto/create-contact-list.dto';
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

@Controller('contact-lists')
export class ContactListsController {
  constructor(private readonly contactListsService: ContactListsService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createContactLists(@Body() dto: CreateContactListDto): Promise<CreateContactListResponseDto> {
    return this.contactListsService.createContactLists(dto);
  }

  @Post('remove')
  @HttpCode(HttpStatus.OK)
  async removeContactLists(@Body() dto: RemoveContactListDto): Promise<RemoveContactListResponseDto> {
    return this.contactListsService.removeContactLists(dto);
  }

  @Post('add-numbers')
  @HttpCode(HttpStatus.OK)
  async addNumbers(@Body() dto: AddNumbersToContactListDto): Promise<ManageNumbersResponseDto> {
    return this.contactListsService.addNumbers(dto);
  }

  @Post('remove-numbers')
  @HttpCode(HttpStatus.OK)
  async removeNumbers(@Body() dto: RemoveNumbersFromContactListDto): Promise<ManageNumbersResponseDto> {
    return this.contactListsService.removeNumbers(dto);
  }

  @Post('all')
  @HttpCode(HttpStatus.OK)
  async getAllContactLists(@Body() dto: GetAllContactListsDto): Promise<GetAllContactListsResponseDto> {
    return this.contactListsService.getAllContactLists(dto);
  }

  @Post('by-id')
  @HttpCode(HttpStatus.OK)
  async getContactListById(@Body() dto: GetContactListByIdDto): Promise<GetContactListByIdResponseDto> {
    return this.contactListsService.getContactListById(dto);
  }
}
