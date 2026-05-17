package auth

import (
	"fmt"
	"context"
	"net/http"
	"strings"

	"google.golang.org/grpc/metadata"
)

type contextKey string

const UserIDKey contextKey = "user_id"

type UserRole int
const (
	RoleAdmin UserRole = iota
	RoleGuide
	RoleTourist
	RoleNone
)

type Permission struct {
	Path string
	Role UserRole
}

func isProtected(path string, protectedRoutes map[Permission]bool) bool {
	for route := range protectedRoutes {
		if strings.HasPrefix(path, route.Path) {
			return true
		}
	}
	return false
}

func authLevel(role string, protectedRoutes map[Permission]bool) bool {
	irole := RoleNone;
	switch strings.ToUpper(role) {
	case "ADMIN": irole = RoleAdmin
	case "GUIDE": irole = RoleGuide
	case "TOURIST": irole = RoleTourist
	default: return false
	}
	for route := range protectedRoutes {
		if route.Role >= irole {
			return true
		}
	}
	return false
}

func Middleware(secret string, protectedRoutes map[Permission]bool) func(http.Handler) http.Handler {
	return func (next http.Handler) http.Handler {
		return http.HandlerFunc(func (res http.ResponseWriter, req *http.Request) {
			if !isProtected(req.URL.Path, protectedRoutes) {
				next.ServeHTTP(res, req)
				return
			}

			authHeader := req.Header.Get("Authorization")
			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				http.Error(res, fmt.Sprintf("Missing authorization or invalid header! Header: [%v]", authHeader), http.StatusUnauthorized)
				return
			}

			claims, err := ValidateToken(strings.TrimPrefix(authHeader, "Bearer "), secret)
			if err != nil {
				http.Error(res, "Invalid token!", http.StatusUnauthorized)
				return
			}
			if claims.TokenType != "access" {
				http.Error(res, "Accepts only access!", http.StatusUnauthorized)
				return
			}
			if !authLevel(claims.Role, protectedRoutes) {
				http.Error(res, "Not of a high enough authorization!", http.StatusUnauthorized)
				return
			}

			md := metadata.Pairs(
				"user_id", claims.UserID,
				"user_email", claims.Email,
				"user_role", claims.Role,
			)
			ctx := metadata.NewOutgoingContext(req.Context(), md)
			ctx = context.WithValue(ctx, UserIDKey, claims.UserID)
			
			req = req.WithContext(ctx)
			req.Header.Set("X-User-ID", claims.UserID)
			req.Header.Set("X-User-Email", claims.Email)
			req.Header.Set("X-User-Role", claims.Role)

			next.ServeHTTP(res, req.WithContext(ctx))
		})
	}
}

