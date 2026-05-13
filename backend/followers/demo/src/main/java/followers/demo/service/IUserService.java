package followers.demo.service;

import followers.demo.model.User;

import java.util.List;

public interface IUserService {
    void follow(Long followerId, Long followedId);
    void unfollow(Long followerId, Long followedId);
    List<User> getRecommendations(Long userId);
    List<String> getFollowingIds(Long userId);
    void syncUser(Long id, String username);
    void deleteUser(Long id);
}
