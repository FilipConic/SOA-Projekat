import { Elysia } from "elysia";
import { pool } from "../db/client";

export const blogRoutes = new Elysia()
	// dodaj like na blog za odredjenog usera
	// POST
	.post("/api/blog/like/:blog_id", async ({ headers, params }) => {
		const user_id = headers['X-User-ID'];
		const blog_id = params.blog_id;

		const a = await pool.query('SELECT * FROM likes WHERE user_id = $1 AND blog_id = $2', [user_id, blog_id]);
		if (a.rows.length === 0) {
			const result = await pool.query(
				`INSERT INTO likes (blog_id, user_id)
				VALUES ($1, $2) RETURNING *`,
				[blog_id, user_id]
			);
			return result.rows[0];
		} else {
			return { message : "Blog already liked by user" };
		}
	})

	// obrisi like sa bloga
	// DELETE
	.delete("/api/blog/rm_like/:blog_id", async ({ headers, params }) => {
		const user_id = headers['X-User-ID'];
		const blog_id = params.blog_id;

		const result = await pool.query(`DELETE FROM likes WHERE blog_id = $1 AND user_id = $2 RETURNING *`, [blog_id, user_id]);
		return { message: "Removed like!", removed: result.rows[0] }
	})

	// prebroj lajkove bloga
	// GET
	.get("/api/blog/likes/:blog_id", async ({ params }) => {
		const result = await pool.query(`SELECT COUNT(*) as total FROM likes WHERE blog_id = $1`, [params.blog_id]);
		return { blog_id: params.blog_id, total: parseInt(result.rows[0].total) };
	})

	// pretraga po id
	// GET
	.get("/api/blog/find/:id", async ({ params }) => {
		const result = await pool.query(`SELECT * FROM blogs WHERE id = $1`, [params.id]);
		if (result.rows.length === 0) return { error: "Blog not found" };
		return result.rows[0];
	})

	// brisanje bloga
	// DELETE
	.delete("/api/blog/delete/:id", async ({ params }) => {
		// prvo brise komentare vezane za blog
		await pool.query(`DELETE FROM comments WHERE blog_id = $1`, [params.id]);

		const result = await pool.query(
			`DELETE FROM blogs WHERE id = $1 RETURNING *`,
				[params.id]
		);
		if (result.rows.length === 0) return { error: "Blog not found" };
		return { message: "Blog deleted!" };
	})

	// uredjivanje bloga
	// PUT
	.put("/api/blog/edit/:id", async ({ headers, params, body }) => {
		const user_id = headers['X-User-ID'];
		const search = await pool.query(`SELECT * FROM blogs WHERE id = $1 AND user_id = $2`, [params.id, user_id]);
		if (search.rows.length === 0) return { error: "Blog not found!" };

		const { title, description, images } = body;
		const result = await pool.query(
			`UPDATE blogs SET title = $1, description = $2, images = $3 WHERE id = $4 RETURNING *`,
				[title, description, images || [], params.id]
		);
		return result.rows[0];
	});
