import { Module } from '@nestjs/common';
import { ReservationLogsService } from './reservation-logs.service';
import { ReservationLogsController } from './reservation-logs.controller';
import { ReservationLog } from './entities/reservation-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationLog]), AuthModule],
  controllers: [ReservationLogsController],
  providers: [ReservationLogsService],
})
export class ReservationLogsModule {}
