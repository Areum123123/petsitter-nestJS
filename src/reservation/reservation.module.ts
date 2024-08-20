import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/entities/user.entity';
import { Petsitter } from 'src/petsitter/entities/petsitter.entity';
import { ReservationLog } from 'src/reservation-logs/entities/reservation-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, User, Petsitter, ReservationLog]),
    AuthModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
