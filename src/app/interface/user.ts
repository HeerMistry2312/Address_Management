import { Address } from './address';

export interface User {
  userid: number;
  username: string;
  email: string;
  address: Address[];
}
