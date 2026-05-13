package followers.demo.repository;

import followers.demo.model.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends Neo4jRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("MATCH (u:User {id: $userId})-[:FOLLOWS]->(:User)-[:FOLLOWS]->(rec:User) " +
            "WHERE u <> rec AND NOT (u)-[:FOLLOWS]->(rec) " +
            "RETURN DISTINCT rec")
    List<User> getRecommendedUsers(@Param("userId") Long userId);

    @Query("MATCH (u:User {id: $userId})-[:FOLLOWS]->(followed:User) RETURN followed.id")
    List<String> findAllFollowingIdsByUserId(@Param("userId") Long userId);
}
