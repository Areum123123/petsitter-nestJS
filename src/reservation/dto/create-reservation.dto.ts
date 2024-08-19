import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  pet_sitter_id: number;

  @IsNotEmpty()
  @IsString()
  dog_name: string;

  @IsNotEmpty()
  @IsString()
  dog_breed: string;

  @IsNotEmpty()
  @IsString()
  dog_age: string;

  @IsNotEmpty()
  @IsString()
  dog_weight: string;

  @IsOptional()
  @IsString()
  request_details?: string;

  @IsNotEmpty()
  @IsDateString()
  booking_date: string;
}
