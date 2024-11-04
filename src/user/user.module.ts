import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { S3Service } from './s3/s3.service';
import { UserRenderController } from './user-render.controller';
// import { PetsitterModule } from 'src/petsitter/petsitter.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController, UserRenderController],
  providers: [UserService, S3Service],
  exports: [UserService], // UserService를 다른 모듈에서 사용할 수 있도록 export
})
export class UserModule {}
