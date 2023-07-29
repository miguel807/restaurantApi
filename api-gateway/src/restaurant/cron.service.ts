import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom, Observable } from 'rxjs';
import { ClientProxyRestaurant } from '../common/proxy/client-proxy';
import { RestaurantMSG } from '../common/constants';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly clientProxy: ClientProxyRestaurant,
    private readonly configService: ConfigService,
  ) {}

  private clientProxyRestaurant = this.clientProxy.ClientProxyRestaurant();

  // This task is for deleting all users every day at 9 am to have the restaurant empty for a new day.
  // But on the order table you have the registry of every client on your system.
  @Cron(CronExpression.EVERY_DAY_AT_9AM, {
    timeZone: 'America/Havana',
  })
  async taskRestaurant(): Promise<void> {
    try {
      this.logger.debug(
        `Starting task to microservices Restaurant at ${new Date().toISOString()}`,
      );
      await firstValueFrom(
        this.clientProxyRestaurant.send(RestaurantMSG.TASK, 'eeeeee'),
      );
    } catch (error) {
      this.logger.error(
        `Error send to microservices Restaurant: ${error.message}`,
      );
    }
  }
}
