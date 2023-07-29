import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserDto } from '../user/dto/create-user.dto';
import { ErrorsInterceptor } from '../common/interceptors/errors.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto);
  }

  @Post('signup')
  async signUp(@Body() userDTO: UserDto) {
    return await this.authService.signUp(userDTO);
  }
}
