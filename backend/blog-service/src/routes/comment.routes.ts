import { Elysia } from "elysia";
import { pool } from "../db/client";

export const commentRoutes = new Elysia()
	// dodaj komentar
	// POST
	.post("/:id/comments", async ({ params, body }: { params: any; body: any }) => {
		const { user_id, text } = body;
		const result = await pool.query(
			`INSERT INTO comments (blog_id, user_id, text)
			VALUES ($1, $2, $3) RETURNING *`,
			[params.id, user_id, text]
		);
		return result.rows[0];
	})

	// svi komentari bloga
	// GET
	.get("/blogs/:id/comments", async ({ params }: { params: any }) => {
		const result = await pool.query(
			`SELECT * FROM comments WHERE blog_id = $1 ORDER BY created_at DESC`,
				[params.id]
		);
		return result.rows;
	})

	// broj komentara za blog
	// GET
	.get("/blogs/:id/comments/count", async ({ params }: { params: any }) => {
		const result = await pool.query(
			`SELECT COUNT(*) as total FROM comments WHERE blog_id = $1`,
				[params.id]
		);
		return { blog_id: params.id, total: parseInt(result.rows[0].total) };
	})

	// svi komentari korisnika
	// GET
	.get("/users/:user_id/comments", async ({ params }: { params: any }) => {
		const result = await pool.query(
			`SELECT * FROM comments WHERE user_id = $1 ORDER BY created_at DESC`,
				[params.user_id]
		);
		if (result.rows.length === 0) return { error: "No comments found for this user" };
		return result.rows;
	})

	// izmena komentara
	// PUT
	.put("/comments/:id", async ({ params, body }: { params: any; body: any }) => {
		const { text } = body;
		const result = await pool.query(
			`UPDATE comments SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
				[text, params.id]
		);
		if (result.rows.length === 0) return { error: "Comment not found" };
		return result.rows[0];
	})

	// brisanje komentara
	// DELETE
	.delete("/comments/:id", async ({ params }: { params: any }) => {
		const result = await pool.query(
			"DELETE FROM comments WHERE id = $1 RETURNING *",
			[params.id]
		);
		if (result.rows.length === 0) return { error: "Comment not found" };
		return { message: "Comment deleted!" };
	});
