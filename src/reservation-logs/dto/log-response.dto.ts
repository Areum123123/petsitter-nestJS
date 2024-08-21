import { Status } from '../../reservation/types/reservation-status.type';

export class LogResponse {
  status: number;
  message: string;
  data: any;
}

export class ReservationLogResponse {
  log_id: number;
  user_id: number;
  reservation_id: number;
  old_status: Status;
  new_status: Status;
  reason: string;
  createdAt: string;
}
