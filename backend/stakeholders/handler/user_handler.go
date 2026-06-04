package handler

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"stakeholders/auth"
	"stakeholders/models"
	"stakeholders/repository"
	"strings"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
)

type UserHandler struct {
	users         *repository.UserRepository
	profiles      *repository.ProfileRepository
	rabbitChannel *amqp.Channel
}

func NewUserHandler(users *repository.UserRepository, profiles *repository.ProfileRepository, rabbitChannel *amqp.Channel) *UserHandler {
	return &UserHandler{users: users, profiles: profiles, rabbitChannel: rabbitChannel}
}

type createUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req createUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.Username == "" || req.Email == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "username, email and password are required")
		return
	}

	role := models.Role(strings.ToUpper(req.Role))
	if role != models.RoleGuide && role != models.RoleTourist {
		writeError(w, http.StatusBadRequest, "invalid role, only 'guide' and 'tourist' are allowed")
		return
	}

	ctx := r.Context()

	if exists, err := h.users.ExistsByUsername(ctx, req.Username); err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	} else if exists {
		writeError(w, http.StatusBadRequest, "username already exists")
		return
	}

	if exists, err := h.users.ExistsByEmail(ctx, req.Email); err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	} else if exists {
		writeError(w, http.StatusBadRequest, "email already exists")
		return
	}

	hashed, err := auth.HashPassword(req.Password)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "couldn't hash password")
		return
	}

	user := &models.User{
		ID:       uuid.New(),
		Username: req.Username,
		Email:    req.Email,
		Password: hashed,
		Role:     role,
		IsActive: true,
	}

	if err := h.users.Create(ctx, user); err != nil {
		writeError(w, http.StatusInternalServerError, "could not create user")
		return
	}

	if err := h.profiles.Create(ctx, user.ID); err != nil {
		log.Printf("failed to create profile for user %s: %v", user.ID, err)
	}

	go h.publishUserSync(context.Background(), "", user.ID.String(), user.Username)

	writeJSON(w, http.StatusCreated, user)
}
func (h *UserHandler) List(w http.ResponseWriter, r *http.Request) {
	users, err := h.users.ListNonAdmin(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not list users")
		return
	}
	writeJSON(w, http.StatusOK, users)
}
func (h *UserHandler) Retrive(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid user id")
		return
	}

	user, err := h.users.GetByID(r.Context(), id)
	if errors.Is(err, repository.ErrUserNotFound) {
		writeError(w, http.StatusNotFound, "user not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, user)
}
func (h *UserHandler) Block(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid user id")
		return
	}

	user, err := h.users.GetByID(r.Context(), id)
	if errors.Is(err, repository.ErrUserNotFound) {
		writeError(w, http.StatusNotFound, "user not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	user.IsActive = !user.IsActive
	if err := h.users.UpdateActive(r.Context(), user.ID, user.IsActive); err != nil {
		writeError(w, http.StatusInternalServerError, "could not update user")
		return
	}

	writeJSON(w, http.StatusOK, user)
}
func (h *UserHandler) publishUserSync(ctx context.Context, sagaID string, userID string, username string) {
	event := map[string]interface{}{
		"id":       userID,
		"username": username,
	}

	body, _ := json.Marshal(event)

	err := h.rabbitChannel.PublishWithContext(ctx,
		"user-exchange",
		"user.sync.routing",
		false, false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
			Headers: amqp.Table{
				"sagaId": sagaID,
			},
		},
	)
	if err != nil {
		log.Printf("Failed to publish user creation sync: %v", err)
	}
}
