package purchase.service;

import purchase.dto.CheckoutRequestDto;
import purchase.dto.CheckoutResponseDto;

public interface ICheckoutService {
    CheckoutResponseDto processCheckout(CheckoutRequestDto request);
}
