package tours

import (
	"errors"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository interface {
	SaveTour(tour *Tour) error
	UpdateTour(tour *Tour) error
	GetTourByID(id string) (*Tour, error)
	SaveKeyPoint(kp *KeyPoint) error
	GetKeyPointsByTourID(tourID string) ([]KeyPoint, error)
	SaveReview(review *Review) error
	SavePosition(position *TouristPosition) error
	GetReviewsByTourID(tourID string) ([]Review, error)
	GetReviewsByTouristID(touristID string) ([]Review, error)
	GetAllTours() ([]Tour, error)
	GetPositionByTouristID(touristID string) (*TouristPosition, error)
	DeleteReview(reviewID string, touristID string) error
	GetToursByCreatorID(creatorID string) ([]Tour, error)
	GetKeyPointByID(id string) (*KeyPoint, error)
	UpdateKeyPoint(kp *KeyPoint) error
	DeleteKeyPoint(id string) error
	SaveTourExecution(exec *TourExecution) error
	GetTourExecutionByID(id string) (*TourExecution, error)
	GetTourExecutionByTouristID(touristID string) ([]TourExecution, error)
	UpdateTourExecution(exec *TourExecution) error
	SaveTourPurchaseToken(token *TourPurchaseToken) error
	GetPurchasedTours(touristID string) ([]Tour, error)
	GetAvailablePublishedTours(touristID string) ([]Tour, error)
}

type PostgresRepo struct {
	db *gorm.DB
}

func NewPostgresRepo(db *gorm.DB) *PostgresRepo {
	return &PostgresRepo{db: db}
}

func (r *PostgresRepo) SaveTour(tour *Tour) error {
	return r.db.Create(tour).Error
}

func (r *PostgresRepo) UpdateTour(tour *Tour) error {
	return r.db.Save(tour).Error
}

func (r *PostgresRepo) GetTourByID(id string) (*Tour, error) {
	var tour Tour
	err := r.db.Preload("KeyPoints").Preload("Reviews").First(&tour, "id = ?", id).Error
	return &tour, err
}

func (r *PostgresRepo) GetAllTours() ([]Tour, error) {
	var tours []Tour
	err := r.db.Preload("KeyPoints").Preload("Reviews").Find(&tours).Error
	return tours, err
}

func (r *PostgresRepo) SaveKeyPoint(kp *KeyPoint) error {
	return r.db.Create(kp).Error
}

func (r *PostgresRepo) GetKeyPointsByTourID(tourID string) ([]KeyPoint, error) {
	var keyPoints []KeyPoint
	err := r.db.Where("tour_id = ?", tourID).Find(&keyPoints).Error
	return keyPoints, err
}

func (r *PostgresRepo) SaveReview(review *Review) error {
	return r.db.Create(review).Error
}

func (r *PostgresRepo) GetReviewsByTourID(tourID string) ([]Review, error) {
	var reviews []Review
	err := r.db.Where("tour_id = ?", tourID).Find(&reviews).Error
	return reviews, err
}

func (r *PostgresRepo) GetReviewsByTouristID(touristID string) ([]Review, error) {
	var reviews []Review
	err := r.db.Where("tourist_id = ?", touristID).Find(&reviews).Error
	return reviews, err
}

func (r *PostgresRepo) SavePosition(position *TouristPosition) error {
	return r.db.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(position).Error
}

func (r *PostgresRepo) GetPositionByTouristID(touristID string) (*TouristPosition, error) {
	var pos TouristPosition
	err := r.db.First(&pos, "tourist_id = ?", touristID).Error
	return &pos, err
}

func (r *PostgresRepo) DeleteReview(reviewID string, touristID string) error {
	result := r.db.Where("id = ? AND tourist_id = ?", reviewID, touristID).Delete(&Review{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("review nije pronađen ili nemate pravo da ga obrišete")
	}
	return nil
}

func (r *PostgresRepo) GetToursByCreatorID(creatorID string) ([]Tour, error) {
	var tours []Tour
	err := r.db.Preload("KeyPoints").Where("creator_id = ?", creatorID).Find(&tours).Error
	return tours, err
}

func (r *PostgresRepo) GetKeyPointByID(id string) (*KeyPoint, error) {
	var kp KeyPoint
	err := r.db.First(&kp, "id = ?", id).Error
	return &kp, err
}

func (r *PostgresRepo) UpdateKeyPoint(kp *KeyPoint) error {
	return r.db.Save(kp).Error
}

func (r *PostgresRepo) DeleteKeyPoint(id string) error {
	return r.db.Delete(&KeyPoint{}, "id = ?", id).Error
}

func (r *PostgresRepo) SaveTourExecution(exec *TourExecution) error {
	return r.db.Create(exec).Error
}

func (r *PostgresRepo) GetTourExecutionByID(id string) (*TourExecution, error) {
	var exec TourExecution
	// Preloadujemo Turu (zbog naslova) i sve pripadajuće tačke sesije
	err := r.db.Preload("Tour").Preload("CompletedPoints").First(&exec, "id = ?", id).Error
	return &exec, err
}

func (r *PostgresRepo) GetTourExecutionByTouristID(touristID string) ([]TourExecution, error) {
	var execs []TourExecution
	err := r.db.Preload("Tour").Preload("CompletedPoints").Where("tourist_id = ?", touristID).Find(&execs).Error
	return execs, err
}

func (r *PostgresRepo) UpdateTourExecution(exec *TourExecution) error {
	// FullSaveAssociations osigurava da se čuvaju promene nad CompletedPoints nizom
	return r.db.Session(&gorm.Session{FullSaveAssociations: true}).Save(exec).Error
}

func (r *PostgresRepo) SaveTourPurchaseToken(token *TourPurchaseToken) error {
	return r.db.Create(token).Error
}

func (r *PostgresRepo) GetPurchasedTours(touristID string) ([]Tour, error) {
	var tours []Tour
	err := r.db.Preload("KeyPoints").Preload("Reviews").
		Joins("JOIN tour_purchase_tokens ON tour_purchase_tokens.tour_id = tours.id").
		Where("tour_purchase_tokens.tourist_id = ?", touristID).
		Find(&tours).Error
	return tours, err
}

func (r *PostgresRepo) GetAvailablePublishedTours(touristID string) ([]Tour, error) {
	var tours []Tour
	err := r.db.Preload("KeyPoints").Preload("Reviews").
		Where("tours.status = ?", "Published").
		Where("tours.id NOT IN (SELECT tour_id FROM tour_purchase_tokens WHERE tourist_id = ?)", touristID).
		Find(&tours).Error
	return tours, err
}
