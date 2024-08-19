import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/auth/dto/req-user.dto';
import { GetReservationDto } from './dto/reservation-res.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  //예약생성
  @Post()
  @UseGuards(AuthGuard())
  async reservationCreate(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: CustomRequest,
  ): Promise<GetReservationDto> {
    const userId = req.user.id;

    const result = await this.reservationService.bookingCreate(
      userId,
      createReservationDto,
    );

    return {
      status: 201,
      message: '예약이 접수 되었습니다. 펫시터의 승인을 기다리고 있습니다.',
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
