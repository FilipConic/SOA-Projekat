package auth

import (
	"errors"
	"os"
	"stakeholders/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

const (
	AccessTokenTTL = 15 * time.Minute
	RefreshTokenTTL = 7 * 24 * time.Hour
)

type TokenType string

const (
	TokenAccess TokenType = "access"
	TokenRefresh TokenType = "refresh"
)

type Claims struct {
	UserID uuid.UUID `json:"user_id"`
	Email string `json:"email"`
	Role models.Role `json:"role"`
	Type TokenType `json:"token_type"`
	jwt.RegisteredClaims
}

func secret() []byte {
	return []byte(os.Getenv("JWT_SECRET"));
}
func generate(u *models.User, tt TokenType, ttl time.Duration) (string, error) {
	claims := Claims{
		UserID: u.ID,
		Email: u.Email,
		Role: u.Role,
		Type: tt,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
			IssuedAt: jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret())
}
func GenerateAccess(u *models.User) (string, error) {
	return generate(u, TokenAccess, AccessTokenTTL)
}
func GenerateRefresh(u *models.User) (string, error) {
	return generate(u, TokenAccess, RefreshTokenTTL)
}
func Verify(tokenStr string, expected TokenType) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return secret(), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	if claims.Type != expected {
		return nil, errors.New("wrong token type")
	}

	return claims, nil
}



