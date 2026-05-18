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

export const blogRoutes = new Elysia()
	// dodaj like na blog za odredjenog usera
	// POST
	.post("/api/blog/like/:blog_id", async ({ headers, params }) => {
		const user_id = headers['x-user-id'];
		const blog_id = params.blog_id;
		const likes = db.collection("likes");

		const existingLike = await likes.findOne({ user_id, blog_id }); // da li vec postoji like od ovog usera za ovaj blog
		
		if (existingLike) {
			return { message: "Blog already liked by user" };
		}

		const result = await likes.insertOne({ user_id, blog_id, createdAt: new Date() }); // SQL: INSERT INTO likes (user_id, blog_id) VALUES ($1, $2)
		return {_id: result.insertedId};
	})

	// obrisi like sa bloga
	// DELETE
	.delete("/api/blog/rm_like/:blog_id", async ({ headers, params }) => {
		const user_id = headers['x-user-id'];
		const blog_id = params.blog_id;
		const likes = db.collection("likes");

		const result = await likes.deleteOne({ user_id, blog_id }); // SQL: DELETE FROM likes WHERE user_id = $1 AND blog_id = $2
		
		if (result.deletedCount === 0) {
			return { message: "Like not found for user on this blog" };
		}

		return { message: "Like removed",
			     removed: result.deletedCount };
		 

	})

	// prebroj lajkove bloga
	// GET
	.get("/api/blog/likes/:blog_id", async ({ params }) => {

		const likes = db.collection("likes");

		const total = await likes.countDocuments(
		{
			// SQL: SELECT COUNT(*) FROM likes WHERE blog_id = $1
			blog_id: params.blog_id 		// filter za prebrojavanje samo onih dokumenata koji imaju blog_id jednak prosledjenom parametru
		});

		return { blog_id: params.blog_id, total };
	})

	// pretraga po id
	// GET
	.get("/api/blog/find/:id", async ({ params }) => {
		// SQL: SELECT * FROM blogs WHERE id = $1
		const blogs = db.collection("blogs");
		const blog = await blogs.findOne({ _id: new ObjectId(params.id) });

		if (!blog) return { error: "Blog not found" };
		return blog;

	})

	// brisanje bloga
	// DELETE
	.delete("/api/blog/delete/:id", async ({ params }) => {
		
		const blogs = db.collection("blogs");
		const comments = db.collection("comments");

		// prvo brise komentare vezane za blog
		await comments.deleteMany({ blog_id: params.id }); // SQL: DELETE FROM comments WHERE blog_id = $1

		// zatim brise sam blog
		const result = await blogs.deleteOne({ _id: new ObjectId(params.id) }); // SQL: DELETE FROM blogs WHERE id = $1

		if (result.deletedCount === 0) {
			return { message: "Blog not found" };
		}

		return { message: "Blog and associated comments deleted"};
		
	})

	// uredjivanje bloga
	// PUT
	.put("/api/blog/edit/:id", async ({ headers, params, body }) => {
		
		const user_id = headers['x-user-id'];
		const blogs = db.collection("blogs");

		type BlogUpdate = {
			title?: string;
			description?: string;
			images?: string[];

		};

		const { title, description, images } = body as BlogUpdate;

		// provera vlasnika
		const existing = await blogs.findOne({ _id: new ObjectId(params.id), 
												user_id});

		if(!existing) {
			return { message: "Blog not found or user not authorized to edit this blog" };
		}

		const result = await blogs.updateOne(

			{ _id: new ObjectId(params.id) }, // filter za pronalazak bloga koji se menja
			{
				$set: {
					title,
					description,
					images,
					updatedAt: new Date()
				}
			}
		); // SQL: UPDATE blogs SET title = $1, description = $2, images = $3, updated_at = NOW() WHERE id = $4 RETURNING *

		return { message: "Blog updated", modified: result.modifiedCount };
	});
