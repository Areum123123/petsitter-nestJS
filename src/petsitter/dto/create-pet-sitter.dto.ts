import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreatePetSitterDto {
  @IsString()
  name: string;

  @IsString()
  experience: string;

  @IsString()
  certification: string;

  @IsString()
  region: string;

  @IsOptional()
  @IsNumber()
  total_rate?: number;

  @IsString()
  image_url: string;
}
