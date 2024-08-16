import { Module } from '@nestjs/common';
import { PetSitterService } from '../petsitter/petsitter.service';
import { PetSitterController } from './petsitter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetSitter } from './entities/petsitter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetSitter])],
  controllers: [PetSitterController],
  providers: [PetSitterService],
})
export class PetsitterModule {}
