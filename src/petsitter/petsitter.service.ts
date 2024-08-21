import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Petsitter } from '../petsitter/entities/petsitter.entity';
import { CreatePetSitterDto } from './dto/create-pet-sitter.dto';
import { Review } from 'src/review/entities/review.entity';
import { getReviewResponse } from 'src/review/dto/review-res.dto';
import Redis from 'ioredis';

@Injectable()
export class PetSitterService {
  constructor(
    @InjectRepository(Petsitter)
    private petSitterRepository: Repository<Petsitter>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  //펫시터 목록 조회
  async getPetsitters(
    name?: string,
    region?: string,
    experience?: string,
  ): Promise<Petsitter[]> {
    const cacheKey = `petsitters:${name || ''}:${region || ''}:${experience || ''}`;
    const startCacheTime = Date.now(); //캐시타임

    // Redis에서 캐시된 데이터 가져오기
    const cachedData = await this.redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Cache hit'); // 캐시에서 데이터 조회
      console.log(`Cache lookup time: ${Date.now() - startCacheTime} ms`); //캐시타임
      return JSON.parse(cachedData);
    }

    console.log('Cache miss'); // 캐시에서 데이터 없음, DB 조회

    const where: any = {};

    if (name) {
      where.name = Like(`%${name}%`);
    }

    if (region) {
      where.region = Like(`%${region}%`);
    }

    if (experience) {
      where.experience = Like(`%${experience}%`);
    }
    // 데이터베이스에서 데이터 조회
    const dbStartTime = Date.now(); //데이터베이스타임
    const result = await this.petSitterRepository.find({
      where,
      order: {
        created_at: 'DESC',
      },
    });

    console.log(`Database query time: ${Date.now() - dbStartTime} ms`);
    // Redis에 데이터 캐싱 (1시간 동안 유효)
    console.log('Caching data:', result); // 데이터 캐시 전에 로그 추가
    await this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600);

    return result;
  }

  //펫시터 리뷰 조회
  async getReviews(petsitterId: number): Promise<getReviewResponse[]> {
    // 펫시터가 존재하는지 확인
    const petsitter = await this.petSitterRepository.findOne({
      where: { id: petsitterId },
      relations: ['reviews', 'reviews.user'], // 리뷰와 관련된 사용자도 포함
    });

    if (!petsitter) {
      throw new NotFoundException('펫시터를 찾을 수 없습니다.');
    }

    // 리뷰를 created_at 기준으로 내림차순 정렬
    const sortedReviews = petsitter.reviews.sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime(),
    );

    // 리뷰 변환
    return sortedReviews.map((review) => ({
      reviewId: review.id,
      petSitterId: petsitterId,
      userName: review.user.name, // 사용자 이름은 User 엔티티에 정의되어 있어야 합니다.
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at.toISOString(),
      updatedAt: review.updated_at.toISOString(),
    }));
  }
  //펫시터생성
  async create(createPetSitterDto: CreatePetSitterDto): Promise<Petsitter> {
    const petSitter = this.petSitterRepository.create(createPetSitterDto);
    return await this.petSitterRepository.save(petSitter);
  }
}
