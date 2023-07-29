import { RESTAURANT, ORDER, USER } from '../common/models/models';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { UserSchema, RestaurantSchema, OrderSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: RESTAURANT.name,
        useFactory: () =>
          RestaurantSchema /*.plugin(require('mongoose-autopopulate'))*/,
      },
      {
        name: USER.name,
        useFactory: () => UserSchema,
      },
      {
        name: ORDER.name,
        useFactory: () => OrderSchema,
      },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
