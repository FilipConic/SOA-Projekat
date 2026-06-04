package handler

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"stakeholders/auth"
	"stakeholders/repository"
)

type AuthHandler struct {
	users *repository.UserRepository
}

func NewAuthHandler(users* repository.UserRepository) *AuthHandler {
	return &AuthHandler{users: users}
}

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type tokenResponse struct {
	Access string `json:"access"`
	Refresh string `json:"refresh"`
}

type refreshRequest struct {
	Refresh string `json:"refresh"`
}

func (h* AuthHandler) Login(w http.ResponseWriter, r* http.Request) {
	var req loginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.Username == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "username and password required")
		return
	}

	user, err := h.users.GetByUsername(r.Context(), req.Username)
	if errors.Is(err, repository.ErrUserNotFound) {
		writeError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	if !user.IsActive {
		writeError(w, http.StatusForbidden, "account is blocked")
		return
	}

	if !auth.CheckPassword(user.Password, req.Password) {
		writeError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	access, err := auth.GenerateAccess(user)
	if err != nil {
		log.Printf("GenerateAccess failed: %v", err)
		writeError(w, http.StatusInternalServerError, "could not generate access token")
		return
	}
	refresh, err := auth.GenerateRefresh(user)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not generate refresh token")
		return
	}

	writeJSON(w, http.StatusOK, tokenResponse{Access: access, Refresh: refresh})
}
func (h* AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	var req refreshRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.Refresh == "" {
		writeError(w, http.StatusBadRequest, "refresh token required")
		return
	}

	claims, err := auth.Verify(req.Refresh, auth.TokenRefresh)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "invalid or expired refresh token")
		return
	}

	user, err := h.users.GetByID(r.Context(), claims.UserID)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "user no longer exists")
		return
	}

	if !user.IsActive {
		writeError(w, http.StatusForbidden, "account is blocked")
		return
	}

	access, err := auth.GenerateAccess(user)
	if err != nil {
		log.Printf("GenerateAccess failed: %v", err)
		writeError(w, http.StatusInternalServerError, "could not generate access token")
		return
	}
	refresh, err := auth.GenerateRefresh(user)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not generate refresh token")
		return
	}

	writeJSON(w, http.StatusOK, tokenResponse{Access: access, Refresh: refresh})
}
