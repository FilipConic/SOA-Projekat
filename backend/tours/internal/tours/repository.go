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

func (r *PostgresRepo) SaveKeyPoint(kp *KeyPoint) error {
	return r.db.Create(kp).Error
}

func (r *PostgresRepo) SaveReview(review *Review) error {
	return r.db.Create(review).Error
}

func (r *PostgresRepo) SavePosition(position *TouristPosition) error {
	return r.db.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(position).Error
}
