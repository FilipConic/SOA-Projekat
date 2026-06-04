package tours

import (
	"encoding/base64"
	"errors"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"sort"
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
		Duration:    0,
		CreatedAt:   time.Now(),
	}
	err := s.repo.SaveTour(tour)
	return tour, err
}

func (s *Service) UpdateTour(id string, dto UpdateTourDTO, creatorID string) (*Tour, error) {
	tour, err := s.repo.GetTourByID(id)
	if err != nil {
		return nil, errors.New("tura nije pronađena")
	}
	if tour.CreatorID != creatorID {
		return nil, errors.New("nemate pravo da ažurirate ovu turu")
	}

	tour.Title = dto.Title
	tour.Description = dto.Description
	tour.Price = dto.Price
	tour.Status = dto.Status
	tour.Difficulty = dto.Difficulty
	tour.Tags = dto.Tags
	tour.Duration = dto.Duration

	err = s.repo.UpdateTour(tour)
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
	var imagePath string
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
	if dto.Image != "" {
		imagePath, err = saveBase64Image(dto.Image)
		if err != nil {
			return nil, fmt.Errorf("greška pri čuvanju slike: %v", err)
		}
		if kp.Image != "" {
			_ = os.Remove(kp.Image)
		}
		kp.Image = imagePath
	}
	if dto.Name != "" {
		kp.Name = dto.Name
	}
	if dto.Description != "" {
		kp.Description = dto.Description
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
	kps, err := s.repo.GetKeyPointsByTourID(tourID)
	if err != nil {
		return nil, err
	}
	for i := range kps {
		if kps[i].Image != "" {
			dataURI, err := loadImageAsBase64(kps[i].Image)
			if err != nil {
				return nil, fmt.Errorf("greška pri učitavanju slike: %v", err)
			}
			kps[i].Image = dataURI
		}
	}
	return kps, nil
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

// --- Pomoćna funkcija: Haversine formula (udaljenost u metrima) ---
func calculateHaversineDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371e3 // Radijus Zemlje u metrima
	phi1 := lat1 * math.Pi / 180
	phi2 := lat2 * math.Pi / 180
	deltaPhi := (lat2 - lat1) * math.Pi / 180
	deltaLambda := (lon2 - lon1) * math.Pi / 180

	a := math.Sin(deltaPhi/2)*math.Sin(deltaPhi/2) +
		math.Cos(phi1)*math.Cos(phi2)*
			math.Sin(deltaLambda/2)*math.Sin(deltaLambda/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c
}

// --- Pomoćna funkcija: Mapiranje Modela u DTO za Frontend ---
func mapExecutionToDTO(s *Service, exec *TourExecution) *TourExecutionDTO {
	dto := &TourExecutionDTO{
		ID:              exec.ID,
		TourID:          exec.TourID,
		TourTitle:       exec.Tour.Title,
		TourDescription: exec.Tour.Description,
		Status:          string(exec.Status),
		StartTime:       exec.StartTime,
		EndTime:         exec.EndTime,
		LastActivity:    exec.LastActivity,
		Keypoints:       make([]ExecutionKeyPointDTO, 0),
	}

	for _, kp := range exec.CompletedPoints {
		actualKp, err := s.repo.GetKeyPointByID(kp.KeyPointID)
		if err != nil {
			return nil
		}
		image, err := loadImageAsBase64(actualKp.Image)
		if err != nil {
			return nil
		}
		dto.Keypoints = append(dto.Keypoints, ExecutionKeyPointDTO{
			ID:          kp.ID,
			Name:        kp.Name,
			Description: kp.Description,
			Latitude:    kp.Latitude,
			Longitude:   kp.Longitude,
			Order:       kp.Order,
			IsCompleted: kp.IsCompleted,
			CompletedAt: kp.CompletedAt,
			Image:       image,
		})
	}
	return dto
}

// 1. Započinjanje ture
func (s *Service) StartTour(tourID string, touristID string, initialPosition CheckPositionDTO) (*TourExecutionDTO, error) {
	tour, err := s.repo.GetTourByID(tourID)
	if err != nil {
		return nil, errors.New("tura nije pronađena")
	}

	// Preduslov: Da li je tura objavljena (ili arhivirana)
	if tour.Status == StatusDraft {
		return nil, errors.New("ne možete pokrenuti turu koja je u draft statusu")
	}

	execID := uuid.New().String()
	execPoints := make([]ExecutionKeyPoint, 0)

	// Kopiramo ključne tačke iz Ture u Sesiju, inicijalno IsCompleted = false
	for i, kp := range tour.KeyPoints {
		order := kp.Order
		if order == 0 {
			order = i + 1 // Fallback ako baza nema unet redosled
		}

		execPoints = append(execPoints, ExecutionKeyPoint{
			ID:          uuid.New().String(),
			ExecutionID: execID,
			KeyPointID:  kp.ID,
			Name:        kp.Name,
			Description: kp.Description,
			Latitude:    kp.Latitude,
			Longitude:   kp.Longitude,
			Order:       order,
			IsCompleted: false,
		})
	}

	execution := &TourExecution{
		ID:              execID,
		TourID:          tourID,
		TouristID:       touristID,
		Status:          ExecutionActive,
		StartTime:       time.Now(),
		LastActivity:    time.Now(),
		CompletedPoints: execPoints,
	}

	err = s.repo.SaveTourExecution(execution)
	if err != nil {
		return nil, err
	}

	// Ponovno dohvatamo da bismo imali pre-loadovan Tour objekat zbog naziva
	fullExec, _ := s.repo.GetTourExecutionByID(execID)
	return mapExecutionToDTO(s, fullExec), nil
}

func (s *Service) GetTourExecution(executionID string) (*TourExecutionDTO, error) {
	exec, err := s.repo.GetTourExecutionByID(executionID)
	if err != nil {
		return nil, errors.New("sesija nije pronađena")
	}
	return mapExecutionToDTO(s, exec), nil
}

func (s *Service) GetMyTourExecutions(touristID string) ([]TourExecutionDTO, error) {
	execs, err := s.repo.GetTourExecutionByTouristID(touristID)
	if err != nil {
		return nil, errors.New("greška prilikom dohvatanja vaših sesija")
	}
	dtos := make([]TourExecutionDTO, 0)
	for _, exec := range execs {
		dtos = append(dtos, *mapExecutionToDTO(s, &exec))
	}
	return dtos, nil
}

// 2. Ping pozicije svakih 10 sekundi
func (s *Service) CheckPosition(executionID string, touristID string, dto CheckPositionDTO) (*TourExecutionDTO, error) {
	exec, err := s.repo.GetTourExecutionByID(executionID)
	if err != nil {
		return nil, errors.New("sesija nije pronađena")
	}
	if exec.TouristID != touristID {
		return nil, errors.New("nemate pravo pristupa ovoj sesiji")
	}
	if exec.Status != ExecutionActive {
		return nil, errors.New("ova tura više nije aktivna")
	}

	// Uvek beležimo poslednju aktivnost (ping)
	exec.LastActivity = time.Now()

	// Sortiramo tačke po redosledu da bismo uvek tražili PRVU sledeću
	sort.Slice(exec.CompletedPoints, func(i, j int) bool {
		return exec.CompletedPoints[i].Order < exec.CompletedPoints[j].Order
	})

	// Nalazimo sledeću tačku koju treba posetiti
	var nextKp *ExecutionKeyPoint
	for i := range exec.CompletedPoints {
		if !exec.CompletedPoints[i].IsCompleted {
			nextKp = &exec.CompletedPoints[i]
			break
		}
	}

	// Ako postoji sledeća tačka, proveravamo udaljenost
	if nextKp != nil {
		distance := calculateHaversineDistance(dto.Latitude, dto.Longitude, nextKp.Latitude, nextKp.Longitude)

		if distance <= 50.0 { // Tolerancija 50 metara
			nextKp.IsCompleted = true
			now := time.Now()
			nextKp.CompletedAt = &now
		}
	}

	err = s.repo.UpdateTourExecution(exec)
	return mapExecutionToDTO(s, exec), err
}

// 3. Zvanično kompletiranje
func (s *Service) CompleteTour(executionID string, touristID string) error {
	exec, err := s.repo.GetTourExecutionByID(executionID)
	if err != nil || exec.TouristID != touristID {
		return errors.New("nedozvoljena akcija")
	}
	if !allKeyPointsCompleted(exec.CompletedPoints) {
		return errors.New("ne možete završiti turu dok ne posetite sve ključne tačke")
	}
	now := time.Now()
	exec.Status = ExecutionCompleted
	exec.EndTime = &now
	return s.repo.UpdateTourExecution(exec)
}

func allKeyPointsCompleted(points []ExecutionKeyPoint) bool {
	for _, kp := range points {
		if !kp.IsCompleted {
			return false
		}
	}
	return true
}

// 4. Napuštanje ture
func (s *Service) AbandonTour(executionID string, touristID string) error {
	exec, err := s.repo.GetTourExecutionByID(executionID)
	if err != nil || exec.TouristID != touristID {
		return errors.New("nedozvoljena akcija")
	}
	now := time.Now()
	exec.Status = ExecutionAbandoned
	exec.EndTime = &now
	return s.repo.UpdateTourExecution(exec)
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

func loadImageAsBase64(filePath string) (string, error) {
	// 1. Read the entire file from disk into a byte slice
	fileBytes, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}

	// 2. Encode the binary bytes into a standard base64 string
	base64Str := base64.StdEncoding.EncodeToString(fileBytes)

	// 3. Determine the correct MIME type based on the file extension
	// Your save function hardcodes ".png", but this keeps it flexible just in case.
	mimeType := "image/png" // Fallback default
	ext := strings.ToLower(filepath.Ext(filePath))

	switch ext {
	case ".jpg", ".jpeg":
		mimeType = "image/jpeg"
	case ".png":
		mimeType = "image/png"
	case ".gif":
		mimeType = "image/gif"
	case ".webp":
		mimeType = "image/webp"
	}

	// 4. Construct the Data URI format that your Angular template expects
	dataURI := fmt.Sprintf("data:%s;base64,%s", mimeType, base64Str)

	return dataURI, nil
}

func (s *Service) AddPurchaseToken(dto CreatePurchaseTokenDTO) error {
	if dto.TourID == "" || dto.TouristID == "" {
		return errors.New("tour_id i tourist_id su obavezni podaci")
	}

	token := &TourPurchaseToken{
		ID:        uuid.New().String(),
		TourID:    dto.TourID,
		TouristID: dto.TouristID,
	}

	return s.repo.SaveTourPurchaseToken(token)
}
