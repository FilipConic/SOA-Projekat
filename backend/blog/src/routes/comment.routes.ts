import { Elysia } from "elysia";
import {db} from "../db/client";
import {ObjectId} from "mongodb";


/*
SQL      MONGO
----------------------
SELECT   find/findOne
INSERT   insertOne
UPDATE   updateOne
DELETE   deleteOne/deleteMany
COUNT    countDocuments

*/

export const commentRoutes = new Elysia()
	// dodaj komentar
	// POST
	.post("/api/blog/comments/new/:blog_id", async ({ headers, params, body }) => {
		const user_id = headers['x-user-id'];
		const { text} = body as { text: string };

		const comments = db.collection("comments");
		
		const resule = await comments.insertOne({

			blog_id: params.blog_id,
			user_id,
			text,
			createdAt: new Date()

		}); // SQL: INSERT INTO comments (user_id, blog_id, text, created_at) VALUES ($1, $2, $3, $4)
	})

	// svi komentari bloga
	// GET
	.get("/api/blog/comments/find_all/:blog_id", async ({ params }) => {
		
		const comments = db.collection("comments");
		const result = await comments
			.find({blog_id: params.blog_id })
			.sort({ createdAt: -1 }) // najnoviji komentari prvi
			.toArray();
		
		return result;


	}) // SQL: SELECT * FROM comments WHERE blog_id = $1 ORDER BY created_at DESC

	// broj komentara za blog
	// GET
	.get("/api/blog/comments/count/:blog_id", async ({ params }) => {

		const comments = db.collection("comments");
		const total = await comments.countDocuments({ blog_id: params.blog_id }); 
		
		return { blog_id: params.blog_id, total };

	}) // SQL: SELECT COUNT(*) FROM comments WHERE blog_id = $1

	// svi komentari korisnika
	// GET
	.get("/api/blog/comments/user/find_all/:user_id", async ({ params }) => {
		
		const comments = db.collection("comments");
		const result = await comments
			.find({user_id: params.user_id })
			.sort({ createdAt: -1 }) // najnoviji komentari prvi
			.toArray();

		if (result.length === 0)  
		{ 
			return { message: "No comments found for user" };
		};

		return result;

	})

	// izmena komentara
	// PUT
	.put("/api/blog/comments/edit/:comment_id", async ({ params, body }) => {

		const comments = db.collection("comments");
		const { text } = body as { text: string };

		const result = await comments.updateOne(
			{ _id: new ObjectId(params.comment_id) }, // filter za pronalazak komentara koji se menja
			{
				$set: {
					text,
					editedAt: new Date()
				}
			}
		); // SQL: UPDATE comments SET text = $1, edited_at = $2 WHERE id = $3

		if (result.matchedCount === 0) {
			return { message: "Comment not found" };
		}

		return { message: "Comment updated successfully" };
	})

	// brisanje komentara
	// DELETE
	.delete("/api/blog/comments/delete/:comment_id", async ({ params }) => {

		const comments = db.collection("comments");
		const result = await comments.deleteOne({ _id: new ObjectId(params.comment_id) }); 

		if (result.deletedCount === 0) {
			return { message: "Comment not found" };
		}

		return { message: "Comment deleted successfully" };

		}); // SQL: DELETE FROM comments WHERE id = $1