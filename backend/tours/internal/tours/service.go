package tours

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateTour(dto CreateTourDTO, creatorID string) (*Tour, error) {
	if dto.Title == "" {
		return nil, errors.New("naslov ture ne može biti prazan")
	}
	tour := &Tour{
		ID:          uuid.New().String(),
		CreatorID:   creatorID,
		Title:       dto.Title,
		Description: dto.Description,
		Price:       dto.Price,
		Duration:    dto.Duration,
		CreatedAt:   time.Now(),
	}
	err := s.repo.SaveTour(tour)
	return tour, err
}

func (s *Service) GetTour(id string) (*Tour, error) {
	return s.repo.GetTourByID(id)
}

func (s *Service) GetAllTours() ([]Tour, error) {
	return s.repo.GetAllTours()
}

func (s *Service) AddKeyPoint(tourID string, dto CreateKeyPointDTO) (*KeyPoint, error) {
	kp := &KeyPoint{
		ID:          uuid.New().String(),
		TourID:      tourID,
		Name:        dto.Name,
		Description: dto.Description,
		Image:       dto.Image,
		Latitude:    dto.Latitude,
		Longitude:   dto.Longitude,
	}
	err := s.repo.SaveKeyPoint(kp)
	return kp, err
}

func (s *Service) AddReview(tourID string, dto CreateReviewDTO) (*Review, error) {
	if dto.Rating < 1 || dto.Rating > 5 {
		return nil, errors.New("ocena mora biti između 1 i 5")
	}

	review := &Review{
		ID:          uuid.New().String(),
		TourID:      tourID,
		TouristID:   dto.TouristID,
		Rating:      dto.Rating,
		Comment:     dto.Comment,
		VisitDate:   dto.VisitDate,
		CommentDate: time.Now(),
		Images:      dto.Images,
	}
	err := s.repo.SaveReview(review)
	return review, err
}

func (s *Service) GetReviewsByTourID(tourID string) ([]Review, error) {
	return s.repo.GetReviewsByTourID(tourID)
}

func (s *Service) GetReviewsByTouristID(touristID string) ([]Review, error) {
	return s.repo.GetReviewsByTouristID(touristID)
}

func (s *Service) UpdateTouristPosition(touristID string, dto UpdatePositionDTO) error {
	pos := &TouristPosition{
		TouristID: touristID,
		Latitude:  dto.Latitude,
		Longitude: dto.Longitude,
		UpdatedAt: time.Now(),
	}
	return s.repo.SavePosition(pos)
}

func (s *Service) GetTouristPosition(touristID string) (*TouristPosition, error) {
	return s.repo.GetPositionByTouristID(touristID)
}

func (s *Service) DeleteReview(reviewID string, touristID string) error {
    return s.repo.DeleteReview(reviewID, touristID)
}
