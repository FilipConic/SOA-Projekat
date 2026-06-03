package purchase.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponseDto {
    private Long itemId;
    private String tourId;
    private String tourName;
    private double price;
}