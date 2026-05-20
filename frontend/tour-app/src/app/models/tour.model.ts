export interface Tour {
  ID: string;
  Title: string;
  CreatorID: string;
  Description: string;
  Price: number;
  Difficulty: string;
  Tags: string[];
  Status: 'draft' | 'published' | 'archived';
  Duration: number;
  CreatedAt: string;
}

export interface CreateTourDTO {
  Title: string;
  Description: string;
  Difficulty: string;
  Tags: string[];
}

export interface UpdateTourDTO {
  Title: string;
  Description: string;
  Difficulty: string;
  Tags: string[];
  Price: number;
  Duration: number;
  Status: 'draft' | 'published' | 'archived';
}

export interface CreateKeyPointDTO {
  Name: string;
  Description: string;
  Image: string;
  Latitude: number;
  Longitude: number;
}

export interface UpdateKeyPointDTO {
  Name?: string;
  Description?: string;
  Image?: string;
  Latitude?: number;
  Longitude?: number;
}

export interface KeyPoint {
  ID: string;
  TourID: string;
  Name: string;
  Description: string;
  Image: string;
  Latitude: number;
  Longitude: number;
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
