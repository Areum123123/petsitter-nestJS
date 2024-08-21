import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../types/reservation-status.type';

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

export class UpdateStatusDTO {
  @IsEnum(Status)
  new_status: Status;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class CancelReservation {
  @IsOptional()
  @IsString()
  reason?: string;
}
