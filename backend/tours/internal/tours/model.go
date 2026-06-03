package tours

import (
	"time"
	toursgen "tours/gen/tours"
)

type TourStatus string

const (
	StatusDraft     TourStatus = "draft"
	StatusPublished TourStatus = "published"
	StatusArchived  TourStatus = "archived"
)

type TourDifficulty string

const (
	DifficultyEasy   TourDifficulty = "easy"
	DifficultyMedium TourDifficulty = "medium"
	DifficultyHard   TourDifficulty = "hard"
)

var difficultyMap = map[toursgen.TourDifficulty]TourDifficulty{
	toursgen.TourDifficulty_TOUR_DIFFICULTY_EASY: DifficultyEasy,
	toursgen.TourDifficulty_TOUR_DIFFICULTY_MEDIUM: DifficultyMedium,
	toursgen.TourDifficulty_TOUR_DIFFICULTY_HARD: DifficultyHard,
}

type Tour struct {
	ID          string         `gorm:"primaryKey"`
	CreatorID   string         `gorm:"index;not null"`
	Title       string         `gorm:"type:varchar(100);not null;unique"`
	Status      TourStatus     `gorm:"type:varchar(20);not null;default:'draft'"`
	Description string         `gorm:"type:text"`
	Price       float64        `gorm:"type:numeric"`
	Difficulty  TourDifficulty `gorm:"type:varchar(20);not null;default:'medium'"`
	Tags        []string       `gorm:"type:jsonb;serializer:json"`
	Duration    int
	CreatedAt   time.Time
	KeyPoints   []KeyPoint `gorm:"foreignKey:TourID"`
	Reviews     []Review   `gorm:"foreignKey:TourID"`
}

type KeyPoint struct {
	ID          string `gorm:"primaryKey"`
	TourID      string `gorm:"foreignKey;index;not null"`
	Name        string `gorm:"not null"`
	Description string
	Image       string
	Latitude    float64 `gorm:"not null"`
	Longitude   float64 `gorm:"not null"`
}

type Review struct {
	ID          string `gorm:"primaryKey" json:"id"`
	TourID      string `gorm:"foreignKey;index;not null" json:"tour_id"`
	TouristID   string `gorm:"index;not null" json:"tourist_id"`
	Rating      int    `gorm:"not null" json:"rating"`
	Comment     string `gorm:"type:text" json:"comment"`
	VisitDate   time.Time `json:"visit_date"`
	CommentDate time.Time `json:"comment_date"`
	Images      []string `gorm:"type:jsonb;serializer:json" json:"images"`
}

type TouristPosition struct {
	TouristID string  `gorm:"primaryKey"`
	Latitude  float64 `gorm:"not null"`
	Longitude float64 `gorm:"not null"`
	UpdatedAt time.Time
}
