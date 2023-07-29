import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyRestaurant {
  constructor(private readonly config: ConfigService) {}

  ClientProxyUsers(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: this.config.get('REDIS_HOST'),
        port: this.config.get('REDIS_PORT'),
      },
    });
  }

  ClientProxyRestaurant(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: this.config.get('REDIS_HOST'),
        port: this.config.get('REDIS_PORT'),
      },
    });
  }
}
