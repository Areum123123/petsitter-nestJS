import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Petsitter } from '../petsitter/entities/petsitter.entity';
import { CreatePetSitterDto } from './dto/create-pet-sitter.dto';

@Injectable()
export class PetSitterService {
  constructor(
    @InjectRepository(Petsitter)
    private petSitterRepository: Repository<Petsitter>,
  ) {}

  //펫시터 목록 조회
  async getPetsitters(): Promise<Petsitter[]> {
    const result = this.petSitterRepository.find();
    return result;
  }

  //펫시터생성
  async create(createPetSitterDto: CreatePetSitterDto): Promise<Petsitter> {
    const petSitter = this.petSitterRepository.create(createPetSitterDto);
    return await this.petSitterRepository.save(petSitter);
  }
}
