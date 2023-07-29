import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  if (data && !Array.isArray(data)) {
    data = [data];
  }

  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  if (!user) throw new InternalServerErrorException('User not found (request)');
  if (data) {
    const response = {};
    for (const dataKey in data) {
      response[data[dataKey]] = user[data[dataKey]];
    }
    return response;
  }
  return user;
});
