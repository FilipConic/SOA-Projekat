import * as grpc from '@grpc/grpc-js';
import { v4 as uuidv4 } from 'uuid';
import { BlogServiceService } from '../gen/blog/blog_grpc_pb';
import {
    CreateBlogRequest,
    CreateBlogResponse,
    GetBlogRequest,
    GetBlogResponse,
    GetBlogsByUserRequest,
    GetBlogsByUserResponse,
    Blog
} from '../gen/blog/blog_pb';

const createBlog = (
	call: grpc.ServerUnaryCall<CreateBlogRequest, CreateBlogResponse>,
	callback: grpc.sendUnaryData<CreateBlogResponse>
) => {
	const user = call.request.getUser();
	const title = call.request.getTitle();
	const description = call.request.getDescription();
	const images = call.request.getImages();

	console.log("createBlog called by user:", user?.getUserId());

	const blog = new Blog();
	blog.setId(uuidv4());
	blog.setUserId(user?.getUserId() || "");
	blog.setTitle(title);
	blog.setDescription(description);
	blog.setImages(images);

	const response = new CreateBlogResponse();
	response.setBlog(Blog);

	callback(null, blog);
}

const getBlogs = (
    call: grpc.ServerUnaryCall<GetBlogRequest, GetBlogResponse>,
    callback: grpc.sendUnaryData<GetBlogResponse>
) => {
    const response = new GetBlogResponse();
    callback(null, response);
};

const getBlogsByUser = (
    call: grpc.ServerUnaryCall<GetBlogsByUserRequest, GetBlogsByUserResponse>,
    callback: grpc.sendUnaryData<GetBlogsByUserResponse>
) => {
    const userId = call.request.getUserId();
    console.log("getBlogsByUser called for user:", userId);

    const response = new GetBlogsByUserResponse();
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
