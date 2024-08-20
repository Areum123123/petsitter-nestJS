import { Injectable } from '@nestjs/common';
import { CreateReservationLogDto } from './dto/create-reservation-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationLog } from './entities/reservation-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationLogsService {
  constructor(
    @InjectRepository(ReservationLog)
    private readonly reservationLogRepository: Repository<ReservationLog>,
  ) {}

  async findAll() {
    const logs = await this.reservationLogRepository.find({
      relations: ['reservation', 'user'],
      order: { created_at: 'DESC' },
    });

    const results = logs.map((log) => ({
      log_id: log.id,
      user_id: log.user.id,
      reservation_id: log.reservation.id,
      old_status: log.old_status,
      new_status: log.new_status,
      reason: log.reason,
      createdAt: log.created_at.toISOString(),
    }));

    return results;
  }
}
