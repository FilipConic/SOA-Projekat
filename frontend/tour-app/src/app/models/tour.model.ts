export interface Tour {
  ID: string;
  Title: string;
  CreatorID: string;
  Description: string;
  Price: number;
  Duration: number;
  CreatedAt: string;
}

export interface ReviewTour {
  id: string;
  tour_id: string;
  tourist_id: string;
  rating: number;
  comment: string;
  visit_date: string;
  comment_date: string;
  images: string[];
}


export interface CreateReviewDTO {
  tourist_id: string;
  rating: number;
  comment: string;
  visit_date: string;
  images: string[];
}
