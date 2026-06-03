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
public class TourDetailsResponseDto {
    private Long tourId;
    private String name;
    private String description;
    private double length;
    private int estimatedTimeMinutes;
    private String startingPoint;
    private List<String> imageUrls;
    private List<String> reviews;
    private List<String> keyPoints;
}
