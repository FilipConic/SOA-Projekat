package models

import "github.com/google/uuid"

type Profile struct {
	ID int64 `json:"id"`
	UserID uuid.UUID `json:"user_id"`
	FirstName string `json:"first_name"`
	LastName string `json:"last_name"`
	Avatar string `json:"avatar"`
	Bio string `json:"bio"`
	Quote string `json:"quote"`
}

type ProfileWithUser struct {
	Profile
	Username string `json:"username"`
	Email string `json:"email"`
}

type UserInfo struct {
	Username string `json:"username"`
	Avatar string `json:"avatar"`
}
