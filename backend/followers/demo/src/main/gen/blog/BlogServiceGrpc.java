package blog;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.62.2)",
    comments = "Source: blog/blog.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class BlogServiceGrpc {

  private BlogServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "blog.BlogService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<blog.BlogOuterClass.CreateBlogRequest,
      blog.BlogOuterClass.CreateBlogResponse> getCreateBlogMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateBlog",
      requestType = blog.BlogOuterClass.CreateBlogRequest.class,
      responseType = blog.BlogOuterClass.CreateBlogResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<blog.BlogOuterClass.CreateBlogRequest,
      blog.BlogOuterClass.CreateBlogResponse> getCreateBlogMethod() {
    io.grpc.MethodDescriptor<blog.BlogOuterClass.CreateBlogRequest, blog.BlogOuterClass.CreateBlogResponse> getCreateBlogMethod;
    if ((getCreateBlogMethod = BlogServiceGrpc.getCreateBlogMethod) == null) {
      synchronized (BlogServiceGrpc.class) {
        if ((getCreateBlogMethod = BlogServiceGrpc.getCreateBlogMethod) == null) {
          BlogServiceGrpc.getCreateBlogMethod = getCreateBlogMethod =
              io.grpc.MethodDescriptor.<blog.BlogOuterClass.CreateBlogRequest, blog.BlogOuterClass.CreateBlogResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateBlog"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  blog.BlogOuterClass.CreateBlogRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  blog.BlogOuterClass.CreateBlogResponse.getDefaultInstance()))
              .setSchemaDescriptor(new BlogServiceMethodDescriptorSupplier("CreateBlog"))
              .build();
        }
      }
    }
    return getCreateBlogMethod;
  }

  private static volatile io.grpc.MethodDescriptor<blog.BlogOuterClass.GetBlogsRequest,
      blog.BlogOuterClass.GetBlogsResponse> getGetBlogsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetBlogs",
      requestType = blog.BlogOuterClass.GetBlogsRequest.class,
      responseType = blog.BlogOuterClass.GetBlogsResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<blog.BlogOuterClass.GetBlogsRequest,
      blog.BlogOuterClass.GetBlogsResponse> getGetBlogsMethod() {
    io.grpc.MethodDescriptor<blog.BlogOuterClass.GetBlogsRequest, blog.BlogOuterClass.GetBlogsResponse> getGetBlogsMethod;
    if ((getGetBlogsMethod = BlogServiceGrpc.getGetBlogsMethod) == null) {
      synchronized (BlogServiceGrpc.class) {
        if ((getGetBlogsMethod = BlogServiceGrpc.getGetBlogsMethod) == null) {
          BlogServiceGrpc.getGetBlogsMethod = getGetBlogsMethod =
              io.grpc.MethodDescriptor.<blog.BlogOuterClass.GetBlogsRequest, blog.BlogOuterClass.GetBlogsResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetBlogs"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  blog.BlogOuterClass.GetBlogsRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  blog.BlogOuterClass.GetBlogsResponse.getDefaultInstance()))
              .setSchemaDescriptor(new BlogServiceMethodDescriptorSupplier("GetBlogs"))
              .build();
        }
      }
    }
    return getGetBlogsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<blog.BlogOuterClass.GetBlogsByUserRequest,
      blog.BlogOuterClass.GetBlogsByUserResponse> getGetBlogsByUserMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetBlogsByUser",
      requestType = blog.BlogOuterClass.GetBlogsByUserRequest.class,
      responseType = blog.BlogOuterClass.GetBlogsByUserResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<blog.BlogOuterClass.GetBlogsByUserRequest,
      blog.BlogOuterClass.GetBlogsByUserResponse> getGetBlogsByUserMethod() {
    io.grpc.MethodDescriptor<blog.BlogOuterClass.GetBlogsByUserRequest, blog.BlogOuterClass.GetBlogsByUserResponse> getGetBlogsByUserMethod;
    if ((getGetBlogsByUserMethod = BlogServiceGrpc.getGetBlogsByUserMethod) == null) {
      synchronized (BlogServiceGrpc.class) {
        if ((getGetBlogsByUserMethod = BlogServiceGrpc.getGetBlogsByUserMethod) == null) {
          BlogServiceGrpc.getGetBlogsByUserMethod = getGetBlogsByUserMethod =
              io.grpc.MethodDescriptor.<blog.BlogOuterClass.GetBlogsByUserRequest, blog.BlogOuterClass.GetBlogsByUserResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetBlogsByUser"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  blog.BlogOuterClass.GetBlogsByUserRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  blog.BlogOuterClass.GetBlogsByUserResponse.getDefaultInstance()))
              .setSchemaDescriptor(new BlogServiceMethodDescriptorSupplier("GetBlogsByUser"))
              .build();
        }
      }
    }
    return getGetBlogsByUserMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static BlogServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<BlogServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<BlogServiceStub>() {
        @java.lang.Override
        public BlogServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new BlogServiceStub(channel, callOptions);
        }
      };
    return BlogServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static BlogServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<BlogServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<BlogServiceBlockingStub>() {
        @java.lang.Override
        public BlogServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new BlogServiceBlockingStub(channel, callOptions);
        }
      };
    return BlogServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static BlogServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<BlogServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<BlogServiceFutureStub>() {
        @java.lang.Override
        public BlogServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new BlogServiceFutureStub(channel, callOptions);
        }
      };
    return BlogServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public interface AsyncService {

    /**
     */
    default void createBlog(blog.BlogOuterClass.CreateBlogRequest request,
        io.grpc.stub.StreamObserver<blog.BlogOuterClass.CreateBlogResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateBlogMethod(), responseObserver);
    }

    /**
     */
    default void getBlogs(blog.BlogOuterClass.GetBlogsRequest request,
        io.grpc.stub.StreamObserver<blog.BlogOuterClass.GetBlogsResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetBlogsMethod(), responseObserver);
    }

    /**
     */
    default void getBlogsByUser(blog.BlogOuterClass.GetBlogsByUserRequest request,
        io.grpc.stub.StreamObserver<blog.BlogOuterClass.GetBlogsByUserResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetBlogsByUserMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service BlogService.
   */
  public static abstract class BlogServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return BlogServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service BlogService.
   */
  public static final class BlogServiceStub
      extends io.grpc.stub.AbstractAsyncStub<BlogServiceStub> {
    private BlogServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected BlogServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new BlogServiceStub(channel, callOptions);
    }

    /**
     */
    public void createBlog(blog.BlogOuterClass.CreateBlogRequest request,
        io.grpc.stub.StreamObserver<blog.BlogOuterClass.CreateBlogResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateBlogMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getBlogs(blog.BlogOuterClass.GetBlogsRequest request,
        io.grpc.stub.StreamObserver<blog.BlogOuterClass.GetBlogsResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetBlogsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getBlogsByUser(blog.BlogOuterClass.GetBlogsByUserRequest request,
        io.grpc.stub.StreamObserver<blog.BlogOuterClass.GetBlogsByUserResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetBlogsByUserMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service BlogService.
   */
  public static final class BlogServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<BlogServiceBlockingStub> {
    private BlogServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected BlogServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new BlogServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public blog.BlogOuterClass.CreateBlogResponse createBlog(blog.BlogOuterClass.CreateBlogRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateBlogMethod(), getCallOptions(), request);
    }

    /**
     */
    public blog.BlogOuterClass.GetBlogsResponse getBlogs(blog.BlogOuterClass.GetBlogsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetBlogsMethod(), getCallOptions(), request);
    }

    /**
     */
    public blog.BlogOuterClass.GetBlogsByUserResponse getBlogsByUser(blog.BlogOuterClass.GetBlogsByUserRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetBlogsByUserMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service BlogService.
   */
  public static final class BlogServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<BlogServiceFutureStub> {
    private BlogServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected BlogServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new BlogServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<blog.BlogOuterClass.CreateBlogResponse> createBlog(
        blog.BlogOuterClass.CreateBlogRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateBlogMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<blog.BlogOuterClass.GetBlogsResponse> getBlogs(
        blog.BlogOuterClass.GetBlogsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetBlogsMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<blog.BlogOuterClass.GetBlogsByUserResponse> getBlogsByUser(
        blog.BlogOuterClass.GetBlogsByUserRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetBlogsByUserMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_BLOG = 0;
  private static final int METHODID_GET_BLOGS = 1;
  private static final int METHODID_GET_BLOGS_BY_USER = 2;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final AsyncService serviceImpl;
    private final int methodId;

    MethodHandlers(AsyncService serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE_BLOG:
          serviceImpl.createBlog((blog.BlogOuterClass.CreateBlogRequest) request,
              (io.grpc.stub.StreamObserver<blog.BlogOuterClass.CreateBlogResponse>) responseObserver);
          break;
        case METHODID_GET_BLOGS:
          serviceImpl.getBlogs((blog.BlogOuterClass.GetBlogsRequest) request,
              (io.grpc.stub.StreamObserver<blog.BlogOuterClass.GetBlogsResponse>) responseObserver);
          break;
        case METHODID_GET_BLOGS_BY_USER:
          serviceImpl.getBlogsByUser((blog.BlogOuterClass.GetBlogsByUserRequest) request,
              (io.grpc.stub.StreamObserver<blog.BlogOuterClass.GetBlogsByUserResponse>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  public static final io.grpc.ServerServiceDefinition bindService(AsyncService service) {
    return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
        .addMethod(
          getCreateBlogMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              blog.BlogOuterClass.CreateBlogRequest,
              blog.BlogOuterClass.CreateBlogResponse>(
                service, METHODID_CREATE_BLOG)))
        .addMethod(
          getGetBlogsMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              blog.BlogOuterClass.GetBlogsRequest,
              blog.BlogOuterClass.GetBlogsResponse>(
                service, METHODID_GET_BLOGS)))
        .addMethod(
          getGetBlogsByUserMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              blog.BlogOuterClass.GetBlogsByUserRequest,
              blog.BlogOuterClass.GetBlogsByUserResponse>(
                service, METHODID_GET_BLOGS_BY_USER)))
        .build();
  }

  private static abstract class BlogServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    BlogServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return blog.BlogOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("BlogService");
    }
  }

  private static final class BlogServiceFileDescriptorSupplier
      extends BlogServiceBaseDescriptorSupplier {
    BlogServiceFileDescriptorSupplier() {}
  }

  private static final class BlogServiceMethodDescriptorSupplier
      extends BlogServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    BlogServiceMethodDescriptorSupplier(java.lang.String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (BlogServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new BlogServiceFileDescriptorSupplier())
              .addMethod(getCreateBlogMethod())
              .addMethod(getGetBlogsMethod())
              .addMethod(getGetBlogsByUserMethod())
              .build();
        }
      }
    }
    return result;
  }
}
