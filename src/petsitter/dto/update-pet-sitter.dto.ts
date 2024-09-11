import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class UpdatePetSitterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  certification?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  total_rate?: string;

  @IsOptional()
  @IsString()
  image_url?: string;
}

export interface updatePetsitter {
  status: number;
  adminId: number;
  message: string;
}
