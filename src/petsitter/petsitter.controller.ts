import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Req,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PetSitterService } from '../petsitter/petsitter.service';
import { CreatePetSitterDto } from './dto/create-pet-sitter.dto';
import { Petsitter } from '../petsitter/entities/petsitter.entity';
import { AuthGuard } from '@nestjs/passport';
import { ReviewService } from 'src/review/review.service';
import { CustomRequest } from 'src/auth/dto/req-user.dto';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { GetReviewDto } from 'src/review/dto/review-res.dto';

@Controller('pet-sitters')
export class PetSitterController {
  constructor(
    private readonly petSitterService: PetSitterService,
    private readonly reviewService: ReviewService,
  ) {}

  //펫시터 목록 조회

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

  //펫시터 리뷰
  @Post(':petSitterId/reviews')
  @UseGuards(AuthGuard())
  async createReview(
    @Param('petSitterId') petSitterId: number,
    @Req() req: CustomRequest, // 사용자 인증 정보가 있는 요청
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<GetReviewDto> {
    const userId = req.user.id;
    const review = await this.reviewService.createReview(
      userId,
      petSitterId,
      createReviewDto,
      // req,
    );

    return {
      status: 201,
      message: '리뷰가 성공적으로 작성되었습니다.',
      data: review,
    };
  }

  //펫시터 리뷰 조회
  @Get(':petSitterId/reviews')
  async getReviews(@Param('petSitterId') petSitterId: number) {
    const reviews = await this.petSitterService.getReviews(petSitterId);

    return {
      status: 200,
      message: '펫시터 리뷰 조회 성공',
      data: reviews,
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
