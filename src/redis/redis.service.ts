import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl); // TTL 설정
    } else {
      await this.redisClient.set(key, value); // 기본 설정
    }
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
