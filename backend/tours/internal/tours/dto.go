package tours

import "time"

type CreateTourDTO struct {
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Difficulty  TourDifficulty `json:"difficulty"`
	Tags        []string       `json:"tags"`
	DistanceKm  float64        `json:"distance_km"`
}

type UpdateTourDTO struct {
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Price       float64        `json:"price"`  // Sada može da promeni cenu sa 0 na neku vrednost
	Status      TourStatus     `json:"status"` // Može da prebaci iz "draft" u "published"
	Difficulty  TourDifficulty `json:"difficulty"`
	Tags        []string       `json:"tags"`
	Duration    int            `json:"duration"`
	DistanceKm  float64        `json:"distance_km"`
}

type TourDTO struct {
	ID          string         `json:"id"`
	CreatorID   string         `json:"creator_id"`
	Title       string         `json:"title"`
	Status      TourStatus     `json:"status"`
	Description string         `json:"description"`
	Price       float64        `json:"price"`
	Difficulty  TourDifficulty `json:"difficulty"`
	Tags        []string       `json:"tags"`
	Duration    int            `json:"duration"`
	CreatedAt   time.Time      `json:"created_at"`
	KeyPoints   []KeyPointDTO  `json:"key_points"`
	Reviews     []ReviewDTO    `json:"reviews"`
	DistanceKm  float64        `json:"distance_km"`
}

type CreateKeyPointDTO struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
}

type UpdateKeyPointDTO struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
}

type KeyPointDTO struct {
	ID          string  `json:"id"`
	TourID      string  `json:"tour_id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
}

type CreateReviewDTO struct {
	TouristID string    `json:"tourist_id"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	VisitDate time.Time `json:"visit_date"`
	Images    []string  `json:"images"`
}

type ReviewDTO struct {
	ID          string    `json:"id"`
	TourID      string    `json:"tour_id"`
	TouristID   string    `json:"tourist_id"`
	Rating      int       `json:"rating"`
	Comment     string    `json:"comment"`
	VisitDate   time.Time `json:"visit_date"`
	CommentDate time.Time `json:"comment_date"`
	Images      []string  `json:"images"`
}

type UpdatePositionDTO struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type CheckPositionDTO struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type ExecutionKeyPointDTO struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Image       string     `json:"image"`
	Latitude    float64    `json:"latitude"`
	Longitude   float64    `json:"longitude"`
	Order       int        `json:"order"`
	IsCompleted bool       `json:"isCompleted"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`
}

type TourExecutionDTO struct {
	ID              string                 `json:"id"`
	TourID          string                 `json:"tourId"`
	TourTitle       string                 `json:"tourTitle"`
	TourDescription string                 `json:"tourDescription"`
	Status          string                 `json:"status"`
	StartTime       time.Time              `json:"startTime"`
	EndTime         *time.Time             `json:"endTime,omitempty"`
	LastActivity    time.Time              `json:"lastActivity"`
	Keypoints       []ExecutionKeyPointDTO `json:"keypoints"`
}
