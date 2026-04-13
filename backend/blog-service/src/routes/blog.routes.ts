import { Elysia } from "elysia";
import { pool } from "../db/client";

export const blogRoutes = new Elysia()

  // kreiranje bloga 
  // POST
  .post("/blogs", async ({ body }: { body: any }) => {
    const { title, description, images } = body;
    const result = await pool.query(
      `INSERT INTO blogs (title, description, images)
       VALUES ($1, $2, $3) RETURNING *`,
      [title, description, images || []]
    );
    return result.rows[0];
  })

  //  svi blogovi
  // GET
  .get("/blogs", async () => {
    const result = await pool.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
    return result.rows;
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
    // Prvo brise komentare vezane za blog
    await pool.query(`DELETE FROM comments WHERE blog_id = $1`, [params.id]);
    
    const result = await pool.query(
      `DELETE FROM blogs WHERE id = $1 RETURNING *`,
      [params.id]
    );
    if (result.rows.length === 0) return { error: "Blog not found" };
    return { message: "Blog deleted!" };
  })
  
  //uredjivanje bloga
  // PUT
  .put("/blogs/:id", async ({ params, body }: { params: any; body: any }) => {
    const { title, description, images } = body;
    const result = await pool.query(
      `UPDATE blogs SET title = $1, description = $2, images = $3 WHERE id = $4 RETURNING *`,
      [title, description, images || [], params.id]
    );
    if (result.rows.length === 0) return { error: "Blog not found" };
    return result.rows[0];
  })
  
  ;