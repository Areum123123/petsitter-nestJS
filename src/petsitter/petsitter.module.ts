import { forwardRef, Module } from '@nestjs/common';
import { PetSitterService } from './petsitter.service';
import { PetSitterController } from './petsitter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Petsitter } from './entities/petsitter.entity';
import { AuthModule } from '../auth/auth.module';
import { ReviewModule } from '../review/review.module'; // Make sure this is correct
import { UserModule } from '../user/user.module';
import { ReviewService } from '../review/review.service'; // Importing this just for completeness
import { Review } from 'src/review/entities/review.entity';
import { RedisModule } from 'src/redis/redis.module';
import { PetsitterRenderController } from './petsitter-render.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Petsitter, Review]),
    AuthModule,
    RedisModule,
    forwardRef(() => ReviewModule), // Use forwardRef if there's a circular dependency
    forwardRef(() => UserModule),
  ],
  controllers: [PetSitterController, PetsitterRenderController],
  providers: [PetSitterService],
  exports: [TypeOrmModule, PetSitterService],
})
export class PetsitterModule {}
