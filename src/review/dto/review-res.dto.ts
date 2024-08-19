export interface GetReviewDto {
  status: number;
  message: string;
  data: any;
}

export interface getReviewResponse {
  reviewId: number;
  petSitterId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface createReviewResponse {
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

export interface getMyReviewResponse {
  review_id: number;
  user_id: number;
  reviews: {
    petsitter_name: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
  };
}
