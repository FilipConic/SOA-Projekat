package main

import (
	"os"
	"context"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	genblog "gateway/gen/blog"
	"gateway/internal/auth"
)

const (
	blogGrpcService = "blog:50051"
	blogRestService = "http://blog:3000"
)

var protectedRoutes = map[string]bool {
	"/v1/blog/new": true,
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

func main() {
	jwtSecret := getEnv("JWT_SECRET", "secret")
	ctx := context.Background()

	grpcMux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	if err := genblog.RegisterBlogServiceHandlerFromEndpoint(ctx, grpcMux, blogGrpcService, opts); err != nil {
		log.Fatalf("Failed to register blog service: %v", err)
	}

	blogRestProxy := newReverseProxy(blogRestService)

	mainMux := http.NewServeMux()

	mainMux.Handle("/v1/blog/new", grpcMux)
	mainMux.Handle("/v1/blog/all", grpcMux)
	mainMux.Handle("/v1/blog/user/", grpcMux)
	mainMux.HandleFunc("/api/blog/", func(res http.ResponseWriter, req *http.Request) {
		blogRestProxy.ServeHTTP(res, req)
	})

	authMiddleware := auth.Middleware(jwtSecret, protectedRoutes)

	log.Println("Gateway listening on :8080")
	if err := http.ListenAndServe(":8080", authMiddleware(mainMux)); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
