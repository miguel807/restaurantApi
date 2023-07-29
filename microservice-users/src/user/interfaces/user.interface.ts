export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  age: number;
  password: string;
}
