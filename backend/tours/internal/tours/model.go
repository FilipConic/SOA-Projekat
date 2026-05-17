package tours

import "time"

type Tour struct {
	ID          string  `gorm:"primaryKey"`
	CreatorID   string  `gorm:"index;not null"`
	Title       string  `gorm:"type:varchar(100);not null;unique"`
	Description string  `gorm:"type:text"`
	Price       float64 `gorm:"type:numeric"`
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
	ID          string `gorm:"primaryKey"`
	TourID      string `gorm:"foreignKey;index;not null"`
	TouristID   string `gorm:"index;not null"`
	Rating      int    `gorm:"not null"`
	Comment     string `gorm:"type:text"`
	VisitDate   time.Time
	CommentDate time.Time
	Images      []string `gorm:"type:jsonb;serializer:json"`
}

type TouristPosition struct {
	TouristID string  `gorm:"primaryKey"`
	Latitude  float64 `gorm:"not null"`
	Longitude float64 `gorm:"not null"`
	UpdatedAt time.Time
}
