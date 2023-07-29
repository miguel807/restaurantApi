import { IClient } from 'src/common/interfaces/client.interface';
export interface IRestaurant extends Document {
  _id?: string;
  name: string;
  address: string;
  capacity: number;
  clients: IClient[];
}
