import { Elysia } from "elysia";
import { pool } from "../db/client";

export const blogRoutes = new Elysia()

  // Kreiranje bloga
  .post("/blogs", async ({ body }: { body: any }) => {
    const { title, description, images } = body;
    const result = await pool.query(
      `INSERT INTO blogs (title, description, images)
       VALUES ($1, $2, $3) RETURNING *`,
      [title, description, images || []]
    );
    return result.rows[0];
  })

  // Lista svih blogova
  .get("/blogs", async () => {
    const result = await pool.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
    return result.rows;
  })

  // Jedan blog po ID-u
  .get("/blogs/:id", async ({ params }: { params: any }) => {
    const result = await pool.query(`SELECT * FROM blogs WHERE id = $1`, [params.id]);
    if (result.rows.length === 0) return { error: "Blog not found" };
    return result.rows[0];
  });