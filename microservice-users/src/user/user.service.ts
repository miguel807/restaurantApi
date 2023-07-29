import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { IUser } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from '../common/models/models';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) {}

  async findByEmail(email: string): Promise<IUser> {
    return this.model.findOne({ email });
  }

  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return bcrypt.compare(password, passwordDB);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(userDto: UserDTO): Promise<IUser> {
    try {
      const hash = await this.hashPassword(userDto.password);
      const newUser = new this.model({ ...userDto, password: hash });
      return await newUser.save();
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(): Promise<IUser[]> {
    return this.model.find();
  }

  findOne(id: string): Promise<IUser> {
    return this.model.findById(id);
  }

  async update(id: string, updateUserDto: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(updateUserDto.password);
    const user = { ...updateUserDto, password: hash };
    return await this.model.findByIdAndUpdate(id, user, { new: true });
  }

  remove(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  findOneByPhoneOrEmail(phone: string, email: string) {
    return this.model.findOne(
      {
        $or: [{ email }, { phone }],
      },
      {
        foundBy: {
          $cond: {
            if: { $eq: ['$email', email] },
            then: 'email',
            else: {
              $cond: {
                if: { $eq: ['$phone', phone] },
                then: 'phone',
                else: null,
              },
            },
          },
        },
      },
    );
  }
}
