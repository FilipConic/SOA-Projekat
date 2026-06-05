package purchase.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import purchase.dto.AddToCartRequestDto;
import purchase.dto.CheckoutResponseDto;
import purchase.dto.ShoppingCartResponseDto;
import purchase.service.ICheckoutService;
import purchase.service.IShoppingCartService;

@RestController
@RequestMapping("/api/purchase")
@RequiredArgsConstructor
public class PurchaseController {

    private final IShoppingCartService shoppingCartService;
    private final ICheckoutService checkoutService;

    @PostMapping("/cart/add")
    public ResponseEntity<ShoppingCartResponseDto> addToCart(@RequestHeader("X-User-ID") String touristId, @RequestBody AddToCartRequestDto dto) {
        return ResponseEntity.ok(shoppingCartService.addItemToCart(touristId, dto));
    }

    @DeleteMapping("/cart/remove")
    public ResponseEntity<ShoppingCartResponseDto> removeFromCart(@RequestHeader("X-User-ID") String touristId, @RequestParam String tourId) {
        return ResponseEntity.ok(shoppingCartService.removeItemFromCart(touristId, tourId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDto> checkout(@RequestHeader("X-User-ID") String touristId) {
        return ResponseEntity.ok(checkoutService.processCheckout(touristId));
    }

    @GetMapping("/cart/get")
    public ResponseEntity<ShoppingCartResponseDto> getCart(@RequestHeader("X-User-ID") String touristId) {
        return ResponseEntity.ok(shoppingCartService.getCart(touristId));
    }
}