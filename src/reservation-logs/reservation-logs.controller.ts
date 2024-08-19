import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationLogsService } from './reservation-logs.service';
import { CreateReservationLogDto } from './dto/create-reservation-log.dto';

@Controller('reservation-logs')
export class ReservationLogsController {
  constructor(
    private readonly reservationLogsService: ReservationLogsService,
  ) {}
}
