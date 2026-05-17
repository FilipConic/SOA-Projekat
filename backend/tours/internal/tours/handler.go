package tours

import (
	"encoding/json"
	"net/http"
)

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/tours", h.createTour)
	mux.HandleFunc("GET /api/tours/{id}", h.getTour)

	mux.HandleFunc("POST /api/tours/{id}/keypoints", h.addKeyPoint)
	mux.HandleFunc("POST /api/tours/{id}/reviews", h.addReview)

	mux.HandleFunc("POST /api/tourists/{tourist_id}/position", h.updatePosition)
}

func (h *Handler) createTour(w http.ResponseWriter, r *http.Request) {
	var dto CreateTourDTO
	json.NewDecoder(r.Body).Decode(&dto)
	tour, err := h.service.CreateTour(dto)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(tour)
}

func (h *Handler) getTour(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("id")
	tour, err := h.service.GetTour(tourID)
	if err != nil {
		http.Error(w, "Tura nije pronađena", http.StatusNotFound)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(tour)
}

func (h *Handler) addKeyPoint(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("id")
	var dto CreateKeyPointDTO
	json.NewDecoder(r.Body).Decode(&dto)

	kp, err := h.service.AddKeyPoint(tourID, dto)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(kp)
}

func (h *Handler) addReview(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("id")
	var dto CreateReviewDTO
	json.NewDecoder(r.Body).Decode(&dto)

	review, err := h.service.AddReview(tourID, dto)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(review)
}

func (h *Handler) updatePosition(w http.ResponseWriter, r *http.Request) {
	touristID := r.PathValue("tourist_id")
	var dto UpdatePositionDTO
	json.NewDecoder(r.Body).Decode(&dto)

	err := h.service.UpdateTouristPosition(touristID, dto)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
