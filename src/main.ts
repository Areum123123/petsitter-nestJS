import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';

const PORT = process.env.PORT_NUMBER;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }), //dto를 사용하기 위해 꼭 필요한것
  );

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  await app.listen(PORT);
}
bootstrap();
