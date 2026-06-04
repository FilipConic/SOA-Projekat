package repository

import (
	"context"
	"errors"
	"stakeholders/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrProfileNotFound = errors.New("profile not found")

type ProfileRepository struct {
	db *pgxpool.Pool
}

func NewProfileRepository(db *pgxpool.Pool) *ProfileRepository {
	return &ProfileRepository{db}
}

func (r* ProfileRepository) Create(ctx context.Context, userID uuid.UUID) error {
	query := `INSERT INTO profiles (user_id, first_name, last_name, avatar, bio, quote) VALUES ($1, '', '', NULL, '', '')`
	_, err := r.db.Exec(ctx, query, userID)
	return err
}
func (r* ProfileRepository) GetByUserID(ctx context.Context, userID uuid.UUID) (*models.ProfileWithUser, error) {
	query := `
		SELECT p.id, p.user_id, p.first_name, p.last_name, COALESCE(p.avatar, ''), p.bio, p.quote, u.username, u.email
		FROM profiles p JOIN users u ON u.id == p.user_id WHERE p.user_id = $1
	`

	var p models.ProfileWithUser
	err := r.db.QueryRow(ctx, query, userID).Scan(
		&p.ID, &p.UserID, &p.FirstName, &p.LastName, &p.Avatar, &p.Bio, &p.Quote, &p.Username, &p.Email,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrProfileNotFound
	}
	if err != nil {
		return nil, err
	}
	return &p, nil
}
func (r* ProfileRepository) GetUserInfo(ctx context.Context, userID uuid.UUID) (*models.UserInfo, error) {
	query := `SELECT u.username, COALESCE(p.avatar, '') FROM profiles p JOIN users u ON p.user_id = u.id WHERE p.user_id = $1`
	
	var info models.UserInfo
	err := r.db.QueryRow(ctx, query, userID).Scan(&info.Username, &info.Avatar)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrProfileNotFound
	}
	if err != nil {
		return nil, err
	}
	return &info, nil
}
func (r* ProfileRepository) Update(ctx context.Context, userID uuid.UUID, p *models.Profile) error {
	query := `UPDATE profiles SET first_name = $1, last_name = $2, bio = $3, quote = $4 WHERE user_id = $5`

	tag, err := r.db.Exec(ctx, query, p.FirstName, p.LastName, p.Bio, p.Quote, userID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrProfileNotFound
	}
	return nil
}
func (r* ProfileRepository) UpdateAvatar(ctx context.Context, userID uuid.UUID, avatar string) (string, error) {
	var oldAvatar string 
	err := r.db.QueryRow(ctx, `SELECT COALESCE(avatar, '') FROM profiles WHERE user_id = $1`, userID).Scan(&oldAvatar)
	if errors.Is(err, pgx.ErrNoRows) {
		return "", ErrProfileNotFound
	}
	if err != nil {
		return "", err
	}
	
	_, err = r.db.Exec(ctx, `UPDATE profiles SET avatar = $1 WHERE user_id = $2`, avatar, userID)
	if err != nil {
		return "", err
	}
	return oldAvatar, nil
}
