package purchase.repository;

import purchase.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourRepository extends JpaRepository<Tour, String> {

    boolean existsByIdAndArchivedFalse(String id);
}