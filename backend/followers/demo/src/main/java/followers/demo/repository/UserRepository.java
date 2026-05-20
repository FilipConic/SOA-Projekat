package followers.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import followers.demo.model.User;

public interface UserRepository extends Neo4jRepository<User, String> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("MATCH (u:User {id: $userId})-[:FOLLOWS]->(:User)-[:FOLLOWS]->(rec:User) " +
            "WHERE u <> rec AND NOT (u)-[:FOLLOWS]->(rec) " +
            "RETURN DISTINCT rec")
    List<User> getRecommendedUsers(@Param("userId") String userId);

    @Query("MATCH (u:User {id: $userId})-[:FOLLOWS]->(followed:User) RETURN followed.id")
    List<String> findAllFollowingIdsByUserId(@Param("userId") String userId);

    @Query("MATCH (follower:User)-[:FOLLOWS]->(u:User {id: $userId}) RETURN follower.id")
    List<String> findAllFollowerIdsByUserId(@Param("userId") String userId);
}
