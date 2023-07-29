import { CacheModule, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { AuthModule } from '../auth/auth.module';
import { RedisCacheModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisCacheModule,
    CacheModule.register({
      ttl: 15000, // miliseconds
      max: 100,
    }),
    ProxyModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
