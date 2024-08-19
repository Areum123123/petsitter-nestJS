import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Petsitter } from 'src/petsitter/entities/petsitter.entity';
import { User } from 'src/user/entities/user.entity';
import { CustomRequest } from 'src/auth/dto/req-user.dto';
import {
  createReviewResponse,
  getMyReviewResponse,
} from './dto/review-res.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { error } from 'console';

@Injectable()
export class ReviewService {
  findOne(reviewId: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Petsitter)
    private readonly petsitterRepository: Repository<Petsitter>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createReview(
    userId: number,
    petSitterId: number,
    createReviewDto: CreateReviewDto,
    // req: CustomRequest,
  ): Promise<createReviewResponse> {
    const petsitter = await this.petsitterRepository.findOne({
      where: { id: petSitterId },
    });
    if (!petsitter) {
      throw new NotFoundException('펫시터를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    const review = this.reviewRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      petsitter,
      user,
    });

    console.log(review);

    await this.reviewRepository.save(review);

    const result = {
      review_id: review.id,
      pet_sitter_id: petSitterId,
      reviews: {
        user_name: review.user.name, // 사용자의 이름
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at.toISOString(),
        updated_at: review.updated_at.toISOString(),
      },
    };

    return result;
  }

  //본인리뷰조회
  async getMyReviews(userId: number): Promise<getMyReviewResponse[]> {
    const reviews = await this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['petsitter'],
    });

    return reviews.map((review) => ({
      review_id: review.id,
      user_id: userId,
      reviews: {
        petsitter_name: review.petsitter.name,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at.toISOString(),
        updated_at: review.updated_at.toISOString(),
      },
    }));
  }

  //리뷰 수정
  async updateReview(
    reviewId: number,
    userId: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<getMyReviewResponse> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
      relations: ['petsitter', 'user'],
    });

    if (!review) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }

    // 리뷰 수정
    review.rating = updateReviewDto.rating;
    review.comment = updateReviewDto.comment;
    review.updated_at = new Date(); // 수정 시간 갱신

    const savedReview = await this.reviewRepository.save(review);

    return {
      review_id: savedReview.id,
      user_id: userId,
      reviews: {
        petsitter_name: review.petsitter.name,
        rating: savedReview.rating,
        comment: savedReview.comment,
        created_at: savedReview.created_at.toISOString(),
        updated_at: savedReview.updated_at.toISOString(),
      },
    };
  }

  //리뷰삭제
  async deleteReivew(reviewId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
        user: { id: userId },
      },
    });

    if (!review) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }

    await this.reviewRepository.remove(review);
  }
}
