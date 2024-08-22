import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisConfig {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      maxRetriesPerRequest: null, // 요청 재시도 제한 없음
      lazyConnect: true, // 명시적으로 connect 호출 시 연결
    });
    this.initialize();
  }
  private async initialize() {
    try {
      await this.redisClient.connect();
      console.log('Redis connected successfully');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }

  // Redis 클라이언트 반환 메서드
  public getClient(): Redis {
    return this.redisClient;
  }
}
