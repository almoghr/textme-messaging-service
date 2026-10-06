import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import {
  EditBirthdayCampaignDto,
  EditBirthdayCampaignResponseDto,
  GetBirthdayCampaignsDto,
  GetBirthdayCampaignsResponseDto,
} from './dto/birthday-campaign.dto';
import {
  CancelCampaignByIdDto,
  CancelCampaignByNameDto,
  CancelCampaignResponseDto,
} from './dto/cancel-campaign.dto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post('cancel-by-id')
  @HttpCode(HttpStatus.OK)
  async cancelById(@Body() dto: CancelCampaignByIdDto): Promise<CancelCampaignResponseDto> {
    return this.campaignsService.cancelById(dto);
  }

  @Post('cancel-by-name')
  @HttpCode(HttpStatus.OK)
  async cancelByName(@Body() dto: CancelCampaignByNameDto): Promise<CancelCampaignResponseDto> {
    return this.campaignsService.cancelByName(dto);
  }

  @Post('birthday')
  @HttpCode(HttpStatus.OK)
  async getBirthdayCampaigns(@Body() dto: GetBirthdayCampaignsDto): Promise<GetBirthdayCampaignsResponseDto> {
    return this.campaignsService.getBirthdayCampaigns(dto);
  }

  @Post('birthday/edit')
  @HttpCode(HttpStatus.OK)
  async editBirthdayCampaign(@Body() dto: EditBirthdayCampaignDto): Promise<EditBirthdayCampaignResponseDto> {
    return this.campaignsService.editBirthdayCampaign(dto);
  }
}
