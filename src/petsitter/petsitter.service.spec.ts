import { Test, TestingModule } from '@nestjs/testing';
import { PetSitterService } from './petsitter.service';

describe('PetsitterService', () => {
  let service: PetSitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetSitterService],
    }).compile();

    service = module.get<PetSitterService>(PetSitterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
