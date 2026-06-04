package purchase.service;

import purchase.dto.AddToCartRequestDto;
import purchase.dto.ShoppingCartResponseDto;

public interface IShoppingCartService {
    ShoppingCartResponseDto addItemToCart(String touristId, AddToCartRequestDto request);
    ShoppingCartResponseDto removeItemFromCart(String touristId, String tourId);
    ShoppingCartResponseDto getCart(String touristId);
}