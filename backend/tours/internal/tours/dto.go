package tours

import "time"

type CreateTourDTO struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Duration    int     `json:"duration"`
}

type CreateKeyPointDTO struct {
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

type UpdatePositionDTO struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
