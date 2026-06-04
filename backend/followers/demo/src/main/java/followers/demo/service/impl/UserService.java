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
    public void follow(String followerId, String followedId) {
        System.out.println("Looking for follower: " + followerId);
        System.out.println("Looking for followed: " + followedId);
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));
        follower.follow(followed);
        userRepository.save(follower);
    }

    @Override
    public void unfollow(String followerId, String followedId) {
        if (!userRepository.existsById(followerId) || !userRepository.existsById(followedId)) {
            return;
        }
        userRepository.unfollow(followerId, followedId);
    }

    @Override
    public List<User> getRecommendations(String userId) {
        return userRepository.getRecommendedUsers(userId);
    }

    @Override
    public List<String> getFollowingIds(String userId) {
        return userRepository.findAllFollowingIdsByUserId(userId);
    }

    @Override
    public List<String> getFollowerIds(String userId) {
        return userRepository.findAllFollowerIdsByUserId(userId);
    }

    @Override
    public void syncUser(String id, String username) {
        User user = userRepository.findById(id).orElse(new User());
        user.setId(id);
        user.setUsername(username);
        userRepository.save(user);
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
