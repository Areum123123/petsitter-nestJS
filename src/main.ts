import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

const PORT = process.env.PORT_NUMBER;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }), //dto를 사용하기 위해 꼭 필요한것
  );

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  // Express 설정
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  await app.listen(PORT);
}
bootstrap();
