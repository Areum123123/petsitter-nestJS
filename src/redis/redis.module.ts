import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfig } from '../redis/redis.config';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot()], // ConfigModule을 루트 모듈로 설정
  providers: [
    RedisConfig,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisConfig = new RedisConfig(configService);
        return redisConfig.getClient();
      },
      inject: [ConfigService],
    },
    RedisService,
  ], // RedisConfig를 모듈의 프로바이더로 등록
  exports: ['REDIS_CLIENT', RedisService], // 다른 모듈에서도 RedisConfig를 사용할 수 있도록 내보내기
})
export class RedisModule {}
