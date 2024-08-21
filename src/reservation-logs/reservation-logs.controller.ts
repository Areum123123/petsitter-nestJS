import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ReservationLogsService } from './reservation-logs.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/user-role.type';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { LogResponse } from './dto/log-response.dto';

@Controller('reservation-logs')
export class ReservationLogsController {
  reservationLogRepository: any;
  constructor(
    private readonly reservationLogsService: ReservationLogsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN) // 관리자만 접근 가능
  async getReservationLogs(): Promise<LogResponse> {
    try {
      const logs = await this.reservationLogsService.findAll();
      return {
        status: 200,
        message: '예약 로그 목록 조회 성공!',
        data: logs,
      };
    } catch (error) {
      throw new HttpException(
        '예약 로그 조회 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
