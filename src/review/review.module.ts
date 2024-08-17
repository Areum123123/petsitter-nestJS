import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from 'src/user/user.module';
// import { PetsitterModule } from 'src/petsitter/petsitter.module';
import { Petsitter } from 'src/petsitter/entities/petsitter.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Petsitter, User]),
    // PetsitterModule,
    // UserModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
