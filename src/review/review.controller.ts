import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/auth/dto/req-user.dto';
import { GetReviewDto } from './dto/review-res.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  //본인 리뷰 조회 APi
  @Get('my')
  @UseGuards(AuthGuard())
  async getMyReview(@Req() req: CustomRequest): Promise<GetReviewDto> {
    const userId = req.user.id;
    const reviews = await this.reviewService.getMyReviews(userId);

    return {
      status: 200,
      message: '본인 리뷰조회 성공!',
      data: reviews,
    };
  }

  //본인 리뷰 수정 APi
  @Patch(':reviewId')
  @UseGuards(AuthGuard())
  async updateReview(
    @Param('reviewId') reviewId: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: CustomRequest,
  ): Promise<GetReviewDto> {
    const userId = req.user.id;

    const review = await this.reviewService.updateReview(
      reviewId,
      userId,
      updateReviewDto,
    );

    return {
      status: 200,
      message: '펫시터 리뷰 수정 성공!',
      data: review,
    };
  }
}
