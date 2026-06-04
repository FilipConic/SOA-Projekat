package tours

import (
	"context"
	pb "tours/gen/tours"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type GrpcHandler struct {
	pb.ToursServiceServer
	service *Service
}

func NewGrpcHandler(s *Service) *GrpcHandler {
	return &GrpcHandler{service: s}
}

func (h *GrpcHandler) CreateTour(ctx context.Context, req *pb.CreateTourRequest) (*pb.CreateTourResponse, error) {
	userID := ""

	if req.User != nil {
		userID = req.User.UserId
	} else {
		md, ok := metadata.FromIncomingContext(ctx)
		if !ok || len(md.Get("user_id")) == 0 {
			return nil, status.Error(codes.Unauthenticated, "missing user")
		}
		userID = md.Get("user_id")[0]
	}

	dto := CreateTourDTO{
		Title:       req.Title,
		Description: req.Description,
		Difficulty:  difficultyMap[req.Difficulty],
		Tags:        req.Tags,
		DistanceKm: req.DistanceKm,
	}

	tour, err := h.service.CreateTour(dto, userID)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	return &pb.CreateTourResponse{Tour: toProtoTour(tour)}, nil
}

func (h *GrpcHandler) GetTours(ctx context.Context, req *pb.GetToursRequest) (*pb.GetToursResponse, error) {
	tours, err := h.service.GetAllTours()
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	var protoTours []*pb.Tour
	for _, t := range tours {
		protoTours = append(protoTours, toProtoTour(&t))
	}

	return &pb.GetToursResponse{Tours: protoTours}, nil
}

func toProtoTour(t *Tour) *pb.Tour {
	ret := &pb.Tour{
		Id:          t.ID,
		CreatorId:   t.CreatorID,
		Title:       t.Title,
		Status:      string(t.Status),
		Description: t.Description,
		Price:       t.Price,
		Duration:    int32(t.Duration),
		Tags:        t.Tags,
		DistanceKm: t.DistanceKm,
	}
	if t.Difficulty == DifficultyEasy {
		ret.Difficulty = pb.TourDifficulty_TOUR_DIFFICULTY_EASY
	} else if t.Difficulty == DifficultyMedium {
		ret.Difficulty = pb.TourDifficulty_TOUR_DIFFICULTY_MEDIUM
	} else if t.Difficulty == DifficultyHard {
		ret.Difficulty = pb.TourDifficulty_TOUR_DIFFICULTY_HARD
	}
	return ret
}
