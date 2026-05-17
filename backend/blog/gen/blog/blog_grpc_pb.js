// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var blog_blog_pb = require('../blog/blog_pb.js');
var google_api_annotations_pb = require('../google/api/annotations_pb.js');
var common_user_pb = require('../common/user_pb.js');

function serialize_blog_CreateBlogRequest(arg) {
  if (!(arg instanceof blog_blog_pb.CreateBlogRequest)) {
    throw new Error('Expected argument of type blog.CreateBlogRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_CreateBlogRequest(buffer_arg) {
  return blog_blog_pb.CreateBlogRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_blog_CreateBlogResponse(arg) {
  if (!(arg instanceof blog_blog_pb.CreateBlogResponse)) {
    throw new Error('Expected argument of type blog.CreateBlogResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_CreateBlogResponse(buffer_arg) {
  return blog_blog_pb.CreateBlogResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_blog_GetBlogRequest(arg) {
  if (!(arg instanceof blog_blog_pb.GetBlogRequest)) {
    throw new Error('Expected argument of type blog.GetBlogRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_GetBlogRequest(buffer_arg) {
  return blog_blog_pb.GetBlogRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_blog_GetBlogResponse(arg) {
  if (!(arg instanceof blog_blog_pb.GetBlogResponse)) {
    throw new Error('Expected argument of type blog.GetBlogResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_GetBlogResponse(buffer_arg) {
  return blog_blog_pb.GetBlogResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_blog_GetBlogsByUserRequest(arg) {
  if (!(arg instanceof blog_blog_pb.GetBlogsByUserRequest)) {
    throw new Error('Expected argument of type blog.GetBlogsByUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_GetBlogsByUserRequest(buffer_arg) {
  return blog_blog_pb.GetBlogsByUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_blog_GetBlogsByUserResponse(arg) {
  if (!(arg instanceof blog_blog_pb.GetBlogsByUserResponse)) {
    throw new Error('Expected argument of type blog.GetBlogsByUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_GetBlogsByUserResponse(buffer_arg) {
  return blog_blog_pb.GetBlogsByUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var BlogServiceService = exports.BlogServiceService = {
  createBlog: {
    path: '/blog.BlogService/CreateBlog',
    requestStream: false,
    responseStream: false,
    requestType: blog_blog_pb.CreateBlogRequest,
    responseType: blog_blog_pb.CreateBlogResponse,
    requestSerialize: serialize_blog_CreateBlogRequest,
    requestDeserialize: deserialize_blog_CreateBlogRequest,
    responseSerialize: serialize_blog_CreateBlogResponse,
    responseDeserialize: deserialize_blog_CreateBlogResponse,
  },
  getBlog: {
    path: '/blog.BlogService/GetBlog',
    requestStream: false,
    responseStream: false,
    requestType: blog_blog_pb.GetBlogRequest,
    responseType: blog_blog_pb.GetBlogResponse,
    requestSerialize: serialize_blog_GetBlogRequest,
    requestDeserialize: deserialize_blog_GetBlogRequest,
    responseSerialize: serialize_blog_GetBlogResponse,
    responseDeserialize: deserialize_blog_GetBlogResponse,
  },
  getBlogsByUser: {
    path: '/blog.BlogService/GetBlogsByUser',
    requestStream: false,
    responseStream: false,
    requestType: blog_blog_pb.GetBlogsByUserRequest,
    responseType: blog_blog_pb.GetBlogsByUserResponse,
    requestSerialize: serialize_blog_GetBlogsByUserRequest,
    requestDeserialize: deserialize_blog_GetBlogsByUserRequest,
    responseSerialize: serialize_blog_GetBlogsByUserResponse,
    responseDeserialize: deserialize_blog_GetBlogsByUserResponse,
  },
};

exports.BlogServiceClient = grpc.makeGenericClientConstructor(BlogServiceService, 'BlogService');

