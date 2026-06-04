package purchase.service;

import purchase.dto.CheckoutResponseDto;

public interface ICheckoutService {
    CheckoutResponseDto processCheckout(String touristId);
}
