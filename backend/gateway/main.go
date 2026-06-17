package main

import (
	"context"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"

	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"

	genblog "gateway/gen/blog"
	genfollowers "gateway/gen/followers"
	genpurchase "gateway/gen/purchase"
	gentours "gateway/gen/tours"
	"gateway/internal/auth"
)

const (
	blogGrpcService         = "blog:50051"
	blogRestService         = "http://blog:3000"
	stakeholdersRestService = "http://stakeholders:8000"
	followerRestService     = "http://followers:8081"
	folowersGrpcService     = "followers:50053"
	toursGrpcService        = "tours:50052"
	toursRestService        = "http://tours:8082"
	purchaseGrpcService     = "purchase:50054"
	purchaseRestService     = "http://purchase:8083"
)

var protectedRoutes = map[auth.Permission]bool{
	{Path: "/v1/blog/new", Role: auth.RoleTourist}:           true,
	{Path: "/api/blog/like", Role: auth.RoleTourist}:         true,
	{Path: "/api/blog/rm_like", Role: auth.RoleTourist}:      true,
	{Path: "/api/blog/edit", Role: auth.RoleTourist}:         true,
	{Path: "/api/blog/comments/new", Role: auth.RoleTourist}: true,

	{Path: "/api/followers", Role: auth.RoleTourist}:                 true,
	{Path: "/v1/tours/new", Role: auth.RoleGuide}:                    true,
	{Path: "/api/tours/find/", Role: auth.RoleTourist}:               true,
	{Path: "/api/tours/keypoints/new", Role: auth.RoleGuide}:         true,
	{Path: "/api/tours/reviews/", Role: auth.RoleTourist}:            true,
	{Path: "/api/tours/tourists/", Role: auth.RoleTourist}:           true,
	{Path: "/api/tours/update/", Role: auth.RoleGuide}:               true,
	{Path: "/api/tours/find-my", Role: auth.RoleGuide}:               true,
	{Path: "/api/tours/available", Role: auth.RoleTourist}:           true,
	{Path: "/api/tours/purchased", Role: auth.RoleTourist}:           true,
	{Path: "/api/tours/tour-executions/", Role: auth.RoleTourist}:    true,
	{Path: "/api/tours/keypoints/delete", Role: auth.RoleGuide}:      true,
	{Path: "/v1/followers/follow/", Role: auth.RoleTourist}:          true,
	{Path: "/v1/followers/unfollow/", Role: auth.RoleTourist}:        true,
	{Path: "/api/followers/followers/", Role: auth.RoleTourist}:      true,
	{Path: "/api/followers/following/", Role: auth.RoleTourist}:      true,
	{Path: "/api/followers/my-followers", Role: auth.RoleTourist}:    true,
	{Path: "/api/followers/my-following", Role: auth.RoleTourist}:    true,
	{Path: "/api/followers/recommendations", Role: auth.RoleTourist}: true,
	{Path: "/api/tours/publish/", Role: auth.RoleGuide}: true,
	{Path: "/api/tours/archive/", Role: auth.RoleGuide}: true,
	{Path: "/api/tours/republish/", Role: auth.RoleGuide}: true,

	{Path: "/api/tours/reviews/delete/", Role: auth.RoleTourist}: true,

	{Path: "/v1/purchase/cart/add", Role: auth.RoleTourist}:     true,
	{Path: "/v1/purchase/checkout", Role: auth.RoleTourist}:     true,
	{Path: "/api/purchase/cart/remove", Role: auth.RoleTourist}: true,
	{Path: "/api/purchase/cart/get", Role: auth.RoleTourist}:    true,
}

func newReverseProxy(target string) *httputil.ReverseProxy {
	url, _ := url.Parse(target)
	return httputil.NewSingleHostReverseProxy(url)
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

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
		resource.WithAttributes(semconv.ServiceName("gateway")),
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
	jwtSecret := getEnv("JWT_SECRET", "secret")
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

	grpcMux := runtime.NewServeMux(
		runtime.WithMetadata(func(ctx context.Context, req *http.Request) metadata.MD {
			if md, ok := metadata.FromOutgoingContext(req.Context()); ok {
				return md
			}
			return nil
		}),
	)
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	if err := genblog.RegisterBlogServiceHandlerFromEndpoint(ctx, grpcMux, blogGrpcService, opts); err != nil {
		log.Fatalf("Failed to register blog service: %v", err)
	}
	if err := gentours.RegisterToursServiceHandlerFromEndpoint(ctx, grpcMux, toursGrpcService, opts); err != nil {
		log.Fatalf("Failed to register tours service: %v", err)
	}
	if err := genfollowers.RegisterFollowersServiceHandlerFromEndpoint(ctx, grpcMux, folowersGrpcService, opts); err != nil {
		log.Fatalf("Failed to register followers service: %v", err)
	}
	if err := genpurchase.RegisterPurchaseServiceHandlerFromEndpoint(ctx, grpcMux, purchaseGrpcService, opts); err != nil {
		log.Fatalf("Failed to register purchase service: %v", err)
	}

	blogRestProxy := newReverseProxy(blogRestService)
	stakeholderRestProxy := newReverseProxy(stakeholdersRestService)
	followerRestProxy := newReverseProxy(followerRestService)
	toursRestProxy := newReverseProxy(toursRestService)
	purchaseRestProxy := newReverseProxy(purchaseRestService)

	mainMux := http.NewServeMux()

	mainMux.Handle("/v1/blog/new", grpcMux)
	mainMux.Handle("/v1/blog/all", grpcMux)
	mainMux.Handle("/v1/blog/user/", grpcMux)
	mainMux.Handle("/v1/followers/follow/", grpcMux)
	mainMux.Handle("/v1/followers/unfollow/", grpcMux)
	mainMux.Handle("/v1/tours/new", grpcMux)
	mainMux.Handle("/v1/tours/all", grpcMux)
	mainMux.Handle("/v1/purchase/cart/add", grpcMux)
	mainMux.Handle("/v1/purchase/checkout", grpcMux)

	mainMux.HandleFunc("/api/blog/", func(res http.ResponseWriter, req *http.Request) {
		blogRestProxy.ServeHTTP(res, req)
	})
	mainMux.HandleFunc("/api/auth/", func(res http.ResponseWriter, req *http.Request) {
		stakeholderRestProxy.ServeHTTP(res, req)
	})
	mainMux.HandleFunc("/api/users/", func(res http.ResponseWriter, req *http.Request) {
		stakeholderRestProxy.ServeHTTP(res, req)
	})
	mainMux.HandleFunc("/api/profiles/", func(res http.ResponseWriter, req *http.Request) {
		stakeholderRestProxy.ServeHTTP(res, req)
	})
	mainMux.HandleFunc("/api/followers/", func(res http.ResponseWriter, req *http.Request) {
		followerRestProxy.ServeHTTP(res, req)
	})
	mainMux.HandleFunc("/api/tours/", func(res http.ResponseWriter, req *http.Request) {
		toursRestProxy.ServeHTTP(res, req)
	})
	mainMux.HandleFunc("/api/purchase/", func(res http.ResponseWriter, req *http.Request) {
		purchaseRestProxy.ServeHTTP(res, req)
	})

	authMiddleware := auth.Middleware(jwtSecret, protectedRoutes)

	tracedMux := otelhttp.NewHandler(authMiddleware(mainMux), "gateway-http")

	log.Println("Gateway listening on :8080")
	if err := http.ListenAndServe(":8080", tracedMux); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
