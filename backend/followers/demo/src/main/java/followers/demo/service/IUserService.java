package followers.demo.service;

import java.util.List;

import followers.demo.model.User;

public interface IUserService {
    void follow(String followerId, String followedId);
    void unfollow(String followerId, String followedId);
    List<User> getRecommendations(String userId);
    List<String> getFollowingIds(String userId);
    List<String> getFollowerIds(String userId);
    void syncUser(String id, String username, String avatar);
    void deleteUser(String id);
}
