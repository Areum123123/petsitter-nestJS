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

export interface getPetsitterAndReview {
  petSitterName: string;
  experience: string;
  region: string;
  certification: string;
  total_rate: number;
  image_url: string;
  reviewDetails: {
    reviewId: number | string;
    userName: string; // 사용자 이름은 User 엔티티에 정의되어 있어야 합니다.
    rating: number | string;
    comment: string;
    createdAt: string | null;
    updatedAt: string | null;
  };
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
