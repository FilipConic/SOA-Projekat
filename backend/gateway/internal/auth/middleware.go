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

func isProtected(path string, protectedRoutes map[string]bool) bool {
	for route := range protectedRoutes {
		if strings.HasPrefix(path, route) {
			return true
		}
	}
	return false
}

func Middleware(secret string, protectedRoutes map[string]bool) func(http.Handler) http.Handler {
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
			}

			md := metadata.Pairs("user_id", claims.UserID)
			ctx := metadata.NewOutgoingContext(req.Context(), md)
			ctx = context.WithValue(ctx, UserIDKey, claims.UserID)
			
			req = req.WithContext(ctx)
			req.Header.Set("X-User-ID", claims.UserID)

			next.ServeHTTP(res, req.WithContext(ctx))
		})
	}
}

