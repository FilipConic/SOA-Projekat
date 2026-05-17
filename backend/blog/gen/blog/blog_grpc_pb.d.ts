// package: blog
// file: blog/blog.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as blog_blog_pb from "../blog/blog_pb";
import * as common_user_pb from "../common/user_pb";

interface IBlogServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createBlog: IBlogServiceService_ICreateBlog;
    getBlogs: IBlogServiceService_IGetBlogs;
    getBlogsByUser: IBlogServiceService_IGetBlogsByUser;
}

interface IBlogServiceService_ICreateBlog extends grpc.MethodDefinition<blog_blog_pb.CreateBlogRequest, blog_blog_pb.CreateBlogResponse> {
    path: "/blog.BlogService/CreateBlog";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<blog_blog_pb.CreateBlogRequest>;
    requestDeserialize: grpc.deserialize<blog_blog_pb.CreateBlogRequest>;
    responseSerialize: grpc.serialize<blog_blog_pb.CreateBlogResponse>;
    responseDeserialize: grpc.deserialize<blog_blog_pb.CreateBlogResponse>;
}
interface IBlogServiceService_IGetBlogs extends grpc.MethodDefinition<blog_blog_pb.GetBlogsRequest, blog_blog_pb.GetBlogsResponse> {
    path: "/blog.BlogService/GetBlogs";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<blog_blog_pb.GetBlogsRequest>;
    requestDeserialize: grpc.deserialize<blog_blog_pb.GetBlogsRequest>;
    responseSerialize: grpc.serialize<blog_blog_pb.GetBlogsResponse>;
    responseDeserialize: grpc.deserialize<blog_blog_pb.GetBlogsResponse>;
}
interface IBlogServiceService_IGetBlogsByUser extends grpc.MethodDefinition<blog_blog_pb.GetBlogsByUserRequest, blog_blog_pb.GetBlogsByUserResponse> {
    path: "/blog.BlogService/GetBlogsByUser";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<blog_blog_pb.GetBlogsByUserRequest>;
    requestDeserialize: grpc.deserialize<blog_blog_pb.GetBlogsByUserRequest>;
    responseSerialize: grpc.serialize<blog_blog_pb.GetBlogsByUserResponse>;
    responseDeserialize: grpc.deserialize<blog_blog_pb.GetBlogsByUserResponse>;
}

export const BlogServiceService: IBlogServiceService;

export interface IBlogServiceServer {
    createBlog: grpc.handleUnaryCall<blog_blog_pb.CreateBlogRequest, blog_blog_pb.CreateBlogResponse>;
    getBlogs: grpc.handleUnaryCall<blog_blog_pb.GetBlogsRequest, blog_blog_pb.GetBlogsResponse>;
    getBlogsByUser: grpc.handleUnaryCall<blog_blog_pb.GetBlogsByUserRequest, blog_blog_pb.GetBlogsByUserResponse>;
}

export interface IBlogServiceClient {
    createBlog(request: blog_blog_pb.CreateBlogRequest, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.CreateBlogResponse) => void): grpc.ClientUnaryCall;
    createBlog(request: blog_blog_pb.CreateBlogRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.CreateBlogResponse) => void): grpc.ClientUnaryCall;
    createBlog(request: blog_blog_pb.CreateBlogRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.CreateBlogResponse) => void): grpc.ClientUnaryCall;
    getBlogs(request: blog_blog_pb.GetBlogsRequest, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsResponse) => void): grpc.ClientUnaryCall;
    getBlogs(request: blog_blog_pb.GetBlogsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsResponse) => void): grpc.ClientUnaryCall;
    getBlogs(request: blog_blog_pb.GetBlogsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsResponse) => void): grpc.ClientUnaryCall;
    getBlogsByUser(request: blog_blog_pb.GetBlogsByUserRequest, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsByUserResponse) => void): grpc.ClientUnaryCall;
    getBlogsByUser(request: blog_blog_pb.GetBlogsByUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsByUserResponse) => void): grpc.ClientUnaryCall;
    getBlogsByUser(request: blog_blog_pb.GetBlogsByUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsByUserResponse) => void): grpc.ClientUnaryCall;
}

export class BlogServiceClient extends grpc.Client implements IBlogServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public createBlog(request: blog_blog_pb.CreateBlogRequest, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.CreateBlogResponse) => void): grpc.ClientUnaryCall;
    public createBlog(request: blog_blog_pb.CreateBlogRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.CreateBlogResponse) => void): grpc.ClientUnaryCall;
    public createBlog(request: blog_blog_pb.CreateBlogRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.CreateBlogResponse) => void): grpc.ClientUnaryCall;
    public getBlogs(request: blog_blog_pb.GetBlogsRequest, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsResponse) => void): grpc.ClientUnaryCall;
    public getBlogs(request: blog_blog_pb.GetBlogsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsResponse) => void): grpc.ClientUnaryCall;
    public getBlogs(request: blog_blog_pb.GetBlogsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsResponse) => void): grpc.ClientUnaryCall;
    public getBlogsByUser(request: blog_blog_pb.GetBlogsByUserRequest, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsByUserResponse) => void): grpc.ClientUnaryCall;
    public getBlogsByUser(request: blog_blog_pb.GetBlogsByUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsByUserResponse) => void): grpc.ClientUnaryCall;
    public getBlogsByUser(request: blog_blog_pb.GetBlogsByUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: blog_blog_pb.GetBlogsByUserResponse) => void): grpc.ClientUnaryCall;
}
