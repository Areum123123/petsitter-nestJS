import { Test, TestingModule } from '@nestjs/testing';
import { ReservationLogsController } from './reservation-logs.controller';
import { ReservationLogsService } from './reservation-logs.service';

describe('ReservationLogsController', () => {
  let controller: ReservationLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationLogsController],
      providers: [ReservationLogsService],
    }).compile();

    controller = module.get<ReservationLogsController>(ReservationLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
