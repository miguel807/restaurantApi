import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { Controller, HttpStatus } from '@nestjs/common';
import { RestaurantMSG } from '../common/constants';
import { IRestaurant } from '../common/interfaces/restaurant.interface';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @MessagePattern(RestaurantMSG.CREATE)
  async create(@Payload() restaurantDto: RestaurantDto): Promise<IRestaurant> {
    const exist = await this.findOneByName(restaurantDto.name);
    if (exist) return exist;
    return this.restaurantService.create(restaurantDto);
  }

  @MessagePattern(RestaurantMSG.FIND_ALL)
  findAll(): Promise<IRestaurant[]> {
    return this.restaurantService.findAll();
  }

  @MessagePattern(RestaurantMSG.FIND_ONE)
  async findOne(@Payload() id: string): Promise<any> {
    const restaurant = await this.restaurantService.findOne(id);
    if (!restaurant) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: [`The restaurant is not found`],
      };
    }
    return restaurant;
  }

  @MessagePattern(RestaurantMSG.UPDATE)
  async update(@Payload() payload): Promise<IRestaurant> {
    await this.restaurantService.findOne(payload.id);
    return this.restaurantService.update(
      payload.id,
      payload.updateRestaurantDto,
    );
  }

  @MessagePattern(RestaurantMSG.DELETE)
  async delete(@Payload() id: string) {
    const restaurant = await this.restaurantService.findOne(id);
    if (!restaurant) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: [`The restaurant is not found`],
      };
    }
    return this.restaurantService.delete(id);
  }

  @MessagePattern(RestaurantMSG.ADD_ORDER)
  async addRestaurantOrderToUser(@Payload() payload): Promise<any> {
    const restaurant = await this.findOne(payload.restaurantId);
    const users = restaurant.clients.map((client) => client._id.toString());
    if (
      !users.includes(payload.userId) &&
      restaurant.clients.length >= restaurant.capacity
    ) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: [`The restaurant has its ${restaurant.capacity} seats filled`],
      };
    }
    return this.restaurantService.addRestaurantOrderToUser(
      payload.restaurantId,
      payload.userId,
      payload.description,
    );
  }

  @MessagePattern(RestaurantMSG.TASK)
  task() {
    return this.restaurantService.task();
  }

  async findOneByName(name: string): Promise<any> {
    const value = await this.restaurantService.findOneByName(name);
    if (value) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: [`${value} already exists`],
      };
    }
    return null;
  }
}
