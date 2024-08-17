// user.dto.ts
import { Exclude, Expose } from 'class-transformer';
import { User } from '../entities/user.entity';

export class GetUserDto {
  status: number;
  message: string;
  data: any;
}
