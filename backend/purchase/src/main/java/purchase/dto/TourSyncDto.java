package purchase.dto;

import lombok.Data;

@Data
public class TourSyncDto {
    private String id;
    private String name;
    private double price;
    private boolean archived;
}