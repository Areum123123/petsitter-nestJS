import { Test, TestingModule } from '@nestjs/testing';
import { PetSitterController } from './petsitter.controller';
import { PetSitterService } from './petsitter.service';

describe('PetsitterController', () => {
  let controller: PetSitterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetSitterController],
      providers: [PetSitterService],
    }).compile();

    controller = module.get<PetSitterController>(PetSitterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
