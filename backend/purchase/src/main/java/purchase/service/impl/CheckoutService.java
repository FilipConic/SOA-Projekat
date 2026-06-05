package purchase.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import purchase.dto.CheckoutResponseDto;
import purchase.model.OrderItem;
import purchase.model.ShoppingCart;
import purchase.model.TourPurchaseToken;
import purchase.repository.OrderItemRepository;
import purchase.repository.ShoppingCartRepository;
import purchase.repository.TourPurchaseTokenRepository;
import purchase.service.ICheckoutService;
import purchase.config.RabbitMQConfig;
import purchase.dto.TourPurchasedEvent;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutService implements ICheckoutService {

    private final ShoppingCartRepository cartRepository;
    private final TourPurchaseTokenRepository tokenRepository;
    private final OrderItemRepository orderItemRepository;
    private final RabbitTemplate rabbitTemplate;

    @Override
    @Transactional
    public CheckoutResponseDto processCheckout(String touristId) {
        ShoppingCart cart = cartRepository.findByTouristId(touristId)
                .orElseThrow(() -> new IllegalArgumentException("Korpa nije pronađena."));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Korpa je prazna.");
        }

        double totalAmountPaid = cart.getTotalPrice();
        int numberOfToursPurchased = cart.getItems().size();
        LocalDateTime purchaseDate = LocalDateTime.now();

        List<TourPurchaseToken> generatedTokens = new ArrayList<>();
        for (OrderItem item : cart.getItems()) {
            TourPurchaseToken token = TourPurchaseToken.builder()
                    .touristId(cart.getTouristId())
                    .tourId(item.getTourId())
                    .purchaseTime(purchaseDate)
                    .tokenCode(UUID.randomUUID().toString())
                    .build();
            generatedTokens.add(token);

            TourPurchasedEvent event = new TourPurchasedEvent(item.getTourId(), cart.getTouristId());
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, event);
        }

        tokenRepository.saveAll(generatedTokens);

        orderItemRepository.deleteAllByShoppingCartId(cart.getId());
        cart.getItems().clear();
        cart.calculateTotalPrice();
        cartRepository.save(cart);

        return CheckoutResponseDto.builder()
                .touristId(touristId)
                .purchaseDate(purchaseDate)
                .totalAmountPaid(totalAmountPaid)
                .numberOfToursPurchased(numberOfToursPurchased)
                .message("Kupovina uspešno završena. Generisano je " + numberOfToursPurchased + " tokena.")
                .build();
    }
}