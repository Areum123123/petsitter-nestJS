import { Test, TestingModule } from '@nestjs/testing';
import { PetsitterController } from './petsitter.controller';
import { PetsitterService } from './petsitter.service';

describe('PetsitterController', () => {
  let controller: PetsitterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetsitterController],
      providers: [PetsitterService],
    }).compile();

    controller = module.get<PetsitterController>(PetsitterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
