import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetSitter } from '../petsitter/entities/petsitter.entity';
import { CreatePetSitterDto } from './dto/create-pet-sitter.dto';

@Injectable()
export class PetSitterService {
  constructor(
    @InjectRepository(PetSitter)
    private petSitterRepository: Repository<PetSitter>,
  ) {}

  //펫시터 목록 조회
  async getPetsitters(): Promise<PetSitter[]> {
    const result = this.petSitterRepository.find();
    return result;
  }

  //펫시터생성
  async create(createPetSitterDto: CreatePetSitterDto): Promise<PetSitter> {
    const petSitter = this.petSitterRepository.create(createPetSitterDto);
    return await this.petSitterRepository.save(petSitter);
  }
}
