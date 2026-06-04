package purchase.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class CheckoutResponseDto {
    private String touristId;
    private LocalDateTime purchaseDate;
    private double totalAmountPaid;
    private int numberOfToursPurchased;
    private String message;
}
