package router

import (
	"net/http"
	"stakeholders/handler"
	"stakeholders/middleware"
	"stakeholders/models"
)

type Handlers struct {
	Auth *handler.AuthHandler
	User *handler.UserHandler
	Profile *handler.ProfileHandler
}

func New(h Handlers) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/auth/login/", h.Auth.Login)
	mux.HandleFunc("POST /api/auth/refresh/", h.Auth.Refresh)
	mux.HandleFunc("POST /api/users/", h.User.Create)

	mux.Handle("GET /api/users/",
		middleware.Authenticate(
			middleware.RequireRole(models.RoleAdmin)(
				http.HandlerFunc(h.User.List),
			),
		),
	)

	mux.Handle("GET /api/users/{id}/",
		middleware.Authenticate(http.HandlerFunc(h.User.Retrive)),
	)

	mux.Handle("PATCH /api/users/{id}/block/",
		middleware.Authenticate(
			middleware.RequireRole(models.RoleAdmin)(
				http.HandlerFunc(h.User.Block),
			),
		),
	)

	mux.Handle("GET /api/profiles/me/",
		middleware.Authenticate(http.HandlerFunc(h.Profile.Me)),
	)
	mux.Handle("PUT /api/profiles/me/update/",
		middleware.Authenticate(http.HandlerFunc(h.Profile.UpdateProfile)),
	)
	mux.Handle("PATCH /api/profiles/me/update/",
		middleware.Authenticate(http.HandlerFunc(h.Profile.UpdateProfile)),
	)
	mux.Handle("POST /api/profiles/me/avatar/",
		middleware.Authenticate(http.HandlerFunc(h.Profile.UploadAvatar)),
	)
	mux.Handle("GET /api/profiles/get/{id}/",
		middleware.Authenticate(http.HandlerFunc(h.Profile.GetProfile)),
	)

	mux.HandleFunc("GET /api/internal/user-info/{id}/", h.Profile.GetUserInfo)

	mux.Handle("GET /media/", http.StripPrefix("/media", http.FileServer(http.Dir("media"))))

	return mux
}
