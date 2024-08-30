import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationLog } from './entities/reservation-log.entity';
import { Like, Repository } from 'typeorm';
import { LogResponse, ReservationLogResponse } from './dto/log-response.dto';
import { Status } from 'src/reservation/types/reservation-status.type';

@Injectable()
export class ReservationLogsService {
  constructor(
    @InjectRepository(ReservationLog)
    private readonly reservationLogRepository: Repository<ReservationLog>,
  ) {}

  async findAll(new_status?: Status): Promise<ReservationLogResponse[]> {
    const where: any = {};

    if (new_status) {
      where.new_status = Like(`%${new_status}%`);
    }

    const logs = await this.reservationLogRepository.find({
      where,
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
