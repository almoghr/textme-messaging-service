import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
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

@Injectable()
export class CampaignsService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Cancel a scheduled campaign by its numerical campaign ID.
   */
  async cancelById(dto: CancelCampaignByIdDto, options?: TextMeRequestOptions): Promise<CancelCampaignResponseDto> {
    const payload: Record<string, unknown> = {
      campaign_id: dto.campaign_id,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, CancelCampaignResponseDto>(
      TEXTME_OPERATIONS.CAMPAIGN_CANCEL,
      payload,
      options,
    );
  }

  /**
   * Cancel all matching campaigns by their campaign name handle.
   */
  async cancelByName(
    dto: CancelCampaignByNameDto,
    options?: TextMeRequestOptions,
  ): Promise<CancelCampaignResponseDto> {
    const payload: Record<string, unknown> = {
      campaign_name: dto.campaign_name,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, CancelCampaignResponseDto>(
      TEXTME_OPERATIONS.CAMPAIGN_CANCEL,
      payload,
      options,
    );
  }

  /**
   * List all configured birthday campaigns for the account.
   */
  async getBirthdayCampaigns(
    dto?: GetBirthdayCampaignsDto,
    options?: TextMeRequestOptions,
  ): Promise<GetBirthdayCampaignsResponseDto> {
    const payload: Record<string, unknown> = {};
    if (dto?.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, GetBirthdayCampaignsResponseDto>(
      TEXTME_OPERATIONS.CAMPAIGN_BIRTHDAY_LIST,
      payload,
      options,
    );
  }

  /**
   * Update the message template on a birthday campaign.
   */
  async editBirthdayCampaign(
    dto: EditBirthdayCampaignDto,
    options?: TextMeRequestOptions,
  ): Promise<EditBirthdayCampaignResponseDto> {
    const payload: Record<string, unknown> = {
      campaign_id: dto.campaign_id,
      message: dto.message,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, EditBirthdayCampaignResponseDto>(
      TEXTME_OPERATIONS.CAMPAIGN_BIRTHDAY_EDIT,
      payload,
      options,
    );
  }
}
