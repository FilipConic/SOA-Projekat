package followers;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.62.2)",
    comments = "Source: followers/followers.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class FollowersServiceGrpc {

  private FollowersServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "followers.FollowersService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<followers.Followers.FollowUserRequest,
      followers.Followers.FollowUserResponse> getFollowUserMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "FollowUser",
      requestType = followers.Followers.FollowUserRequest.class,
      responseType = followers.Followers.FollowUserResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<followers.Followers.FollowUserRequest,
      followers.Followers.FollowUserResponse> getFollowUserMethod() {
    io.grpc.MethodDescriptor<followers.Followers.FollowUserRequest, followers.Followers.FollowUserResponse> getFollowUserMethod;
    if ((getFollowUserMethod = FollowersServiceGrpc.getFollowUserMethod) == null) {
      synchronized (FollowersServiceGrpc.class) {
        if ((getFollowUserMethod = FollowersServiceGrpc.getFollowUserMethod) == null) {
          FollowersServiceGrpc.getFollowUserMethod = getFollowUserMethod =
              io.grpc.MethodDescriptor.<followers.Followers.FollowUserRequest, followers.Followers.FollowUserResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "FollowUser"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  followers.Followers.FollowUserRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  followers.Followers.FollowUserResponse.getDefaultInstance()))
              .setSchemaDescriptor(new FollowersServiceMethodDescriptorSupplier("FollowUser"))
              .build();
        }
      }
    }
    return getFollowUserMethod;
  }

  private static volatile io.grpc.MethodDescriptor<followers.Followers.UnfollowUserRequest,
      followers.Followers.UnfollowUserResponse> getUnfollowUserMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UnfollowUser",
      requestType = followers.Followers.UnfollowUserRequest.class,
      responseType = followers.Followers.UnfollowUserResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<followers.Followers.UnfollowUserRequest,
      followers.Followers.UnfollowUserResponse> getUnfollowUserMethod() {
    io.grpc.MethodDescriptor<followers.Followers.UnfollowUserRequest, followers.Followers.UnfollowUserResponse> getUnfollowUserMethod;
    if ((getUnfollowUserMethod = FollowersServiceGrpc.getUnfollowUserMethod) == null) {
      synchronized (FollowersServiceGrpc.class) {
        if ((getUnfollowUserMethod = FollowersServiceGrpc.getUnfollowUserMethod) == null) {
          FollowersServiceGrpc.getUnfollowUserMethod = getUnfollowUserMethod =
              io.grpc.MethodDescriptor.<followers.Followers.UnfollowUserRequest, followers.Followers.UnfollowUserResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UnfollowUser"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  followers.Followers.UnfollowUserRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  followers.Followers.UnfollowUserResponse.getDefaultInstance()))
              .setSchemaDescriptor(new FollowersServiceMethodDescriptorSupplier("UnfollowUser"))
              .build();
        }
      }
    }
    return getUnfollowUserMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static FollowersServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<FollowersServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<FollowersServiceStub>() {
        @java.lang.Override
        public FollowersServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new FollowersServiceStub(channel, callOptions);
        }
      };
    return FollowersServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static FollowersServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<FollowersServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<FollowersServiceBlockingStub>() {
        @java.lang.Override
        public FollowersServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new FollowersServiceBlockingStub(channel, callOptions);
        }
      };
    return FollowersServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static FollowersServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<FollowersServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<FollowersServiceFutureStub>() {
        @java.lang.Override
        public FollowersServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new FollowersServiceFutureStub(channel, callOptions);
        }
      };
    return FollowersServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public interface AsyncService {

    /**
     */
    default void followUser(followers.Followers.FollowUserRequest request,
        io.grpc.stub.StreamObserver<followers.Followers.FollowUserResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getFollowUserMethod(), responseObserver);
    }

    /**
     */
    default void unfollowUser(followers.Followers.UnfollowUserRequest request,
        io.grpc.stub.StreamObserver<followers.Followers.UnfollowUserResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUnfollowUserMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service FollowersService.
   */
  public static abstract class FollowersServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return FollowersServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service FollowersService.
   */
  public static final class FollowersServiceStub
      extends io.grpc.stub.AbstractAsyncStub<FollowersServiceStub> {
    private FollowersServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected FollowersServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new FollowersServiceStub(channel, callOptions);
    }

    /**
     */
    public void followUser(followers.Followers.FollowUserRequest request,
        io.grpc.stub.StreamObserver<followers.Followers.FollowUserResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getFollowUserMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void unfollowUser(followers.Followers.UnfollowUserRequest request,
        io.grpc.stub.StreamObserver<followers.Followers.UnfollowUserResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUnfollowUserMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service FollowersService.
   */
  public static final class FollowersServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<FollowersServiceBlockingStub> {
    private FollowersServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected FollowersServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new FollowersServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public followers.Followers.FollowUserResponse followUser(followers.Followers.FollowUserRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getFollowUserMethod(), getCallOptions(), request);
    }

    /**
     */
    public followers.Followers.UnfollowUserResponse unfollowUser(followers.Followers.UnfollowUserRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUnfollowUserMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service FollowersService.
   */
  public static final class FollowersServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<FollowersServiceFutureStub> {
    private FollowersServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected FollowersServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new FollowersServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<followers.Followers.FollowUserResponse> followUser(
        followers.Followers.FollowUserRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getFollowUserMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<followers.Followers.UnfollowUserResponse> unfollowUser(
        followers.Followers.UnfollowUserRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUnfollowUserMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_FOLLOW_USER = 0;
  private static final int METHODID_UNFOLLOW_USER = 1;

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
        case METHODID_FOLLOW_USER:
          serviceImpl.followUser((followers.Followers.FollowUserRequest) request,
              (io.grpc.stub.StreamObserver<followers.Followers.FollowUserResponse>) responseObserver);
          break;
        case METHODID_UNFOLLOW_USER:
          serviceImpl.unfollowUser((followers.Followers.UnfollowUserRequest) request,
              (io.grpc.stub.StreamObserver<followers.Followers.UnfollowUserResponse>) responseObserver);
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
          getFollowUserMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              followers.Followers.FollowUserRequest,
              followers.Followers.FollowUserResponse>(
                service, METHODID_FOLLOW_USER)))
        .addMethod(
          getUnfollowUserMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              followers.Followers.UnfollowUserRequest,
              followers.Followers.UnfollowUserResponse>(
                service, METHODID_UNFOLLOW_USER)))
        .build();
  }

  private static abstract class FollowersServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    FollowersServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return followers.Followers.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("FollowersService");
    }
  }

  private static final class FollowersServiceFileDescriptorSupplier
      extends FollowersServiceBaseDescriptorSupplier {
    FollowersServiceFileDescriptorSupplier() {}
  }

  private static final class FollowersServiceMethodDescriptorSupplier
      extends FollowersServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    FollowersServiceMethodDescriptorSupplier(java.lang.String methodName) {
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
      synchronized (FollowersServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new FollowersServiceFileDescriptorSupplier())
              .addMethod(getFollowUserMethod())
              .addMethod(getUnfollowUserMethod())
              .build();
        }
      }
    }
    return result;
  }
}
