package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"stakeholders/middleware"
	"stakeholders/models"
	"stakeholders/repository"
	"strings"

	"github.com/google/uuid"
)

const (
	maxAvatarSize = 5 * 1024 * 1024
	avatarDir = "media/avatars"
)

type ProfileHandler struct {
	profiles *repository.ProfileRepository
}

func NewProfileHandler(profiles *repository.ProfileRepository) *ProfileHandler {
	return &ProfileHandler{profiles: profiles}
}

type updateProfileRequest struct {
	FirstName *string `json:"first_name"`
	LastName *string `json:"last_name"`
	Bio *string `json:"bio"`
	Quote *string `json:"quote"`
}

func (h* ProfileHandler) Me(w http.ResponseWriter, r* http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	profile, err := h.profiles.GetByUserID(r.Context(), userID)
	if errors.Is(err, repository.ErrProfileNotFound) {
		writeError(w, http.StatusNotFound, "profile not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, profile)
}
func (h* ProfileHandler) UpdateProfile(w http.ResponseWriter, r* http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req updateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	current, err := h.profiles.GetByUserID(r.Context(), userID)
	if errors.Is(err, repository.ErrProfileNotFound) {
		writeError(w, http.StatusNotFound, "not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	updated := models.Profile{
		FirstName: current.FirstName,
		LastName: current.LastName,
		Bio: current.Bio,
		Quote: current.Quote,
	}
	if req.FirstName != nil {
		updated.FirstName = *req.FirstName
	}
	if req.LastName != nil {
		updated.LastName = *req.LastName
	}
	if req.Bio != nil {
		updated.Bio = *req.Bio
	}
	if req.Quote != nil {
		updated.Quote = *req.Quote
	}

	if err := h.profiles.Update(r.Context(), userID, &updated); err != nil {
		writeError(w, http.StatusInternalServerError, "could not update profile")
		return
	}

	refreshed, err := h.profiles.GetByUserID(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, refreshed)
}
func (h* ProfileHandler) UploadAvatar(w http.ResponseWriter, r* http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	if err := r.ParseMultipartForm(maxAvatarSize); err != nil {
		writeError(w, http.StatusBadRequest, "could not parse multipart form")
		return
	}

	file, header, err := r.FormFile("avatar")
	if err != nil {
		writeError(w, http.StatusBadRequest, "avatar image is required")
		return
	}
	defer file.Close()

	if header.Size > maxAvatarSize {
		writeError(w, http.StatusBadRequest, "avatar image size should not exceed 5MB")
		return
	}

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if !isAllowedImageExt(ext) {
		writeError(w, http.StatusBadRequest, "unsupported image type")
		return
	}

	userDir := filepath.Join(avatarDir, fmt.Sprintf("user_%s", userID.String()))
	if err := os.MkdirAll(userDir, 0o755); err != nil {
		writeError(w, http.StatusInternalServerError, "could not prepare upload directory")
		return
	}

	filename := fmt.Sprintf("%s%s", uuid.NewString(), ext)
	relPath := filepath.Join(userDir, filename)

	dst, err := os.Create(relPath)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not save avatar")
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		writeError(w, http.StatusInternalServerError, "could not write avatar")
		return
	}

	oldAvatar, err := h.profiles.UpdateAvatar(r.Context(), userID, relPath)
	if err != nil {
		_ = os.Remove(relPath)
		writeError(w, http.StatusInternalServerError, "could not update avatar")
		return
	}

	if oldAvatar != "" {
		_ = os.Remove(relPath)
	}

	writeJSON(w, http.StatusOK, map[string]string {
		"message": "Avatar uploaded successfully",
		"url": "/" + relPath,
	})
}
func (h* ProfileHandler) GetProfile(w http.ResponseWriter, r* http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid user id")
		return
	}

	profile, err := h.profiles.GetByUserID(r.Context(), id)
	if errors.Is(err, repository.ErrProfileNotFound) {
		writeError(w, http.StatusNotFound, "profile not found")
		return
	} 
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, profile)
}
func (h* ProfileHandler) GetUserInfo(w http.ResponseWriter, r* http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid user id")
		return
	}

	info, err := h.profiles.GetUserInfo(r.Context(), id)
	if errors.Is(err, repository.ErrProfileNotFound) {
		writeError(w, http.StatusNotFound, "info not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, info)
}

func isAllowedImageExt(ext string) bool {
	switch ext {
	case ".jpg", ".jpeg", ".png":
		return true
	}
	return false
}
