package purchase.repository;

import purchase.model.TourPurchaseToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TourPurchaseTokenRepository extends JpaRepository<TourPurchaseToken, Long> {

    boolean existsByTouristIdAndTourId(String touristId, String tourId);

    List<TourPurchaseToken> findAllByTouristId(String touristId);
}