package tours;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.58.0)",
    comments = "Source: tours/tours.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class ToursServiceGrpc {

  private ToursServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "tours.ToursService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<tours.Tours.CreateTourRequest,
      tours.Tours.CreateTourResponse> getCreateTourMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateTour",
      requestType = tours.Tours.CreateTourRequest.class,
      responseType = tours.Tours.CreateTourResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<tours.Tours.CreateTourRequest,
      tours.Tours.CreateTourResponse> getCreateTourMethod() {
    io.grpc.MethodDescriptor<tours.Tours.CreateTourRequest, tours.Tours.CreateTourResponse> getCreateTourMethod;
    if ((getCreateTourMethod = ToursServiceGrpc.getCreateTourMethod) == null) {
      synchronized (ToursServiceGrpc.class) {
        if ((getCreateTourMethod = ToursServiceGrpc.getCreateTourMethod) == null) {
          ToursServiceGrpc.getCreateTourMethod = getCreateTourMethod =
              io.grpc.MethodDescriptor.<tours.Tours.CreateTourRequest, tours.Tours.CreateTourResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateTour"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  tours.Tours.CreateTourRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  tours.Tours.CreateTourResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ToursServiceMethodDescriptorSupplier("CreateTour"))
              .build();
        }
      }
    }
    return getCreateTourMethod;
  }

  private static volatile io.grpc.MethodDescriptor<tours.Tours.GetToursRequest,
      tours.Tours.GetToursResponse> getGetToursMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetTours",
      requestType = tours.Tours.GetToursRequest.class,
      responseType = tours.Tours.GetToursResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<tours.Tours.GetToursRequest,
      tours.Tours.GetToursResponse> getGetToursMethod() {
    io.grpc.MethodDescriptor<tours.Tours.GetToursRequest, tours.Tours.GetToursResponse> getGetToursMethod;
    if ((getGetToursMethod = ToursServiceGrpc.getGetToursMethod) == null) {
      synchronized (ToursServiceGrpc.class) {
        if ((getGetToursMethod = ToursServiceGrpc.getGetToursMethod) == null) {
          ToursServiceGrpc.getGetToursMethod = getGetToursMethod =
              io.grpc.MethodDescriptor.<tours.Tours.GetToursRequest, tours.Tours.GetToursResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetTours"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  tours.Tours.GetToursRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  tours.Tours.GetToursResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ToursServiceMethodDescriptorSupplier("GetTours"))
              .build();
        }
      }
    }
    return getGetToursMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static ToursServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ToursServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<ToursServiceStub>() {
        @java.lang.Override
        public ToursServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new ToursServiceStub(channel, callOptions);
        }
      };
    return ToursServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static ToursServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ToursServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<ToursServiceBlockingStub>() {
        @java.lang.Override
        public ToursServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new ToursServiceBlockingStub(channel, callOptions);
        }
      };
    return ToursServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static ToursServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ToursServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<ToursServiceFutureStub>() {
        @java.lang.Override
        public ToursServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new ToursServiceFutureStub(channel, callOptions);
        }
      };
    return ToursServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public interface AsyncService {

    /**
     */
    default void createTour(tours.Tours.CreateTourRequest request,
        io.grpc.stub.StreamObserver<tours.Tours.CreateTourResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateTourMethod(), responseObserver);
    }

    /**
     */
    default void getTours(tours.Tours.GetToursRequest request,
        io.grpc.stub.StreamObserver<tours.Tours.GetToursResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetToursMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service ToursService.
   */
  public static abstract class ToursServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return ToursServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service ToursService.
   */
  public static final class ToursServiceStub
      extends io.grpc.stub.AbstractAsyncStub<ToursServiceStub> {
    private ToursServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ToursServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ToursServiceStub(channel, callOptions);
    }

    /**
     */
    public void createTour(tours.Tours.CreateTourRequest request,
        io.grpc.stub.StreamObserver<tours.Tours.CreateTourResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateTourMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getTours(tours.Tours.GetToursRequest request,
        io.grpc.stub.StreamObserver<tours.Tours.GetToursResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetToursMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service ToursService.
   */
  public static final class ToursServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<ToursServiceBlockingStub> {
    private ToursServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ToursServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ToursServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public tours.Tours.CreateTourResponse createTour(tours.Tours.CreateTourRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateTourMethod(), getCallOptions(), request);
    }

    /**
     */
    public tours.Tours.GetToursResponse getTours(tours.Tours.GetToursRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetToursMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service ToursService.
   */
  public static final class ToursServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<ToursServiceFutureStub> {
    private ToursServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ToursServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ToursServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<tours.Tours.CreateTourResponse> createTour(
        tours.Tours.CreateTourRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateTourMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<tours.Tours.GetToursResponse> getTours(
        tours.Tours.GetToursRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetToursMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_TOUR = 0;
  private static final int METHODID_GET_TOURS = 1;

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
        case METHODID_CREATE_TOUR:
          serviceImpl.createTour((tours.Tours.CreateTourRequest) request,
              (io.grpc.stub.StreamObserver<tours.Tours.CreateTourResponse>) responseObserver);
          break;
        case METHODID_GET_TOURS:
          serviceImpl.getTours((tours.Tours.GetToursRequest) request,
              (io.grpc.stub.StreamObserver<tours.Tours.GetToursResponse>) responseObserver);
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
          getCreateTourMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              tours.Tours.CreateTourRequest,
              tours.Tours.CreateTourResponse>(
                service, METHODID_CREATE_TOUR)))
        .addMethod(
          getGetToursMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              tours.Tours.GetToursRequest,
              tours.Tours.GetToursResponse>(
                service, METHODID_GET_TOURS)))
        .build();
  }

  private static abstract class ToursServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    ToursServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return tours.Tours.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("ToursService");
    }
  }

  private static final class ToursServiceFileDescriptorSupplier
      extends ToursServiceBaseDescriptorSupplier {
    ToursServiceFileDescriptorSupplier() {}
  }

  private static final class ToursServiceMethodDescriptorSupplier
      extends ToursServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    ToursServiceMethodDescriptorSupplier(java.lang.String methodName) {
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
      synchronized (ToursServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new ToursServiceFileDescriptorSupplier())
              .addMethod(getCreateTourMethod())
              .addMethod(getGetToursMethod())
              .build();
        }
      }
    }
    return result;
  }
}
