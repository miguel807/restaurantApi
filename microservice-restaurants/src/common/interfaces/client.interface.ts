export interface IClient extends Document {
  _id?: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  password: string;
}
