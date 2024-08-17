import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { PetSitterService } from '../petsitter/petsitter.service';
import { CreatePetSitterDto } from './dto/create-pet-sitter.dto';
import { Petsitter } from '../petsitter/entities/petsitter.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('pet-sitters')
export class PetSitterController {
  constructor(private readonly petSitterService: PetSitterService) {}

  //펫시터 목록 조회
  @UseGuards(AuthGuard()) //인증된사용자만 사용할수있게(authmiddlware)
  @Get()
  async getPetsitters(): Promise<{
    status: number;
    message: string;
    data: any[];
  }> {
    const petSitters = await this.petSitterService.getPetsitters();

    const formattedPetSitters = petSitters.map((petSitter) => ({
      petSitterId: petSitter.id,
      name: petSitter.name,
      experience: petSitter.experience,
      certification: petSitter.certification,
      region: petSitter.region,
      total_rate: petSitter.total_rate,
      image_url: petSitter.image_url,
      created_at: petSitter.created_at,
      updated_at: petSitter.updated_at,
    }));
    return {
      status: 200,
      message: '펫시터 목록 조회 성공',
      data: formattedPetSitters,
    };
  }

  //펫시터생성 - 관리자만 할수있도록 수정필요
  @Post()
  async create(
    @Body() createPetSitterDto: CreatePetSitterDto,
  ): Promise<Petsitter> {
    return this.petSitterService.create(createPetSitterDto);
  }
}
