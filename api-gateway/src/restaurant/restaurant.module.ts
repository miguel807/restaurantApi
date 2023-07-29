import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), ProxyModule],
  controllers: [RestaurantController],
  providers: [CronService],
})
export class RestaurantModule {}
