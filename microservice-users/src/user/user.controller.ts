import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserMsg } from '../common/constants';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { IUser } from './interfaces/user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMsg.CREATE)
  async create(@Payload() userDTO: UserDTO) {
    try {
      const { phone, email } = userDTO;
      const exist = await this.findOneByPhoneOrEmail(phone, email);
      if (exist) return exist;

      return this.userService.create(userDTO);
    } catch (e) {
      console.log(e);
    }
  }

  @MessagePattern(UserMsg.FIND_ALL)
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern(UserMsg.FIND_ONE)
  async findOne(@Payload(new ParseMongoIdPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern(UserMsg.UPDATE)
  update(@Payload() payload: any): Promise<IUser> {
    try {
      return this.userService.update(payload.id, payload.userDTO);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern(UserMsg.DELETE)
  delete(@Payload(new ParseMongoIdPipe()) id: string) {
    return this.userService.remove(id);
  }

  @MessagePattern(UserMsg.VALID_USER)
  async validateUser(@Payload() payload) {
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: [`Email ${payload.email} hasn't exists`],
      };
    }

    const isValidPassword = await this.userService.checkPassword(
      payload.password,
      user.password,
    );

    if (user && isValidPassword) return user;

    return null;
  }

  async findOneByPhoneOrEmail(phone: string, email: string): Promise<any> {
    const value = await this.userService.findOneByPhoneOrEmail(phone, email);
    if (value) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: [`${value} already exists`],
      };
    }
    return null;
  }
}
