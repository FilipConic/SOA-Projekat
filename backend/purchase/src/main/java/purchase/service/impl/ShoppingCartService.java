package purchase.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import purchase.dto.AddToCartRequestDto;
import purchase.dto.OrderItemResponseDto;
import purchase.dto.ShoppingCartResponseDto;
import purchase.model.OrderItem;
import purchase.model.ShoppingCart;
import purchase.repository.ShoppingCartRepository;
import purchase.repository.TourPurchaseTokenRepository;
import purchase.service.IShoppingCartService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingCartService implements IShoppingCartService {

    private final ShoppingCartRepository cartRepository;
    private final TourPurchaseTokenRepository tokenRepository;

    @Override
    @Transactional
    public ShoppingCartResponseDto addItemToCart(String touristId, AddToCartRequestDto request) {
        if (tokenRepository.existsByTouristIdAndTourId(touristId, request.getTourId())) {
            throw new IllegalStateException("Već ste kupili ovu turu.");
        }

        ShoppingCart cart = cartRepository.findByTouristId(touristId)
                .orElseGet(() -> {
                    ShoppingCart newCart = ShoppingCart.builder()
                            .touristId(touristId)
                            .totalPrice(0.0)
                            .build();
                    return cartRepository.save(newCart);
                });

        boolean alreadyInCart = cart.getItems().stream()
                .anyMatch(item -> item.getTourId().equals(request.getTourId()));

        if (alreadyInCart) {
            throw new IllegalStateException("Tura se već nalazi u korpi.");
        }

        OrderItem orderItem = OrderItem.builder()
                .tourId(request.getTourId())
                .tourName(request.getTourName())
                .price(request.getPrice())
                .build();

        cart.addItem(orderItem);
        ShoppingCart savedCart = cartRepository.save(cart);

        List<OrderItemResponseDto> itemDtos = savedCart.getItems().stream()
                .map(item -> OrderItemResponseDto.builder()
                        .itemId(item.getId())
                        .tourId(item.getTourId())
                        .tourName(item.getTourName())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return ShoppingCartResponseDto.builder()
                .totalPrice(savedCart.getTotalPrice())
                .items(itemDtos)
                .build();
    }

    @Override
    @Transactional
    public ShoppingCartResponseDto removeItemFromCart(String touristId, String tourId) {
        ShoppingCart cart = cartRepository.findByTouristId(touristId)
                .orElseThrow(() -> new IllegalArgumentException("Korpa nije pronađena."));

        OrderItem itemToRemove = cart.getItems().stream()
                .filter(item -> item.getTourId().equals(tourId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tura se ne nalazi u vašoj korpi."));

        cart.removeItem(itemToRemove);
        ShoppingCart savedCart = cartRepository.save(cart);

        List<OrderItemResponseDto> itemDtos = savedCart.getItems().stream()
                .map(item -> OrderItemResponseDto.builder()
                        .itemId(item.getId())
                        .tourId(item.getTourId())
                        .tourName(item.getTourName())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return ShoppingCartResponseDto.builder()
                .totalPrice(savedCart.getTotalPrice())
                .items(itemDtos)
                .build();
    }

    public ShoppingCartResponseDto getCart(String touristId) {
        ShoppingCart cart = cartRepository.findByTouristId(touristId)
                .orElseGet(() -> cartRepository.save(ShoppingCart.builder().touristId(touristId).totalPrice(0.0).build()));

        List<OrderItemResponseDto> itemDtos = cart.getItems().stream()
                .map(item -> new OrderItemResponseDto(item.getId(), item.getTourId(), item.getTourName(), item.getPrice()))
                .collect(Collectors.toList());

        return new ShoppingCartResponseDto(cart.getTotalPrice(), itemDtos);
    }
}