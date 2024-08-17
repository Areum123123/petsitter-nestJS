import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone_number: string;
  address: string;
  role: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CustomRequest extends Request {
  user: User;
}
