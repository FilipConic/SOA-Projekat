package followers.demo.service;

import followers.demo.model.User;

import java.util.List;

public interface IUserService {
    void follow(String followerId, String followedId);
    void unfollow(String followerId, String followedId);
    List<User> getRecommendations(String userId);
    List<String> getFollowingIds(String userId);
    void syncUser(String id, String username);
    void deleteUser(String id);
}
