import { IClient } from 'src/common/interfaces/client.interface';
import { IRestaurant } from './restaurant.interface';

export interface IOrder extends Document {
  _id?: string;
  description: string;
  client: IClient;
  restaurant: IRestaurant;
}
