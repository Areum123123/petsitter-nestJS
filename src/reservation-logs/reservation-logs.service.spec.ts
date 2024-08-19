import { Test, TestingModule } from '@nestjs/testing';
import { ReservationLogsService } from './reservation-logs.service';

describe('ReservationLogsService', () => {
  let service: ReservationLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationLogsService],
    }).compile();

    service = module.get<ReservationLogsService>(ReservationLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
