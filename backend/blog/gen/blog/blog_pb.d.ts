// package: blog
// file: blog/blog.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as common_user_pb from "../common/user_pb";

export class Blog extends jspb.Message { 
    getId(): string;
    setId(value: string): Blog;
    getUserId(): string;
    setUserId(value: string): Blog;
    getTitle(): string;
    setTitle(value: string): Blog;
    getDescription(): string;
    setDescription(value: string): Blog;
    clearImagesList(): void;
    getImagesList(): Array<string>;
    setImagesList(value: Array<string>): Blog;
    addImages(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Blog.AsObject;
    static toObject(includeInstance: boolean, msg: Blog): Blog.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Blog, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Blog;
    static deserializeBinaryFromReader(message: Blog, reader: jspb.BinaryReader): Blog;
}

export namespace Blog {
    export type AsObject = {
        id: string,
        userId: string,
        title: string,
        description: string,
        imagesList: Array<string>,
    }
}

export class CreateBlogRequest extends jspb.Message { 

    hasUser(): boolean;
    clearUser(): void;
    getUser(): common_user_pb.User | undefined;
    setUser(value?: common_user_pb.User): CreateBlogRequest;
    getTitle(): string;
    setTitle(value: string): CreateBlogRequest;
    getDescription(): string;
    setDescription(value: string): CreateBlogRequest;
    clearImagesList(): void;
    getImagesList(): Array<string>;
    setImagesList(value: Array<string>): CreateBlogRequest;
    addImages(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateBlogRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateBlogRequest): CreateBlogRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateBlogRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateBlogRequest;
    static deserializeBinaryFromReader(message: CreateBlogRequest, reader: jspb.BinaryReader): CreateBlogRequest;
}

export namespace CreateBlogRequest {
    export type AsObject = {
        user?: common_user_pb.User.AsObject,
        title: string,
        description: string,
        imagesList: Array<string>,
    }
}

export class CreateBlogResponse extends jspb.Message { 

    hasBlog(): boolean;
    clearBlog(): void;
    getBlog(): Blog | undefined;
    setBlog(value?: Blog): CreateBlogResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateBlogResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateBlogResponse): CreateBlogResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateBlogResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateBlogResponse;
    static deserializeBinaryFromReader(message: CreateBlogResponse, reader: jspb.BinaryReader): CreateBlogResponse;
}

export namespace CreateBlogResponse {
    export type AsObject = {
        blog?: Blog.AsObject,
    }
}

export class GetBlogRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBlogRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetBlogRequest): GetBlogRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBlogRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBlogRequest;
    static deserializeBinaryFromReader(message: GetBlogRequest, reader: jspb.BinaryReader): GetBlogRequest;
}

export namespace GetBlogRequest {
    export type AsObject = {
    }
}

export class GetBlogResponse extends jspb.Message { 
    clearBlogsList(): void;
    getBlogsList(): Array<Blog>;
    setBlogsList(value: Array<Blog>): GetBlogResponse;
    addBlogs(value?: Blog, index?: number): Blog;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBlogResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetBlogResponse): GetBlogResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBlogResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBlogResponse;
    static deserializeBinaryFromReader(message: GetBlogResponse, reader: jspb.BinaryReader): GetBlogResponse;
}

export namespace GetBlogResponse {
    export type AsObject = {
        blogsList: Array<Blog.AsObject>,
    }
}

export class GetBlogsByUserRequest extends jspb.Message { 
    getUserId(): string;
    setUserId(value: string): GetBlogsByUserRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBlogsByUserRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetBlogsByUserRequest): GetBlogsByUserRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBlogsByUserRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBlogsByUserRequest;
    static deserializeBinaryFromReader(message: GetBlogsByUserRequest, reader: jspb.BinaryReader): GetBlogsByUserRequest;
}

export namespace GetBlogsByUserRequest {
    export type AsObject = {
        userId: string,
    }
}

export class GetBlogsByUserResponse extends jspb.Message { 
    clearBlogsList(): void;
    getBlogsList(): Array<Blog>;
    setBlogsList(value: Array<Blog>): GetBlogsByUserResponse;
    addBlogs(value?: Blog, index?: number): Blog;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBlogsByUserResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetBlogsByUserResponse): GetBlogsByUserResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBlogsByUserResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBlogsByUserResponse;
    static deserializeBinaryFromReader(message: GetBlogsByUserResponse, reader: jspb.BinaryReader): GetBlogsByUserResponse;
}

export namespace GetBlogsByUserResponse {
    export type AsObject = {
        blogsList: Array<Blog.AsObject>,
    }
}
