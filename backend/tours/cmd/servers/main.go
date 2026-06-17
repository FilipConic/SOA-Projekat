package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"time"
	"tours/internal/tours"

	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
	"google.golang.org/grpc"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	pb "tours/gen/tours"
)

func initTracer(ctx context.Context) (*sdktrace.TracerProvider, error) {
	endpoint := getEnv("OTEL_EXPORTER_OTLP_ENDPOINT", "otel-collector:4317")

	exporter, err := otlptracegrpc.New(ctx,
		otlptracegrpc.WithEndpoint(endpoint),
		otlptracegrpc.WithInsecure(),
	)
	if err != nil {
		return nil, err
	}

	res, err := resource.New(ctx,
		resource.WithAttributes(semconv.ServiceName("tours")),
	)
	if err != nil {
		return nil, err
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(res),
	)

	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	return tp, nil
}

func main() {
	ctx := context.Background()

	tp, err := initTracer(ctx)
	if err != nil {
		log.Printf("Failed to initialize tracer: %v", err)
	} else {
		defer func() {
			shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			if err := tp.Shutdown(shutdownCtx); err != nil {
				log.Printf("Error shutting down tracer provider: %v", err)
			}
		}()
	}

	dbHost := getEnv("DB_HOST", "localhost")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "tvoja_lozinka")
	dbName := getEnv("DB_NAME", "tours_db")
	dbPort := getEnv("DB_PORT", "5432")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Greška pri povezivanju na bazu: %v", err)
	}

	err = db.AutoMigrate(
		&tours.Tour{},
		&tours.KeyPoint{},
		&tours.Review{},
		&tours.TouristPosition{},
		&tours.TourExecution{},
		&tours.ExecutionKeyPoint{},
		&tours.TourPurchaseToken{},
	)
	if err != nil {
		log.Fatalf("Greška tokom migracije: %v", err)
	}

	repo := tours.NewPostgresRepo(db)

	service := tours.NewService(repo)

	rabbitConsumer := tours.NewRabbitConsumer(service)
	rabbitConsumer.Start()
	defer rabbitConsumer.Close()

	handler := tours.NewHandler(service)

	grpcHandler := tours.NewGrpcHandler(service)
	grpcServer := grpc.NewServer(
		grpc.StatsHandler(otelgrpc.NewServerHandler()),
		grpc.UnaryInterceptor(func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
			log.Printf("gRPC call: %s", info.FullMethod)
			resp, err := handler(ctx, req)
			log.Printf("gRPC result: %v", err)
			return resp, err
		}),
	)
	pb.RegisterToursServiceServer(grpcServer, grpcHandler)

	mux := http.NewServeMux()
	handler.RegisterRoutes(mux)

	tracedMux := otelhttp.NewHandler(mux, "tours-http")

	go func() {
		log.Printf("Tours servis uspešno pokrenut na portu :8082 (Baza povezana na %s:%s)\n", dbHost, dbPort)
		if err := http.ListenAndServe(":8082", tracedMux); err != nil {
			log.Fatalf("Server pao: %v", err)
		}
	}()

	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Tours gRPC server running on :50052")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatal(err)
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
