package purchase.grpc;

import lombok.extern.slf4j.Slf4j;
import purchase.PurchaseServiceGrpc;
import purchase.AddToCartGrpcRequest;
import purchase.AddToCartGrpcResponse;
import purchase.CheckoutGrpcRequest;
import purchase.CheckoutGrpcResponse;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;
import purchase.dto.AddToCartRequestDto;
import purchase.interceptor.UserContext;
import purchase.service.ICheckoutService;
import purchase.service.IShoppingCartService;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class PurchaseGrpcServer extends PurchaseServiceGrpc.PurchaseServiceImplBase {

    private final IShoppingCartService shoppingCartService;
    private final ICheckoutService checkoutService;

    @Override
    public void addToCart(AddToCartGrpcRequest request, StreamObserver<AddToCartGrpcResponse> responseObserver) {
        try {
            AddToCartRequestDto dto = new AddToCartRequestDto(
                                                        request.getTourId(),
                                                        request.getTourName(), 
                                                        request.getPrice()
                                                    );
            String userId = request.hasUser() ? request.getUser().getUserId() : UserContext.USER_ID_KEY.get();
            log.info("Adding tour {} to cart for user {}", dto.getTourId(), userId);
            shoppingCartService.addItemToCart(userId, dto);

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
            checkoutService.processCheckout(request.hasUser() ? request.getUser().getUserId() : UserContext.USER_ID_KEY.get());

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