export interface Tour {
  id: string;
  Title: string;
  CreatorID: string;
  Description: string;
  Price: number;
  Difficulty: TourDifficulty;
  Tags: string[];
  status: 'draft' | 'published' | 'archived';
  Duration: number;
  CreatedAt: string;
  distance_km?: number;
  Keypoints?: KeyPoint[];
}

export enum TourDifficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
}

export interface CreateTourDTO {
  title: string;
  description: string;
  difficulty: TourDifficulty;
  tags: string[];
}

export interface UpdateTourDTO {
  Title: string;
  Description: string;
  Difficulty: string;
  Tags: string[];
  Price: number;
  Duration: number;
  Status: 'draft' | 'published' | 'archived';
  distance_km?: number;
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
