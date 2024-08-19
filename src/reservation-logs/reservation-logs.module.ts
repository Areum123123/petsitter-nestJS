import { Module } from '@nestjs/common';
import { ReservationLogsService } from './reservation-logs.service';
import { ReservationLogsController } from './reservation-logs.controller';
import { ReservationLog } from './entities/reservation-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationLog])],
  controllers: [ReservationLogsController],
  providers: [ReservationLogsService],
})
export class ReservationLogsModule {}
