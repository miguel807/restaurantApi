import { ValidRoles } from '../interfaces';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(UseGuards(AuthGuard('jwt')));
}
