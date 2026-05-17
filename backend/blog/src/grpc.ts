import * as grpc from '@grpc/grpc-js';
import { BlogServiceService } from '../gen/blog/blog_grpc_pb';
import {
    CreateBlogRequest,
    CreateBlogResponse,
    GetBlogsRequest,
    GetBlogsResponse,
    GetBlogsByUserRequest,
    GetBlogsByUserResponse,
    Blog
} from '../gen/blog/blog_pb';
import { pool } from './db/client';

function mapRows(rows: [any]): Blog {
	return rows.map(row => {
		const blog = new Blog();
		blog.setId(row.id.toString());
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
	const user = call.request.getUser();
	const title = call.request.getTitle();
	const description = call.request.getDescription();
	const images = call.request.getImages();

	// console.log("createBlog called by user:", user?.getUserId());

	const result = await pool.query(
		`INSERT INTO blogs (user_id, title, description, images)
		VALUES ($1, $2, $3, $4) RETURNING *`,
		[user.id, title, description, images || []]
	);

	const blog = new Blog();
	blog.setId(result.rows[0].id);
	blog.setUserId(user?.getUserId() || "");
	blog.setTitle(title);
	blog.setDescription(description);
	blog.setImagesList(images);

	const response = new CreateBlogResponse();
	response.setBlog(Blog);

	callback(null, blog);
}

const getBlogs = async (
    call: grpc.ServerUnaryCall<GetBlogsRequest, GetBlogsResponse>,
    callback: grpc.sendUnaryData<GetBlogsResponse>
) => {
	const result = await pool.query(`SELECT * FROM blogs ORDER BY created_at DESC`);

    const response = new GetBlogsResponse();
	response.setBlogsList(mapRows(result.rows));

    callback(null, response);
};

const getBlogsByUser = async (
    call: grpc.ServerUnaryCall<GetBlogsByUserRequest, GetBlogsByUserResponse>,
    callback: grpc.sendUnaryData<GetBlogsByUserResponse>
) => {
    const user = call.request.getUser();
    // console.log("getBlogsByUser called for user:", userId);
	const result = await pool.query('SELECT * FROM blogs WHERE user_id = $1', [user.id]);

    const response = new GetBlogsByUserResponse();
	if (result.rows.length !== 0) {
		response.setBlogsList(result.rows);
	} else {
		response.setBlogsList([]);
	}

    callback(null, response);
};

export function createGrpcServer(port: number) {
	const server = new grpc.Server();

	server.addService(BlogServiceService, {
		createBlog,
		getBlogs,
		getBlogsByUser,
	});

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
