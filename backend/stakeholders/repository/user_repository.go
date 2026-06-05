package repository

import (
	"context"
	"errors"
	"stakeholders/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrUserNotFound = errors.New("user not found")

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	query := `CREATE TABLE IF NOT EXISTS users (
				id UUID PRIMARY KEY,
				username TEXT UNIQUE NOT NULL,
				email TEXT UNIQUE NOT NULL,
				password TEXT NOT NULL,
				role TEXT NOT NULL,
				is_active BOOLEAN NOT NULL
			)`
	_, err := db.Exec(context.Background(), query)
	if err != nil {
		panic("Failed to create users table: " + err.Error())
	}
	return &UserRepository{db}
}

func (r *UserRepository) Create(ctx context.Context, u *models.User) error {
	query := `INSERT INTO users (id, username, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5, $6)`

	_, err := r.db.Exec(ctx, query, u.ID, u.Username, u.Email, u.Password, u.Role, u.IsActive)

	return err
}
func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	query := `SELECT id, username, email, password, role, is_active FROM users WHERE id = $1`

	var u models.User
	err := r.db.QueryRow(ctx, query, id).Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Role, &u.IsActive)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}

	return &u, err
}
func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*models.User, error) {
	query := `SELECT id, username, email, password, role, is_active FROM users WHERE username = $1`

	var u models.User
	err := r.db.QueryRow(ctx, query, username).Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Role, &u.IsActive)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}

	return &u, nil
}
func (r *UserRepository) ExistsByUsername(ctx context.Context, username string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`, username).Scan(&exists)
	return exists, err
}
func (r *UserRepository) ExistsByEmail(ctx context.Context, email string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`, email).Scan(&exists)
	return exists, err
}
func (r *UserRepository) ListNonAdmin(ctx context.Context) ([]models.User, error) {
	query := `SELECT id, username, email, password, role, is_active FROM users WHERE role != $1`

	rows, err := r.db.Query(ctx, query, models.RoleAdmin)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Role, &u.IsActive); err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	return users, rows.Err()
}
func (r *UserRepository) UpdateActive(ctx context.Context, id uuid.UUID, isActive bool) error {
	query := `UPDATE users SET is_active = $1 WHERE id = $2`
	tag, err := r.db.Exec(ctx, query, isActive, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrUserNotFound
	}
	return nil
}
