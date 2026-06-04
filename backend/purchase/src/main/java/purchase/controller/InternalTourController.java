package purchase.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import purchase.dto.TourSyncDto;
import purchase.model.Tour;
import purchase.repository.TourRepository;

@RestController
@RequestMapping("/api/internal/tours")
@RequiredArgsConstructor
public class InternalTourController {

    private final TourRepository tourRepository;

    @PostMapping
    public void syncTour(@RequestBody TourSyncDto dto) {
        Tour tour = Tour.builder()
                .id(dto.getId())
                .name(dto.getName())
                .price(dto.getPrice())
                .archived(dto.isArchived())
                .build();

        tourRepository.save(tour);
    }
}