package tours

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository interface {
	SaveTour(tour *Tour) error
	GetTourByID(id string) (*Tour, error)
	SaveKeyPoint(kp *KeyPoint) error
	SaveReview(review *Review) error
	SavePosition(position *TouristPosition) error
	GetReviewsByTourID(tourID string) ([]Review, error)
	GetReviewsByTouristID(touristID string) ([]Review, error)
	GetAllTours() ([]Tour, error)
	GetPositionByTouristID(touristID string) (*TouristPosition, error)
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
