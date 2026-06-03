package purchase.dto;

import jakarta.validation.constraints.NotNull;import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequestDto {

    @NotNull(message = "ID turiste je obavezan za checkout.")
    @Positive(message = "ID turiste mora biti pozitivan.")
    private String touristId;
}