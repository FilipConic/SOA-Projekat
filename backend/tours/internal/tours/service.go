package tours

import (
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
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
		Status:      StatusDraft,
		Price:       0.0,
		Difficulty:  dto.Difficulty,
		Tags:        dto.Tags,
		Duration:    dto.Duration,
		CreatedAt:   time.Now(),
	}
	err := s.repo.SaveTour(tour)
	return tour, err
}

func (s *Service) UpdateTour(id string, dto UpdateTourDTO) (*Tour, error) {
	tour, err := s.repo.GetTourByID(id)
	if err != nil {
		return nil, errors.New("tura nije pronađena")
	}

	tour.Title = dto.Title
	tour.Description = dto.Description
	tour.Price = dto.Price
	tour.Status = dto.Status
	tour.Difficulty = dto.Difficulty
	tour.Tags = dto.Tags
	tour.Duration = dto.Duration

	err = s.repo.SaveTour(tour)
	return tour, err
}

func (s *Service) GetTour(id string) (*Tour, error) {
	return s.repo.GetTourByID(id)
}

func (s *Service) GetMyTours(creatorID string) ([]Tour, error) {
	return s.repo.GetToursByCreatorID(creatorID)
}

func (s *Service) GetAllTours() ([]Tour, error) {
	return s.repo.GetAllTours()
}

func (s *Service) AddKeyPoint(tourID string, dto CreateKeyPointDTO) (*KeyPoint, error) {
	var imagePath string
	var err error

	if dto.Image != "" {
		imagePath, err = saveBase64Image(dto.Image)
		if err != nil {
			return nil, fmt.Errorf("greška pri čuvanju slike: %v", err)
		}
	}

	kp := &KeyPoint{
		ID:          uuid.New().String(),
		TourID:      tourID,
		Name:        dto.Name,
		Description: dto.Description,
		Image:       imagePath,
		Latitude:    dto.Latitude,
		Longitude:   dto.Longitude,
	}

	err = s.repo.SaveKeyPoint(kp)
	return kp, err
}

func (s *Service) DeleteKeyPoint(id string) error {
	kp, err := s.repo.GetKeyPointByID(id)
	if err != nil {
		return errors.New("ključna tačka ne postoji")
	}

	if kp.Image != "" {
		_ = os.Remove(kp.Image)
	}

	return s.repo.DeleteKeyPoint(id)
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

func saveBase64Image(base64Str string) (string, error) {
	if idx := strings.Index(base64Str, ","); idx != -1 {
		base64Str = base64Str[idx+1:]
	}

	dec, err := base64.StdEncoding.DecodeString(base64Str)
	if err != nil {
		return "", err
	}

	outputDir := filepath.Join("uploads", "keypoints")
	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
		return "", err
	}

	filename := fmt.Sprintf("%s.png", uuid.New().String())
	filePath := filepath.Join(outputDir, filename)

	f, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer f.Close()

	if _, err := f.Write(dec); err != nil {
		return "", err
	}

	return filePath, nil
}
