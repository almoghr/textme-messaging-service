import { Module } from '@nestjs/common';
import { TextMeClientModule } from '../textme-client/textme-client.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TextMeClientModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
