// redis.module.ts
import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redis = new Redis({
          host: process.env.REDIS_HOST, // Redis 서버의 호스트 주소
          port: Number(process.env.REDIS_PORT), // Redis 서버의 포트 번호
        });
        return redis;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
