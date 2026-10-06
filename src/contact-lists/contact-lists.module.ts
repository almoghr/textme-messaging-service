import { Module } from '@nestjs/common';
import { TextMeClientModule } from '../textme-client/textme-client.module';
import { ContactListsController } from './contact-lists.controller';
import { ContactListsService } from './contact-lists.service';

@Module({
  imports: [TextMeClientModule],
  controllers: [ContactListsController],
  providers: [ContactListsService],
  exports: [ContactListsService],
})
export class ContactListsModule {}
