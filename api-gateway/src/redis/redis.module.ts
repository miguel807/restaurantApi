import {
  CacheStore,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisCacheService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
          // password: config.get("REDIS_PASSWORD")
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 60 * 60 * 24 * 7,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheModule, RedisCacheService],
})
export class RedisCacheModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public onModuleInit(): any {
    const logger = new Logger(RedisCacheModule.name);
  }
}
