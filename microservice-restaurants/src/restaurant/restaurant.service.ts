import { RestaurantDto } from './dto/restaurant.dto';
import { ORDER, RESTAURANT } from '../common/models/models';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRestaurant } from 'src/common/interfaces/restaurant.interface';
import { IOrder } from '../common/interfaces/order.interface';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(RESTAURANT.name)
    private readonly modelRestaurant: Model<IRestaurant>,
    @InjectModel(ORDER.name)
    private readonly modelOrder: Model<IOrder>,
  ) {}

  async create(restaurantDto: RestaurantDto): Promise<IRestaurant> {
    const newRestaurant = new this.modelRestaurant(restaurantDto);
    return await newRestaurant.save();
  }

  async findAll(): Promise<IRestaurant[]> {
    return this.modelRestaurant.find().populate('clients').select('-__v');
  }

  async findOne(id: string): Promise<IRestaurant> {
    return this.modelRestaurant.findById(id).populate('clients');
  }

  async update(id: string, restaurantDto: RestaurantDto): Promise<IRestaurant> {
    return this.modelRestaurant.findByIdAndUpdate(id, restaurantDto, {
      new: true,
    });
  }

  async delete(id: string) {
    await this.modelRestaurant.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }

  async addRestaurantOrderToUser(
    restaurantId: string,
    userId: string,
    description: string,
  ): Promise<IRestaurant> {
    await this.modelRestaurant.findByIdAndUpdate(
      restaurantId,
      {
        $addToSet: { clients: userId },
      },
      { new: true },
    );

    const newOrder = new this.modelOrder({
      client: userId,
      restaurant: restaurantId,
      description,
    });
    const userOrder = await this.modelOrder.create(newOrder);
    return userOrder.populate(['client', 'restaurant']);
  }

  async task() {
    return this.modelRestaurant.updateMany({}, { $unset: { clients: 1 } });
  }

  async findOneByName(name: string) {
    return this.modelRestaurant.findOne(
      { name },
      {
        foundBy: {
          $cond: {
            if: { $eq: ['$name', name] },
            then: 'name',
            else: null,
          },
        },
      },
    );
  }
}
