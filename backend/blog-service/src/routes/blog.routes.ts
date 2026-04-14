import { Elysia } from "elysia";
import { pool } from "../db/client";
import { authPlugin } from "../plugins/authPlugin";

export const blogRoutes = new Elysia()
	.use(authPlugin)
	// kreiranje bloga 
	// POST
	.post("/blogs", async ({ body, user }) => {
		console.log("im here: ", JSON.stringify(user))
		const { title, description, images } = body;
		const result = await pool.query(
			`INSERT INTO blogs (user_id, title, description, images)
			VALUES ($1, $2, $3, $4) RETURNING *`,
			[user.user_id, title, description, images || []]
		);
		return result.rows[0];
	})

	// svi blogovi
	// GET
	.get("/blogs", async () => {
		const result = await pool.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
		return result.rows;
	})

	// svi blogovi od jednog user-a
	// GET
	.get("/blogs/user/:user_id", async ({ params }: { body: any }) => {
		const result = await pool.query('SELECT * FROM blogs WHERE user_id = $1', [params.user_id]);
		if (result.rows.length === 0) return { error: "User has no blogs" };
		return result.rows;
	})

	// dodaj like na blog za odredjenog usera
	// POST
	.post("/blogs/like/:blog_id", async ({ params, user }) => {
		if (!user) {
			return { error: "User has to be logged in for this action" }
		}

		const user_id = user.user_id;
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
	.delete("/blogs/rm_like/:blog_id", async ({ params, user }) => {
		console.log(params);
		if (!user) {
			return { error: "User has to be logged in for this action" }
		}

		const user_id = user.user_id;
		const blog_id = params.blog_id;

		const result = await pool.query(`DELETE FROM likes WHERE blog_id = $1 AND user_id = $2 RETURNING *`, [blog_id, user_id]);
		return { message: "Removed like!", removed: result.rows[0] }
	})

	// prebroj lajkove bloga
	// GET
	.get("/blogs/likes/:blog_id", async ({ params }) => {
		const result = await pool.query(`SELECT COUNT(*) as total FROM likes WHERE blog_id = $1`, [params.blog_id]);
		return { blog_id: params.blog_id, total: parseInt(result.rows[0].total) };
	})

	// pretraga po id
	// GET
	.get("/blogs/:id", async ({ params }: { params: any }) => {
		const result = await pool.query(`SELECT * FROM blogs WHERE id = $1`, [params.id]);
		if (result.rows.length === 0) return { error: "Blog not found" };
		return result.rows[0];
	})

	// brisanje bloga
	// DELETE
	.delete("/blogs/:id", async ({ params }: { params: any }) => {
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
	.put("/blogs/:id", async ({ params, body }: { params: any; body: any }) => {
		const { title, description, images } = body;
		const result = await pool.query(
			`UPDATE blogs SET title = $1, description = $2, images = $3 WHERE id = $4 RETURNING *`,
				[title, description, images || [], params.id]
		);
		if (result.rows.length === 0) return { error: "Blog not found" };
		return result.rows[0];
	});
