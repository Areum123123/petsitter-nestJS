import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsString()
  dog_name?: string;

  @IsOptional()
  @IsString()
  dog_breed?: string;

  @IsOptional()
  @IsString()
  dog_age?: string;

  @IsOptional()
  @IsString()
  dog_weight?: string;

  @IsOptional()
  @IsString()
  request_details?: string;

  @IsOptional()
  @IsString()
  booking_date?: string;
}
