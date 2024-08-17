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

@Controller('pet-sitters')
export class PetSitterController {
  constructor(
    private readonly petSitterService: PetSitterService,
    // private readonly reviewService: ReviewService,
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
  // @Post(':petSitterId/reviews')
  // async createReview(
  //   @Param('petSitterId') petSitterId: number,
  //   @Req() req: any, // 사용자 인증 정보가 있는 요청
  //   @Body() createReviewDto: CreateReviewDto,
  // ) {
  //   const userId = req.user.id; // 사용자 ID는 인증 미들웨어에서 설정한 값을 가져옵니다.
  //   const review = await this.reviewService.createReview(userId, petSitterId, createReviewDto);

  //   return {
  //     status: HttpStatus.CREATED,
  //     message: '리뷰가 성공적으로 작성되었습니다.',
  //     data: {
  //       review_id: review.id,
  //       pet_sitter_id: petSitterId,
  //       reviews: {
  //         user_name: req.user.name, // 사용자의 이름
  //         rating: review.rating,
  //         comment: review.comment,
  //         created_at: review.created_at.toISOString(),
  //         updated_at: review.updated_at.toISOString(),
  //       },
  //     },
  //   }}

  //펫시터생성 - 관리자만 할수있도록 수정필요
  @Post()
  async create(
    @Body() createPetSitterDto: CreatePetSitterDto,
  ): Promise<Petsitter> {
    return this.petSitterService.create(createPetSitterDto);
  }
}
