package main

import (
	"context"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	genblog "gateway/gen/blog"
	"gateway/internal/auth"
)

const (
	blogGrpcService         = "blog:50051"
	blogRestService         = "http://blog:3000"
	stakeholdersRestService = "http://stakeholders:8000"
	followerRestService     = "http://followers:8081"
	toursRestService        = "http://tours:8082"
)

var protectedRoutes = map[auth.Permission]bool{
	{Path: "/v1/blog/new", Role: auth.RoleTourist}:           true,
	{Path: "/api/blog/like", Role: auth.RoleTourist}:         true,
	{Path: "/api/blog/rm_like", Role: auth.RoleTourist}:      true,
	{Path: "/api/blog/edit", Role: auth.RoleTourist}:         true,
	{Path: "/api/blog/comments/new", Role: auth.RoleTourist}: true,

	{Path: "/api/followers", Role: auth.RoleTourist}:                 true,
	{Path: "/api/tours/new", Role: auth.RoleGuide}:                   true,
	{Path: "/api/tours/find/", Role: auth.RoleTourist}:               true,
	{Path: "/api/tours/keypoints/new", Role: auth.RoleGuide}:         true,
	{Path: "/api/tours/reviews/", Role: auth.RoleTourist}:            true,
	{Path: "/api/tours/tourists/", Role: auth.RoleTourist}:           true,
	{Path: "/api/tours/update/", Role: auth.RoleGuide}:               true,
	{Path: "/api/tours/find-my", Role: auth.RoleGuide}:               true,
	{Path: "/api/tours/keypoints/delete", Role: auth.RoleGuide}:      true,
	{Path: "/api/followers/follow/", Role: auth.RoleTourist}:         true,
	{Path: "/api/followers/unfollow/", Role: auth.RoleTourist}:       true,
	{Path: "/api/followers/followers/", Role: auth.RoleTourist}:      true,
	{Path: "/api/followers/following/", Role: auth.RoleTourist}:      true,
	{Path: "/api/followers/my-followers", Role: auth.RoleTourist}:    true,
	{Path: "/api/followers/my-following", Role: auth.RoleTourist}:    true,
	{Path: "/api/followers/recommendations", Role: auth.RoleTourist}: true,

	{Path: "/api/tours/reviews/delete/", Role: auth.RoleTourist}: true,
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
	stakeholderRestProxy := newReverseProxy(stakeholdersRestService)
	followerRestProxy := newReverseProxy(followerRestService)
	toursRestProxy := newReverseProxy(toursRestService)

	mainMux := http.NewServeMux()

	mainMux.Handle("/v1/blog/new", grpcMux)
	mainMux.Handle("/v1/blog/all", grpcMux)
	mainMux.Handle("/v1/blog/user/", grpcMux)
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

	authMiddleware := auth.Middleware(jwtSecret, protectedRoutes)

	log.Println("Gateway listening on :8080")
	if err := http.ListenAndServe(":8080", authMiddleware(mainMux)); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
