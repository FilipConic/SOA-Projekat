package models

import "github.com/google/uuid"

type Role string

const (
	RoleAdmin Role = "ADMIN"
	RoleTourist Role = "TOURIST"
	RoleGuide Role = "GUIDE"
)


type User struct {
	ID uuid.UUID `json:"id"`
	Username string `json:"username"`
	Email string `json:"email"`
	Password string `json:"-"`
	Role Role `json:"role"`
	IsActive bool `json:"is_active"`
}
