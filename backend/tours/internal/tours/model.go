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

type ExecutionStatus string

const (
	ExecutionActive    ExecutionStatus = "ACTIVE"
	ExecutionCompleted ExecutionStatus = "COMPLETED"
	ExecutionAbandoned ExecutionStatus = "ABANDONED"
)

var difficultyMap = map[toursgen.TourDifficulty]TourDifficulty{
	toursgen.TourDifficulty_TOUR_DIFFICULTY_EASY:   DifficultyEasy,
	toursgen.TourDifficulty_TOUR_DIFFICULTY_MEDIUM: DifficultyMedium,
	toursgen.TourDifficulty_TOUR_DIFFICULTY_HARD:   DifficultyHard,
}

type Tour struct {
	ID          string         `gorm:"primaryKey"`
	CreatorID   string         `gorm:"index;not null"`
	Title       string         `gorm:"type:varchar(100);not null;unique"`
	Status      TourStatus     `gorm:"type:varchar(20);not null;default:'draft'"`
	PublishTime *time.Time 	   `gorm:"column:publish_time" json:"PublishedAt,omitempty"`
	ArchiveTime *time.Time 	   `gorm:"column:archive_time" json:"ArchivedAt,omitempty"`
	Description string         `gorm:"type:text"`
	Price       float64        `gorm:"type:numeric"`
	Difficulty  TourDifficulty `gorm:"type:varchar(20);not null;default:'medium'"`
	Tags        []string       `gorm:"type:jsonb;serializer:json"`
	DurationWalk *int          `gorm:"type:integer"`
	DurationBike *int          `gorm:"type:integer"`
	DurationCar  *int          `gorm:"type:integer"`
	CreatedAt   time.Time      `gorm:"autoCreateTime"`
	KeyPoints   []KeyPoint     `gorm:"foreignKey:TourID"`
	Reviews     []Review       `gorm:"foreignKey:TourID"`
	DistanceKm  float64        `gorm:"type:numeric"`
}

type KeyPoint struct {
	ID          string `gorm:"primaryKey"`
	TourID      string `gorm:"foreignKey;index;not null"`
	Name        string `gorm:"not null"`
	Order       int    `gorm:"not null;default:0"`
	Description string
	Image       string
	Latitude    float64 `gorm:"not null"`
	Longitude   float64 `gorm:"not null"`
}

type Review struct {
	ID          string    `gorm:"primaryKey" json:"id"`
	TourID      string    `gorm:"foreignKey;index;not null" json:"tour_id"`
	TouristID   string    `gorm:"index;not null" json:"tourist_id"`
	Rating      int       `gorm:"not null" json:"rating"`
	Comment     string    `gorm:"type:text" json:"comment"`
	VisitDate   time.Time `json:"visit_date"`
	CommentDate time.Time `json:"comment_date"`
	Images      []string  `gorm:"type:jsonb;serializer:json" json:"images"`
}

type TouristPosition struct {
	TouristID string  `gorm:"primaryKey"`
	Latitude  float64 `gorm:"not null"`
	Longitude float64 `gorm:"not null"`
	UpdatedAt time.Time
}

type TourExecution struct {
	ID              string          `gorm:"primaryKey"`
	TourID          string          `gorm:"index;not null"`
	Tour            Tour            `gorm:"foreignKey:TourID"` // Za lako dohvatanje naslova i opisa
	TouristID       string          `gorm:"index;not null"`
	Status          ExecutionStatus `gorm:"type:varchar(20);not null;default:'ACTIVE'"`
	StartTime       time.Time       `gorm:"not null"`
	EndTime         *time.Time
	LastActivity    time.Time           `gorm:"not null"`
	CompletedPoints []ExecutionKeyPoint `gorm:"foreignKey:ExecutionID;constraint:OnDelete:CASCADE;"`
}

type ExecutionKeyPoint struct {
	ID          string `gorm:"primaryKey"`
	ExecutionID string `gorm:"index;not null"`
	KeyPointID  string `gorm:"not null"`
	Name        string `gorm:"not null"`
	Description string
	Latitude    float64
	Longitude   float64
	Order       int
	IsCompleted bool `gorm:"not null;default:false"`
	CompletedAt *time.Time
}

type TourPurchaseToken struct {
	ID        string `gorm:"primaryKey"`
	TourID    string `gorm:"foreignKey;not null"`
	TouristID string `gorm:"foreignKey;not null"`
}
