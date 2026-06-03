package purchase.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingCartResponseDto {
    private Long touristId;
    private double totalPrice;
    private List<OrderItemResponseDto> items;
}