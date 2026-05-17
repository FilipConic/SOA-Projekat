package followers.demo.controller;

import followers.demo.dto.UserDTO;
import followers.demo.model.User;
import followers.demo.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/followers")
public class UserController {

    @Autowired
    private IUserService userService;

    @PostMapping("/follow/{followedId}")
    public ResponseEntity<Void> follow(@RequestHeader("X-User-ID") String followerId, @PathVariable String followedId) {
        userService.follow(followerId, followedId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/unfollow/{followedId}")
    public ResponseEntity<Void> unfollow(@RequestHeader("X-User-ID") String followerId, @PathVariable String followedId) {
        userService.unfollow(followerId, followedId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/followers/{user_id}")
    public ResponseEntity<List<String>> getFollowers(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getFollowingIds(userId));
    }

    @GetMapping("/my-followers")
    public ResponseEntity<List<String>> getMyFollowers(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(userService.getFollowingIds(userId));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<UserDTO>> getRecommendations(@RequestHeader("X-User-ID") String userId) {
        List<UserDTO> dtos = userService.getRecommendations(userId).stream()
                .map(user -> {
                    UserDTO dto = new UserDTO();
                    dto.setId(user.getId());
                    dto.setUsername(user.getUsername());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }


    @PostMapping("/sync")
    public ResponseEntity<Void> syncUser(@RequestBody UserDTO userDto) {
        userService.syncUser(userDto.getId(), userDto.getUsername());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/sync/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}