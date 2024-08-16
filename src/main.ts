import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }), //dto를 사용하기 위해 꼭 필요한것
  );

  // 모든 라우트에 `/api` 프리픽스 추가
  app.setGlobalPrefix('api');

  await app.listen(3020);
}
bootstrap();
