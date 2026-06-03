package purchase.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import purchase.dto.AddToCartRequestDto;
import purchase.dto.CheckoutRequestDto;
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
    public ResponseEntity<ShoppingCartResponseDto> addToCart(@RequestBody AddToCartRequestDto dto) {
        return ResponseEntity.ok(shoppingCartService.addItemToCart(dto));
    }

    @DeleteMapping("/cart/remove")
    public ResponseEntity<ShoppingCartResponseDto> removeFromCart(@RequestParam Long touristId, @RequestParam Long tourId) {
        return ResponseEntity.ok(shoppingCartService.removeItemFromCart(touristId, tourId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDto> checkout(@RequestBody CheckoutRequestDto dto) {
        return ResponseEntity.ok(checkoutService.processCheckout(dto));
    }
}