package followers.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import followers.demo.model.User;
import followers.demo.repository.UserRepository;
import followers.demo.service.IUserService;

@Service
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public void follow(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        follower.follow(followed);
        userRepository.save(follower);
    }

    @Override
    public void unfollow(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));

        follower.getFollowing().removeIf(u -> u.getId().equals(followedId));
        userRepository.save(follower);
    }

    @Override
    public List<User> getRecommendations(Long userId) {
        return userRepository.getRecommendedUsers(userId);
    }

    @Override
    public List<String> getFollowingIds(Long userId) {
        return userRepository.findAllFollowingIdsByUserId(userId);
    }

    @Override
    public void syncUser(Long id, String username) {
        User user = userRepository.findById(id).orElse(new User());
        user.setId(id);
        user.setUsername(username);
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
