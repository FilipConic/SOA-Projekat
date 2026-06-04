package com.example.grpc.purchase;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.62.2)",
    comments = "Source: purchase/purchase.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class PurchaseServiceGrpc {

  private PurchaseServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "purchase.PurchaseService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.example.grpc.purchase.AddToCartGrpcRequest,
      com.example.grpc.purchase.AddToCartGrpcResponse> getAddToCartMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "AddToCart",
      requestType = com.example.grpc.purchase.AddToCartGrpcRequest.class,
      responseType = com.example.grpc.purchase.AddToCartGrpcResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.example.grpc.purchase.AddToCartGrpcRequest,
      com.example.grpc.purchase.AddToCartGrpcResponse> getAddToCartMethod() {
    io.grpc.MethodDescriptor<com.example.grpc.purchase.AddToCartGrpcRequest, com.example.grpc.purchase.AddToCartGrpcResponse> getAddToCartMethod;
    if ((getAddToCartMethod = PurchaseServiceGrpc.getAddToCartMethod) == null) {
      synchronized (PurchaseServiceGrpc.class) {
        if ((getAddToCartMethod = PurchaseServiceGrpc.getAddToCartMethod) == null) {
          PurchaseServiceGrpc.getAddToCartMethod = getAddToCartMethod =
              io.grpc.MethodDescriptor.<com.example.grpc.purchase.AddToCartGrpcRequest, com.example.grpc.purchase.AddToCartGrpcResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "AddToCart"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.grpc.purchase.AddToCartGrpcRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.grpc.purchase.AddToCartGrpcResponse.getDefaultInstance()))
              .setSchemaDescriptor(new PurchaseServiceMethodDescriptorSupplier("AddToCart"))
              .build();
        }
      }
    }
    return getAddToCartMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.example.grpc.purchase.CheckoutGrpcRequest,
      com.example.grpc.purchase.CheckoutGrpcResponse> getCheckoutMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "Checkout",
      requestType = com.example.grpc.purchase.CheckoutGrpcRequest.class,
      responseType = com.example.grpc.purchase.CheckoutGrpcResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.example.grpc.purchase.CheckoutGrpcRequest,
      com.example.grpc.purchase.CheckoutGrpcResponse> getCheckoutMethod() {
    io.grpc.MethodDescriptor<com.example.grpc.purchase.CheckoutGrpcRequest, com.example.grpc.purchase.CheckoutGrpcResponse> getCheckoutMethod;
    if ((getCheckoutMethod = PurchaseServiceGrpc.getCheckoutMethod) == null) {
      synchronized (PurchaseServiceGrpc.class) {
        if ((getCheckoutMethod = PurchaseServiceGrpc.getCheckoutMethod) == null) {
          PurchaseServiceGrpc.getCheckoutMethod = getCheckoutMethod =
              io.grpc.MethodDescriptor.<com.example.grpc.purchase.CheckoutGrpcRequest, com.example.grpc.purchase.CheckoutGrpcResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "Checkout"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.grpc.purchase.CheckoutGrpcRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.grpc.purchase.CheckoutGrpcResponse.getDefaultInstance()))
              .setSchemaDescriptor(new PurchaseServiceMethodDescriptorSupplier("Checkout"))
              .build();
        }
      }
    }
    return getCheckoutMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static PurchaseServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<PurchaseServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<PurchaseServiceStub>() {
        @java.lang.Override
        public PurchaseServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new PurchaseServiceStub(channel, callOptions);
        }
      };
    return PurchaseServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static PurchaseServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<PurchaseServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<PurchaseServiceBlockingStub>() {
        @java.lang.Override
        public PurchaseServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new PurchaseServiceBlockingStub(channel, callOptions);
        }
      };
    return PurchaseServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static PurchaseServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<PurchaseServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<PurchaseServiceFutureStub>() {
        @java.lang.Override
        public PurchaseServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new PurchaseServiceFutureStub(channel, callOptions);
        }
      };
    return PurchaseServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public interface AsyncService {

    /**
     */
    default void addToCart(com.example.grpc.purchase.AddToCartGrpcRequest request,
        io.grpc.stub.StreamObserver<com.example.grpc.purchase.AddToCartGrpcResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getAddToCartMethod(), responseObserver);
    }

    /**
     */
    default void checkout(com.example.grpc.purchase.CheckoutGrpcRequest request,
        io.grpc.stub.StreamObserver<com.example.grpc.purchase.CheckoutGrpcResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCheckoutMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service PurchaseService.
   */
  public static abstract class PurchaseServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return PurchaseServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service PurchaseService.
   */
  public static final class PurchaseServiceStub
      extends io.grpc.stub.AbstractAsyncStub<PurchaseServiceStub> {
    private PurchaseServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected PurchaseServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new PurchaseServiceStub(channel, callOptions);
    }

    /**
     */
    public void addToCart(com.example.grpc.purchase.AddToCartGrpcRequest request,
        io.grpc.stub.StreamObserver<com.example.grpc.purchase.AddToCartGrpcResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getAddToCartMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void checkout(com.example.grpc.purchase.CheckoutGrpcRequest request,
        io.grpc.stub.StreamObserver<com.example.grpc.purchase.CheckoutGrpcResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCheckoutMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service PurchaseService.
   */
  public static final class PurchaseServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<PurchaseServiceBlockingStub> {
    private PurchaseServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected PurchaseServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new PurchaseServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.example.grpc.purchase.AddToCartGrpcResponse addToCart(com.example.grpc.purchase.AddToCartGrpcRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getAddToCartMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.example.grpc.purchase.CheckoutGrpcResponse checkout(com.example.grpc.purchase.CheckoutGrpcRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCheckoutMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service PurchaseService.
   */
  public static final class PurchaseServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<PurchaseServiceFutureStub> {
    private PurchaseServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected PurchaseServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new PurchaseServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.example.grpc.purchase.AddToCartGrpcResponse> addToCart(
        com.example.grpc.purchase.AddToCartGrpcRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getAddToCartMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.example.grpc.purchase.CheckoutGrpcResponse> checkout(
        com.example.grpc.purchase.CheckoutGrpcRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCheckoutMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_ADD_TO_CART = 0;
  private static final int METHODID_CHECKOUT = 1;

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
        case METHODID_ADD_TO_CART:
          serviceImpl.addToCart((com.example.grpc.purchase.AddToCartGrpcRequest) request,
              (io.grpc.stub.StreamObserver<com.example.grpc.purchase.AddToCartGrpcResponse>) responseObserver);
          break;
        case METHODID_CHECKOUT:
          serviceImpl.checkout((com.example.grpc.purchase.CheckoutGrpcRequest) request,
              (io.grpc.stub.StreamObserver<com.example.grpc.purchase.CheckoutGrpcResponse>) responseObserver);
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
          getAddToCartMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.example.grpc.purchase.AddToCartGrpcRequest,
              com.example.grpc.purchase.AddToCartGrpcResponse>(
                service, METHODID_ADD_TO_CART)))
        .addMethod(
          getCheckoutMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.example.grpc.purchase.CheckoutGrpcRequest,
              com.example.grpc.purchase.CheckoutGrpcResponse>(
                service, METHODID_CHECKOUT)))
        .build();
  }

  private static abstract class PurchaseServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    PurchaseServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.example.grpc.purchase.PurchaseProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("PurchaseService");
    }
  }

  private static final class PurchaseServiceFileDescriptorSupplier
      extends PurchaseServiceBaseDescriptorSupplier {
    PurchaseServiceFileDescriptorSupplier() {}
  }

  private static final class PurchaseServiceMethodDescriptorSupplier
      extends PurchaseServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    PurchaseServiceMethodDescriptorSupplier(java.lang.String methodName) {
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
      synchronized (PurchaseServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new PurchaseServiceFileDescriptorSupplier())
              .addMethod(getAddToCartMethod())
              .addMethod(getCheckoutMethod())
              .build();
        }
      }
    }
    return result;
  }
}
