package purchase.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequestDto {

    @NotNull(message = "ID turiste ne sme biti null.")
    @Positive(message = "ID turiste mora biti pozitivan.")
    private Long touristId;

    @NotNull(message = "ID ture ne sme biti null.")
    @Positive(message = "ID ture mora biti pozitivan.")
    private Long tourId;
}