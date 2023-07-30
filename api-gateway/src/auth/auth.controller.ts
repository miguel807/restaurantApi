import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserDto } from '../user/dto/create-user.dto';

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
