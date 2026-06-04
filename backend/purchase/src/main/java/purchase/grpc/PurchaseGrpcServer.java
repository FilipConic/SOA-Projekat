package purchase.grpc;

import purchase.grpc.PurchaseServiceGrpc;
import purchase.grpc.AddToCartGrpcRequest;
import purchase.grpc.AddToCartGrpcResponse;
import purchase.grpc.CheckoutGrpcRequest;
import purchase.grpc.CheckoutGrpcResponse;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;
import purchase.dto.AddToCartRequestDto;
import purchase.dto.CheckoutRequestDto;
import purchase.service.ICheckoutService;
import purchase.service.IShoppingCartService;

@GrpcService
@RequiredArgsConstructor
public class PurchaseGrpcServer extends PurchaseServiceGrpc.PurchaseServiceImplBase {

    private final IShoppingCartService shoppingCartService;
    private final ICheckoutService checkoutService;

    @Override
    public void addToCart(AddToCartGrpcRequest request, StreamObserver<AddToCartGrpcResponse> responseObserver) {
        try {
            AddToCartRequestDto dto = new AddToCartRequestDto(request.getTouristId(), request.getTourId());
            shoppingCartService.addItemToCart(dto);

            AddToCartGrpcResponse response = AddToCartGrpcResponse.newBuilder()
                    .setSuccess(true)
                    .setMessage("Tura uspesno dodata u korpu.")
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            AddToCartGrpcResponse response = AddToCartGrpcResponse.newBuilder()
                    .setSuccess(false)
                    .setMessage(e.getMessage())
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }

    @Override
    public void checkout(CheckoutGrpcRequest request, StreamObserver<CheckoutGrpcResponse> responseObserver) {
        try {
            CheckoutRequestDto dto = new CheckoutRequestDto(request.getTouristId());
            checkoutService.processCheckout(dto);

            CheckoutGrpcResponse response = CheckoutGrpcResponse.newBuilder()
                    .setSuccess(true)
                    .setMessage("Kupovina uspesno zavrsena.")
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            CheckoutGrpcResponse response = CheckoutGrpcResponse.newBuilder()
                    .setSuccess(false)
                    .setMessage(e.getMessage())
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }
}