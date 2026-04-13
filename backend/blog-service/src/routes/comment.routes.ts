import { Elysia } from "elysia";
import { pool } from "../db/client";

export const commentRoutes = new Elysia()

  // Dodaj komentar
  .post("/blogs/:id/comments", async ({ params, body }: { params: any; body: any }) => {
    const { user_id, text } = body;
    const result = await pool.query(
      `INSERT INTO comments (blog_id, user_id, text)
       VALUES ($1, $2, $3) RETURNING *`,
      [params.id, user_id, text]
    );
    return result.rows[0];
  })

  // Svi komentari bloga
  .get("/blogs/:id/comments", async ({ params }: { params: any }) => {
    const result = await pool.query(
      `SELECT * FROM comments WHERE blog_id = $1 ORDER BY created_at ASC`,
      [params.id]
    );
    return result.rows;
  })

  // Izmena komentara
  .put("/comments/:id", async ({ params, body }: { params: any; body: any }) => {
    const { text } = body;
    const result = await pool.query(
      `UPDATE comments SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [text, params.id]
    );
    if (result.rows.length === 0) return { error: "Comment not found" };
    return result.rows[0];
  });