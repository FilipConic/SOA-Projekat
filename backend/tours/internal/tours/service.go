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

func (s *Service) UpdateTour(tourID string, dto CreateTourDTO, creatorID string) (*Tour, error) {
	tour, err := s.repo.GetTourByID(tourID)
	if err != nil {
		return nil, errors.New("tura nije pronađena")
	}
	if tour.CreatorID != creatorID {
		return nil, errors.New("niste ovlašteni za uređivanje ove ture")
	}
	if dto.Title != "" {
		tour.Title = dto.Title
	}
	if dto.Description != "" {
		tour.Description = dto.Description
	}
	if dto.Price != 0 {
		tour.Price = dto.Price
	}
	if dto.Duration != 0 {
		tour.Duration = dto.Duration
	}
	err = s.repo.UpdateTour(tour)
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

func (s *Service) UpdateKeyPoint(kpID string, tourID string, dto CreateKeyPointDTO) (*KeyPoint, error) {
	tour, err := s.repo.GetTourByID(tourID)
	if err != nil {
		return nil, errors.New("tura nije pronađena")
	}
	var kp *KeyPoint
	for i := range tour.KeyPoints {
		if tour.KeyPoints[i].ID == kpID {
			kp = &tour.KeyPoints[i]
			break
		}
	}
	if kp == nil {
		return nil, errors.New("ključna tačka nije pronađena")
	}
	if dto.Name != "" {
		kp.Name = dto.Name
	}
	if dto.Description != "" {
		kp.Description = dto.Description
	}
	if dto.Image != "" {
		kp.Image = dto.Image
	}
	if dto.Latitude != 0 {
		kp.Latitude = dto.Latitude
	}
	if dto.Longitude != 0 {
		kp.Longitude = dto.Longitude
	}
	err = s.repo.UpdateKeyPoint(kp)
	return kp, err
}

func (s *Service) DeleteKeyPoint(kpID string, tourID string) error {
	tour, err := s.repo.GetTourByID(tourID)
	if err != nil {
		return errors.New("tura nije pronađena")
	}
	var kp *KeyPoint
	for i := range tour.KeyPoints {
		if tour.KeyPoints[i].ID == kpID {
			kp = &tour.KeyPoints[i]
			break
		}
	}
	if kp == nil {
		return errors.New("ključna tačka nije pronađena")
	}
	return s.repo.DeleteKeyPoint(kpID)
}

func (s *Service) GetKeyPointsByTourID(tourID string) ([]KeyPoint, error) {
	return s.repo.GetKeyPointsByTourID(tourID)
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
