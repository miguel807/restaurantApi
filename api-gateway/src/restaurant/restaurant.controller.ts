import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Observable, firstValueFrom } from 'rxjs';
import { IRestaurant } from './interfaces/restaurant.interface';
import { RestaurantMSG, UserMSG } from '../common/constants';
import { ClientProxyRestaurant } from '../common/proxy/client-proxy';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators';
import { IUser } from '../user/interfaces/user.interface';
import { AddOrderRestaurantDto } from './dto/add-order-restaurant.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly clientProxy: ClientProxyRestaurant) {}

  private clientProxyRestaurant = this.clientProxy.ClientProxyRestaurant();
  private clientProxyUser = this.clientProxy.ClientProxyUsers();

  @Post()
  create(@Body() restaurantDto: CreateRestaurantDto): Observable<IRestaurant> {
    return this.clientProxyRestaurant.send(RestaurantMSG.CREATE, restaurantDto);
  }

  @Get()
  findAll(): Observable<IRestaurant[]> {
    return this.clientProxyRestaurant.send(RestaurantMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IRestaurant> {
    return this.clientProxyRestaurant.send(RestaurantMSG.FIND_ONE, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Observable<IRestaurant> {
    return this.clientProxyRestaurant.send(RestaurantMSG.UPDATE, {
      id,
      updateRestaurantDto,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<any> {
    return this.clientProxyRestaurant.send(RestaurantMSG.DELETE, id);
  }

  @Post(':id/addOrderToUser')
  async addRestaurantOrderToUser(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() addOrderRestaurantDto: AddOrderRestaurantDto,
  ) {
    const client: IUser = await firstValueFrom(
      this.clientProxyUser.send(UserMSG.FIND_ONE, user.userId),
    );

    if (!client)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    if (client.age < 18)
      throw new HttpException(
        'You must be at least 18 years old to perform this action',
        HttpStatus.NOT_FOUND,
      );

    return this.clientProxyRestaurant.send(RestaurantMSG.ADD_ORDER, {
      restaurantId: id,
      userId: user.userId,
      description: addOrderRestaurantDto.description,
    });
  }
}
