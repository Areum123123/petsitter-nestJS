import { Status } from '../types/reservation-status.type';

export interface GetReservationDto {
  status: number;
  message: string;
  data: any;
}

export interface bookingReservation {
  reservation_id: number;
  user_id: number;
  pet_details: {
    dog_name: string;
    dog_breed: string;
    dog_age: string;
    dog_weight: string;
    request_details?: string;
  };
  pet_sitter: {
    pet_sitter_id: number;
    name: string;
    booking_date: Date;
  };
  created_at: Date;
}

export interface getAllReservation {
  reservation_id: number;
  status: Status;
  pet_details: {
    name: string;
    breed: string;
    age: string;
    weight: string;
    request_details: string;
  };
  reservation_details: {
    user_name: string;
    phone_number: string;
    address: string;
  };
  petsitter_details: {
    name: string;
    region: string;
    booking_date: Date;
  };
  created_at: Date;
  updated_at: Date;
}

export interface cancelReservation {
  status: number;
  message: string;
  Id: string;
}
