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
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { reviewRenderController } from './review-render.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Petsitter, User, Reservation]),
    AuthModule,
    // PetsitterModule,
    // UserModule,
  ],
  controllers: [ReviewController, reviewRenderController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
