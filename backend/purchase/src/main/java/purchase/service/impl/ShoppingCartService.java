package purchase.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import purchase.dto.AddToCartRequestDto;
import purchase.dto.OrderItemResponseDto;
import purchase.dto.ShoppingCartResponseDto;
import purchase.model.OrderItem;
import purchase.model.ShoppingCart;
import purchase.model.Tour;
import purchase.repository.ShoppingCartRepository;
import purchase.repository.TourPurchaseTokenRepository;
import purchase.repository.TourRepository;
import purchase.service.IShoppingCartService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingCartService implements IShoppingCartService {

    private final ShoppingCartRepository cartRepository;
    private final TourRepository tourRepository;
    private final TourPurchaseTokenRepository tokenRepository;

    @Override
    @Transactional
    public ShoppingCartResponseDto addItemToCart(AddToCartRequestDto request) {
        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new IllegalArgumentException("Tura nije pronađena."));

        if (tour.isArchived()) {
            throw new IllegalStateException("Arhivirane ture se ne mogu kupiti.");
        }

        if (tokenRepository.existsByTouristIdAndTourId(request.getTouristId(), request.getTourId())) {
            throw new IllegalStateException("Već ste kupili ovu turu.");
        }

        ShoppingCart cart = cartRepository.findByTouristId(request.getTouristId())
                .orElseGet(() -> {
                    ShoppingCart newCart = ShoppingCart.builder()
                            .touristId(request.getTouristId())
                            .totalPrice(0.0)
                            .build();
                    return cartRepository.save(newCart);
                });

        boolean alreadyInCart = cart.getItems().stream()
                .anyMatch(item -> item.getTourId().equals(tour.getId()));

        if (alreadyInCart) {
            throw new IllegalStateException("Tura se već nalazi u korpi.");
        }

        OrderItem orderItem = OrderItem.builder()
                .tourId(tour.getId())
                .tourName(tour.getName())
                .price(tour.getPrice())
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
                .touristId(savedCart.getTouristId())
                .totalPrice(savedCart.getTotalPrice())
                .items(itemDtos)
                .build();
    }

    @Override
    @Transactional
    public ShoppingCartResponseDto removeItemFromCart(Long touristId, Long tourId) {
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
                .touristId(savedCart.getTouristId())
                .totalPrice(savedCart.getTotalPrice())
                .items(itemDtos)
                .build();
    }
}