package purchase.service;

import purchase.dto.AddToCartRequestDto;
import purchase.dto.ShoppingCartResponseDto;

public interface IShoppingCartService {
    ShoppingCartResponseDto addItemToCart(AddToCartRequestDto request);
    ShoppingCartResponseDto removeItemFromCart(Long touristId, Long tourId);
    ShoppingCartResponseDto getCart(Long touristId);
}