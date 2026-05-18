import * as grpc from '@grpc/grpc-js';
import { BlogServiceService } from '../gen/blog/blog_grpc_pb';
import {db} from "./db/client";


import {
    CreateBlogRequest,
    CreateBlogResponse,
    GetBlogsRequest,
    GetBlogsResponse,
    GetBlogsByUserRequest,
    GetBlogsByUserResponse,
    Blog
} from '../gen/blog/blog_pb';

function mapRows(rows: any[]): Blog []{
	return rows.map(row => {
		const blog = new Blog();
		blog.setId(row._id?.toString() || "");
		blog.setUserId(row.user_id);
		blog.setTitle(row.title);
		blog.setDescription(row.description);
		blog.setImagesList(row.images || []);
		return blog;
	});
}

const createBlog = async (
	call: grpc.ServerUnaryCall<CreateBlogRequest, CreateBlogResponse>,
	callback: grpc.sendUnaryData<CreateBlogResponse>
) => {

	try{
		const user = call.request.getUser();
		const userId = user?.getUserId();

		if (!userId) {
			callback({
				code: grpc.status.UNAUTHENTICATED,
				message: "User missing"
			} as any, null);

			return;
		}

		const title = call.request.getTitle();
		const description = call.request.getDescription();
		const images = call.request.getImagesList();

		const blogs = db.collection("blogs");
		// console.log("createBlog called by user:", user?.getUserId());

		const result = await blogs.insertOne({

			user_id: user?.getUserId(),
			title,
			description,
			images,
			createdAt: new Date()

		});

		const blog = new Blog();
		blog.setId(result.insertedId.toString());
		blog.setUserId(user?.getUserId() || "");
		blog.setTitle(title);
		blog.setDescription(description);
		blog.setImagesList(images);

		const response = new CreateBlogResponse();
		response.setBlog(blog);

		callback(null, response);
	} catch (err){
		callback({
			code: grpc.status.INTERNAL,
			message: "Database error"
		} as any, null);		
	}
}

const getBlogs = async (
    call: grpc.ServerUnaryCall<GetBlogsRequest, GetBlogsResponse>,
    callback: grpc.sendUnaryData<GetBlogsResponse>
) => {
	try{
		const blogs = db.collection("blogs");
		const result = await blogs
				.find()
				.sort({ createdAt: -1 }) // najnoviji blogovi prvi
				.toArray();

		const response = new GetBlogsResponse(); // kreiranje praznog odgovora
		response.setBlogsList(mapRows(result)); // mapiranje MongoDB dokumenata na Blog poruke
    	callback(null, response);
	
	}catch (err){ // za slucaj da mongo pukne
		callback({
			code: grpc.status.INTERNAL,
			message: "Database error"
		} as any, null);
	}
	
};

const getBlogsByUser = async (
    call: grpc.ServerUnaryCall<GetBlogsByUserRequest, GetBlogsByUserResponse>,
    callback: grpc.sendUnaryData<GetBlogsByUserResponse>
) => {
	try 
	{

		const blogs = db.collection("blogs");
    	const userId = call.request.getUserId();
		if(!userId) {
			callback({
				code: grpc.status.INVALID_ARGUMENT,
				message: "userId is required"
			}as any, null);
			return;
		}


    	// console.log("getBlogsByUser called for user:", userId);

		const result = await blogs
				.find({ user_id: userId })
				.sort({ createdAt: -1 }) // najnoviji blogovi prvi
				.toArray();

		const response = new GetBlogsByUserResponse();
		response.setBlogsList(mapRows(result));
    	callback(null, response);
	} catch (err) {
		callback({
			code: grpc.status.INTERNAL,
			message: "Database error"
		} as any, null);
	}
	
};

export function createGrpcServer(port: number) {
	const server = new grpc.Server();

	server.addService(BlogServiceService as any, {
		createBlog,
		getBlogs,
		getBlogsByUser,
	});

	// const reflection = require("@grpc/reflection");
	// reflection.enableReflection(server);

	server.bindAsync(
		`0.0.0.0:${port}`,
		grpc.ServerCredentials.createInsecure(),
		(err, port) => {
			if (err) {
				console.error('failed to bind server:', err);
				return;
			}
			console.log(`blog gRPC server listening on port ${port}`);
		}
	);
}