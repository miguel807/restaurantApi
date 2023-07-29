import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/create-user.dto';
import { ClientProxyRestaurant } from '../common/proxy/client-proxy';
import { UserMSG } from '../common/constants';
import { firstValueFrom, Observable } from 'rxjs';
import { IUser } from '../user/interfaces/user.interface';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisCacheService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxyRestaurant,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  private clientProxyUser = this.clientProxy.ClientProxyUsers();

  async validateUser(email: string, password: string): Promise<any> {
    const user = await firstValueFrom(
      this.clientProxyUser.send(UserMSG.VALID_USER, {
        email,
        password,
      }),
    );
    if (user) return user;

    return null;
  }

  async signIn(loginUserDto: CreateAuthDto) {
    const { password, email } = loginUserDto;
    const user: any = await this.validateUser(email, password);
    if (user.error) {
      throw new BadRequestException(user.error, user.status);
    }

    if (!user) throw new UnauthorizedException('Credentials are not valid');
    const payload = {
      email: user.email,
      _id: user._id,
    };

    await this.redisCacheService.set('signin', {
      ...payload,
      access_token: this.jwtService.sign(payload),
    });

    return { ...payload, access_token: this.jwtService.sign(payload) };
  }

  signUp(userDto: UserDto): Observable<IUser> {
    try {
      return this.clientProxyUser.send(UserMSG.CREATE, userDto);
    } catch (e) {
      console.log(e);
    }
  }
}
