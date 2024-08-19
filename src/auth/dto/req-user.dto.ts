import { Request } from 'express';
import { Role } from 'src/user/types/user-role.type';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone_number: string;
  address: string;
  role: Role;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CustomRequest extends Request {
  user: User;
}
