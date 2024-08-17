export class GetReviewDto {
  status: number;
  message: string;
  data: any;
}

export class getReviewResponse {
  reviewId: number;
  petSitterId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export class createReviewResponse {
  review_id: number;
  pet_sitter_id: number;
  reviews: {
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
  };
}
