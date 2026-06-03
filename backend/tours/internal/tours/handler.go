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
	// mux.HandleFunc("POST /api/tours/new", h.createTour)
	mux.HandleFunc("GET /api/tours/find/{tour_id}", h.getTour)
	// mux.HandleFunc("GET /api/tours/all", h.getAllTours)

	mux.HandleFunc("POST /api/tours/keypoints/new/{tour_id}", h.addKeyPoint)
	mux.HandleFunc("PUT /api/tours/keypoints/update/{tour_id}/{kp_id}", h.updateKeyPoint)
	mux.HandleFunc("GET /api/tours/keypoints/find/{tour_id}", h.getKeyPoints)
	mux.HandleFunc("POST /api/tours/reviews/new/{tour_id}", h.addReview)
	mux.HandleFunc("GET /api/tours/reviews/{tour_id}", h.getReviewsByTourID)
	mux.HandleFunc("GET /api/tours/tourists/reviews/{tourist_id}", h.getReviewsByTouristID)
	mux.HandleFunc("DELETE /api/tours/reviews/delete/{review_id}", h.deleteReview)

	mux.HandleFunc("GET /api/tours/tourists/position/find", h.getTouristPosition)
	mux.HandleFunc("POST /api/tours/tourists/position/new", h.updatePosition)

	mux.HandleFunc("PUT /api/tours/update/{tour_id}", h.updateTour)
	mux.HandleFunc("GET /api/tours/find-my", h.getMyTours)
	mux.HandleFunc("DELETE /api/tours/keypoints/delete/{id}", h.deleteKeyPoint)
}

// func (h *Handler) createTour(w http.ResponseWriter, r *http.Request) {
// 	var dto CreateTourDTO
// 	json.NewDecoder(r.Body).Decode(&dto)
// 	creatorID := r.Header.Get("X-User-ID")
// 	tour, err := h.service.CreateTour(dto, creatorID)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusBadRequest)
// 		return
// 	}
// 	enc := json.NewEncoder(w)
// 	enc.SetIndent("", "  ")
// 	enc.Encode(tour)
// }

func (h *Handler) updateTour(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("tour_id")
	var dto UpdateTourDTO
	json.NewDecoder(r.Body).Decode(&dto)
	creatorID := r.Header.Get("X-User-ID")
	tour, err := h.service.UpdateTour(tourID, dto, creatorID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(tour)
}

func (h *Handler) getTour(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("tour_id")
	tour, err := h.service.GetTour(tourID)
	if err != nil {
		http.Error(w, "Tura nije pronađena", http.StatusNotFound)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(tour)
}

// func (h *Handler) getAllTours(w http.ResponseWriter, r *http.Request) {
// 	tours, err := h.service.GetAllTours()
// 	if err != nil {
// 		http.Error(w, "Greška prilikom dohvatanja tura", http.StatusInternalServerError)
// 		return
// 	}
// 	enc := json.NewEncoder(w)
// 	enc.SetIndent("", "  ")
// 	enc.Encode(tours)
// }

func (h *Handler) addKeyPoint(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("tour_id")
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

func (h *Handler) updateKeyPoint(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("tour_id")
	kpID := r.PathValue("kp_id")
	var dto CreateKeyPointDTO
	json.NewDecoder(r.Body).Decode(&dto)
	kp, err := h.service.UpdateKeyPoint(kpID, tourID, dto)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(kp)
}

func (h *Handler) getKeyPoints(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("tour_id")
	keyPoints, err := h.service.GetKeyPointsByTourID(tourID)
	if err != nil {
		http.Error(w, "Tura nije pronađena", http.StatusNotFound)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(keyPoints)
}

func (h *Handler) addReview(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("tour_id")
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

func (h *Handler) getReviewsByTourID(w http.ResponseWriter, r *http.Request) {
	tourID := r.PathValue("tour_id")
	reviews, err := h.service.GetReviewsByTourID(tourID)
	if err != nil {
		http.Error(w, "Tura nije pronađena", http.StatusNotFound)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(reviews)
}

func (h *Handler) getReviewsByTouristID(w http.ResponseWriter, r *http.Request) {
	touristID := r.PathValue("tourist_id")
	reviews, err := h.service.GetReviewsByTouristID(touristID)
	if err != nil {
		http.Error(w, "Turista nije pronađen", http.StatusNotFound)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(reviews)
}

func (h *Handler) updatePosition(w http.ResponseWriter, r *http.Request) {
	var dto UpdatePositionDTO
	json.NewDecoder(r.Body).Decode(&dto)

	touristID := r.Header.Get("X-User-ID")
	err := h.service.UpdateTouristPosition(touristID, dto)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *Handler) getTouristPosition(w http.ResponseWriter, r *http.Request) {
	touristID := r.Header.Get("X-User-ID")
	pos, err := h.service.GetTouristPosition(touristID)
	if err != nil {
		http.Error(w, "Pozicija turista nije pronađena", http.StatusNotFound)
		return
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(pos)
}

func (h *Handler) deleteReview(w http.ResponseWriter, r *http.Request) {
	reviewID := r.PathValue("review_id")
	touristID := r.Header.Get("X-User-ID")

	if touristID == "" {
		http.Error(w, "Nedostaje X-User-ID", http.StatusUnauthorized)
		return
	}

	err := h.service.DeleteReview(reviewID, touristID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) getMyTours(w http.ResponseWriter, r *http.Request) {
	creatorID := r.Header.Get("X-User-ID")
	tours, err := h.service.GetMyTours(creatorID)
	if err != nil {
		http.Error(w, "Greška prilikom dohvatanja tura autora", http.StatusInternalServerError)
		return
	}

	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(tours)
}

func (h *Handler) deleteKeyPoint(w http.ResponseWriter, r *http.Request) {
	kpID := r.PathValue("id")
	err := h.service.DeleteKeyPoint(kpID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Ključna tačka je uspešno obrisana"}`))
}
