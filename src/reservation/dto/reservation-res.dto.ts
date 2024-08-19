export interface GetReservationDto {
  status: number;
  message: string;
  data: any;
}

export interface createReservationDto {
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
